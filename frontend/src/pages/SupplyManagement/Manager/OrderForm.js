import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const PREDEFINED_ITEMS = {
  'Cleaning': [
    { id: 'det1', name: 'Detergents', price: 200 },
    { id: 'gc1', name: 'Glass Cleaner', price: 150 },
    { id: 'tc1', name: 'Tire Cleaner', price: 180 },
    { id: 'ic1', name: 'Interior Cleaner', price: 220 },
    { id: 'mc1', name: 'Microfiber Cloths', price: 100 },
    { id: 'sp1', name: 'Sponges', price: 80 }
  ],
  'Polishing': [
    { id: 'cw1', name: 'Car Wax', price: 300 },
    { id: 'ts1', name: 'Tire Shine', price: 250 },
    { id: 'lc1', name: 'Leather Conditioner', price: 350 },
    { id: 'fp1', name: 'Fabric Protector', price: 280 }
  ],
  'Oils': [
    { id: 'eo1', name: 'Engine Oil', price: 1500 },
    { id: 'bo1', name: 'Brake Oil', price: 1200 },
    { id: 'to1', name: 'Transmission Oil', price: 1800 }
  ],
  'Fluids': [
    { id: 'co1', name: 'Coolant', price: 600 },
    { id: 'wf1', name: 'Windshield Fluid', price: 400 }
  ],
  'Filters': [
    { id: 'af1', name: 'Air Filter', price: 900 },
    { id: 'of1', name: 'Oil Filter', price: 750 },
    { id: 'ff1', name: 'Fuel Filter', price: 1100 }
  ],
  'Tire': [
    { id: 'tg1', name: 'Tire Gauge', price: 550 },
    { id: 'ti1', name: 'Tire Inflator', price: 2500 },
    { id: 'ts1', name: 'Tire Sealant', price: 1300 }
  ],
  'Electrical': [
    { id: 'bat1', name: 'Batteries', price: 6500 }
  ],
  'Other': [
    { id: 'gr1', name: 'Grease', price: 300 },
    { id: 'sg1', name: 'Safety Gloves', price: 200 },
    { id: 'sgl1', name: 'Safety Glasses', price: 350 }
  ]
};

const OrderForm = () => {
  const navigate = useNavigate();
  const [suppliers, setSuppliers] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [formData, setFormData] = useState({
    supplierID: '',
    itemID: '',
    orderDetails: '',
    quantity: 1,
    unitPrice: 0,
    status: 'Processing'
  });

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/suppliers');
        setSuppliers(response.data.suppliers);
      } catch (error) {
        console.error('Error fetching suppliers:', error);
        alert('Failed to fetch suppliers');
      }
    };

    fetchSuppliers();
  }, []);

  // Update filtered items when supplierID changes
  useEffect(() => {
    if (formData.supplierID) {
      const selectedSupplier = suppliers.find(s => s._id === formData.supplierID);

      if (selectedSupplier) {
        const supplierCategory = selectedSupplier.category.trim();
        const items = PREDEFINED_ITEMS[supplierCategory] || [];

        console.log('Supplier Category:', supplierCategory);
        console.log('Available Items:', items);

        setFilteredItems(items);
      }
    } else {
      setFilteredItems([]);
    }

    setFormData(prev => ({ ...prev, itemID: '' }));
  }, [formData.supplierID, suppliers]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'itemID') {
      // Find the selected item
      const selectedItem = filteredItems.find(item => item.id === value);
      setFormData(prev => ({
        ...prev,
        [name]: value,
        unitPrice: selectedItem ? selectedItem.price : 0
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Get full supplier and item objects based on selected IDs
    const selectedSupplier = suppliers.find(s => s._id === formData.supplierID);
    const selectedItem = filteredItems.find(item => item.id === formData.itemID);

    // Create new order object including supplier name and item name
    const orderToSubmit = {
      ...formData,
      supplier: selectedSupplier?.name || '',
      itemName: selectedItem?.name || ''
    };

    try {
      await axios.post('http://localhost:8000/api/orders', orderToSubmit);
      alert('Order added successfully!');
      navigate('/suppliers/orders');
    } catch (error) {
      console.error('Error adding order:', error);
      alert('Failed to add order: ' + (error.response?.data?.message || error.message));
    }
  };


  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Create New Order</h2>
        <button
          onClick={() => navigate('/suppliers/orders')}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Back to Orders
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Supplier</label>
          <select
            name="supplierID"
            value={formData.supplierID}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
            required
          >
            <option value="" disabled>Select a supplier</option>
            {suppliers.map(supplier => (
              <option key={supplier._id} value={supplier._id}>
                {supplier.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Item</label>
          <select
            name="itemID"
            value={formData.itemID}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
            required
            disabled={!formData.supplierID}
          >
            <option value="" disabled>Select an item</option>
            {filteredItems.map(item => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Order Details</label>
          <textarea
            name="orderDetails"
            value={formData.orderDetails}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
            rows="3"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Quantity</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
            min={1}
            required
          />
        </div>

        <div className='py-4'>
          <hr />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <span>
            <h1 className='font-medium'>Unit Price</h1>
            <p className='font-semibold text-2xl'>
              Rs. {formData.unitPrice || 1}
            </p>
          </span>
          <span className='text-right'>
            <h1 className='font-medium'>Total Price</h1>
            <p className='font-semibold text-2xl'>
              Rs. {(formData.unitPrice * (parseInt(formData.quantity) || 1)).toFixed(2)}
            </p>
          </span>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            className="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Create Order
          </button>
          <button
            type="button"
            onClick={() => navigate('/suppliers/orders')}
            className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default OrderForm;
