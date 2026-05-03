const express = require('express');
const router = express.Router();
const Season = require('../models/Season');

// Get all seasons
router.get('/', async (req, res) => {
    try {
        const seasons = await Season.find().sort({ year: -1, createdAt: -1 });
        res.json(seasons);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get active season
router.get('/active', async (req, res) => {
    try {
        const activeSeason = await Season.findOne({ isActive: true });
        if (!activeSeason) {
            return res.status(404).json({ message: 'No active season found' });
        }
        res.json(activeSeason);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Create new season
router.post('/', async (req, res) => {
    try {
        const { seasonName, year } = req.body;
        const season = new Season({ seasonName, year });
        await season.save();
        res.status(201).json(season);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update season
router.put('/:id', async (req, res) => {
    try {
        const season = await Season.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(season);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Activate season (and deactivate others)
router.patch('/:id/activate', async (req, res) => {
    try {
        // Deactivate all
        await Season.updateMany({}, { isActive: false });
        // Activate this one
        const season = await Season.findByIdAndUpdate(req.params.id, { isActive: true }, { new: true });
        res.json(season);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete season
router.delete('/:id', async (req, res) => {
    try {
        await Season.findByIdAndDelete(req.params.id);
        res.json({ message: 'Season deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
