import React, { useState, useEffect } from "react";
import axios from "axios";

const BookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [updatedStatus, setUpdatedStatus] = useState("");
  const [addingServicesId, setAddingServicesId] = useState(null);
  const [pendingServices, setPendingServices] = useState([]);
  const [availableServices, setAvailableServices] = useState([]);
  const [selectedDate, setSelectedDate] = useState("2025-03-20");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    fetchBookings();
    fetchAvailableServices();
  }, []);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found. Please log in.");
      }

      const response = await axios.get("http://localhost:8000/api/booking/getAllBookings", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBookings(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setError(error.response?.data?.error || error.message || "Failed to fetch bookings");
    }
  };

  const fetchAvailableServices = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/service/getAllServices");
      if (response.data.length === 0) {
        setError("No services available to add.");
      } else {
        setAvailableServices(response.data);
        setError(null);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
      setError(error.response?.data?.message || "Failed to fetch services");
    }
  };

  const handleStatusChange = async (id) => {
    try {
      const token = localStorage.getItem("token");
      // Update the booking status
      await axios.put(
        `http://localhost:8000/api/booking/updateStatus/${id}`,
        { status: updatedStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Send notification after status change
      await axios.post(
        `http://localhost:8000/api/booking/sendNotification/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setEditingId(null);
      setSuccessMessage("Status updated and notification sent successfully!");
      fetchBookings();
    } catch (error) {
      console.error("Error updating status:", error);
      setError(error.response?.data?.error || "Failed to update status or send notification");
    }
  };

  const handleAddServices = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const booking = bookings.find((b) => b._id === id);

      // Update the booking with the new pending services
      await axios.put(
        `http://localhost:8000/api/booking/updateBooking/${id}`,
        {
          pendingServices: [...(booking.pendingServices || []), ...pendingServices],
          status: "OnHold", // Set status to OnHold when adding pending services
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Send notification after adding pending services
      await axios.post(
        `http://localhost:8000/api/booking/sendNotification/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAddingServicesId(null);
      setPendingServices([]);
      setSuccessMessage("Pending services added and notification sent successfully!");
      fetchBookings();
    } catch (error) {
      console.error("Error adding services:", error);
      setError(error.response?.data?.error || "Failed to add services");
    }
  };

  const handleSendReminders = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:8000/api/booking/sendReminders",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccessMessage(response.data.message);
    } catch (error) {
      console.error("Error sending reminders:", error);
      setError(error.response?.data?.error || "Failed to send reminders");
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this booking?");
    if (confirmDelete) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:8000/api/booking/deleteBooking/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSuccessMessage("Booking deleted successfully!");
        fetchBookings();
      } catch (error) {
        console.error("Error deleting booking:", error);
        setError(error.response?.data?.error || "Failed to delete booking");
      }
    }
  };

  const selectedDateBookings = bookings.filter((booking) => {
    const bookingDate = new Date(booking.bookingDate);
    const selected = new Date(selectedDate);
    return (
      bookingDate.getFullYear() === selected.getFullYear() &&
      bookingDate.getMonth() === selected.getMonth() &&
      bookingDate.getDate() === selected.getDate()
    );
  });

  const totalAppointments = bookings.length;
  const completedAppointments = bookings.filter((booking) => booking.status === "Complete").length;
  const upcomingAppointments = bookings.filter((booking) => booking.status === "Active").length;

  const formatServiceType = (serviceType) => {
    return serviceType.map((service) => service.name).join(", ");
  };

  return (
    <div style={{ maxWidth: "800px", margin: "20px auto" }}>
      {error && (
        <div style={{ color: "red", textAlign: "center", marginBottom: "20px" }}>
          {error}
        </div>
      )}
      {successMessage && (
        <div style={{ color: "green", textAlign: "center", marginBottom: "40px" }}>
          {successMessage}
        </div>
      )}

      <div style={{ marginBottom: "30px", textAlign: "center" }}>
        <label htmlFor="datePicker" style={{ marginRight: "10px", fontWeight: "bold" }}>
          Select Date:
        </label>
        <input
          type="date"
          id="datePicker"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          style={{
            padding: "5px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />
        <div
          style={{
            marginTop: "50px",
            display: "flex",
            justifyContent: "center",
            gap: "20px",
          }}
        >
          <p>
            <strong>Total Appointments:</strong> {totalAppointments}
          </p>
          <p>
            <strong>Completed Appointments:</strong> {completedAppointments}
          </p>
          <p>
            <strong>Upcoming Appointments:</strong> {upcomingAppointments}
          </p>
        </div>
        <button
          onClick={handleSendReminders}
          style={{
            marginTop: "50px",
            padding: "8px 16px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Send Reminders for Tomorrow
        </button>
      </div>

      <h2 style={{ textAlign: "center", marginBottom: "20px", marginTop: "50px" }}>
        Appointments for {new Date(selectedDate).toLocaleDateString()}
      </h2>
      {selectedDateBookings.length === 0 ? (
        <p style={{ textAlign: "center", color: "#666" }}>
          No appointments for {new Date(selectedDate).toLocaleDateString()}.
        </p>
      ) : (
        selectedDateBookings.map((booking) => (
          <div
            key={booking._id}
            style={{
              border: "1px solid #e0e0e0",
              borderRadius: "8px",
              padding: "15px",
              marginBottom: "15px",
              backgroundColor: "#fff",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p style={{ margin: "5px 0", fontSize: "16px" }}>
                  <strong>Name:</strong> {booking.name}
                </p>
                <p style={{ margin: "5px 0", fontSize: "16px" }}>
                  <strong>Status:</strong> {booking.status}
                </p>
                <p style={{ margin: "5px 0", fontSize: "16px" }}>
                  <strong>Booking Date:</strong> {new Date(booking.bookingDate).toLocaleDateString()}
                </p>
                <p style={{ margin: "5px 0", fontSize: "16px" }}>
                  <strong>Booking Time:</strong> {booking.bookingTime}
                </p>
                <p style={{ margin: "5px 0", fontSize: "16px" }}>
                  <strong>Vehicle No:</strong> {booking.vehicleNo}
                </p>
                <p style={{ margin: "5px 0", fontSize: "16px" }}>
                  <strong>Service Type:</strong> {formatServiceType(booking.serviceType)}
                </p>
                {booking.pendingServices && booking.pendingServices.length > 0 && (
                  <p style={{ margin: "5px 0", fontSize: "16px" }}>
                    <strong>Pending Services:</strong>{" "}
                    {formatServiceType(booking.pendingServices)}
                  </p>
                )}
                <p style={{ margin: "5px 0", fontSize: "16px" }}>
                  <strong>Phone:</strong> {booking.phoneNumber}
                </p>
                <p style={{ margin: "5px 0", fontSize: "16px" }}>
                  <strong>Email:</strong> {booking.email}
                </p>
              </div>
              <div style={{ textAlign: "right" }}>
                {editingId === booking._id ? (
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <select
                      value={updatedStatus}
                      onChange={(e) => setUpdatedStatus(e.target.value)}
                      style={{
                        padding: "5px",
                        borderRadius: "4px",
                        border: "1px solid #ccc",
                      }}
                    >
                      <option value="Active">Active</option>
                      <option value="Ongoing">Ongoing</option>
                      <option value="Complete">Complete</option>
                      <option value="OnHold">On Hold</option>
                      <option value="Canceled">Canceled</option>
                    </select>
                    <button
                      onClick={() => handleStatusChange(booking._id)}
                      style={{
                        padding: "6px 12px",
                        backgroundColor: "#28a745",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      style={{
                        padding: "6px 12px",
                        backgroundColor: "#dc3545",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                ) : addingServicesId === booking._id ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    <select
                      multiple
                      value={pendingServices.map((service) => service._id)}
                      onChange={(e) => {
                        const selectedOptions = Array.from(e.target.selectedOptions).map(
                          (option) => {
                            const service = availableServices.find(
                              (s) => s._id === option.value
                            );
                            return {
                              _id: service._id,
                              name: service.name,
                              description: service.description,
                              unitPrice: service.unitPrice,
                              items: service.items,
                            };
                          }
                        );
                        setPendingServices(selectedOptions);
                      }}
                      style={{
                        padding: "5px",
                        borderRadius: "4px",
                        border: "1px solid #ccc",
                        height: "100px",
                      }}
                    >
                      {availableServices.map((service) => (
                        <option key={service._id} value={service._id}>
                          {service.name} (${service.unitPrice})
                        </option>
                      ))}
                    </select>
                    <div style={{ display: "flex", gap: "10px" }}>
                      <button
                        onClick={() => handleAddServices(booking._id)}
                        style={{
                          padding: "6px 12px",
                          backgroundColor: "#28a745",
                          color: "#fff",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                      >
                        Add Services
                      </button>
                      <button
                        onClick={() => setAddingServicesId(null)}
                        style={{
                          padding: "6px 12px",
                          backgroundColor: "#dc3545",
                          color: "#fff",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button
                      onClick={() => {
                        setEditingId(booking._id);
                        setUpdatedStatus(booking.status);
                      }}
                      style={{
                        padding: "6px 12px",
                        backgroundColor: "#007bff",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      Change Status
                    </button>
                    <button
                      onClick={() => {
                        setAddingServicesId(booking._id);
                        setPendingServices([]);
                      }}
                      style={{
                        padding: "6px 12px",
                        backgroundColor: "#ffc107",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      Add Services
                    </button>
                    <button
                      onClick={() => handleDelete(booking._id)}
                      style={{
                        padding: "6px 12px",
                        backgroundColor: "#dc3545",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))
      )}

      <h2 style={{ textAlign: "center", margin: "40px 0 20px" }}>All Appointments</h2>
      {bookings.length === 0 ? (
        <p style={{ textAlign: "center", color: "#666" }}>No bookings available.</p>
      ) : (
        bookings.map((booking) => (
          <div
            key={booking._id}
            style={{
              border: "1px solid #e0e0e0",
              borderRadius: "8px",
              padding: "15px",
              marginBottom: "15px",
              backgroundColor: "#fff",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p style={{ margin: "5px 0", fontSize: "16px" }}>
                  <strong>Name:</strong> {booking.name}
                </p>
                <p style={{ margin: "5px 0", fontSize: "16px" }}>
                  <strong>Status:</strong> {booking.status}
                </p>
                <p style={{ margin: "5px 0", fontSize: "16px" }}>
                  <strong>Booking Date:</strong> {new Date(booking.bookingDate).toLocaleDateString()}
                </p>
                <p style={{ margin: "5px 0", fontSize: "16px" }}>
                  <strong>Booking Time:</strong> {booking.bookingTime}
                </p>
                <p style={{ margin: "5px 0", fontSize: "16px" }}>
                  <strong>Vehicle No:</strong> {booking.vehicleNo}
                </p>
                <p style={{ margin: "5px 0", fontSize: "16px" }}>
                  <strong>Service Type:</strong> {formatServiceType(booking.serviceType)}
                </p>
                {booking.pendingServices && booking.pendingServices.length > 0 && (
                  <p style={{ margin: "5px 0", fontSize: "16px" }}>
                    <strong>Pending Services:</strong>{" "}
                    {formatServiceType(booking.pendingServices)}
                  </p>
                )}
                <p style={{ margin: "5px 0", fontSize: "16px" }}>
                  <strong>Phone:</strong> {booking.phoneNumber}
                </p>
                <p style={{ margin: "5px 0", fontSize: "16px" }}>
                  <strong>Email:</strong> {booking.email}
                </p>
              </div>
              <div style={{ textAlign: "right" }}>
                {editingId === booking._id ? (
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <select
                      value={updatedStatus}
                      onChange={(e) => setUpdatedStatus(e.target.value)}
                      style={{
                        padding: "5px",
                        borderRadius: "4px",
                        border: "1px solid #ccc",
                      }}
                    >
                      <option value="Active">Active</option>
                      <option value="Ongoing">Ongoing</option>
                      <option value="Complete">Complete</option>
                      <option value="OnHold">On Hold</option>
                      <option value="Canceled">Canceled</option>
                    </select>
                    <button
                      onClick={() => handleStatusChange(booking._id)}
                      style={{
                        padding: "6px 12px",
                        backgroundColor: "#28a745",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      style={{
                        padding: "6px 12px",
                        backgroundColor: "#dc3545",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                ) : addingServicesId === booking._id ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    <select
                      multiple
                      value={pendingServices.map((service) => service._id)}
                      onChange={(e) => {
                        const selectedOptions = Array.from(e.target.selectedOptions).map(
                          (option) => {
                            const service = availableServices.find(
                              (s) => s._id === option.value
                            );
                            return {
                              _id: service._id,
                              name: service.name,
                              description: service.description,
                              unitPrice: service.unitPrice,
                              items: service.items,
                            };
                          }
                        );
                        setPendingServices(selectedOptions);
                      }}
                      style={{
                        padding: "5px",
                        borderRadius: "4px",
                        border: "1px solid #ccc",
                        height: "100px",
                      }}
                    >
                      {availableServices.map((service) => (
                        <option key={service._id} value={service._id}>
                          {service.name} (${service.unitPrice})
                        </option>
                      ))}
                    </select>
                    <div style={{ display: "flex", gap: "10px" }}>
                      <button
                        onClick={() => handleAddServices(booking._id)}
                        style={{
                          padding: "6px 12px",
                          backgroundColor: "#28a745",
                          color: "#fff",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                      >
                        Add Services
                      </button>
                      <button
                        onClick={() => setAddingServicesId(null)}
                        style={{
                          padding: "6px 12px",
                          backgroundColor: "#dc3545",
                          color: "#fff",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button
                      onClick={() => {
                        setEditingId(booking._id);
                        setUpdatedStatus(booking.status);
                      }}
                      style={{
                        padding: "6px 12px",
                        backgroundColor: "#007bff",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      Change Status
                    </button>
                    <button
                      onClick={() => {
                        setAddingServicesId(booking._id);
                        setPendingServices([]);
                      }}
                      style={{
                        padding: "6px 12px",
                        backgroundColor: "#ffc107",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      Add Services
                    </button>
                    <button
                      onClick={() => handleDelete(booking._id)}
                      style={{
                        padding: "6px 12px",
                        backgroundColor: "#dc3545",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default BookingList;