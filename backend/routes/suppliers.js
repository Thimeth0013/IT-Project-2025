const router = require('express').Router();
const itemsModel = require('../models/supplier/items');
const ordersModel = require('../models/supplier/orders');
const stockTransactionsModel = require('../models/supplier/stock_transactions');
const suppliersModel = require('../models/supplier/suppliers');

// Get all suppliers
router.get('/', async (req, res) => {
    try {
        const suppliers = await suppliersModel.find({});
        return res.status(200).json({
            success: true,
            suppliers
        });
    } catch (err) {
        return res.status(400).json({
            success: false,
            message: err
        });
    }
});

// Get all items
router.get('/items', async (req, res) => {
    try {
        const items = await itemsModel.find({});
        return res.status(200).json({
            success: true,
            items
        });
    } catch (err) {
        return res.status(400).json({
            success: false,
            message: err
        });
    }
});

// Get all orders
router.get('/orders', async (req, res) => {
    try {
        const orders = await ordersModel.find({});
        return res.status(200).json({
            success: true,
            orders
        });
    } catch (err) {
        return res.status(400).json({
            success: false,
            message: err
        });
    }
});

// Get all stock transactions
router.get('/stock_transactions', async (req, res) => {
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