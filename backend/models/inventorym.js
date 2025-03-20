const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
    itemName: { type: String, required: true },
    category: { type: String, required: true },
    Quantity: { type: Number, required: true, default: 0 },
    unitPrice: { type: Number, required: true },
    totalCost: { 
        type: Number,
        required: true,
        default: function () { return this.stock * this.unitPrice; } // Auto-calculate total cost
    },
    expiryDate: { type: Date, required: true },
    manufactureDate: { type: Date, required: true },
    reorderLevel: { type: Number, required: true, default: 5 },
}, { timestamps: true });

const Inventory = mongoose.model('inve', inventorySchema);
module.exports = Inventory;
