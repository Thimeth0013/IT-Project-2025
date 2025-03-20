const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  quantity: { type: Number, required: true, default: 0 },
  pricePerUnit: { type: Number, required: true },
  totalCost: { type: Number, required: true },
  brand: { type: String, required: true },
  origin: { type: String },
  manufactureDate: { type: Date },
  expiryDate: { type: Date },
  reorderLevel: { type: Number, required: true, default: 5 },
}, { timestamps: true });

inventorySchema.pre("save", function (next) {
  this.totalCost = this.quantity * this.pricePerUnit;
  next();
});

module.exports = mongoose.model("Inventory", inventorySchema);