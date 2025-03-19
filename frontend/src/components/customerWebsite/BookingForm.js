import React, { useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

const BookingForm = () => {
  
  const location = useLocation();
  const { selectedDate, selectedSlot } = location.state || {}; // Handle potential undefined state

  const [booking, setBooking] = useState({
    name: "",
    vehicleNo: "",
    vehicleType: "",
    serviceType: "",
    bookingDate: selectedDate || "",
    bookingTime: selectedSlot || "",
    phoneNumber: "",
    email: "",
    mileage: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBooking({ ...booking, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8000/api/booking/addBooking", booking);
      console.log("Booking added:", response.data);
      alert("Booking successfully created");
    } catch (error) {
      console.error("Error adding booking:", error);
      alert("There was an error creating your booking");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white shadow-md rounded-md" style={{width: "50%", paddingTop: "100px", paddingBottom: "100px"}}>
      <h2 className="text-xl font-bold mb-4">Booking Form</h2>
      <label>Name:</label>
      <input
        type="text"
        name="name"
        value={booking.name}
        onChange={handleChange}
        className="w-full p-2 border border-gray-300 rounded-md mb-4"
        required
      />
      <label>Vehicle Number:</label>
      <input
        type="text"
        name="vehicleNo"
        value={booking.vehicleNo}
        onChange={handleChange}
        className="w-full p-2 border border-gray-300 rounded-md mb-4"
        required
      />
      <label>Vehicle Type:</label>
      <input
        type="text"
        name="vehicleType"
        value={booking.vehicleType}
        onChange={handleChange}
        className="w-full p-2 border border-gray-300 rounded-md mb-4"
        required
      />
      <label>Service Type:</label>
      <input
        type="text"
        name="serviceType"
        value={booking.serviceType}
        onChange={handleChange}
        className="w-full p-2 border border-gray-300 rounded-md mb-4"
        required
      />
      <label>Booking Date:</label>
      <input type="text" className="w-full p-2 border border-gray-300 rounded-md mb-4 " value={selectedDate} disabled />
      <label>Booking Time:</label>
      <input type="text" className="w-full p-2 border border-gray-300 rounded-md mb-4" value={selectedSlot} disabled />
      <br/>
      <label>Phone Number:</label>
      <input
        type="text"
        name="phoneNumber"
        value={booking.phoneNumber}
        onChange={handleChange}
        className="w-full p-2 border border-gray-300 rounded-md mb-4"
        required
      />
      <label>Email:</label>
      <input
        type="email"
        name="email"
        value={booking.email}
        onChange={handleChange}
        className="w-full p-2 border border-gray-300 rounded-md mb-4"
        required
      />
      <label>Mileage:</label>
      <input
        type="number"
        name="mileage"
        value={booking.mileage}
        onChange={handleChange}
        className="w-full p-2 border border-gray-300 rounded-md mb-4"
        required
      />
      <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded-md mt-4">
        Proceed to Payment
      </button>
    </form>
  );
};

export default BookingForm;
