const mongoose = require('mongoose');

const aboutSchema = new mongoose.Schema({
    content: { type: String, required: true },
    lastUpdated: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('About', aboutSchema);
