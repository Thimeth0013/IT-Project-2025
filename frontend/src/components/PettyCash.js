import React, { useState } from 'react';
import axios from 'axios';

function PettyForm({ onSubmitSuccess }) {
    // State to manage form input values
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0], // Set today as default date
        description: '',
        amount: '',
        category: '',
        paymentMethod: '',
        remarks: ''
    });

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Send data to backend API
            await axios.post('http://localhost:8000/api/pettycash', formData);

            // Immediately refresh the parent component before showing alert
            if (onSubmitSuccess) {
                await onSubmitSuccess();
            }

            // Reset form after successful submission
            setFormData({
                date: new Date().toISOString().split('T')[0],
                description: '',
                amount: '',
                category: '',
                paymentMethod: '',
                remarks: ''
            });

            alert('Entry added successfully!');
        } catch (error) {
            console.error('Error adding entry:', error);
            alert('Error adding entry');
        }
    };

    // Handle input changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
            <div>
                <label className="block text-sm font-medium text-gray-700">Date</label>
                <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    required
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <input
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    required
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Amount</label>
                <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    required
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    required
                >
                    <option value="">Select Category</option>
                    <option value="Meals&Entertainment">Meals&Entertainment</option>
                    <option value="Transport">Transport</option>
                    <option value="Utilities">Utilities</option>
                    <option value="Office">Office</option>
                    <option value="Postage">Postage</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Miscellaneous">Miscellaneous</option>
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Payment Method</label>
                <select
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    required
                >
                    <option value="">Select Payment Method</option>
                    <option value="Cash">Cash</option>
                    <option value="Card">Card</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Remarks</label>
                <textarea
                    name="remarks"
                    value={formData.remarks}
                    onChange={handleChange}
                    rows="3"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
            </div>
            <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
                Add Entry
            </button>
        </form>
    );
}

export default PettyForm;
