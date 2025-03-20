const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Authentication = require("../models/Authentication");
const authMiddleware = require("../middleware/authMiddleware");

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key"; // Use environment variables in production

// POST - Register a new user
router.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await Authentication.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User with this email already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user with default role "Customer"
    const newUser = new Authentication({
      name,
      email,
      password: hashedPassword,
      role: role || "Customer", // Default to "Customer" if no role is provided
    });

    await newUser.save();

    // Generate JWT Token
    const token = jwt.sign({ id: newUser._id, role: newUser.role }, JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({
      message: "User registered successfully!",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error registering user" });
  }
});

// POST - User Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    const user = await Authentication.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Generate JWT Token
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: "7d" });

    // Redirect based on user role
    switch (user.role) {
      case "Supplier":
        return res.status(200).json({
          message: "Login successful",
          token,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
          redirectTo: "/supplier-dashboard",
        });
      case "Supplier Manager":
        return res.status(200).json({
          message: "Login successful",
          token,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
          redirectTo: "/supplier-manager-dashboard",
        });
      case "Customer Manager":
        return res.status(200).json({
          message: "Login successful",
          token,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
          redirectTo: "/CustomerM",
        });
      case "Employee Manager":
        return res.status(200).json({
          message: "Login successful",
          token,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
          redirectTo: "/employee-manager-dashboard",
        });
      case "Inventory Manager":
        return res.status(200).json({
          message: "Login successful",
          token,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
          redirectTo: "/inventory-manager-dashboard",
        });
      case "Finance Manager":
        return res.status(200).json({
          message: "Login successful",
          token,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
          redirectTo: "/finance-manager-dashboard",
        });
      case "Admin":
        return res.status(200).json({
          message: "Login successful",
          token,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
          redirectTo: "/Admin",
        });
      default:
        // For "Customer" or any other role, redirect to the default route
        return res.status(200).json({
          message: "Login successful",
          token,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
          redirectTo: "/",
        });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error logging in" });
  }
});

// GET - Get current user's details
router.get("/currentUser", authMiddleware(["Customer", "Admin", "Supplier", "Supplier Manager", "Customer Manager", "Employee Manager", "Inventory Manager", "Finance Manager"]), async (req, res) => {
  try {
    const user = await Authentication.findById(req.userId).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching user details" });
  }
});

// GET - Get all users (Admin only)
router.get("/getAllUsers", authMiddleware(["Admin"]), async (req, res) => {
  try {
    const users = await Authentication.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching users" });
  }
});

// GET - Get user by ID
router.get("/getUser/:id", authMiddleware(["Admin", "Customer"]), async (req, res) => {
  try {
    const user = await Authentication.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching user" });
  }
});

// PUT - Update User Profile
router.put("/updateProfile/:id", authMiddleware(["Customer", "Admin"]), async (req, res) => {
  try {
    const { password, ...updateData } = req.body;

    const updatedUser = await Authentication.findByIdAndUpdate(
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

// PUT - Change Password
router.put("/changePassword/:id", authMiddleware(["Customer", "Admin"]), async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await Authentication.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Current password is incorrect" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error changing password" });
  }
});

// DELETE - Delete User Account (Admin or user themselves)
router.delete("/deleteAccount/:id", authMiddleware(["Admin", "Customer"]), async (req, res) => {
  try {
    const deletedUser = await Authentication.findByIdAndDelete(req.params.id);
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
