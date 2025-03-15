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

module.exports = router;