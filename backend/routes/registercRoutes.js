const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs"); // For password hashing

const RegisterC = require("../models/RegisterC"); // Import the RegisterC model

// POST - Register a new user
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await RegisterC.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User with this email already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new RegisterC({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({
      message: "User registered successfully!",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error registering user" });
  }
});

// POST - User login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await RegisterC.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Return user data (in a real app, you'd generate a JWT token here)
    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error logging in" });
  }
});

// GET - Get all users (admin only route in a real app)
router.get("/getAllUsers", async (req, res) => {
  try {
    const users = await RegisterC.find().select("-password"); // Exclude password field
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching users" });
  }
});

// GET - Get user by ID
router.get("/getUser/:id", async (req, res) => {
  try {
    const user = await RegisterC.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching user" });
  }
});

// PUT - Update user profile
router.put("/updateProfile/:id", async (req, res) => {
  try {
    // Don't allow password update through this route
    const { password, ...updateData } = req.body;
    
    const updatedUser = await RegisterC.findByIdAndUpdate(
      req.params.id, 
      updateData, 
      { new: true }
    ).select("-password");
    
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    
    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error updating profile" });
  }
});

// PUT - Change password
router.put("/changePassword/:id", async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    // Find user
    const user = await RegisterC.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Current password is incorrect" });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error changing password" });
  }
});

// DELETE - Delete user account
router.delete("/deleteAccount/:id", async (req, res) => {
  try {
    const deletedUser = await RegisterC.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error deleting account" });
  }
});

module.exports = router;