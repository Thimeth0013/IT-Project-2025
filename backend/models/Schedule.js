const mongoose = require("mongoose");

const ScheduleSchema = new mongoose.Schema({
    scheduleID: {
        type: String,
        required: true,
        unique: true
    },
    employeeID: {  
        type: String,
        required: true,
        unique: true  
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    shift: {
        type: String,
        enum: ["Morning", "Evening", "Night"],
        required: true
    },
    workDays: {
        type: [String], // Example: ["Monday", "Wednesday", "Friday"]
        required: true
    },
    startTime: {
        type: String, // Example: "08:00 AM"
        required: true
    },
    endTime: {
        type: String, // Example: "05:00 PM"
        required: true
    }
}, { timestamps: true });

const Schedule = mongoose.model("Schedule", ScheduleSchema);
module.exports = Schedule;
