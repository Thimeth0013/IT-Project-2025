const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    itemID: ObjectId,
    quantity: Number,
    date: String,
    remarks: String,
});

const TransactionModel = mongoose.model('stock_transations', TransactionSchema);
module.exports = TransactionModel;