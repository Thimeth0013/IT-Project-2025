const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const supplierSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    address: {
        type: String,
        required: true
    },
    category: {  
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['Cleaning', 'Polishing', 'Oils', 'Fluids', 'Filters', 'Tire', 'Electrical', 'Other']
    },
    role: {
        type: String,
        enum: ['Admin', 'Customer', 'Customer Manager', 'Supplier', 'Supplier Manager', 'Employee Manager', 'Finance Manager'], // List of allowed roles
        default: 'Supplier'
    }
}, {
    timestamps: true
});

// Hash password before saving
supplierSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

module.exports = mongoose.model('suppliers', supplierSchema);