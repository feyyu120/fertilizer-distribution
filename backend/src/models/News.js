// backend/models/News.js
const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    caption: {
        type: String,
        required: true
    },
    image: {
        type: String,           // URL of the image
        default: ""
    },
    user: {
        type: String,           // Who posted (e.g., "Oromia Agriculture Office", "Admin")
        default: "Admin"
    },
    likes: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('News', newsSchema);