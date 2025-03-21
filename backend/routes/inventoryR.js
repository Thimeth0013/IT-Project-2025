const express = require("express");
const {
  addInventoryItem,
  updateStock,
  getInventory,
  deleteInventoryItem,
  useStock,
} = require("../controllers/inventoryController");

const router = express.Router();

router.post("/add", addInventoryItem);
router.get("/all", getInventory);
router.put("/updateStock", updateStock);
router.delete("/:id", deleteInventoryItem);
router.get("/track", useStock,);

module.exports = router;
