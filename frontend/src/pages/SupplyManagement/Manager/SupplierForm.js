import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';

const SupplierForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        address: ''
    });
    const [generatedCredentials, setGeneratedCredentials] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await axios.post('http://localhost:8000/api/suppliers', formData);
            if (response.data.success) {
                setGeneratedCredentials({
                    username: response.data.supplier.username,
                    password: response.data.supplier.plainPassword
                });
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add supplier');
        } finally {
            setLoading(false);
        }
    };

    if (generatedCredentials) {
        return (
            <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
                    <h3 className="text-lg font-semibold text-green-800 mb-4">
                        Supplier Added Successfully!
                    </h3>
                    <div className="space-y-4">
                        <div className="p-3 bg-white rounded border border-green-300">
                            <p className="text-sm mb-1">
                                <span className="font-semibold">Username:</span>
                            </p>
                            <code className="block p-2 bg-gray-50 rounded">
                                {generatedCredentials.username}
                            </code>
                        </div>
                        <div className="p-3 bg-white rounded border border-green-300">
                            <p className="text-sm mb-1">
                                <span className="font-semibold">Password:</span>
                            </p>
                            <code className="block p-2 bg-gray-50 rounded">
                                {generatedCredentials.password}
                            </code>
                        </div>
                    </div>
                    <div className="mt-6 space-y-2">
                        <p className="text-sm text-red-600 font-medium">
                            ⚠️ Important: Save these credentials now! You won't be able to see them again.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    const credentials = `
                                        Supplier Credentials
                                        -------------------
                                        Email: ${generatedCredentials.email}
                                        Password: ${generatedCredentials.password}
                                    `.trim();
                                    navigator.clipboard.writeText(credentials);
                                    alert('Credentials copied to clipboard!');
                                }}
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            >
                                Copy to Clipboard
                            </button>
                            <button
                                onClick={() => navigate('/suppliers')}
                                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                            >
                                Go to Suppliers List
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

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
                </div>

                <div
                    className="flex justify-between items-center gap-2"
                >
                    <Link
                        to="/suppliers/suppliers"
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