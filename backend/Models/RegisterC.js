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
    }
});

//mongoose.model("RegisterC") is the collection aka database
const RegisterC = mongoose.model("RegisterC", registercSchema);

//Export RegisterC model to use in routes
module.exports = RegisterC;