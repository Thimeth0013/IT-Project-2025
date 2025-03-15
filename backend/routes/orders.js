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

module.exports = router;