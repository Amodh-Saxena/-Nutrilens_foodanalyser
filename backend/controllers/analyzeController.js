const { db } = require('../config/firebase');
const fs = require('fs');
const { analyzeIngredientsText } = require('../services/openFoodFactsService');
const { sendHighRiskAlert } = require('../services/emailService');
const IngredientLog = require('../models/IngredientLog');

// @desc    Upload image, analyze with Open Food Facts Dataset, and save result
// @route   POST /api/analyze
// @access  Private (or Public if optional)
exports.analyzeImage = async (req, res) => {
    try {
        const foodImage = req.files['image'] ? req.files['image'][0] : null;
        const ingredientsImage = req.files['ingredientsImage'] ? req.files['ingredientsImage'][0] : null;

        if (!foodImage && !ingredientsImage) {
            return res.status(400).json({ success: false, error: 'No image provided' });
        }
        
        const extractedText = req.body.extractedText;
        if (!extractedText) {
            return res.status(400).json({ success: false, error: 'Missing extracted text from image' });
        }

        // PERSISTENCE: Save raw OCR labels to the new DB
        try {
            await IngredientLog.create({
                productName: req.body.productName || 'Unknown Product',
                rawOcrText: extractedText,
                metadata: {
                    charCount: extractedText.length,
                    wordCount: extractedText.split(/\s+/).length
                }
            });
            console.log('[SYSTEM] Raw OCR label archived in database.');
        } catch (dbErr) {
            console.error('[ERROR] Failed to archive OCR label:', dbErr);
        }

        // Call Open Food Facts Service
        const analysisResult = await analyzeIngredientsText(extractedText, req.body.productName);

        // Save result to Firebase Firestore
        const scanData = {
            user: req.user ? req.user.id : null, 
            imageUrl: foodImage ? `/uploads/${foodImage.filename}` : `/uploads/${ingredientsImage.filename}`,
            ingredientsImageUrl: ingredientsImage ? `/uploads/${ingredientsImage.filename}` : null,
            ingredients: analysisResult.ingredients,
            components: analysisResult.components,
            metabolicStressScore: analysisResult.metabolicStressScore,
            geminiSummary: analysisResult.summary,
            upesMetrics: analysisResult.upesMetrics,
            createdAt: new Date().toISOString()
        };

        const newScanRef = db.collection('scans').doc();
        await newScanRef.set(scanData);

        res.status(201).json({
            success: true,
            data: { _id: newScanRef.id, ...scanData }
        });

        // Fire and forget High-Risk Alert if applicable
        if (req.user && analysisResult.metabolicStressScore >= 70) {
            sendHighRiskAlert(req.user.email, req.user.name || 'User', analysisResult.metabolicStressScore, analysisResult.summary);
        }

    } catch (error) {
        console.error('Analyze Error:', error);
        res.status(500).json({ success: false, error: error.message || 'Analysis failed' });
    }
};

// @desc    Search for products by name in Open Food Facts
// @route   GET /api/analyze/search
// @access  Private
exports.searchProduct = async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) {
            return res.status(400).json({ success: false, error: 'Search query is required' });
        }

        const { searchFoodByName } = require('../services/openFoodFactsService');
        const results = await searchFoodByName(query);

        res.status(200).json({
            success: true,
            data: results
        });
    } catch (error) {
        console.error('Search Error:', error);
        res.status(500).json({ success: false, error: 'Product search failed' });
    }
};

// @desc    Get user's past scans
// @route   GET /api/analyze/history
// @access  Private
exports.getScanHistory = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ success: false, error: 'User not authenticated' });
        }

        const scansRef = db.collection('scans')
            .where('user', '==', req.user.id);

        const snapshot = await scansRef.get();
        
        const scans = [];
        snapshot.forEach(doc => {
            scans.push({ _id: doc.id, ...doc.data() });
        });

        scans.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        res.status(200).json({ success: true, data: scans });
    } catch (error) {
        console.error('History Fetch Error:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch history' });
    }
};

// @desc    Get all raw OCR ingredient logs from MongoDB
// @route   GET /api/analyze/logs
// @access  Private/Public
exports.getIngredientLogs = async (req, res) => {
    try {
        const logs = await IngredientLog.find().sort({ scannedAt: -1 });
        res.status(200).json({ success: true, data: logs });
    } catch (error) {
        console.error('Log Fetch Error:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch ingredient logs' });
    }
};
