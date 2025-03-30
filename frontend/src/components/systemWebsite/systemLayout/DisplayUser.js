import React, { useState, useEffect } from "react";
import axios from "axios";

const DisplayUsers = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null); // Track the user being edited
  const [editFormData, setEditFormData] = useState({
    name: "",
    email: "",
    role: "",
    password: "", // Add password field for editing (optional)
  });

  // Fetch all users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/auth/getAllUsers", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setUsers(response.data);
        setLoading(false);
      } catch (err) {
        setError("Error fetching users");
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Handle delete user
  const handleDelete = async (userId) => {
    try {
      await axios.delete(`http://localhost:8000/api/auth/deleteAccount/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      // Remove the deleted user from the state
      setUsers(users.filter((user) => user._id !== userId));
    } catch (err) {
      setError("Error deleting user");
    }
  };

  // Handle edit user
  const handleEdit = (user) => {
    setEditingUser(user._id);
    setEditFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      password: "", // Reset password field (optional)
    });
  };

  // Handle edit form input change
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value,
    });
  };

  // Handle edit form submission
  const handleEditSubmit = async (userId) => {
    try {
      const response = await axios.put(
        `http://localhost:8000/api/auth/updateProfile/${userId}`,
        editFormData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Update the user in the state
      setUsers(
        users.map((user) =>
          user._id === userId ? { ...user, ...response.data } : user
        )
      );

      // Reset editing state
      setEditingUser(null);
    } catch (err) {
      setError("Error updating user");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-semibold text-center mb-6">All Users</h2>

      {/* Table to display users */}
      <table className="min-w-full table-auto">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Email</th>
            <th className="px-4 py-2 text-left">Role</th>
            <th className="px-4 py-2 text-left">Password</th> {/* Add password column */}
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user._id} className="border-b">
                {/* Display user details or edit form */}
                {editingUser === user._id ? (
                  <>
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        name="name"
                        value={editFormData.name}
                        onChange={handleEditChange}
                        className="border p-1 rounded"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="email"
                        name="email"
                        value={editFormData.email}
                        onChange={handleEditChange}
                        className="border p-1 rounded"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <select
                        name="role"
                        value={editFormData.role}
                        onChange={handleEditChange}
                        className="border p-1 rounded"
                      >
                        <option value="Customer">Customer</option>
                        <option value="Admin">Admin</option>
                        <option value="Supplier">Supplier</option>
                        <option value="Supplier Manager">Supplier Manager</option>
                        <option value="Customer Manager">Customer Manager</option>
                        <option value="Employee Manager">Employee Manager</option>
                        <option value="Inventory Manager">Inventory Manager</option>
                        <option value="Finance Manager">Finance Manager</option>
                      </select>
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="password"
                        name="password"
                        value={editFormData.password}
                        onChange={handleEditChange}
                        className="border p-1 rounded"
                        placeholder="New password"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => handleEditSubmit(user._id)}
                        className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingUser(null)}
                        className="bg-gray-500 text-white px-2 py-1 rounded"
                      >
                        Cancel
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-4 py-2">{user.name}</td>
                    <td className="px-4 py-2">{user.email}</td>
                    <td className="px-4 py-2">{user.role}</td>
                    <td className="px-4 py-2">********</td> {/* Masked password */}
                    <td className="px-4 py-2">
                      <button
                        onClick={() => handleEdit(user)}
                        className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="bg-red-500 text-white px-2 py-1 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="px-4 py-2 text-center">
                No users found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DisplayUsers;