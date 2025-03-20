const express = require('express');
const router = express.Router();
const CustomerPayment = require('../models/Payment');

// Get all customer payments
router.get('/customer-payments', async (req, res) => {
  try {
    const payments = await CustomerPayment.find().sort({ date: -1 });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Process a new customer payment
router.post('/payments', async (req, res) => {
  try {
    const { 
      amount, 
      transactionId, 
      cardType,
      last4,
      status,
      customerName,
      customerEmail,
      paymentPurpose
    } = req.body;
    
    const newPayment = new CustomerPayment({
      amount,
      transactionId,
      cardType,
      last4,
      status,
      customerName,
      customerEmail,
      paymentPurpose,
      date: new Date()
    });
    
    const savedPayment = await newPayment.save();
    res.status(201).json(savedPayment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get customer payment by ID
router.get('/customer-payments/:id', async (req, res) => {
  try {
    const payment = await CustomerPayment.findById(req.params.id);
    if (!payment) return res.status(404).json({ message: 'Payment not found' });
    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;