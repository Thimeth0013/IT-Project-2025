const router = require('express').Router();
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

module.exports = router;