// backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// Register Farmer
router.post('/register', async (req, res) => {
    try {
        const { fullname, phone, email, password, address, landSize } = req.body;

        // Check if user exists
        let user = await User.findOne({ $or: [{ phone }, { email }] });
        if (user) return res.status(400).json({ message: 'User with this phone or email already exists' });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new farmer (pending approval)
        user = new User({
            fullname,
            phone,
            email,
            password: hashedPassword,
            address,
            landSize,
            role: 'farmer',
            status: 'pending'
        });

        await user.save();

        res.status(201).json({
            message: 'Registration successful! Waiting for admin approval.',

            user: {
                role: user.role
            }
        });
    } catch (error) {
        console.error('❌ Registration Error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { identifier, password } = req.body;
        console.log(`🔑 Login attempt for: ${identifier}`);

        // Hardcoded admin check
        if (identifier === 'admin@fertilizerhub.et' && password === 'admin123') {
            const token = jwt.sign(
                { id: 'admin', role: 'admin', status: 'approved' },
                JWT_SECRET,
                { expiresIn: '1d' }
            );
            return res.json({
                token,
                user: {
                    id: 'admin',
                    fullname: 'Administrator',
                    email: 'admin@fertilizerhub.et',
                    role: 'admin',
                    status: 'approved'
                }
            });
        }

        const isEmail = identifier.includes('@');
        const query = isEmail ? { email: identifier } : { phone: identifier };
        const user = await User.findOne(query);

        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        // Check if farmer is approved
        /* if (user.role === 'farmer' && user.status !== 'approved') {
             return res.status(403).json({
                 message: 'Your account is pending admin approval. Please wait.'
             });
         }*/

        // Generate JWT
        const token = jwt.sign(
            { id: user._id, role: user.role, status: user.status },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            token,
            user: {
                id: user._id,
                fullname: user.fullname,
                phone: user.phone,
                email: user.email,
                role: user.role,
                status: user.status
            }
        });
    } catch (error) {
        console.error('❌ Login Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get Current User Profile
router.get('/me', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({ message: 'No token provided' });

        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');

        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json(user);
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
});

const Order = require('../models/Order');
const Message = require('../models/Message');

// Update Current User Profile (Name)
router.put('/profile', async (req, res) => {
    try {
        const { id, fullname } = req.body;
        if (!id) return res.status(400).json({ message: 'User ID is required' });

        const user = await User.findByIdAndUpdate(id, { fullname }, { new: true }).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json(user);
    } catch (error) {
        console.error('❌ Profile Update Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Mark fertilizers as read
router.put('/read-fertilizers', async (req, res) => {
    try {
        const { id } = req.body;
        if (!id) return res.status(400).json({ message: 'User ID is required' });

        if (id === 'admin') {
            return res.json({ message: 'Admin bypass' });
        }

        const user = await User.findByIdAndUpdate(
            id,
            { lastViewedFertilizersAt: Date.now() },
            { new: true }
        ).select('-password');

        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json(user);
    } catch (error) {
        console.error('❌ Read Fertilizers Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete Current User Account
router.delete('/profile', async (req, res) => {
    try {
        const { id } = req.body;
        if (!id) return res.status(400).json({ message: 'User ID is required' });

        await User.findByIdAndDelete(id);
        res.json({ message: 'Account deleted successfully' });
    } catch (error) {
        console.error('❌ Account Deletion Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get User's Orders
router.get('/my-orders', async (req, res) => {
    try {
        const { id } = req.query;
        if (!id) return res.status(400).json({ message: 'User ID is required' });

        if (id === 'admin') {
            return res.json([]);
        }

        const orders = await Order.find({ farmer: id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        console.error('❌ Get Orders Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get User's Messages (by phone)
router.get('/my-messages', async (req, res) => {
    try {
        const { phone } = req.query;
        if (!phone) return res.status(400).json({ message: 'Phone is required' });

        const messages = await Message.find({ phone }).sort({ createdAt: -1 });
        res.json(messages);
    } catch (error) {
        console.error('❌ Get Messages Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;