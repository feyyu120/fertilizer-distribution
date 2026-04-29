// backend/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Fertilizer = require('../models/Fertilizer');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// Admin Login (Simple for now)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    // Hardcoded admin for development (change later)
    if (email === 'admin@fertilizerhub.et' && password === 'admin123') {
      const token = jwt.sign({ id: 'admin', role: 'admin' }, JWT_SECRET, { expiresIn: '1d' });
      return res.json({ token, role: 'admin', name: 'Admin' });
    }
    res.status(401).json({ message: 'Invalid admin credentials' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get Dashboard Stats
router.get('/dashboard', async (req, res) => {
  try {
    const totalFarmers = await User.countDocuments({ role: 'farmer' });
    const verifiedFarmers = await User.countDocuments({ role: 'farmer', status: 'approved' });
    const pendingFarmers = await User.countDocuments({ role: 'farmer', status: 'pending' });
    const totalFertilizers = await Fertilizer.countDocuments();
    const totalQuintals = await Fertilizer.aggregate([{ $group: { _id: null, total: { $sum: "$quantity" } } }]);

    res.json({
      totalFarmers,
      verifiedFarmers,
      pendingFarmers,
      totalFertilizers,
      totalQuintals: totalQuintals[0]?.total || 0
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get Pending Farmers
router.get('/pending-farmers', async (req, res) => {
  try {
    const pending = await User.find({ role: 'farmer', status: 'pending' })
      .select('fullname phone address landSize createdAt');
    res.json(pending);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Approve/Reject Farmer
router.put('/approve-farmer/:id', async (req, res) => {
  try {
    const { status } = req.body; // 'approved' or 'rejected'
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json({ message: `Farmer ${status}`, user });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;