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