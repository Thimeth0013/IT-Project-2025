const router = require('express').Router();
const suppliersModel = require('../models/supplier/suppliers');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

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

// Create a supplier with credentials
router.post('/', async (req, res) => {
    try {
        // Generate username from name
        const username = req.body.name.toLowerCase().replace(/\s+/g, '') +
            Math.floor(Math.random() * 1000);

        // Generate random password
        const password = Math.random().toString(36).slice(-8) +
            Math.random().toString(36).toUpperCase().slice(-2) +
            Math.floor(Math.random() * 10);

        // Create supplier with credentials
        const supplierData = {
            ...req.body,
            username,
            password
        };

        const supplier = await suppliersModel.create(supplierData);

        // Send email with credentials
        transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: supplier.email,
            subject: 'Supplier account created',
            text: `
                Dear ${supplierData.name},

                Your supplier account has been created successfully.

                Here are your login credentials:
                Email: ${supplierData.email}
                Password: ${req.body.password}

                Please keep this information secure.

                Regards,
                FixMate Team
            `
        });

        return res.status(201).json({
            success: true,
            supplier: {
                ...supplier.toObject(),
                plainPassword: password // Send plain password only in response
            }
        });
    } catch (err) {
        return res.status(400).json({
            success: false,
            message: err.message
        });
    }
});

// Supplier login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find supplier by username
        const supplier = await suppliersModel.findOne({ username });
        if (!supplier) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, supplier.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        return res.status(200).json({
            success: true,
            supplier: {
                _id: supplier._id,
                name: supplier.name,
                username: supplier.username
            }
        });
    } catch (err) {
        return res.status(400).json({
            success: false,
            message: err.message
        });
    }
});

// Update a supplier
router.put('/:id', async (req, res) => {
    try {
        const supplier = await suppliersModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        return res.status(200).json({ success: true, supplier });
    } catch (err) {
        return res.status(400).json({ success: false, message: err });
    }
});

// Delete a supplier
router.delete('/:id', async (req, res) => {
    try {
        await suppliersModel.findByIdAndDelete(req.params.id);
        return res.status(200).json({
            success: true,
            message: 'The supplier was deleted.'
        });
    } catch (err) {
        return res.status(400).json({ success: false, message: err });
    }
});

module.exports = router;