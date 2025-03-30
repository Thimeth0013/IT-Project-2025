const express = require("express");
const {
  addInventoryItem,
  getInventory,
  deleteInventoryItem,
  useStock,
  updateInventoryItem, // Function to update all fields
} = require("../controllers/inventorycontroller");

const router = express.Router();

// Route to add a new inventory item
router.post("/add", addInventoryItem);

// Route to fetch all inventory items
router.get("/all", getInventory);

// Route to update an inventory item (all fields)
router.put("/update/:id", updateInventoryItem); // More descriptive route name

// Route to delete an inventory item
router.delete("/:id", deleteInventoryItem);

// Route to track inventory usage
router.get("/track", useStock); 

module.exports = router;