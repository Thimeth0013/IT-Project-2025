const router = require('express').Router();
const ordersModel = require('../models/supplier/orders');

// Get all orders
router.get('/', async (req, res) => {
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

// Get an order by ID
router.get('/:id', async (req, res) => {
    try {
        const order = await ordersModel.findById(req.params.id);
        return res.status(200).json({
            success: true,
            order
        });
    } catch (err) {
        return res.status(400).json({
            success: false,
            message: err
        });
    }
});

// Create an order
router.post('/', async (req, res) => {
    try {
        const order = await ordersModel.create(req.body);
        return res.status(201).json({
            success: true,
            order
        });
    } catch (err) {
        return res.status(400).json({
            success: false,
            message: err
        });
    }
});

// Update an order
router.put('/:id', async (req, res) => {
    try {
        const order = await ordersModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        return res.status(200).json({ success: true, order });
    } catch (err) {
        return res.status(400).json({ success: false, message: err });
    }
});

// Delete an order
router.delete('/:id', async (req, res) => {
    try {
        const order = await ordersModel.findByIdAndDelete(req.params.id);
        return res.status(200).json({ success: true, order });
    } catch (err) {
        return res.status(400).json({ success: false, message: err });
    }
});

module.exports = router;