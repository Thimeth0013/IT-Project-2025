import Inventory from "../Models/InventoryModel.js";
import { io } from "../app.js";

// 1️⃣ Add a new inventory item
export const addInventoryItem = async (req, res) => {
    try {
        const { name, category, quantity, pricePerUnit, brand, origin, manufactureDate, expiryDate, reorderLevel } = req.body;

        if (!name || !category || !quantity || !pricePerUnit || !brand) {
            return res.status(400).json({ message: "Missing required fields." });
        }

        const newItem = new Inventory({
            name,
            category,
            quantity,
            pricePerUnit,
            totalCost: quantity * pricePerUnit,
            brand,
            origin,
            manufactureDate,
            expiryDate,
            reorderLevel
        });

        await newItem.save();
        io.emit("inventoryUpdated", await Inventory.find()); // Notify clients about new inventory
        res.status(201).json({ message: "Inventory item added successfully", data: newItem });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 2️⃣ Update stock when supplier sends items
export const updateStock = async (req, res) => {
    try {
        const { itemId, quantity } = req.body;
        const item = await Inventory.findById(itemId);

        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }

        item.quantity += quantity;
        item.totalCost = item.quantity * item.pricePerUnit;
        await item.save();

        io.emit("inventoryUpdated", await Inventory.find()); // Notify clients about stock update

        // ✅ Check if stock reaches reorder level
        if (item.quantity <= item.reorderLevel) {
            io.emit("reorderAlert", { message: `Stock reaches re-order level for ${item.name}`, itemId: item._id });
        }

        res.status(200).json({ message: "Stock updated successfully", data: item });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 3️⃣ Fetch all inventory items
export const getInventory = async (req, res) => {
    try {
        const inventory = await Inventory.find();
        res.status(200).json(inventory);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 4️⃣ Reduce stock when items are used (but don't delete)
export const useStock = async (req, res) => {
    try {
        const { itemId, quantity } = req.body;
        const item = await Inventory.findById(itemId);

        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }

        if (item.quantity < quantity) {
            return res.status(400).json({ message: "Not enough stock available" });
        }

        item.quantity -= quantity;
        item.totalCost = item.quantity * item.pricePerUnit;
        await item.save();

        io.emit("inventoryUpdated", await Inventory.find()); // Notify clients about stock usage

        // ✅ Check if stock reaches reorder level
        if (item.quantity <= item.reorderLevel) {
            io.emit("reorderAlert", { message: `Stock reaches re-order level for ${item.name}`, itemId: item._id });
        }

        res.status(200).json({ message: "Stock used successfully", data: item });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 5️⃣ Remove items used for service (delete from DB)
export const removeUsedItems = async (req, res) => {
    try {
        const { itemIds } = req.body;

        if (!itemIds || !Array.isArray(itemIds)) {
            return res.status(400).json({ message: "Invalid request format" });
        }

        await Inventory.deleteMany({ _id: { $in: itemIds } });

        io.emit("inventoryUpdated", await Inventory.find()); // Notify clients about inventory change

        res.status(200).json({ message: "Items removed successfully from inventory" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 6️⃣ Delete an inventory item
export const deleteInventoryItem = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedItem = await Inventory.findByIdAndDelete(id);

        if (!deletedItem) {
            return res.status(404).json({ message: "Item not found" });
        }

        // Notify clients via Socket.io about inventory update
        io.emit("inventoryUpdated", { _id: id, deleted: true });

        res.json({ message: "Item deleted successfully", deletedItem });
    } catch (error) {
        res.status(500).json({ message: "Error deleting item", error });
    }
};

// 7️⃣ Automate expiry alerts
export const checkExpiringItems = async () => {
    try {
        const today = new Date();
        const expiringItems = await Inventory.find({ expiryDate: { $lte: today } });

        expiringItems.forEach(item => {
            io.emit("expiryAlert", { message: `${item.name} is expiring soon!` });
        });

    } catch (error) {
        console.error("Error checking expiring items:", error);
    }
};

// Run expiry check every 24 hours
setInterval(checkExpiringItems, 86400000);
