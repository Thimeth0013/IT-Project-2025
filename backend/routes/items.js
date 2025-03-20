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

// Get an item by ID
router.get('/:id', async (req, res) => {
    try {
        const item = await itemsModel.findById(req.params.id);
        return res.status(200).json({
            success: true,
            item
        });
    } catch (err) {
        return res.status(400).json({
            success: false,
            message: err
        });
    }
});

// Create an item
router.post('/', async (req, res) => {
    try {
        const item = await itemsModel.create(req.body);
        return res.status(201).json({
            success: true,
            item
        });
    } catch (err) {
        return res.status(400).json({
            success: false,
            message: err
        });
    }
});

// Update an item
router.put('/:id', async (req, res) => {
    try {
        const item = await itemsModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        return res.status(200).json({ success: true, item });
    } catch (err) {
        return res.status(400).json({ success: false, message: err });
    }
});

// Delete an item
router.delete('/:id', async (req, res) => {
    try {
        await itemsModel.findByIdAndDelete(req.params.id);
        return res.status(200).json({ success: true, message: 'Item deleted successfully' });
    } catch (err) {
        return res.status(400).json({ success: false, message: err });
    }
});

module.exports = router;