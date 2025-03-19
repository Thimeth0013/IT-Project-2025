import React, { useState, useEffect } from "react";
import axios from "axios";

const BookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [updatedStatus, setUpdatedStatus] = useState("");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/booking/getAllBookings");
      setBookings(response.data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  const handleUpdate = async (id) => {
    try {
      await axios.put(`http://localhost:8000/api/booking/updateBooking/${id}`, { status: updatedStatus });
      setEditingId(null);
      fetchBookings(); // Refresh list
    } catch (error) {
      console.error("Error updating booking:", error);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this booking?");
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:8000/api/booking/deleteBooking/${id}`);
        fetchBookings(); // Refresh list
      } catch (error) {
        console.error("Error deleting booking:", error);
      }
    }
  };

  return (
    <div>
      <h2>Bookings List</h2>
      {bookings.length === 0 ? <p>No bookings available.</p> : (
        bookings.map((booking) => (
          <div key={booking._id} style={{ border: "1px solid #ddd", padding: "10px", marginBottom: "10px" }}>
            <p><strong>Name:</strong> {booking.name}</p>
            <p><strong>Status:</strong> {booking.status}</p>
            <p><strong>Booking Time:</strong> {booking.bookingTime}</p>
            <p><strong>Vehicle Number:</strong> {booking.vehicleNo}</p>
            <p><strong>Service Type:</strong> {booking.serviceType.join(", ")}</p>
            <p><strong>Phone:</strong> {booking.phoneNumber}</p>
            <p><strong>Email:</strong> {booking.email}</p> <br/>
            {editingId === booking._id ? (
              <>
                <select style={{paddingRight: "0px"}} value={updatedStatus} onChange={(e) => setUpdatedStatus(e.target.value)}>
                  <option value="Active">Active</option>
                  <option value="Ongoing">Ongoing</option>
                  <option value="Complete">Complete</option>
                  <option value="OnHold">On Hold</option>
                  <option value="Canceled">Canceled</option>
                </select>
                <button style={{paddingLeft: "20px", paddingRight: "10px", color: "green"}} onClick={() => handleUpdate(booking._id)}>Save</button>
                <button style={{paddingRight: "20px", color: "red"}} onClick={() => setEditingId(null)}>Cancel</button>
              </>
            ) : (
              <>
                <button onClick={() => { setEditingId(booking._id); setUpdatedStatus(booking.status)}} style={{fontWeight: "500"}}>
                  Update
                </button>
                <button 
                  onClick={() => handleDelete(booking._id)} 
                  style={{ marginLeft: "10px", color: "red", fontWeight: "500"}}>
                  Delete
                </button>
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default BookingList;
