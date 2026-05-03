const mongoose = require('mongoose');

const fertilizerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, default: '' },
    quantity: { type: Number, required: true }, // in Quintal
    pricePerQuintal: { type: Number, required: true },
    status: { type: String, enum: ['available', 'low', 'outofstock'], default: 'available' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier' }
}, { timestamps: true });

module.exports = mongoose.model('Fertilizer', fertilizerSchema);