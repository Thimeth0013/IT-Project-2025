import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

// import SupplierManagerNavbar from '../../../components/SupplyManagement/Navbar';
import SupplyOrderEditModal from '../../../components/SupplyManagement/Supply/SupplyOrderEditModal';

function SupplierOrderRequestsDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalRequests: 0
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleEdit = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleSave = async (updatedItem) => {
    try {
      const payload = {
        status: updatedItem.status
      };
      await axios.put(`http://localhost:8000/api/orders/${updatedItem._id}`, payload);
      await fetchOrders();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const fetchOrders = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/orders/');
      setOrders(response.data.orders);
      calculateStats(response.data.orders);
      setLoading(false);
    } catch (err) {
      setError('Error fetching orders');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const calculateStats = (orderData) => {
    const stats = {
      totalOrders: orderData.length,
      activeOrders: orderData.filter(s => s.status === 'Processing').length,
      totalAmount: orderData.reduce((sum, s) => sum + (s.totalAmmount || 0), 0)
    };
    setStats(stats);
  };

  const handleDecline = async (id) => {
    if (window.confirm('Are you sure you want to decline this order?')) {
      try {
        await axios.put(`http://localhost:8000/api/orders/${id}`, { status: 'Declined' });
        alert('Order declined successfully');
        fetchOrders();
      } catch (error) {
        console.error('Error declining order:', error);
        alert('Error declining order: ' + error.message);
      }
    }
  };

  const handleAccept = async (id) => {
    if (window.confirm('Are you sure you want to accept this order?')) {
      try {
        await axios.put(`http://localhost:8000/api/orders/${id}`, { status: 'Accepted' });
        alert('Order accepted successfully');
        fetchOrders();
      } catch (error) {
        console.error('Error accepting order:', error);
        alert('Error accepting order: ' + error.message);
      }
    }
  };

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
            <h1 className="text-2xl font-bold text-white">Order Requests Management</h1>
            <span className="bg-gray-500 text-white px-2 py-1 rounded-full text-xs font-medium">Total Requests: {stats.activeOrders}</span>
          </div>
          <button
            onClick={fetchOrders}
            className="flex flex-row items-center gap-2 bg-white text-green-600 font-semibold px-4 py-2 rounded hover:bg-gray-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-refresh"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4" /><path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4" /></svg>
            Refresh
          </button>
        </div>

        <div className="h-[90%] bg-white rounded-lg shadow overflow-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="min-w-[250px] px-6 py-3 text-center text-sm font-semibold text-gray-500 bg-gray-200 uppercase tracking-wider">Item</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-500 bg-gray-200 uppercase tracking-wider">Order Details</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-500 bg-gray-200 uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-500 bg-gray-200 uppercase tracking-wider">Unit Price (Rs.)</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-500 bg-gray-200 uppercase tracking-wider">Total Price (Rs.)</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-500 bg-gray-200 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-500 bg-gray-200 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{order.itemName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{order.orderDetails}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{order.quantity}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{order.unitPrice}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{(order.unitPrice * order.quantity).toFixed(2)}</div>
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
                    {order.status === 'Processing' ? (
                      <span className="flex flex-row items-center justify-center gap-1">
                        <button
                          onClick={() => handleDecline(order._id)}
                          className="flex flex-row items-center gap-1 text-red-600 mr-4 px-2 py-1 rounded-md border border-red-600 hover:bg-red-600 hover:text-white"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-x"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M18 6l-12 12" /><path d="M6 6l12 12" /></svg>
                          Decline
                        </button>
                        <button
                          onClick={() => handleAccept(order._id)}
                          className="flex flex-row items-center gap-1 text-green-600 px-2 py-1 rounded-md border border-green-600 hover:bg-green-600 hover:text-white"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-check"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M5 12l5 5l10 -10" /></svg>
                          Accept
                        </button>
                      </span>
                    ) : order.status === 'Declined' ? (
                      <span className="flex flex-row items-center justify-center gap-1">
                        <span className="text-sm text-gray-500 font-medium">No actions available</span>
                      </span>
                    ) : order.status === 'Rejected' ? (
                      <span className="flex flex-row items-center justify-center gap-1">
                        <span className="text-sm text-gray-500 font-medium">No actions available</span>
                      </span>
                    ) : order.status === 'Delivered' ? (
                      <span className="flex flex-row items-center justify-center gap-1">
                        <span className="text-sm text-gray-500 font-medium">No actions available</span>
                      </span>
                    ) : order.status === 'Approved' ? (
                      <span className="flex flex-row items-center justify-center gap-1">
                        <span className="text-sm text-gray-500 font-medium">No actions available</span>
                      </span>
                    ) : (
                      <span className="flex flex-row items-center justify-center gap-1">
                        <button
                          onClick={() => handleEdit(order)}
                          className="flex flex-row items-center gap-1 text-blue-600 px-2 py-1 rounded-md border border-blue-600 hover:bg-blue-600 hover:text-white"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-edit"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" /><path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" /><path d="M16 5l3 3" /></svg>
                          Edit Status
                        </button>
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <SupplyOrderEditModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        item={selectedItem}
      />
    </>
  );
};

export default SupplierOrderRequestsDashboard;