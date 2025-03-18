const mongoose = require("mongoose");
const { Schema } = mongoose;

const bookingSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    vehicleNo: {
        type: String,
        required: true
    },
    vehicleType: {
        type: String,
        required: true
    },
    serviceType: {
        type: [String],
        required: true
    },
    bookingDate: {
        type: Date,
        required: true
    },
    bookingTime: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,  // Storing phone number as string to handle different formats
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    mileage: {
        type: Number,  // Storing mileage as a number
        required: true
    },
    status: {
        type: String,
        enum: ['Active', 'Ongoing', 'Complete', 'OnHold', 'Canceled'],
        default: 'Active', // Set default status to Active
    }
}, { timestamps: true });

//mongoose.model("Booking") is the collection aka database
const Booking = mongoose.model("Booking", bookingSchema);

//Export Booking model to use in routes
module.exports = Booking;