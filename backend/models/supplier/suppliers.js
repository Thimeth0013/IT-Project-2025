const mongoose = require('mongoose');

const SupplierSchema = new mongoose.Schema({
    name: String,
    phone: Number,
    email: String,
    address: String,
    totalAmmount: Number,
    status: String,
});

const SupplierModel = mongoose.model('suppliers', SupplierSchema);
module.exports = SupplierModel;