const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String, 
        required: true 
    },
    category: { 
        type: String, 
        required: true 
    },
    price: { 
        type: Number, 
        required: true,
        min: 0 
    },
    stockQuantity: { 
        type: Number, 
        required: true,
        min: 0 
    },
    supplierID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'suppliers',
        required: true
    }
}, {
    timestamps: true
});

// Add index for faster queries
ItemSchema.index({ supplierID: 1 });
ItemSchema.index({ name: 1 });

// Pre-save middleware to update timestamps
ItemSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

// Virtual for full item details
ItemSchema.virtual('fullDetails').get(function() {
    return `${this.name} - ${this.category} (Stock: ${this.stockQuantity})`;
});

const ItemModel = mongoose.model('items', ItemSchema);

module.exports = ItemModel;