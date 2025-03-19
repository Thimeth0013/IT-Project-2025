import mongoose from "mongoose";

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
    reorderLevel: { type: Number, required: true, default: 5 }, // Reorder alert threshold
}, { timestamps: true });

//  Auto-calculate totalCost before saving
inventorySchema.pre("save", function (next) {
    this.totalCost = this.quantity * this.pricePerUnit;
    next();
});

export default mongoose.model("Inventory", inventorySchema);