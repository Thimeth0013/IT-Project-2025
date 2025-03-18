import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const SupplyDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalSuppliers: 0,
    totalItems: 0,
    totalOrders: 0,
    totalTransactions: 0,
    pendingOrders: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [suppliers, items, orders, transactions] = await Promise.all([
        axios.get('http://localhost:8000/api/suppliers'),
        axios.get('http://localhost:8000/api/items'),
        axios.get('http://localhost:8000/api/orders'),
        axios.get('http://localhost:8000/api/stock_transactions')
      ]);

      const pendingOrders = orders.data.orders.filter(order => order.status === 'Pending').length;

      setStats({
        totalSuppliers: suppliers.data.suppliers.length,
        totalItems: items.data.items.length,
        totalOrders: orders.data.orders.length,
        totalTransactions: transactions.data.stockTransactions.length,
        pendingOrders
      });
      setLoading(false);
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError('Error fetching dashboard statistics');
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Supply Management Dashboard</h1>
        <button
          onClick={() => navigate('/')}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Back to Main Dashboard
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Suppliers Card */}
        <Link 
          to="/suppliers"
          className="bg-blue-100 p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
        >
          <div className="text-blue-600">
            <h2 className="text-xl font-semibold mb-2">Suppliers</h2>
            <p className="text-3xl font-bold">{stats.totalSuppliers}</p>
            <p className="text-sm mt-2">Total registered suppliers</p>
          </div>
        </Link>

        {/* Items Card */}
        <Link 
          to="/items"
          className="bg-green-100 p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
        >
          <div className="text-green-600">
            <h2 className="text-xl font-semibold mb-2">Items</h2>
            <p className="text-3xl font-bold">{stats.totalItems}</p>
            <p className="text-sm mt-2">Total inventory items</p>
          </div>
        </Link>

        {/* Orders Card */}
        <Link 
          to="/orders"
          className="bg-purple-100 p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
        >
          <div className="text-purple-600">
            <h2 className="text-xl font-semibold mb-2">Orders</h2>
            <p className="text-3xl font-bold">{stats.totalOrders}</p>
            <p className="text-sm mt-2">Total supply orders</p>
          </div>
        </Link>

        {/* Stock Transactions Card */}
        <Link 
          to="/stock-transactions"
          className="bg-yellow-100 p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
        >
          <div className="text-yellow-600">
            <h2 className="text-xl font-semibold mb-2">Transactions</h2>
            <p className="text-3xl font-bold">{stats.totalTransactions}</p>
            <p className="text-sm mt-2">Total stock transactions</p>
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="space-y-4">
            <Link 
              to="/suppliers/add"
              className="block w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-center"
            >
              Add New Supplier
            </Link>
            <Link 
              to="/orders/add"
              className="block w-full bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 text-center"
            >
              Create New Order
            </Link>
            <Link 
              to="/items/add"
              className="block w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 text-center"
            >
              Add New Item
            </Link>
            <Link 
              to="/supply/orders"
              className="block w-full bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 text-center"
            >
              View Supply Orders
            </Link>
          </div>
        </div>

        {/* System Overview */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">System Overview</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Active Suppliers</span>
              <span className="font-bold text-blue-600">{stats.totalSuppliers}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Items</span>
              <span className="font-bold text-green-600">{stats.totalItems}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Pending Orders</span>
              <span className="font-bold text-purple-600">{stats.pendingOrders}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Recent Transactions</span>
              <span className="font-bold text-yellow-600">{stats.totalTransactions}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplyDashboard;