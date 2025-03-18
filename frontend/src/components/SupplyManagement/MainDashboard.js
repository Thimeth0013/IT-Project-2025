import React from 'react';
import { Link } from 'react-router-dom';

const MainDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="container mx-auto px-4">
        <div className="flex justify-center items-center gap-4 mb-12">
          <h1 className="text-4xl font-bold">
            Supply Management System
          </h1>
          <Link
            to="/suppliers/suppliers"
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-md transition-all transform hover:scale-105"
          >
            Supplier Orders
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center max-w-7xl mx-auto">
          {/* Supplier Button */}
          <Link
            to="/suppliers/suppliers"
            className="bg-blue-500 hover:bg-blue-600 text-white p-8 rounded-xl shadow-lg transition-all transform hover:scale-105"
          >
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">Supplier Management</h2>
              <p className="text-lg">
                View and manage supplier information
              </p>
            </div>
          </Link>

          {/* Order Button */}
          <Link
            to="/suppliers/orders"
            className="bg-purple-500 hover:bg-purple-600 text-white p-8 rounded-xl shadow-lg transition-all transform hover:scale-105"
          >
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">Order Management</h2>
              <p className="text-lg">
                Track and manage orders
              </p>
            </div>
          </Link>

          {/* Item Button */}
          <Link
            to="/suppliers/items"
            className="bg-yellow-500 hover:bg-yellow-600 text-white p-8 rounded-xl shadow-lg transition-all transform hover:scale-105"
          >
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">Item Management</h2>
              <p className="text-lg">
                Manage product inventory
              </p>
            </div>
          </Link>

          {/* Stock Transaction Button */}
          <Link
            to="/suppliers/stock-transactions"
            className="bg-green-500 hover:bg-green-600 text-white p-8 rounded-xl shadow-lg transition-all transform hover:scale-105"
          >
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">Stock Transactions</h2>
              <p className="text-lg">
                Manage inventory transactions
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MainDashboard;