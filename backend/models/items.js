const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
    name: String,
    description: String,
    category: String,
    price: Number,
    stockQuantity: Number,
});

const ItemModel = mongoose.model('items', ItemSchema);
module.exports = ItemModel;