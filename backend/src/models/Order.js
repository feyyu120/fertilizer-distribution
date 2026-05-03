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
                ref: 'Fertilizer',
                required: true
            },
            name: {
                type: String,
                required: true
            },
            quantity: {
                type: Number,
                required: true
            }, // in Quintal
            pricePerQuintal: {
                type: Number,
                required: true
            }
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

    // Active agricultural season
    season: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Season',
        required: true
    },

    status: {
        type: String,
        enum: [
            'pending',
            'approved',
            'processing',
            'distributed',
            'delivered',
            'cancelled'
        ],
        default: 'pending'
    },

    paymentMethod: {
        type: String,
        enum: ['TeleBirr', 'CBE Birr', 'Cash on Delivery'],
        default: 'Cash on Delivery'
    },

    payment: {
        amountPaid: {
            type: Number,
            default: 0
        },
        paymentStatus: {
            type: String,
            enum: ['unpaid', 'paid'],
            default: 'unpaid'
        },
        paymentDate: {
            type: Date
        },
        transactionRef: {
            type: String,
            default: ''
        }
    },

    distribution: {
        truckPlate: {
            type: String,
            default: ''
        },
        driverName: {
            type: String,
            default: ''
        },
        dispatchDate: {
            type: Date
        },
        arrivalDate: {
            type: Date
        },
        distributionStatus: {
            type: String,
            enum: ['waiting', 'on-route', 'delivered'],
            default: 'waiting'
        }
    },

    notes: {
        type: String,
        default: ''
    }

}, {
    timestamps: true
});

// Prevent one farmer from placing multiple orders in the same season
orderSchema.index({ farmer: 1, season: 1 }, { unique: true });

module.exports = mongoose.model('Order', orderSchema);