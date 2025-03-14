const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    supplierID: ObjectId,
    orderDetails: String,
    itemID: ObjectId,
    quantity: Number,
    unitPrice: Number,
});

const OrderModel = mongoose.model('orders', OrderSchema);
module.exports = OrderModel;