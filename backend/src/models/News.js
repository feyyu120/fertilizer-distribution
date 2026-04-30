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
    userId: {
        type: String,
        required: true,
        default: "admin"
    },
    likedBy: [{
        type: String
    }],
    comments: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        userName: String,
        text: String,
        createdAt: { type: Date, default: Date.now }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('News', newsSchema);