const mongoose = require('mongoose');

const supplierOrderSchema = new mongoose.Schema({
  supplierID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier',
    required: true
  },
  supplierName: String,
  orderDetails: String,
  itemID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item'
  },
  quantity: Number,
  unitPrice: Number,
  status: {
    type: String,
    enum: ['Pending', 'Processing', 'Completed', 'Cancelled'],
    default: 'Pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('SupplierOrder', supplierOrderSchema);