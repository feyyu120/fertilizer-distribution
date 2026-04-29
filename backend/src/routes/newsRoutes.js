// backend/routes/newsRoutes.js
const express = require('express');
const router = express.Router();
const News = require('../models/News');

// Get all news (for farmers)
router.get('/', async (req, res) => {
    try {
        const news = await News.find().sort({ createdAt: -1 });
        res.json(news);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Create new news post (Admin only)
router.post('/', async (req, res) => {
    try {
        const { title, caption, image, user } = req.body;
        const newsPost = new News({ title, caption, image, user });
        await newsPost.save();
        res.status(201).json(newsPost);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;