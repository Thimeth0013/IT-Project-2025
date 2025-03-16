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

// Get a supplier by ID
router.get('/:id', async (req, res) => {
    try {
        const supplier = await suppliersModel.findById(req.params.id);
        return res.status(200).json({
            success: true,
            supplier
        });
    } catch (err) {
        return res.status(400).json({
            success: false,
            message: err
        });
    }
});

// Create a supplier
router.post('/', async (req, res) => {
    try {
        const supplier = await suppliersModel.create(req.body);
        return res.status(201).json({
            success: true,
            supplier
        });
    } catch (err) {
        return res.status(400).json({
            success: false,
            message: err
        });
    }
});

// Update a supplier
router.put('/:id', async (req, res) => {
    try {
        const supplier = await suppliersModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        return res.status(200).json({ success: true, supplier });
    } catch (err) {
        return res.status(400).json({ success: false, message: err });
    }
});

// Delete a supplier
router.delete('/:id', async (req, res) => {
    try {
        await suppliersModel.findByIdAndDelete(req.params.id);
        return res.status(200).json( { success: true, message: 'The supplier was deleted.' });
    } catch (err) {
        return res.status(400).json({ success: false, message: err });
    }
});

module.exports = router;