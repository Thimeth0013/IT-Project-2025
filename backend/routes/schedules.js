const express = require("express");
const router = express.Router();
const Schedule = require("../models/Schedule");

// ✅ Add Work Schedule
router.post("/addschedule", async (req, res) => {
    try {
        const { scheduleID, employeeID, email, shift, workDays, startTime, endTime } = req.body;

        if (!employeeID) {
            return res.status(400).json({ error: "Employee ID is required" });
        }

        // ✅ Check if a schedule already exists for this employee
        const existingSchedule = await Schedule.findOne({ employeeID });
        if (existingSchedule) {
            return res.status(400).json({ error: "Schedule already exists for this employee" });
        }

        const newSchedule = new Schedule({
            scheduleID,
            employeeID,
            email,
            shift,
            workDays,
            startTime,
            endTime
        });

        await newSchedule.save();
        res.status(201).json({ message: "Schedule added successfully!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// ✅ Get All Schedules
router.get("/getallschedules", async (req, res) => {
    try {
        const schedules = await Schedule.find();
        res.status(200).json(schedules);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ Get Schedule by Employee id
router.get("/:id", async (req, res) => {
    try {
        const schedule = await Schedule.findOne({ employeeID: req.params.id });  
        if (!schedule) return res.status(404).json({ error: "Schedule not found" });
        res.status(200).json(schedule);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// ✅ Update Work Schedule
router.put("/update/:id", async (req, res) => {
    try {
        const updatedSchedule = await Schedule.findOneAndUpdate({ employeeID: req.params.id }, req.body, { new: true });
        if (!updatedSchedule) return res.status(404).json({ error: "Schedule not found" });
        res.status(200).json({ message: "Schedule updated successfully!", schedule: updatedSchedule });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ Delete Schedule
router.delete("/delete/:id", async (req, res) => {
    try {
        const deletedSchedule = await Schedule.findOneAndDelete({ employeeID: req.params.id });
        if (!deletedSchedule) return res.status(404).json({ error: "Schedule not found" });
        res.status(200).json({ message: "Schedule deleted successfully!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
