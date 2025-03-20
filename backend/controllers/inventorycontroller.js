const Inventory = require("../models/inventorym");

// Add a new inventory item
const addInventoryItem = async (req, res) => {
  try {
    const { name, quantity } = req.body;
    const newItem = new Inventory({ name, quantity });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update stock quantity
const updateStock = async (req, res) => {
  try {
    const { id, quantity } = req.body;
    const item = await Inventory.findByIdAndUpdate(id, { quantity }, { new: true });
    res.status(200).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all inventory items
const getInventory = async (req, res) => {
  try {
    const items = await Inventory.find();
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Use stock (reduce quantity)
const useStock = async (req, res) => {
  try {
    const { id, quantity } = req.body;
    const item = await Inventory.findById(id);
    if (item.quantity < quantity) {
      return res.status(400).json({ error: "Insufficient stock" });
    }
    item.quantity -= quantity;
    await item.save();
    res.status(200).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Remove used items
const removeUsedItems = async (req, res) => {
  try {
    const { id } = req.body;
    await Inventory.findByIdAndDelete(id);
    res.status(200).json({ message: "Item removed successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete an inventory item
const deleteInventoryItem = async (req, res) => {
  try {
    const { id } = req.params;
    await Inventory.findByIdAndDelete(id);
    res.status(200).json({ message: "Item deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  addInventoryItem,
  updateStock,
  getInventory,
  useStock,
  removeUsedItems,
  deleteInventoryItem,
};