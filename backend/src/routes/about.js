const express = require('express');
const About = require('../models/About');
const router = express.Router();

// Get about info
router.get('/', async (req, res) => {
    try {
        let about = await About.findOne();
        if (!about) {
            return res.json({
                content: "Welcome to FertilizerHub. We help Ethiopian farmers get access to fertilizers easily. Farmers can register, track available stocks, and place orders directly. Our goal is to modernize the distribution process and support agricultural productivity."
            });
        }
        res.json(about);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update about info (Admin only - assuming middleware will be added later)
router.post('/', async (req, res) => {
    try {
        const { content } = req.body;
        let about = await About.findOne();
        if (about) {
            about.content = content;
            about.lastUpdated = Date.now();
            await about.save();
        } else {
            about = new About({ content });
            await about.save();
        }
        res.json(about);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
