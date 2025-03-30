const mongoose = require("mongoose");
const { Schema } = mongoose;

const registercSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: false // Optional field
    },
    role: {
        type: String,
        enum: ['Admin', 'Customer', 'Customer Manager', 'Supplier', 'Supplier Manager', 'Employee Manager', 'Finance Manager'], // List of allowed roles
        default: 'Customer' // Default role
      }

});

//mongoose.model("RegisterC") is the collection aka database
const RegisterC = mongoose.model("RegisterC", registercSchema);

//Export RegisterC model to use in routes
module.exports = RegisterC;