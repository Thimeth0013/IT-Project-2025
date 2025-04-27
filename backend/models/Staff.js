const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const staffSchema = new mongoose.Schema({
    employeeID: {
        type: String,
        unique: true, 
        required: true,
    },
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
    password: {
        type: String,
        
    },
    role: {
        type: String,
        enum: ["Mechanic", "Engine Repair", "Oil Change Technician", "Cleaner", "Tire Specialist"], // Allowed roles
        default: 'Mechanic'
    },
    basicSalary: {
        type: Number,
        required: true
    },
    taxRate: {
        type: Number,
        required: true,
    },
    deductions: {
        type: Number,
        required: true,
    },
    bonuses: {
        type: Number,
        required: true,
    },
    netSalary: {
        type: Number,
    },
    paymentDate: {
        type: Date,
        default: Date.now
    },
    shift: {
        type: String,
        enum: ["Morning", "Evening", "Night"],
        required: true
    },
    workDays: {
        type: [String], // Example: ["Monday", "Wednesday", "Friday"]
        required: true
    },
    

}, {
    timestamps: true
});

// ✅ Hash password before saving
staffSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

// Automatically calculate net salary before saving
staffSchema.pre("save", function (next) {
    const { basicSalary, taxRate, deductions, bonuses } = this;
    // Calculate net salary based on basic salary, tax, deductions, and bonuses
    this.netSalary = basicSalary - (basicSalary * (taxRate / 100)) - deductions + bonuses;
    next();
});



module.exports = mongoose.model('Staff', staffSchema);


    
    