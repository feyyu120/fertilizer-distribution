// backend/routes/messageRoutes.js
const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// Get messages
router.get('/', async (req, res) => {
    try {
        const messages = await Message.find().sort({ createdAt: -1 });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Send message
router.post('/', async (req, res) => {
    try {
        const message = new Message(req.body);
        await message.save();
        res.status(201).json(message);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;