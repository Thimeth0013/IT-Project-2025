const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    supplierID: mongoose.Schema.Types.ObjectId,
    itemID: String,
    orderDetails: String,
    quantity: Number,
    unitPrice: Number,
    status: {
        type: String,
        enum: ['Processing', 'Accepted', 'Delivering', 'Completed', 'Declined', 'Undefined'],
        default: 'Processing'
    }
});

const OrderModel = mongoose.model('orders', OrderSchema);
module.exports = OrderModel;