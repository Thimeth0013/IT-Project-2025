import React from "react";
import "./styles/styles.css";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2>Inventory Dashboard</h2>
      <ul>
        <li><Link to="/inventory">Inventory</Link></li>
        <li><Link to="/add-stock">Add Stock</Link></li>
        <li><Link to="/analytics">Analytics</Link></li>
        <li><Link to="/suppliers">Suppliers</Link></li>
        <li><Link to="/settings">Settings</Link></li>
      </ul>
    </div>
  );
};

export default Sidebar;
