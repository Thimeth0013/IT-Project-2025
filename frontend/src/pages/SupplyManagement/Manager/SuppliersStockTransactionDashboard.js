import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

import SupplierManagerNavbar from '../../../components/SupplyManagement/Navbar';

function SuppliersStockTransactionDashboard() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalTransactions: 0,
    totalItems: 0,
    totalQuantity: 0
  });

  const fetchTransactions = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

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
    <>
      <SupplierManagerNavbar />

      <div className="text-white bg-gray-800 container mx-auto p-4"
        style={{ height: 'calc(100vh - 72px)' }}
      >
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <Link
              to="/suppliers"
              className="flex items-center text-black bg-white p-1 rounded-md hover:bg-gray-100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-chevron-left"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M15 6l-6 6l6 6" /></svg>
            </Link>
            <h1 className="text-2xl font-bold text-white">Stock Transactions Management</h1>
            <span className="bg-gray-500 text-white px-2 py-1 rounded-full text-xs font-medium">Total Transactions: {stats.totalTransactions}</span>
          </div>
          <Link
            to="/suppliers/stock-transactions/new"
            className="flex flex-row items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-cash-banknote-plus"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" /><path d="M12.25 18h-7.25a2 2 0 0 1 -2 -2v-8a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v4.5" /><path d="M18 12h.01" /><path d="M6 12h.01" /><path d="M16 19h6" /><path d="M19 16v6" /></svg>
            New Transaction
          </Link>
        </div>

        <div className="h-[90%] bg-white rounded-lg shadow overflow-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-500 bg-gray-200 uppercase tracking-wider">Item ID</th>
                <th className="min-w-[150px] px-6 py-3 text-center text-sm font-semibold text-gray-500 bg-gray-200 uppercase tracking-wider">Date</th>
                <th className="min-w-[150px] px-6 py-3 text-center text-sm font-semibold text-gray-500 bg-gray-200 uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-500 bg-gray-200 uppercase tracking-wider">Remarks</th>
                <th className="min-w-[150px] px-6 py-3 text-center text-sm font-semibold text-gray-500 bg-gray-200 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.map((transaction) => (
                <tr key={transaction._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900 text-center">{transaction.itemID}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 text-center">{formatDate(transaction.date)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-medium text-center ${transaction.quantity > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                      {transaction.quantity > 0 ? '+' : ''}{transaction.quantity}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{transaction.remarks}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <span className="flex flex-row items-center gap-1">
                      <Link to={`/stock_transactions/edit/${transaction._id}`} className="flex flex-row items-center gap-1 text-indigo-600 hover:text-indigo-900 mr-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-edit"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" /><path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" /><path d="M16 5l3 3" /></svg>
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(transaction._id)}
                        className="flex flex-row items-center gap-1 text-red-600 hover:text-red-900"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-trash"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M4 7l16 0" /><path d="M10 11l0 6" /><path d="M14 11l0 6" /><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" /><path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" /></svg>
                        Delete
                      </button>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default SuppliersStockTransactionDashboard;