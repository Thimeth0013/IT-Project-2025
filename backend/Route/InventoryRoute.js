import express from "express";
import {
    addInventoryItem,
    updateStock,
    getInventory,
    useStock,
    removeUsedItems,
    deleteInventoryItem
} from "../Controllers/inventoryController.js";

const router = express.Router();

router.post("/add", addInventoryItem);
router.put("/updateStock", updateStock);
router.get("/all", getInventory);
router.put("/useStock", useStock);
router.delete("/removeUsedItems", removeUsedItems);
// DELETE route to remove an inventory item
router.delete("/:id", deleteInventoryItem);



export default router;
