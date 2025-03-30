const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
    itemName: { type: String, required: true },
    category: { type: String, required: true },
    stock: { type: Number, required: true, default: 0 },
    unitPrice: { type: Number, required: true },
    expiryDate: { type: Date, required: true },
    manufactureDate: { type: Date, required: true },
    reorderLevel: { type: Number, required: true, default: 5 },
}, { timestamps: true });

// 🔥 Pre-save middleware to calculate totalCost before saving
inventorySchema.pre('save', function (next) {
    this.totalCost = this.stock * this.unitPrice;
    next();
});

const Inventory = mongoose.model('inventories', inventorySchema);
module.exports = Inventory;