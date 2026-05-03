const mongoose = require('mongoose');

const seasonSchema = new mongoose.Schema({
    seasonName: {
        type: String,
        enum: ["Summer", "Winter"]
    },
    year: String,
    isActive: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Season", seasonSchema);