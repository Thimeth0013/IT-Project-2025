const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    itemID: mongoose.Schema.Types.ObjectId,
    quantity: Number,
    date: String,
    remarks: String,
});

const TransactionModel = mongoose.model('stock_transations', TransactionSchema);
module.exports = TransactionModel;