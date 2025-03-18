const express = require('express');
const router = express.Router();
const supplierOrderController = require('../../controllers/supply/supplierOrderController');

router.get('/:supplierID', supplierOrderController.getSupplierOrders);
router.patch('/:orderID/status', supplierOrderController.updateOrderStatus);

module.exports = router;