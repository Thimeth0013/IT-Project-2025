const mongoose = require('mongoose');

const TestSchema = new mongoose.Schema({
    name: String,
    message: String
});

const TestModel = mongoose.model('test', TestSchema);
module.exports = TestModel;