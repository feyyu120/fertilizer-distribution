// backend/models/Order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    farmer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    farmerName: {
        type: String,
        required: true
    },
    farmerPhone: {
        type: String,
        required: true
    },
    fertilizers: [
        {
            fertilizerId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Fertilizer'
            },
            name: String,
            quantity: Number,        // in Quintal
            pricePerQuintal: Number
        }
    ],
    totalAmount: {
        type: Number,
        required: true
    },
    deliveryAddress: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'processing', 'delivered', 'cancelled'],
        default: 'pending'
    },
    paymentMethod: {
        type: String,
        enum: ['TeleBirr', 'CBE Birr', 'Cash on Delivery'],
        default: 'Cash on Delivery'
    },
    notes: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Virtual to populate fertilizer details if needed
orderSchema.virtual('fertilizerDetails').get(function () {
    return this.fertilizers;
});

module.exports = mongoose.model('Order', orderSchema);