import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const SupplierForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        address: '',
        category: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [validationErrors, setValidationErrors] = useState({});

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const validateForm = () => {
        const errors = {};
        // Name Validation: Ensure it contains only letters and is not empty
        if (!formData.name.trim()) {
            errors.name = "Name is required.";
        } else if (!/^[a-zA-Z\s]*$/.test(formData.name)) {
            errors.name = "Name should only contain letters.";
        }

        // Phone Validation: Must be 10 digits and contain only numbers
        if (!formData.phone.trim()) {
            errors.phone = "Phone number is required.";
        } else if (!/^\d{10}$/.test(formData.phone)) {
            errors.phone = "Phone number must be exactly 10 digits.";
        }

        // Email Validation: Must be a valid email format
        if (!formData.email.trim()) {
            errors.email = "Email is required.";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = "Email format is invalid.";
        }

        // Password Validation: Must be at least 6 characters and contain letters and numbers
        if (!formData.password.trim()) {
            errors.password = "Password is required.";
        } else if (formData.password.length < 6) {
            errors.password = "Password must be at least 6 characters long.";
        } else if (!/[a-zA-Z]/.test(formData.password) || !/\d/.test(formData.password)) {
            errors.password = "Password must contain both letters and numbers.";
        }

        // Address Validation: Ensure it is not empty
        if (!formData.address.trim()) {
            errors.address = "Address is required.";
        }

        // Category Validation: Ensure it is selected
        if (!formData.category) {
            errors.category = "Category is required.";
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate form
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await axios.post('http://localhost:8000/api/suppliers', formData);
            if (response.data.success) {
                alert('Supplier added successfully');
                navigate('/suppliers/all');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add supplier');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6">Add New Supplier</h2>

            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Form fields */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border rounded-md"
                    />
                    {validationErrors.name && (
                        <p className="text-red-500 text-sm">{validationErrors.name}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category
                    </label>
                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                        required
                    >
                        <option value="" selected disabled>Select Category</option>
                        <option value="Cleaning">Cleaning</option>
                        <option value="Polishing">Polishing</option>
                        <option value="Oils">Oils</option>
                        <option value="Fluids">Fluids</option>
                        <option value="Filters">Filters</option>
                        <option value="Tire">Tire</option>
                        <option value="Electrical">Electrical</option>
                        <option value="Other">Other</option>
                    </select>
                    {validationErrors.category && (
                        <p className="text-red-500 text-sm">{validationErrors.category}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone
                    </label>
                    <input
                        type="tel"
                        name="phone"
                        maxLength={10}
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border rounded-md"
                    />
                    {validationErrors.phone && (
                        <p className="text-red-500 text-sm">{validationErrors.phone}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                    </label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border rounded-md"
                    />
                    {validationErrors.email && (
                        <p className="text-red-500 text-sm">{validationErrors.email}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address
                    </label>
                    <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border rounded-md"
                    />
                    {validationErrors.address && (
                        <p className="text-red-500 text-sm">{validationErrors.address}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Password
                    </label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border rounded-md"
                    />
                    {validationErrors.password && (
                        <p className="text-red-500 text-sm">{validationErrors.password}</p>
                    )}
                </div>

                <div
                    className="flex justify-between items-center gap-2"
                >
                    <Link
                        to="/suppliers/all"
                        className="w-full py-2 px-4 bg-gray-200 text-black rounded-md hover:bg-gray-300 text-center"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-center ${loading ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                    >
                        {loading ? 'Adding Supplier...' : 'Add Supplier'}
                    </button>
                </div>

            </form>
        </div>
    );
};

export default SupplierForm;
