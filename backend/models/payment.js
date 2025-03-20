const mongoose = require('mongoose');

const customerPaymentSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true
  },
  transactionId: {
    type: String,
    required: true,
    unique: true
  },
  cardType: {
    type: String,
    required: true
  },
  last4: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['success', 'failed', 'pending'],
    default: 'pending'
  },
  customerName: {
    type: String,
    required: true
  },
  customerEmail: {
    type: String
  },
  paymentPurpose: {
    type: String,
    enum: ['reservation', 'service', 'repair', 'parts', 'other'],
    default: 'other'
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('CustomerPayment', customerPaymentSchema);