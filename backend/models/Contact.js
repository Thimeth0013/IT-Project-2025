const mongoose = require("mongoose");
const { Schema } = mongoose;

const contactSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    messagereply: {
        type: String
    },
});

//mongoose.model("RegisterC") is the collection aka database
const Contactc = mongoose.model("Contactc", contactSchema);

//Export RegisterC model to use in routes
module.exports = Contactc;