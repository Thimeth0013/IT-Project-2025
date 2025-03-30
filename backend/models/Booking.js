// backend/models/Booking.js
const mongoose = require("mongoose");
const { Schema } = mongoose;

const bookingSchema = new Schema(
  {
    name: { type: String, required: true },
    vehicleNo: { type: String, required: true },
    vehicleType: { type: String, required: true },
    vehicleMake: { type: String, required: true },
    serviceType: [
      {
        _id: { type: Schema.Types.ObjectId, ref: "Service" },
        name: { type: String },
        description: { type: String },
        unitPrice: { type: Number },
        items: [
          {
            itemId: { type: Schema.Types.ObjectId, ref: "inventories" },
            itemName: { type: String },
            quantity: { type: Number },
            unitPrice: { type: Number },
          },
        ],
      },
    ],
    bookingDate: { type: Date, required: true },
    bookingTime: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String, required: true },
    mileage: { type: Number, required: true },
    totalCost: { type: Number, required: true },
    initialPayment: { type: Number, default: 0 },
    additionalPayment: { type: Number, default: 0 }, // Added for notifications
    pendingServices: [{ // Added for notifications
      name: { type: String },
      unitPrice: { type: Number },
    }],
    additionalCost: { type: Number, default: 0 }, // Added for notifications
    status: {
      type: String,
      enum: ["Active", "Ongoing", "Complete", "OnHold", "Canceled"],
      default: "Active",
    },
    paymentStatus: {
      type: String,
      enum: ["Fully Paid", "Partially Paid", "Not Paid"],
      default: "Not Paid",
    },
    inventoryDeducted: { type: Boolean, default: false }, // Added to prevent multiple deductions
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);