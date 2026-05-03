const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
    supplierName: { type: String, required: true },
    phone: String,
    address: String,
    region: String,
    city: String,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Supplier", supplierSchema);