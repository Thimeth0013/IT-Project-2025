const Inventory = require("../models/inventorym");

// ✅ Add a new inventory item
const addInventoryItem = async (req, res) => {
    try {
        const { itemName, category, stock, unitPrice, expiryDate, manufactureDate, reorderLevel } = req.body;

        const newItem = new Inventory({
            itemName,
            category,
            stock,
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
    }
};

// ✅ Update an inventory item (all fields, including stock)
const updateInventoryItem = async (req, res) => {
    try {
        const { id } = req.params; // Get item ID from request params
        const updatedData = req.body; // Get updated data from request body

        // Find the item by ID and update it with new data
        const item = await Inventory.findById(id);
        if (!item) return res.status(404).json({ message: "Item not found" });

        // Update all fields dynamically from the request body
        Object.keys(updatedData).forEach((key) => {
            if (key in item) {
                item[key] = updatedData[key];
            }
        });

        // Recalculate totalCost if stock or unitPrice is updated
        if (updatedData.stock || updatedData.unitPrice) {
            item.totalCost = item.stock * item.unitPrice;
        }

        await item.save();

        // Check reorder level after updating stock
        if (updatedData.stock) {
            checkReorderLevel(item);
        }

        res.json({ message: "Inventory item updated successfully", item });
    } catch (error) {
        res.status(500).json({ message: "Error updating inventory item", error });
    }
};


module.exports = {
    addInventoryItem,
    getInventory,
    useStock,
    deleteInventoryItem,
    updateInventoryItem // Export newly added function
};