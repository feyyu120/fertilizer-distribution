// backend/routes/fertilizerRoutes.js
const express = require('express');
const router = express.Router();
const Fertilizer = require('../models/Fertilizer');

// Get all fertilizers (Public for farmers)
router.get('/', async (req, res) => {
    try {
        const fertilizers = await Fertilizer.find().sort({ createdAt: -1 });
        res.json(fertilizers);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Add new fertilizer (Admin only)
router.post('/', async (req, res) => {
    try {
        const { name, type, quantity, pricePerQuintal } = req.body;
        const fertilizer = new Fertilizer({
            name,
            type,
            quantity,
            pricePerQuintal,
            status: quantity > 100 ? 'available' : 'low'
        });
        await fertilizer.save();
        res.status(201).json(fertilizer);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update fertilizer
router.put('/:id', async (req, res) => {
    try {
        const fertilizer = await Fertilizer.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(fertilizer);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete fertilizer
router.delete('/:id', async (req, res) => {
    try {
        await Fertilizer.findByIdAndDelete(req.params.id);
        res.json({ message: 'Fertilizer deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;