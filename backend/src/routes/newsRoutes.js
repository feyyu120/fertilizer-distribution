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

// Update news post
router.put('/:id', async (req, res) => {
    try {
        const newsPost = await News.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!newsPost) return res.status(404).json({ message: 'Post not found' });
        res.json(newsPost);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete news post
router.delete('/:id', async (req, res) => {
    try {
        await News.findByIdAndDelete(req.params.id);
        res.json({ message: 'Post deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;