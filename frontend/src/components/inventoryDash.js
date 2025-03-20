import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import "./styles/styles.css";
import axios from "axios";
import Sidebar from "./sidebar"; // ✅ Import Sidebar

const socket = io("http://localhost:8000"); // Adjust based on your backend URL

const InventoryDashboard = () => {
  const [inventory, setInventory] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [reorderAlerts, setReorderAlerts] = useState({}); // ✅ Fixed state initialization

  useEffect(() => {
    fetch("http://localhost:8000/api/inventory/all")
      .then((res) => res.json())
      .then((data) => setInventory(data))
      .catch((err) => console.error("Error fetching inventory:", err));

    socket.on("inventoryUpdated", (data) => {
      setInventory((prevInventory) =>
        prevInventory.map((item) => (item._id === data._id ? data : item))
      );
    });

    // ✅ Listen for reorder alerts
    socket.on("reorderAlert", (alert) => {
      setReorderAlerts((prevAlerts) => ({
        ...prevAlerts,
        [alert.itemId]: alert.message,
      }));
    });

    return () => {
      socket.off("inventoryUpdated");
      socket.off("reorderAlert");
    };
  }, []);

  // ✅ Handle item deletion with confirmation alert
  const deleteItem = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this item?");
    if (!confirmDelete) return; // Stop if the user cancels

    try {
      await axios.delete(`http://localhost:8000/api/inventory/${id}`);
      setInventory((prevInventory) => prevInventory.filter(item => item._id !== id)); // Update UI
      alert("Item deleted successfully!"); // ✅ Show success message
    } catch (error) {
      console.error("Error deleting item:", error);
      alert("Failed to delete item."); // ✅ Show error message
    }
  };
  
  // ✅ Handle category filter
  const handleFilterClick = (category) => {
    setActiveFilter(category);
  };

  // ✅ Filtered inventory based on selected category
  const filteredInventory =
    activeFilter === "All"
      ? inventory
      : inventory.filter((item) => item.category === activeFilter);

  // ✅ More categories added
  const categories = ["All", "Vehicle Parts", "Oil", "Batteries", "Tires", "Accessories", "Lubricants", "Cleaning & Maintenance",  "Electrical Components", 
    "Tools & Equipment", "Safety Equipment"];

  return (
    <div className="container">
      <Sidebar /> {/* ✅ Use Sidebar Component */}
      
      <main className="main-content">
      <div className="filters">
          {categories.map((category) => (
            <button
              key={category}
              className={category === activeFilter ? "active" : ""}
              onClick={() => handleFilterClick(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Brand</th>
                <th>Category</th>
                <th>Quantity</th>
                <th>Price Per Unit</th>
                <th>Manufacture Date</th>
                <th>Expiry Date</th>
                <th>Reorder Level</th>
                <th>Actions</th> 
              </tr>
            </thead>
            <tbody>
              {filteredInventory.map((item) => (
                <tr key={item._id}>
                  <td>{item.name}</td>
                  <td>{item.brand}</td>
                  <td>{item.category}</td>
                  <td className={item.quantity <= 5 ? "low-stock" : ""}>
                  {item.quantity} {item.quantity <= 5 && <span className="low">Low</span>}
                  </td>
                  <td>${item.pricePerUnit}</td>
                  <td>{new Date(item.manufactureDate).toLocaleDateString()}</td>
                  <td className={new Date(item.expiryDate) < new Date() ? "expired" : ""}>
                    {new Date(item.expiryDate).toLocaleDateString()}{" "}
                    {new Date(item.expiryDate) < new Date() && <span className="expired-label">Expired</span>}
                  </td>
                  <td>
                    {item.quantity <= 5 ? (
                     <span className="reorder-alert">⚠️ Reach to re-order level</span>
                     ) : (
                     item.reorderLevel
                      )}
                     {reorderAlerts[item._id] && <span className="alert-message">{reorderAlerts[item._id]}</span>}
                 </td>
                  <td>
                    <button className="delete-btn" onClick={() => deleteItem(item._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default InventoryDashboard;

