const SupplierOrder = require('../../models/supply/supplierOrder');

exports.getSupplierOrders = async (req, res) => {
  try {
    const { supplierID } = req.params;
    const orders = await SupplierOrder.find({ supplierID })
      .populate('itemID')
      .sort({ createdAt: -1 });
    
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderID } = req.params;
    const { status } = req.body;
    
    const order = await SupplierOrder.findByIdAndUpdate(
      orderID,
      { status },
      { new: true }
    );
    
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};