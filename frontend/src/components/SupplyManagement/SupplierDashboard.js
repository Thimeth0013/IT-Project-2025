import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const SupplierDashboard = () => {
  const navigate = useNavigate();
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalSuppliers: 0,
    activeSuppliers: 0
  });

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/suppliers/');
      setSuppliers(response.data.suppliers);
      calculateStats(response.data.suppliers);
      setLoading(false);
    } catch (err) {
      setError('Error fetching suppliers');
      setLoading(false);
    }
  };

  const calculateStats = (supplierData) => {
    const stats = {
      totalSuppliers: supplierData.length,
      activeSuppliers: supplierData.filter(s => s.status === 'Active').length,
      totalAmount: supplierData.reduce((sum, s) => sum + (s.totalAmmount || 0), 0)
    };
    setStats(stats);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-red-100 text-red-800';
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this supplier?')) {
      try {
        await axios.delete(`http://localhost:8000/api/suppliers/${id}`);
        alert('Supplier deleted successfully');
        fetchSuppliers();
      } catch (error) {
        console.error('Error deleting supplier:', error);
        alert('Error deleting supplier: ' + error.message);
      }
    }
  };

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

 // ...existing code...

return (
  <div className="container mx-auto p-4">
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center gap-4">
        <Link
          to="/suppliers"
          className="flex items-center text-black bg-white p-1 rounded-md hover:bg-gray-100"
        >
          <svg  xmlns="http://www.w3.org/2000/svg"  width={24}  height={24}  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth={2}  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-chevron-left"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M15 6l-6 6l6 6" /></svg>
        </Link>
        <h1 className="text-2xl font-bold text-white">Supplier Dashboard</h1>
        <span className="bg-gray-500 text-white px-2 py-1 rounded-full text-xs font-medium">Total Suppliers: {stats.totalSuppliers}</span>
      </div>
      <Link
        to="/suppliers/new"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Add New Supplier
      </Link>
    </div>



      {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Total Suppliers</h3>
          <p className="text-3xl font-bold">{stats.totalSuppliers}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Active Suppliers</h3>
          <p className="text-3xl font-bold">{stats.activeSuppliers}</p>
        </div>
      </div> */}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Address</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Phone</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {suppliers.map((supplier) => (
              <tr key={supplier._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900">{supplier.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900">{supplier.address}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900">{supplier.phone}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900">{supplier.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Link to={`/suppliers/edit/${supplier._id}`} className="text-indigo-600 hover:text-indigo-900 mr-4">
                    Edit
                  </Link>
                  <button 
                    onClick={() => handleDelete(supplier._id)}
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

export default SupplierDashboard;