const router = require('express').Router();
const stockTransactionsModel = require('../models/supplier/stock_transactions');

// Get all stock transactions
router.get('/', async (req, res) => {
    try {
        const stockTransactions = await stockTransactionsModel.find({});
        return res.status(200).json({
            success: true,
            stockTransactions
        });
    } catch (err) {
        return res.status(400).json({
            success: false,
            message: err
        });
    }
});

// Get a stock transaction by ID
router.get('/:id', async (req, res) => {
    try {
        const stockTransaction = await stockTransactionsModel.findById(req.params.id);
        return res.status(200).json({
            success: true,
            stockTransaction
        });
    } catch (err) {
        return res.status(400).json({
            success: false,
            message: err
        });
    }
});

// Create a stock transaction
router.post('/', async (req, res) => {
    try {
        const stockTransaction = await stockTransactionsModel.create(req.body);
        return res.status(200).json({
            success: true,
            stockTransaction
        });
    } catch (err) {
        return res.status(400).json({
            success: false,
            message: err
        });
    }
});

// Update a stock transaction
router.put('/:id', async (req, res) => {
    try {
        const stockTransaction = await stockTransactionsModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        return res.status(200).json({ success: true, stockTransaction });
    } catch (err) {
        return res.status(400).json({ success: false, message: err });
    }
});

// Delete a stock transaction
router.delete('/:id', async (req, res) => {
    try {
        await stockTransactionsModel.findByIdAndDelete(req.params.id);
        return res.status(200).json({ success: true, message: 'Stock transaction deleted successfully' });
    } catch (err) {
        return res.status(400).json({ success: false, message: err });
    }
});

module.exports = router;