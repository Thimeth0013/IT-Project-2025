const mongoose = require("mongoose");

const SalarySchema = new mongoose.Schema({
    employeeID: { // ✅ Add employeeID to schema
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
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
    }
});

// Automatically calculate net salary before saving
SalarySchema.pre("save", function (next) {
    const { basicSalary, taxRate, deductions, bonuses } = this;
    // Calculate net salary based on basic salary, tax, deductions, and bonuses
    this.netSalary = basicSalary - (basicSalary * (taxRate / 100)) - deductions + bonuses;
    next();
});

const Salary = mongoose.model("Salary", SalarySchema);
module.exports = Salary;
