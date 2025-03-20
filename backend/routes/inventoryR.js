const express = require("express");
const {
  addInventoryItem,
  updateStock,
  getInventory,
  useStock,
  removeUsedItems,
  deleteInventoryItem,
} = require("../controllers/inventorycontroller");

const router = express.Router();

router.post("/add", addInventoryItem);
router.put("/updateStock", updateStock);
router.get("/all", getInventory);
router.put("/useStock", useStock);
router.delete("/removeUsedItems", removeUsedItems);
router.delete("/:id", deleteInventoryItem);

module.exports = router;