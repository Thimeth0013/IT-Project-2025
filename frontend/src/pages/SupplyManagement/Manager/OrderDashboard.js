import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const OrderDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalAmount: 0,
    pendingOrders: 0
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const [ordersRes, itemsRes, suppliersRes] = await Promise.all([
        axios.get('http://localhost:8000/api/orders'),
        axios.get('http://localhost:8000/api/items'),
        axios.get('http://localhost:8000/api/suppliers')
      ]);

      // Log responses to check data
      console.log('Orders:', ordersRes.data);
      console.log('Items:', itemsRes.data);
      console.log('Suppliers:', suppliersRes.data);

      // Create maps for items and suppliers
      const itemMap = itemsRes.data.items.reduce((acc, item) => {
        acc[item._id] = item.name;
        return acc;
      }, {});

      const supplierMap = suppliersRes.data.suppliers.reduce((acc, supplier) => {
        acc[supplier._id] = supplier.name;
        return acc;
      }, {});

      // Combine order data with item and supplier names
      const ordersWithDetails = ordersRes.data.orders.map(order => {
        console.log('Processing order:', order);
        console.log('Looking up item:', order.itemID, itemMap[order.itemID]);
        return {
          ...order,
          itemName: itemMap[order.itemID] || 'Unknown Item',
          supplierName: supplierMap[order.supplierID] || 'Unknown Supplier'
        };
      });

      console.log('Processed orders:', ordersWithDetails);

      setOrders(ordersWithDetails);
      calculateStats(ordersWithDetails);
      setLoading(false);
    } catch (err) {
      console.error('Error details:', err.response || err);
      setError('Error fetching orders: ' + (err.response?.data?.message || err.message));
      setLoading(false);
    }
  };

  const calculateStats = (orderData) => {
    const stats = {
      totalOrders: orderData.length,
      totalAmount: orderData.reduce((sum, order) => sum + (order.quantity * order.unitPrice), 0),
      pendingOrders: orderData.filter(order => order.status === 'Pending').length
    };
    setStats(stats);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        await axios.delete(`http://localhost:8000/api/orders/${id}`);
        fetchOrders();
        alert('Order deleted successfully');
      } catch (error) {
        console.error('Error deleting order:', error);
        alert('Error deleting order: ' + error.message);
      }
    }
  };

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">Order Dashboard</h1>
          <button
            onClick={() => navigate('/')}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Back to Dashboard
          </button>
          <button
            onClick={() => navigate('/supply')}
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
          >
            Check Order Status
          </button>
        </div>
        <Link
          to="/orders/add"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add New Order
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Total Orders</h3>
          <p className="text-3xl font-bold">{stats.totalOrders}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Total Amount</h3>
          <p className="text-3xl font-bold">Rs.{stats.totalAmount.toFixed(2)}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Pending Orders</h3>
          <p className="text-3xl font-bold">{stats.pendingOrders}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order Details</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Supplier</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unit Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order._id}>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{order.supplier}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{order.itemName}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{order.orderDetails}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{order.supplierName}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{order.itemName}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{order.quantity}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">Rs.{order.unitPrice}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    Rs.{(order.quantity * order.unitPrice).toFixed(2)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Link to={`/orders/edit/${order._id}`} className="text-indigo-600 hover:text-indigo-900 mr-4">
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(order._id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderDashboard;