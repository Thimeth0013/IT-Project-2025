const Inventory = require("../models/inventorym");

// ✅ Add a new inventory item
const addInventoryItem = async (req, res) => {
    try {
        const { itemName, category, Quantity, unitPrice, expiryDate, manufactureDate, reorderLevel } = req.body;

        const newItem = new Inventory({
            itemName,
            category,
            Quantity,
            unitPrice,
            expiryDate,
            manufactureDate,
            reorderLevel
        });

        await newItem.save();
        res.status(201).json({ message: "Inventory item added successfully", newItem });
    } catch (error) {
        res.status(500).json({ message: "Error adding item", error });
    }
};

// ✅ Update stock manually
const updateStock = async (req, res) => {
    try {
        const { id, stock } = req.body;

        const item = await Inventory.findById(id);
        if (!item) return res.status(404).json({ message: "Item not found" });

        item.Quantity = Quantity;
        item.totalCost = item.Quantity * item.unitPrice;
        await item.save();

        checkReorderLevel(item);  // Check reorder level after stock update

        res.json({ message: "Stock updated successfully", item });
    } catch (error) {
        res.status(500).json({ message: "Error updating stock", error });
    }
};

// ✅ Fetch all inventory items
const getInventory = async (req, res) => {
    try {
        const items = await Inventory.find();
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: "Error fetching inventory", error });
    }
};

// ✅ Deduct stock when used (e.g., customer books items)
const useStock = async (req, res) => {
    try {
        const { id, quantityUsed } = req.body;

        const item = await Inventory.findById(id);
        if (!item) return res.status(404).json({ message: "Item not found" });

        if (item.stock < quantityUsed) {
            return res.status(400).json({ message: "Not enough stock available" });
        }

        item.stock -= quantityUsed;
        item.totalCost = item.stock * item.unitPrice;
        await item.save();

        checkReorderLevel(item);  // Check reorder level after stock usage

        res.json({ message: "Stock updated after usage", item });
    } catch (error) {
        res.status(500).json({ message: "Error using stock", error });
    }
};

// ✅ Delete an inventory item
const deleteInventoryItem = async (req, res) => {
    try {
        const { id } = req.params;

        const item = await Inventory.findByIdAndDelete(id);
        if (!item) return res.status(404).json({ message: "Item not found" });

        res.json({ message: "Inventory item deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting item", error });
    }
};

// ✅ Check Reorder Level & Send Notification
const checkReorderLevel = async (item) => {
    if (item.Quantity <= item.reorderLevel) {
        console.log(`🔴 Low stock alert: ${item.itemName} has reached the reorder level.`);
        // You can extend this to store notifications in a DB table
    }
};

module.exports = {
    addInventoryItem,
    updateStock,
    getInventory,
    useStock,
    deleteInventoryItem
};
