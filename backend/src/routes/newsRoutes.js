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

// Get user's news posts
router.get('/my-posts', async (req, res) => {
    try {
        const { userId } = req.query;
        if (!userId) return res.status(400).json({ message: 'User ID is required' });
        
        const news = await News.find({ userId }).sort({ createdAt: -1 });
        res.json(news);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Create new news post (Admin & Farmers)
router.post('/', async (req, res) => {
    try {
        const { title, caption, image, user, userId } = req.body;
        const newsPost = new News({ title, caption, image, user, userId });
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

// Toggle like
router.put('/:id/like', async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) return res.status(400).json({ message: 'User ID is required' });

        const post = await News.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        // Compare as strings since likedBy stores ObjectIds but userId comes as string
        const index = post.likedBy.findIndex(id => id.toString() === userId.toString());
        if (index === -1) {
            post.likedBy.push(userId); // Like
        } else {
            post.likedBy.splice(index, 1); // Unlike
        }

        await post.save();
        res.json(post);
    } catch (error) {
        console.error('Like toggle error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Add comment
router.post('/:id/comment', async (req, res) => {
    try {
        const { userId, userName, text } = req.body;
        if (!userId || !text) return res.status(400).json({ message: 'User ID and text are required' });

        const post = await News.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        post.comments.push({
            user: userId,
            userName: userName || 'Anonymous',
            text: text
        });

        await post.save();
        res.json(post);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;