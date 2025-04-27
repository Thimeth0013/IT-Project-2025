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
    const [validationErrors, setValidationErrors] = useState({});

    // Password strength checker
    const getPasswordStrength = (password) => {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;
        return strength;
    };

    // Form validation
    const validateForm = () => {
        const errors = {};

        // Name validation
        if (!formData.name.trim()) {
            errors.name = "Name is required.";
        } else if (!/^[a-zA-Z\s]+$/.test(formData.name)) {
            errors.name = "Name can only contain letters and spaces.";
        } else if (formData.name.length < 3) {
            errors.name = "Name must be at least 3 characters long.";
        }

        // Phone validation
        if (!formData.phone) {
            errors.phone = "Phone number is required.";
        } else if (!/^\d{10}$/.test(formData.phone)) {
            errors.phone = "Phone number must be exactly 10 digits.";
        }

        // Email validation
        if (!formData.email) {
            errors.email = "Email is required.";
        } else if (/\s/.test(formData.email)) {
            errors.email = "Email cannot contain spaces.";
        } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)) {
            errors.email = "Please enter a valid email address.";
        }

        // Password validation
        if (!formData.password) {
            errors.password = "Password is required.";
        } else if (formData.password.length < 8) {
            errors.password = "Password must be at least 8 characters long.";
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(formData.password)) {
            errors.password = "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.";
        }

        // Address validation
        if (!formData.address.trim()) {
            errors.address = "Address is required.";
        } else if (formData.address.length < 10) {
            errors.address = "Address must be at least 10 characters long.";
        }

        // Category validation
        if (!formData.category) {
            errors.category = "Category is required.";
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Input handler with real-time validation
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        switch (name) {
            case 'phone':
                // Only allow numbers and limit to 10 digits
                if (/^\d{0,10}$/.test(value)) {
                    setFormData(prev => ({ ...prev, phone: value }));
                }
                break;

            case 'name':
                // Only allow letters and spaces
                if (/^[a-zA-Z\s]*$/.test(value)) {
                    setFormData(prev => ({ ...prev, name: value }));
                }
                break;

            case 'email':
                // Remove spaces automatically
                setFormData(prev => ({ ...prev, email: value.replace(/\s/g, '') }));
                break;

            default:
                setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    // Data sanitization before submission
    const sanitizeFormData = (data) => {
        return {
            ...data,
            name: data.name.trim(),
            email: data.email.toLowerCase().trim(),
            phone: data.phone.replace(/\D/g, ''),
            address: data.address.trim()
        };
    };

    // Form submission handler
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const sanitizedData = sanitizeFormData(formData);
        setLoading(true);

        try {
            const response = await axios.post('http://localhost:8000/api/suppliers', sanitizedData);
            if (response.data) {
                navigate('/suppliers/all');
            }
        } catch (err) {
            setValidationErrors({
                submit: err.response?.data?.message || 'Error creating supplier'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6">Add New Supplier</h2>

            {validationErrors.submit && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600">
                    {validationErrors.submit}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`w-full p-2 border rounded-md ${validationErrors.name ? 'border-red-500' : 'border-gray-300'
                            }`}
                        placeholder="Enter supplier name"
                    />
                    {validationErrors.name && (
                        <p className="text-red-500 text-sm">{validationErrors.name}</p>
                    )}
                </div>

                {/* Category */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className={`w-full p-2 border rounded-md ${
                            validationErrors.category ? 'border-red-500' : 'border-gray-300'
                        }`}
                    >
                        <option value="" disabled>Select Category</option>
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
                        <p className="mt-1 text-sm text-red-500">{validationErrors.category}</p>
                    )}
                </div>

                {/* Phone */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                        type="tel"
                        name="phone"
                        maxLength={10}
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`w-full p-2 border rounded-md ${validationErrors.phone ? 'border-red-500' : 'border-gray-300'
                            }`}
                        placeholder="Enter phone number"
                    />
                    {validationErrors.phone && (
                        <p className="mt-1 text-sm text-red-500">{validationErrors.phone}</p>
                    )}
                </div>

                {/* Email */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full p-2 border rounded-md ${validationErrors.email ? 'border-red-500' : 'border-gray-300'
                            }`}
                        placeholder="Enter email address"
                    />
                    {validationErrors.email && (
                        <p className="text-red-500 text-sm">{validationErrors.email}</p>
                    )}
                </div>

                {/* Address */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className={`w-full p-2 border rounded-md ${validationErrors.address ? 'border-red-500' : 'border-gray-300'
                            }`}
                        rows="3"
                        placeholder="Enter address"
                    />
                    {validationErrors.address && (
                        <p className="text-red-500 text-sm">{validationErrors.address}</p>
                    )}
                </div>

                {/* Password */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className={`w-full p-2 border rounded-md ${validationErrors.password ? 'border-red-500' : 'border-gray-300'
                            }`}
                        placeholder="Enter password"
                    />
                    {validationErrors.password && (
                        <p className="mt-1 text-sm text-red-500">{validationErrors.password}</p>
                    )}
                    {formData.password && (
                        <div className="mt-1">
                            <div className="h-2 bg-gray-200 rounded">
                                <div
                                    className={`h-full rounded ${getPasswordStrength(formData.password) === 5
                                        ? 'bg-green-500'
                                        : getPasswordStrength(formData.password) >= 3
                                            ? 'bg-yellow-500'
                                            : 'bg-red-500'
                                        }`}
                                    style={{
                                        width: `${(getPasswordStrength(formData.password) / 5) * 100}%`
                                    }}
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Buttons */}
                <div className="flex justify-between items-center gap-2">
                    <Link
                        to="/suppliers/all"
                        className="w-full py-2 px-4 bg-gray-200 text-black rounded-md hover:bg-gray-300 text-center"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full p-2 text-white rounded-md ${
                            loading
                                ? 'bg-blue-300 cursor-not-allowed'
                                : 'bg-blue-500 hover:bg-blue-600'
                        }`}
                    >
                        {loading ? 'Creating...' : 'Create Supplier'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SupplierForm;
