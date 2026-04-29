// backend/routes/adminRoute.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Fertilizer = require('../models/Fertilizer');
const nodemailer = require('nodemailer');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// Email transporter (Gmail App Password)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendStatusEmail = async (email, fullname, status) => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) return;
    const isApproved = status === 'approved';
    try {
        await transporter.sendMail({
            from: `"FertilizerHub" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: isApproved ? '✅ Account Approved — FertilizerHub' : '❌ Account Rejected — FertilizerHub',
            html: `
                <div style="font-family:sans-serif;max-width:500px;margin:auto;padding:30px;background:#f9f9f9;border-radius:12px">
                    <h2 style="color:${isApproved ? '#16a34a' : '#dc2626'}">
                        ${isApproved ? '✅ Your Account is Approved!' : '❌ Account Not Approved'}
                    </h2>
                    <p>Dear <strong>${fullname}</strong>,</p>
                    <p>${isApproved
                        ? 'Congratulations! Your FertilizerHub account has been verified. You can now log in and place fertilizer orders.'
                        : 'Unfortunately, your FertilizerHub registration could not be approved at this time. Please contact support for more information.'
                    }</p>
                    <a href="http://localhost:5173/login" style="display:inline-block;margin-top:16px;padding:12px 24px;background:${isApproved ? '#16a34a' : '#6b7280'};color:#fff;border-radius:8px;text-decoration:none;font-weight:600">
                        ${isApproved ? 'Login Now' : 'Contact Support'}
                    </a>
                    <p style="margin-top:24px;font-size:12px;color:#888">FertilizerHub — Ethiopia's Digital Fertilizer Distribution Platform</p>
                </div>
            `,
        });
    } catch (err) {
        console.error('Email send error:', err.message);
    }
};

// Get Dashboard Stats
router.get('/dashboard', async (req, res) => {
    try {
        const totalFarmers = await User.countDocuments({ role: 'farmer' });
        const verifiedFarmers = await User.countDocuments({ role: 'farmer', status: 'approved' });
        const pendingFarmers = await User.countDocuments({ role: 'farmer', status: 'pending' });
        const totalFertilizers = await Fertilizer.countDocuments();
        const totalQuintals = await Fertilizer.aggregate([{ $group: { _id: null, total: { $sum: '$quantity' } } }]);
        res.json({ totalFarmers, verifiedFarmers, pendingFarmers, totalFertilizers, totalQuintals: totalQuintals[0]?.total || 0 });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get ALL Farmers (with optional status filter)
router.get('/farmers', async (req, res) => {
    try {
        const filter = { role: 'farmer' };
        if (req.query.status) filter.status = req.query.status;
        const farmers = await User.find(filter)
            .select('fullname phone email address landSize status createdAt')
            .sort({ createdAt: -1 });
        res.json(farmers);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get ONLY Pending Farmers (used by overview)
router.get('/pending-farmers', async (req, res) => {
    try {
        const pending = await User.find({ role: 'farmer', status: 'pending' })
            .select('fullname phone email address landSize createdAt');
        res.json(pending);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update Farmer Status (approve / reject / pending)
router.put('/farmers/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const user = await User.findByIdAndUpdate(req.params.id, { status }, { new: true });
        if (!user) return res.status(404).json({ message: 'Farmer not found' });
        // Send email notification
        await sendStatusEmail(user.email, user.fullname, status);
        res.json({ message: `Farmer ${status}`, user });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Legacy approve endpoint (backward compat with overview tab)
router.put('/approve-farmer/:id', async (req, res) => {
    try {
        const { status } = req.body;
        const user = await User.findByIdAndUpdate(req.params.id, { status }, { new: true });
        if (!user) return res.status(404).json({ message: 'Farmer not found' });
        await sendStatusEmail(user.email, user.fullname, status);
        res.json({ message: `Farmer ${status}`, user });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete Farmer
router.delete('/farmers/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: 'Farmer not found' });
        res.json({ message: 'Farmer deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;