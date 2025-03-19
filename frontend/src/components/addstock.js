import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./sidebar"; // Import Sidebar
import "../styles/styles.css"; // Ensure styles are applied

const AddStock = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    category: "",
    quantity: "",
    pricePerUnit: "",
    manufactureDate: "",
    expiryDate: "",
    reorderLevel: "",
  });

  const categories = [
    "All", "Vehicle Parts", "Oil", "Batteries", "Tires", "Accessories", 
    "Lubricants", "Cleaning & Maintenance", "Electrical Components", 
    "Tools & Equipment", "Safety Equipment"
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://localhost:5001/api/inventory/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then(() => {
        alert("Stock added successfully!");
        navigate("/");
      })
      .catch((err) => console.error("Error adding stock:", err));
  };

  return (
    <div className="container">
      <Sidebar /> {/* Sidebar remains visible */}
      <main className="main-content">
       
        <form className="stock-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Item Name:</label>
            <input type="text" name="name" required onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Brand:</label>
            <input type="text" name="brand" required onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Category:</label>
            <select name="category" required onChange={handleChange}>
              <option value="">Select Category</option>
              {categories.map((category, index) => (
                <option key={index} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Quantity:</label>
            <input type="number" name="quantity" required onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Price Per Unit:</label>
            <input type="number" name="pricePerUnit" required onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Manufacture Date:</label>
            <input type="date" name="manufactureDate" required onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Expiry Date:</label>
            <input type="date" name="expiryDate" required onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Reorder Level:</label>
            <input type="number" name="reorderLevel" required onChange={handleChange} />
          </div>

          <button type="submit" className="submit-btn">Add Stock</button>
        </form>
      </main>
    </div>
  );
};

export default AddStock;
