const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    supplierID: mongoose.Schema.Types.ObjectId,
    supplier: String,
    itemID: String,
    itemName: String,
    orderDetails: String,
    quantity: Number,
    unitPrice: Number,
    status: {
        type: String,
        enum: ['Processing', 'Accepted', 'Delivering', 'Delivered', 'Declined', 'Rejected', 'Approved', 'Undefined'],
        default: 'Processing'
    }
});

const OrderModel = mongoose.model('orders', OrderSchema);
module.exports = OrderModel;