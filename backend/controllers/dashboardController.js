const { db } = require('../config/firebase');

// @desc    Get user's daily log history
// @route   GET /api/dashboard/history
// @access  Private
exports.getDashboardHistory = async (req, res) => {
    try {
        const logsRef = db.collection('dailyLogs').where('user', '==', req.user.id);
        const snapshot = await logsRef.get();
        
        const logs = [];
        snapshot.forEach(doc => {
            logs.push({ _id: doc.id, ...doc.data() });
        });

        const validLogs = logs.filter(l => l.date && !isNaN(new Date(l.date).getTime()));
        validLogs.sort((a, b) => new Date(a.date) - new Date(b.date));

        res.status(200).json({ success: true, data: validLogs });
    } catch (error) {
        console.error('Dashboard History Error:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch dashboard history' });
    }
};

// @desc    Submit a new daily log
// @route   POST /api/dashboard/log
// @access  Private
exports.addDailyLog = async (req, res) => {
    try {
        const { date, sleepHours, stressLevel, exerciseLevel, weight } = req.body;

        if (!date || sleepHours === undefined || stressLevel === undefined) {
             return res.status(400).json({ success: false, error: 'Missing biometric data' });
        }

        const logData = {
            user: req.user.id,
            date,
            sleepHours: Number(sleepHours),
            stressLevel: Number(stressLevel),
            exerciseLevel: Number(exerciseLevel) || 0,
            weight: Number(weight) || 70,
            updatedAt: new Date().toISOString()
        };

        const existingLogs = await db.collection('dailyLogs')
            .where('user', '==', req.user.id)
            .where('date', '==', date)
            .get();

        let logId;
        if (!existingLogs.empty) {
            logId = existingLogs.docs[0].id;
            await db.collection('dailyLogs').doc(logId).update(logData);
        } else {
            logData.createdAt = new Date().toISOString();
            const newLogRef = db.collection('dailyLogs').doc();
            logId = newLogRef.id;
            await newLogRef.set(logData);
        }

        res.status(existingLogs.empty ? 201 : 200).json({
            success: true,
            data: { _id: logId, ...logData }
        });

    } catch (error) {
        console.error('Daily Log Error:', error);
        res.status(500).json({ success: false, error: 'Failed to sync telemetry' });
    }
};

// @desc    Predict metabolic health based on biometric telemetry
// @route   POST /api/dashboard/predict
// @access  Private
exports.predictMetabolicScore = async (req, res) => {
    try {
        const { logId } = req.body;

        if (!logId) {
            return res.status(400).json({ success: false, error: 'logId is required' });
        }
        
        const logDoc = await db.collection('dailyLogs').doc(logId).get();
        if (!logDoc.exists) return res.status(404).json({ success: false, error: 'Log not found' });
        
        const logData = logDoc.data();
        const dateStr = logData.date; 

        // 1. Fetch Today's Scans to get aggregated Stress
        const scansSnapshot = await db.collection('scans')
            .where('user', '==', req.user.id)
            .get();
            
        let totalStress = 0;
        let scanCount = 0;

        scansSnapshot.forEach(doc => {
            const data = doc.data();
            const scanDate = data.createdAt ? (data.createdAt.split ? data.createdAt.split('T')[0] : data.createdAt.toDate().toISOString().split('T')[0]) : null;

            if (scanDate === dateStr) {
                totalStress += (data.metabolicStressScore || 30);
                scanCount++;
            }
        });

        const dailyFoodStress = scanCount > 0 ? (totalStress / scanCount) : 30;  // Ns

        // 2. Lifestyle Stress Score (LSS) — Scientific Formula
        // Ls = ((8 - Sh)^2 × 2) + ((5 - El) × 6)
        const sleepHours  = logData.sleepHours  || 7;      // Sh — hours slept
        const exerciseLevel = logData.exerciseLevel || 2;  // El — 0-5 activity level

        const sleepPenalty    = Math.pow(8 - sleepHours, 2) * 2;  // Quadratic sleep debt
        const exercisePenalty = Math.max(0, (5 - exerciseLevel)) * 6; // Linear inactivity cost
        const lifestyleStressScore = Math.max(0, Math.min(100, sleepPenalty + exercisePenalty));

        // 3. Core MHI Formula
        // MHI = 100 - (0.4 × Ns + 0.1 × Ls)
        const metabolicHealthIndex = Math.max(0, Math.min(100,
            100 - ((dailyFoodStress * 0.4) + (lifestyleStressScore * 0.1))
        ));

        const sanitize = (val) => {
            const num = Number(val);
            return (isNaN(num) || !isFinite(num)) ? 0 : Number(num.toFixed(2));
        };

        const updateData = { 
            dailyFoodStress:      sanitize(dailyFoodStress),
            lifestyleStressScore: sanitize(lifestyleStressScore),
            metabolicHealthIndex: sanitize(metabolicHealthIndex),
            predictedScore:       sanitize(metabolicHealthIndex)
        };
        
        await db.collection('dailyLogs').doc(logId).update(updateData);

        res.status(200).json({
            success: true,
            data: updateData
        });

    } catch (error) {
         console.error('Prediction Error:', error);
        res.status(500).json({ success: false, error: 'Failed to calculate health metrics' });
    }
};
