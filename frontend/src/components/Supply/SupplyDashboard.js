import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const SupplyDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Supply Dashboard</h1>
        <Link
          to="/suppliers"
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Back to Dashboard
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          to="/supply/supply/orders"
          className="bg-blue-500 hover:bg-blue-600 text-white p-8 rounded-xl shadow-lg"
        >
          <h2 className="text-2xl font-bold mb-2">View Orders</h2>
          <p>Check all supply orders</p>
        </Link>
        
        <Link
          to="/supply/supply"
          className="bg-green-500 hover:bg-green-600 text-white p-8 rounded-xl shadow-lg"
        >
          <h2 className="text-2xl font-bold mb-2">Supplier Orders</h2>
          <p>View supplier specific orders</p>
        </Link>
      </div>
    </div>
  );
};

export default SupplyDashboard;