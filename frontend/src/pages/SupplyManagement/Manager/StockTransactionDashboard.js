import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const StockTransactionDashboard = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalTransactions: 0,
    totalItems: 0,
    totalQuantity: 0
  });

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/stock_transactions');
      console.log('API Response:', response.data);
      const transactionData = response.data.stockTransactions || [];
      setTransactions(transactionData);
      calculateStats(transactionData);
      setLoading(false);
    } catch (err) {
      console.error('Error details:', err.response || err);
      setError('Error fetching transactions: ' + (err.response?.data?.message || err.message));
      setLoading(false);
    }
  };

  const calculateStats = (transactionData) => {
    const stats = {
      totalTransactions: transactionData.length,
      totalItems: new Set(transactionData.map(t => t.itemID)).size,
      totalQuantity: transactionData.reduce((sum, t) => sum + (t.quantity || 0), 0)
    };
    setStats(stats);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await axios.delete(`http://localhost:8000/api/stock_transactions/${id}`);
        fetchTransactions();
        alert('Transaction deleted successfully');
      } catch (error) {
        console.error('Error deleting transaction:', error);
        alert('Error deleting transaction: ' + error.message);
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">Stock Transactions</h1>
          <button
            onClick={() => navigate('/')}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Back to Dashboard
          </button>
        </div>
        <Link
          to="/stock_transactions/add"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add New Transaction
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Total Transactions</h3>
          <p className="text-3xl font-bold">{stats.totalTransactions}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Total Items</h3>
          <p className="text-3xl font-bold">{stats.totalItems}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Total Quantity</h3>
          <p className="text-3xl font-bold">{stats.totalQuantity}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Remarks</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {transactions.map((transaction) => (
              <tr key={transaction._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{transaction.itemID}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`text-sm font-medium ${
                    transaction.quantity > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.quantity > 0 ? '+' : ''}{transaction.quantity}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{formatDate(transaction.date)}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{transaction.remarks}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Link to={`/stock_transactions/edit/${transaction._id}`} className="text-indigo-600 hover:text-indigo-900 mr-4">
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(transaction._id)}
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

export default StockTransactionDashboard;