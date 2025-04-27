import React, { useState, useEffect } from "react";
import axios from "axios";

const AddServiceForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    unitPrice: "",
    items: [],
  });
  const [image, setImage] = useState(null);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [services, setServices] = useState([]);
  const [error, setError] = useState(null);
  const [alert, setAlert] = useState({ message: "", type: "" });
  const [editingService, setEditingService] = useState(null);
  const [editFormData, setEditFormData] = useState({ name: "", description: "", unitPrice: "" });
  const [editImage, setEditImage] = useState(null);

  useEffect(() => {
    fetchInventoryItems();
    fetchServices();
  }, []);

  const fetchInventoryItems = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/inventory/all");
      setInventoryItems(response.data);
    } catch (error) {
      setError("Failed to fetch inventory items");
    }
  };

  const fetchServices = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/service/getAllServices");
      setServices(response.data);
    } catch (error) {
      setError("Failed to fetch services");
    }
  };

  const showAlert = (message, type) => {
    setAlert({ message, type });
    setTimeout(() => setAlert({ message: "", type: "" }), 3000);
  };

  // Updated handleChange to restrict name and description to letters and spaces
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Restrict name and description to letters and spaces
    if (name === "name" || name === "description") {
      const lettersOnly = value.replace(/[^a-zA-Z\s]/g, "");
      setFormData({ ...formData, [name]: lettersOnly });
      return;
    }

    // For other fields (like unitPrice), update normally
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [
        ...formData.items,
        {
          itemId: "",
          quantities: { bike: 0, scooter: 0, car: 0, van: 0, suv: 0, cab: 0, bus: 0, truck: 0 },
        },
      ],
    });
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items];
    if (field === "itemId") {
      updatedItems[index][field] = value;
    } else {
      updatedItems[index].quantities[field] = parseInt(value) || 0;
    }
    setFormData({ ...formData, items: updatedItems });
  };

  const removeItem = (index) => {
    const updatedItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: updatedItems });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("unitPrice", formData.unitPrice);
      data.append("items", JSON.stringify(formData.items));
      if (image) {
        data.append("image", image);
      }

      const response = await axios.post("http://localhost:8000/api/service/create", data);
      showAlert("Service added successfully", "success");
      setFormData({ name: "", description: "", unitPrice: "", items: [] });
      setImage(null);
      setError(null);
      fetchServices();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to add service");
    }
  };

  const handleEdit = (service) => {
    setEditingService(service._id);
    setEditFormData({
      name: service.name,
      description: service.description,
      unitPrice: service.unitPrice,
    });
    setEditImage(null);
  };

  // Updated handleEditChange to restrict name and description to letters and spaces
  const handleEditChange = (e) => {
    const { name, value } = e.target;

    // Restrict name and description to letters and spaces
    if (name === "name" || name === "description") {
      const lettersOnly = value.replace(/[^a-zA-Z\s]/g, "");
      setEditFormData({ ...editFormData, [name]: lettersOnly });
      return;
    }

    // For other fields (like unitPrice), update normally
    setEditFormData({ ...editFormData, [name]: value });
  };

  const handleEditImageChange = (e) => {
    setEditImage(e.target.files[0]);
  };

  const handleUpdate = async (id) => {
    try {
      const data = new FormData();
      data.append("name", editFormData.name);
      data.append("description", editFormData.description);
      data.append("unitPrice", editFormData.unitPrice);
      if (editImage) {
        data.append("image", editImage);
      }

      const response = await axios.put(`http://localhost:8000/api/service/update/${id}`, data);
      showAlert("Service updated successfully", "success");
      setEditingService(null);
      setEditImage(null);
      fetchServices();
    } catch (error) {
      setError("Failed to update service");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      try {
        const response = await axios.delete(`http://localhost:8000/api/service/delete/${id}`);
        showAlert("Service deleted successfully", "success");
        fetchServices();
      } catch (error) {
        setError("Failed to delete service");
      }
    }
  };

  // The rest of the component (JSX) remains unchanged
  return (
    <div style={{ maxWidth: "1200px", padding: "20px" }}>
      {/* Alert Display */}
      {alert.message && (
        <div
          style={{
            padding: "10px",
            marginBottom: "20px",
            borderRadius: "4px",
            color: "#fff",
            backgroundColor: alert.type === "success" ? "#28a745" : "#dc3545",
            textAlign: "center",
            position: "relative",
          }}
        >
          {alert.message}
          <button
            onClick={() => setAlert({ message: "", type: "" })}
            style={{
              position: "absolute",
              right: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            ×
          </button>
        </div>
      )}

      {error && (
        <div style={{ color: "red", textAlign: "center", marginBottom: "20px" }}>{error}</div>
      )}

      {/* Add Service Form */}
      <h2 style={{ textAlign: "left", marginBottom: "20px", marginTop: "0px", fontWeight: "600"}}>Add New Service</h2>
      <div style={{ border: "1px solid #ccc", borderRadius: "8px", padding: "20px", marginBottom: "30px" }}>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>Service Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>Description:</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc", minHeight: "80px" }}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>Unit Price:</label>
            <input
              type="number"
              name="unitPrice"
              value={formData.unitPrice}
              onChange={handleChange}
              min="0"
              required
              style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>Image (Optional):</label>
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <h4>Items Required</h4>
            {formData.items.map((item, index) => (
              <div key={index} style={{ border: "1px solid #eee", padding: "10px", marginBottom: "10px", borderRadius: "4px" }}>
                <div style={{ marginBottom: "10px" }}>
                  <label style={{ marginRight: "10px" }}>Select Item:</label>
                  <select
                    value={item.itemId}
                    onChange={(e) => handleItemChange(index, "itemId", e.target.value)}
                    required
                    style={{ padding: "5px", borderRadius: "4px" }}
                  >
                    <option value="">Select an item</option>
                    {inventoryItems.map((invItem) => (
                      <option key={invItem._id} value={invItem._id}>
                        {invItem.itemName}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px" }}>
                  {["bike", "scooter", "car", "van", "suv", "cab", "bus", "truck"].map((vehicle) => (
                    <div key={vehicle}>
                      <label style={{ display: "block", textTransform: "capitalize" }}>{vehicle}:</label>
                      <input
                        type="number"
                        value={item.quantities[vehicle]}
                        onChange={(e) => handleItemChange(index, vehicle, e.target.value)}
                        min="0"
                        style={{ width: "100%", padding: "5px", borderRadius: "4px", border: "1px solid #ccc" }}
                      />
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  style={{
                    marginTop: "10px",
                    padding: "5px 10px",
                    backgroundColor: "#dc3545",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                  }}
                >
                  Remove Item
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={addItem}
              style={{
                padding: "8px 16px",
                backgroundColor: "#007bff",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                marginTop: "10px",
              }}
            >
              Add Item
            </button>
          </div>

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "10px",
              backgroundColor: "#28a745",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
            }}
          >
            Add Service
          </button>
        </form>
      </div>

      {/* Service Table */}
      <div>
        <h2 style={{ textAlign: "left", marginBottom: "20px", marginTop: "60px", fontWeight: "600"}}>Manage Services</h2>

        {services.length === 0 ? (
          <p style={{ textAlign: "center", color: "#666" }}>No services available.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", backgroundColor: "#fff", boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)" }}>
            <thead>
              <tr style={{ backgroundColor: "#f8f9fa" }}>
                <th style={{ padding: "10px", border: "1px solid #ddd", textAlign: "left" }}>Name</th>
                <th style={{ padding: "10px", border: "1px solid #ddd", textAlign: "left" }}>Description</th>
                <th style={{ padding: "10px", border: "1px solid #ddd", textAlign: "left" }}>Unit Price</th>
                <th style={{ padding: "10px", border: "1px solid #ddd", textAlign: "left" }}>Image</th>
                <th style={{ padding: "10px", border: "1px solid #ddd", textAlign: "left" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr key={service._id}>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    {editingService === service._id ? (
                      <input
                        type="text"
                        name="name"
                        value={editFormData.name}
                        onChange={handleEditChange}
                        style={{ padding: "5px", width: "100%" }}
                      />
                    ) : (
                      service.name
                    )}
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    {editingService === service._id ? (
                      <textarea
                        name="description"
                        value={editFormData.description}
                        onChange={handleEditChange}
                        style={{ padding: "5px", width: "100%", minHeight: "50px" }}
                      />
                    ) : (
                      service.description
                    )}
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    {editingService === service._id ? (
                      <input
                        type="number"
                        name="unitPrice"
                        value={editFormData.unitPrice}
                        onChange={handleEditChange}
                        min="0"
                        style={{ padding: "5px", width: "100%" }}
                      />
                    ) : (
                      `Rs.${service.unitPrice}`
                    )}
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    {editingService === service._id ? (
                      <div>
                        {service.image && (
                          <img
                            src={`http://localhost:8000${service.image}`}
                            alt={service.name}
                            style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "4px", marginBottom: "5px" }}
                          />
                        )}
                        <input type="file" accept="image/*" onChange={handleEditImageChange} />
                      </div>
                    ) : service.image ? (
                      <img
                        src={`http://localhost:8000${service.image}`}
                        alt={service.name}
                        style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "4px" }}
                      />
                    ) : (
                      "No Image"
                    )}
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    {editingService === service._id ? (
                      <>
                        <button
                          onClick={() => handleUpdate(service._id)}
                          style={{
                            padding: "5px 10px",
                            backgroundColor: "#28a745",
                            color: "#fff",
                            border: "none",
                            borderRadius: "4px",
                            marginRight: "5px",
                          }}
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingService(null)}
                          style={{
                            padding: "5px 10px",
                            backgroundColor: "#dc3545",
                            color: "#fff",
                            border: "none",
                            borderRadius: "4px",
                          }}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEdit(service)}
                          style={{
                            padding: "5px 10px",
                            backgroundColor: "#007bff",
                            color: "#fff",
                            border: "none",
                            borderRadius: "4px",
                            marginRight: "5px",
                            marginBottom: "5px",
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(service._id)}
                          style={{
                            padding: "5px 10px",
                            backgroundColor: "#dc3545",
                            color: "#fff",
                            border: "none",
                            borderRadius: "4px",
                          }}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AddServiceForm;