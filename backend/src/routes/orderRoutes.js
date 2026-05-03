// backend/routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

const Season = require('../models/Season');

// Get all orders (Admin)
router.get('/', async (req, res) => {
    try {
        const orders = await Order.find().populate('season').sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Create new order (Farmer)
router.post('/', async (req, res) => {
    try {
        const activeSeason = await Season.findOne({ isActive: true });
        if (!activeSeason) {
            return res.status(400).json({ message: 'No active season found. Ordering is currently disabled.' });
        }

        const orderData = {
            ...req.body,
            season: activeSeason._id
        };

        // Check if already ordered this season (optional but helpful for better error)
        const existingOrder = await Order.findOne({ 
            farmer: orderData.farmer, 
            season: activeSeason._id 
        });

        if (existingOrder) {
            return res.status(400).json({ message: 'You have already placed an order for this season.' });
        }

        const order = new Order(orderData);
        await order.save();
        res.status(201).json(order);
    } catch (error) {
        console.error('Order creation error:', error);
        if (error.code === 11000) {
            return res.status(400).json({ message: 'You have already placed an order for this season.' });
        }
        res.status(500).json({ message: 'Server error' });
    }
});

// Update order status (approve/reject/cancel)
router.put('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;