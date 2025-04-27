const express = require("express");
const router = express.Router();
const Salary = require("../models/Salary");

// ✅ Add Salary Record
router.post("/addsalary", async (req, res) => {
    try {
        const { email, employeeID, basicSalary, taxRate = 10, deductions = 0, bonuses = 0 } = req.body;

        // ✅ Ensure employeeID is provided
        if (!employeeID) {
            return res.status(400).json({ error: "Employee ID is required" });
        }

        // ✅ Ensure email is provided
        if (!email) {
            return res.status(400).json({ error: "Email is required" });
        }

        // ✅ Check if salary record already exists for the employee based on employeeID
        const existingSalary = await Salary.findOne({ employeeID });
        if (existingSalary) {
            return res.status(400).json({ error: "Salary record already exists for this employee" });
        }

        // ✅ Create new salary record
        const newSalary = new Salary({
            email,
            employeeID,
            basicSalary,
            taxRate,
            deductions,
            bonuses
        });

        await newSalary.save();
        res.status(201).json({ message: "Salary record added successfully!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



// ✅ Get All Salary Records
router.get("/getallsalaries", async (req, res) => {
    try {
        const salaries = await Salary.find();
        res.status(200).json(salaries);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ Get Salary by Employee Email
router.get("/:email", async (req, res) => {
    try {
        const salary = await Salary.findOne({ email: req.params.email });
        if (!salary) return res.status(404).json({ error: "Salary record not found" });
        res.status(200).json(salary);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ Update Salary Record
router.put("/update/:email", async (req, res) => {
    try {
        const { basicSalary, taxRate, deductions, bonuses } = req.body;
        const updatedSalary = await Salary.findOneAndUpdate(
            { email: req.params.email },
            { basicSalary, taxRate, deductions, bonuses },
            { new: true }
        );

        if (!updatedSalary) return res.status(404).json({ error: "Salary record not found" });
        res.status(200).json({ message: "Salary record updated successfully!", salary: updatedSalary });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ Delete Salary Record
router.delete("/delete/:email", async (req, res) => {
    try {
        const deletedSalary = await Salary.findOneAndDelete({ email: req.params.email });
        if (!deletedSalary) return res.status(404).json({ error: "Salary record not found" });
        res.status(200).json({ message: "Salary record deleted successfully!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
