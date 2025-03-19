const mongoose = require('mongoose');

// Define the schema for petty cash entries
const PettyCashSchema = new mongoose.Schema({
    monthlyBudget: Number,
    date: Date,
    description: String,
    amount: Number,
    category: String,
    paymentMethod: String,
    remarks: String
}, {
    // Automatically add createdAt and updatedAt timestamps
    timestamps: true
});

// Export the model using the existing 'PettyCash' collection in your database
const PettyCashModel = mongoose.model('PettyCash', PettyCashSchema,'PettyCash');
module.exports = PettyCashModel;