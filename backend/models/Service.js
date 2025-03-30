// backend/models/Service.js
const mongoose = require("mongoose");
const { Schema } = mongoose;

const serviceSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    items: [
      {
        itemId: { type: Schema.Types.ObjectId, ref: "inventories", required: true },
        quantities: {
          bike: { type: Number, min: 0, default: 0 },
          scooter: { type: Number, min: 0, default: 0 },
          car: { type: Number, min: 0, default: 0 },
          van: { type: Number, min: 0, default: 0 },
          suv: { type: Number, min: 0, default: 0 },
          cab: { type: Number, min: 0, default: 0 },
          bus: { type: Number, min: 0, default: 0 },
          truck: { type: Number, min: 0, default: 0 },
        },
      },
    ],
    unitPrice: { type: Number, required: true, min: 0 },
    image: { type: String, required: false }, // Added field to store the image path
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Service", serviceSchema);