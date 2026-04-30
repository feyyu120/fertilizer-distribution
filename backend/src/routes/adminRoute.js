// backend/routes/adminRoute.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Fertilizer = require('../models/Fertilizer');
const nodemailer = require('nodemailer');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// Email transporter (Explicit Gmail SMTP for better cloud compatibility)
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: true, // Use SSL/TLS
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendStatusEmail = async (email, fullname, status) => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.warn('⚠️ Email credentials missing. Skipping email.');
        return;
    }
    const frontendUrl = process.env.FRONTEND_URL || 'https://fertilizer-distribution.vercel.app';

    let subject, title, body, color, btnText;
    if (status === 'approved') {
        subject = '✅ Account Approved — FertilizerHub';
        title = '✅ Your Account is Approved!';
        body = 'Congratulations! Your FertilizerHub account has been verified. You can now log in and place fertilizer orders.';
        color = '#16a34a';
        btnText = 'Login Now';
    } else if (status === 'rejected') {
        subject = '❌ Account Rejected — FertilizerHub';
        title = '❌ Account Not Approved';
        body = 'Unfortunately, your FertilizerHub registration could not be approved at this time. Please contact support for more information.';
        color = '#dc2626';
        btnText = 'Contact Support';
    } else {
        subject = '⏳ Account Status Update — FertilizerHub';
        title = '⏳ Account Set to Pending';
        body = 'Your account status has been updated to pending. We are currently reviewing your details. We will notify you once the verification is complete.';
        color = '#f59e0b';
        btnText = 'Visit Website';
    }

    console.log(`📡 Attempting to send ${status} email to: ${email}...`);
    // We don't await this in the route handlers to keep them non-blocking
    transporter.sendMail({
        from: `"FertilizerHub" <${process.env.EMAIL_USER}>`,
        to: email,
        subject,
        html: `
            <div style="font-family:sans-serif;max-width:500px;margin:auto;padding:30px;background:#f9f9f9;border-radius:12px">
                <h2 style="color:${color}">${title}</h2>
                <p>Dear <strong>${fullname}</strong>,</p>
                <p>${body}</p>
                <a href="${frontendUrl}/login" style="display:inline-block;margin-top:16px;padding:12px 24px;background:${color};color:#fff;border-radius:8px;text-decoration:none;font-weight:600">
                    ${btnText}
                </a>
                <p style="margin-top:24px;font-size:12px;color:#888">FertilizerHub — Ethiopia's Digital Fertilizer Distribution Platform</p>
            </div>
        `,
    }).then(() => {
        console.log(`📧 Email sent successfully to ${email} (${status})`);
    }).catch(err => {
        console.error('❌ Email send error:', err.message);
    });
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
        // Send email notification (non-blocking)
        sendStatusEmail(user.email, user.fullname, status);
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
        sendStatusEmail(user.email, user.fullname, status);
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