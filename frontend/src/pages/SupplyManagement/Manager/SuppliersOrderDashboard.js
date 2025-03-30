import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

// import SupplierManagerNavbar from '../../../components/SupplyManagement/Navbar';

function SuppliersOrderDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalAmount: 0,
    pendingOrders: 0
  });

  const fetchOrders = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/orders');
      console.log('API Response:', response.data);
      setOrders(response.data.orders || []);
      calculateStats(response.data.orders || []);
      setLoading(false);
    } catch (err) {
      console.error('Error details:', err.response || err);
      setError('Error fetching orders: ' + (err.response?.data?.message || err.message));
      setLoading(false);
    }
  }, []);

  const calculateStats = (orderData) => {
    const stats = {
      totalOrders: orderData.length,
      totalAmount: orderData.reduce((sum, order) => sum + (order.quantity * order.unitPrice), 0),
      pendingOrders: orderData.filter(order => order.status === 'Pending').length
    };
    setStats(stats);
  };

  const handleReject = async (id) => {
    if (window.confirm('Are you sure you want to reject this order?')) {
      try {
        await axios.put(`http://localhost:8000/api/orders/${id}`, { status: 'Rejected' });
        alert('Order rejected successfully');
        fetchOrders();
      } catch (error) {
        console.error('Error rejecting order:', error);
        alert('Error rejecting order: ' + error.message);
      }
    }
  };

  const handleApprove = async (id) => {
    if (window.confirm('Are you sure you want to approve this order?')) {
      try {
        await axios.put(`http://localhost:8000/api/orders/${id}`, { status: 'Approved' });
        alert('Order approved successfully');
        fetchOrders();
      } catch (error) {
        console.error('Error approving order:', error);
        alert('Error approving order: ' + error.message);
      }
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

  return (
    <>
      {/* <SupplierManagerNavbar /> */}

      <div className="h-screen text-white bg-gray-800 container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <Link
              to="/suppliers"
              className="flex items-center text-black bg-white p-1 rounded-md hover:bg-gray-100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-chevron-left"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M15 6l-6 6l6 6" /></svg>
            </Link>
            <h1 className="text-2xl font-bold text-white">Orders Management</h1>
            <span className="bg-gray-500 text-white px-2 py-1 rounded-full text-xs font-medium">Total Orders: {stats.totalOrders}</span>
          </div>
          <Link
            to="/suppliers/orders/new"
            className="flex flex-row items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-package-export"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 21l-8 -4.5v-9l8 -4.5l8 4.5v4.5" /><path d="M12 12l8 -4.5" /><path d="M12 12v9" /><path d="M12 12l-8 -4.5" /><path d="M15 18h7" /><path d="M19 15l3 3l-3 3" /></svg>
            New Order
          </Link>
        </div>

        <div className="h-[90%] bg-white rounded-lg shadow overflow-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="min-w-[250px] px-6 py-3 text-center text-sm font-semibold text-gray-500 bg-gray-200 uppercase tracking-wider">Supplier</th>
                <th className="min-w-[250px] px-6 py-3 text-center text-sm font-semibold text-gray-500 bg-gray-200 uppercase tracking-wider">Item</th>
                <th className="min-w-[350px] px-6 py-3 text-center text-sm font-semibold text-gray-500 bg-gray-200 uppercase tracking-wider">Order Details</th>
                <th className="min-w-[100px] px-6 py-3 text-center text-sm font-semibold text-gray-500 bg-gray-200 uppercase tracking-wider">Quantity</th>
                <th className="min-w-[200px] px-6 py-3 text-center text-sm font-semibold text-gray-500 bg-gray-200 uppercase tracking-wider">Unit Price<br />(Rs)</th>
                <th className="min-w-[200px] px-6 py-3 text-center text-sm font-semibold text-gray-500 bg-gray-200 uppercase tracking-wider">Total Price<br />(Rs)</th>
                <th className="min-w-[150px] px-6 py-3 text-center text-sm font-semibold text-gray-500 bg-gray-200 uppercase tracking-wider">Status</th>
                <th className="min-w-[150px] px-6 py-3 text-center text-sm font-semibold text-gray-500 bg-gray-200 uppercase tracking-wider">Actions</th>
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
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 text-center">{order.quantity}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 text-center">{(order.unitPrice)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 text-center">
                      {(order.quantity * order.unitPrice).toFixed(2)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className='w-full flex items-center justify-center'>
                      {order.status === 'Processing' ? (
                        <span className="flex flex-row items-center gap-1 text-xs font-semibold px-3 py-1.5 border border-blue-800 bg-blue-200 text-blue-800 rounded-full">
                          <svg xmlns="http://www.w3.org/2000/svg" width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-loader"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 6l0 -3" /><path d="M16.25 7.75l2.15 -2.15" /><path d="M18 12l3 0" /><path d="M16.25 16.25l2.15 2.15" /><path d="M12 18l0 3" /><path d="M7.75 16.25l-2.15 2.15" /><path d="M6 12l-3 0" /><path d="M7.75 7.75l-2.15 -2.15" /></svg>
                          Processing
                        </span>
                      ) : order.status === 'Accepted' ? (
                        <span className="flex flex-row items-center gap-1 text-xs font-semibold px-3 py-1.5 border border-green-800 bg-green-100 text-green-800 rounded-full">
                          <svg xmlns="http://www.w3.org/2000/svg" width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-check"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M5 12l5 5l10 -10" /></svg>
                          Accepted
                        </span>
                      ) : order.status === 'Approved' ? (
                        <span className="flex flex-row items-center gap-1 text-xs font-semibold px-3 py-1.5 border border-green-800 bg-green-800 text-white rounded-full">
                          <svg xmlns="http://www.w3.org/2000/svg" width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-clipboard-check"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2" /><path d="M9 3m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z" /><path d="M9 14l2 2l4 -4" /></svg>
                          Approved
                        </span>
                      ) : order.status === 'Delivering' ? (
                        <span className="flex flex-row items-center gap-1 text-xs font-semibold px-3 py-1.5 border border-yellow-800 bg-yellow-200 text-yellow-800 rounded-full">
                          <svg xmlns="http://www.w3.org/2000/svg" width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-truck-delivery"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M7 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M17 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M5 17h-2v-4m-1 -8h11v12m-4 0h6m4 0h2v-6h-8m0 -5h5l3 5" /><path d="M3 9l4 0" /></svg>
                          Delivering
                        </span>
                      ) : order.status === 'Completed' ? (
                        <span className="flex flex-row items-center gap-1 text-xs font-semibold px-3 py-1.5 border border-green-900 bg-green-300 text-green-900 rounded-full">
                          <svg xmlns="http://www.w3.org/2000/svg" width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-checks"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M7 12l5 5l10 -10" /><path d="M2 12l5 5m5 -5l5 -5" /></svg>
                          Completed
                        </span>
                      ) : order.status === 'Declined' ? (
                        <span className="flex flex-row items-center gap-1 text-xs font-semibold px-3 py-1.5 border border-red-800 bg-red-200 text-red-800 rounded-full">
                          <svg xmlns="http://www.w3.org/2000/svg" width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-x"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M18 6l-12 12" /><path d="M6 6l12 12" /></svg>
                          Declined
                        </span>
                      ) : order.status === 'Rejected' ? (
                        <span className="flex flex-row items-center gap-1 text-xs font-semibold px-3 py-1.5 border border-red-800 bg-red-800 text-white rounded-full">
                          <svg xmlns="http://www.w3.org/2000/svg" width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-ban"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" /><path d="M5.7 5.7l12.6 12.6" /></svg>
                          Rejected
                        </span>
                      ) : order.status === 'Delivered' ? (
                        <span className="flex flex-row items-center gap-1 text-xs font-semibold px-3 py-1.5 border border-gray-800 bg-gray-200 text-gray-800 rounded-full">
                          <svg xmlns="http://www.w3.org/2000/svg" width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-package"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 3l8 4.5l0 9l-8 4.5l-8 -4.5l0 -9l8 -4.5" /><path d="M12 12l8 -4.5" /><path d="M12 12l0 9" /><path d="M12 12l-8 -4.5" /><path d="M16 5.25l-8 4.5" /></svg>
                          Delivered
                        </span>
                      ) : (
                        <span className="flex flex-row items-center gap-1 text-xs font-semibold px-3 py-1.5 border border-gray-800 bg-gray-200 text-gray-800 rounded-full">
                          <svg xmlns="http://www.w3.org/2000/svg" width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-alert-circle"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><circle cx={12} cy={12} r={9} /><line x1={12} y1={8} x2={12} y2={12} /><line x1={12} y1={16} x2={12.01} y2={16} /></svg>
                          Undefined
                        </span>
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {order.status === 'Delivered' ? (
                      <span className="flex flex-row items-center justify-center gap-1">
                        <button
                          onClick={() => handleReject(order._id)}
                          className="flex flex-row items-center gap-1 text-red-600 mr-4 px-2 py-1 rounded-md border border-red-600 hover:bg-red-600 hover:text-white"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-x"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M18 6l-12 12" /><path d="M6 6l12 12" /></svg>
                          Reject
                        </button>
                        <button
                          onClick={() => handleApprove(order._id)}
                          className="flex flex-row items-center gap-1 text-green-600 px-2 py-1 rounded-md border border-green-600 hover:bg-green-600 hover:text-white"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-check"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M5 12l5 5l10 -10" /></svg>
                          Approve
                        </button>
                      </span>
                    ) : order.status === 'Processing' ? (
                      <span className="flex flex-row items-center justify-center gap-1">
                        <span className="text-sm text-gray-500 font-medium">No actions available</span>
                      </span>
                    ) : order.status === 'Accepted' ? (
                      <span className="flex flex-row items-center justify-center gap-1">
                        <span className="text-sm text-gray-500 font-medium">No actions available</span>
                      </span>
                    ) : order.status === 'Declined' ? (
                      <span className="flex flex-row items-center justify-center gap-1">
                        <span className="text-sm text-gray-500 font-medium">No actions available</span>
                      </span>
                    ) : order.status === 'Delivering' ? (
                      <span className="flex flex-row items-center justify-center gap-1">
                        <span className="text-sm text-gray-500 font-medium">No actions available</span>
                      </span>
                    ) : (
                      <span className="flex flex-row items-center justify-center gap-1">
                        <span className="text-sm text-gray-500 font-medium">No actions available</span>
                      </span>
                    )}
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

export default SuppliersOrderDashboard;