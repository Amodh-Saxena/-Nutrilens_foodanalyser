const { db } = require('../config/firebase');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { sendWelcomeEmail } = require('../services/emailService');

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
exports.registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, error: 'Please add all fields' });
        }

        // Check if user exists in Firestore
        const userRef = db.collection('users').where('email', '==', email);
        const snapshot = await userRef.get();

        if (!snapshot.empty) {
            return res.status(400).json({ success: false, error: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user document in Firestore
        const newUserRef = db.collection('users').doc();
        await newUserRef.set({
            name,
            email,
            password: hashedPassword,
            age: null,
            healthInfo: '',
            healthIssues: '',
            profileComplete: false,
            createdAt: new Date().toISOString()
        });

        res.status(201).json({
            success: true,
            _id: newUserRef.id,
            name,
            email,
            profileComplete: false,
            token: generateToken(newUserRef.id),
        });

        // Fire and forget welcome email
        sendWelcomeEmail(email, name);

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Fetch user from Firestore
        const usersRef = db.collection('users').where('email', '==', email);
        const snapshot = await usersRef.get();

        if (snapshot.empty) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        const userDoc = snapshot.docs[0];
        const userData = userDoc.data();

        // Compare passwords
        const isMatch = await bcrypt.compare(password, userData.password);

        if (isMatch) {
            res.json({
                success: true,
                _id: userDoc.id,
                name: userData.name,
                email: userData.email,
                profileComplete: userData.profileComplete || false,
                token: generateToken(userDoc.id),
            });
        } else {
            res.status(401).json({ success: false, error: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Get user data
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
    try {
        // req.user is populated by authMiddleware
        res.status(200).json({ success: true, data: req.user });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Update user profile info
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res) => {
    try {
        const { name, age, healthInfo, healthIssues, height, weight } = req.body;
        
        const updateData = {
            profileComplete: true,
            updatedAt: new Date().toISOString()
        };

        if (name) updateData.name = name;
        if (age) updateData.age = Number(age);
        if (healthInfo) updateData.healthInfo = healthInfo;
        if (healthIssues) updateData.healthIssues = healthIssues;
        if (height) updateData.height = Number(height);
        if (weight) updateData.weight = Number(weight);

        await db.collection('users').doc(req.user.id).update(updateData);

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: updateData
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
