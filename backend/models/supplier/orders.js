const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    supplierID: mongoose.Schema.Types.ObjectId,
    orderDetails: String,
    itemID: mongoose.Schema.Types.ObjectId,
    quantity: Number,
    unitPrice: Number,
});

const OrderModel = mongoose.model('orders', OrderSchema);
module.exports = OrderModel;