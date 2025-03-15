const router = require('express').Router();
const itemsModel = require('../models/supplier/items');

// Get all items
router.get('/', async (req, res) => {
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

module.exports = router;