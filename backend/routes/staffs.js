const router = require('express').Router();
const bcrypt = require("bcryptjs");
const Staff = require("../models/Staff");
const nodemailer = require("nodemailer");


// ✅ Get all staff members
router.get("/getallstaff", async (req, res) => {
    try {
        const staff = await Staff.find({});
        return res.status(200).json({
            success: true,
            staff
        });
    } catch (err) {
        return res.status(400).json({ success: false, message: err.message });
    }
});

// ✅ Get a staff member by ID
// In routes/staff.js or similar
router.get('/:id', async (req, res) => {
    try {
      const staff = await Staff.findById(req.params.id);
      if (!staff) {
        return res.status(404).json({ message: 'Staff not found' });
      }
  
      res.json({ staff }); // ✅ This is what the frontend expects
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  });
  

// ✅ Create a staff member and send email (Gmail auth fix)
router.post("/addstaff", async (req, res) => {
    try {
        // Generate username
        const username = req.body.name.toLowerCase().replace(/\s+/g, '') + 
                         Math.floor(Math.random() * 1000);

        // Generate password
        const password = Math.random().toString(36).slice(-8) + 
                         Math.random().toString(36).toUpperCase().slice(-2) + 
                         Math.floor(Math.random() * 10);

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create staff
        const staffData = {
            ...req.body,
            username,
            password: hashedPassword
        };
        const newStaff = await Staff.create(staffData);

        // ✅ Transporter using Gmail (Authentication fixed)
        const transporter = nodemailer.createTransport({
            service: 'gmail', // 👈 this is important instead of host/port
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // ✨ Prepare work days (array to string)
        const workDays = Array.isArray(newStaff.workDays) ? newStaff.workDays.join(', ') : '';

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: newStaff.email,
            subject: "Welcome to Staff Management System",
            text: `
Hi ${newStaff.name},

Welcome to our system!

Here are your details:

- Role: ${newStaff.role}
- Basic Salary: ${newStaff.basicSalary}
- Shift: ${newStaff.shift}
- Work Days: ${workDays}



Thank you,
Staff Management Team
            `
        };

        // ✅ Send the email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Failed to send email:", error.message);
            } else {
                console.log("Email sent successfully:", info.response);
            }
        });

        // ✅ Respond back to frontend
        return res.status(201).json({
            success: true,
            staff: {
                ...newStaff.toObject(),
                plainPassword: password
            },
            message: "Staff created successfully (email attempted)"
        });

    } catch (err) {
        console.error(err);
        return res.status(400).json({ success: false, message: err.message });
    }
});




// ✅ Staff Login Route
router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find staff by username
        const staff = await Staff.findOne({ username });
        if (!staff) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, staff.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        return res.status(200).json({
            success: true,
            staff: {
                _id: staff._id,
                name: staff.name,
                username: staff.username,
                role: staff.role
            }
        });
    } catch (err) {
        return res.status(400).json({ success: false, message: err.message });
    }
});

// ✅ Update a staff member
router.put("/:id", async (req, res) => {
    try {
        const updatedStaff = await Staff.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedStaff) {
            return res.status(404).json({ success: false, message: "Staff member not found" });
        }
        return res.status(200).json({ success: true, staff: updatedStaff });
    } catch (err) {
        return res.status(400).json({ success: false, message: err.message });
    }
});

// ✅ Delete a staff member
router.delete("/deletestaff/:id", async (req, res) => {
    try {
        const deletedStaff = await Staff.findByIdAndDelete(req.params.id);
        if (!deletedStaff) {
            return res.status(404).json({ success: false, message: "Staff member not found" });
        }
        return res.status(200).json({ success: true, message: "Staff member deleted successfully" });
    } catch (err) {
        return res.status(400).json({ success: false, message: err.message });
    }
});

module.exports = router;
