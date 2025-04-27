import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";  // If using react-router for navigation

const AddUserForm = () => {
  const navigate = useNavigate(); // For navigating after successful registration

  // State to hold form data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "Customer",  // Default role
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Make the API call to register the user
      const response = await axios.post("http://localhost:8000/api/auth/register", formData);

      if (response.status === 201) {
        // Successful registration
        alert("User registered successfully!");
        navigate("/Admin");  // Navigate to login page after successful registration
      }
    } catch (error) {
      setLoading(false);
      if (error.response && error.response.data) {
        setError(error.response.data.error || "Error registering user");
      } else {
        setError("Something went wrong");
      }
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 border border-gray-300 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-center mb-6">Add New User</h2>

      {/* Display error message if any */}
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700">
            Role
          </label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Customer Manager">Customer Manager</option>
            <option value="Supplier">Supplier</option>
            <option value="Supplier Manager">Supplier Manager</option>
            <option value="Inventory Manager">Inventory Manager</option>
            <option value="Employee Manager">Employee Manager</option>
            <option value="Finance Manager">Finance Manager</option>
            <option value="Admin">Admin</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {loading ? "Registering..." : "Register User"}
        </button>
      </form>
    </div>
  );
};

export default AddUserForm;
