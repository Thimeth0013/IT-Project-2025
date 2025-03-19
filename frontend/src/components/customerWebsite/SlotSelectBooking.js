import React, { useState, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SlotSelection = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [bookedSlots, setBookedSlots] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Time slots
  const timeSlots = [
    "08:00 - 10:00",
    "10:00 - 12:00",
    "13:00 - 15:00",
    "15:00 - 17:00",
  ];

  // Get today's date
  const today = new Date();
  today.setDate(today.getDate() + 2); // Skip one day from current date

  // Set the max date to 30 days from today
  const maxDate = new Date();
  maxDate.setDate(today.getDate() + 30);

  // Fetch booked slots when date changes
  useEffect(() => {
    if (selectedDate) {
      setIsLoading(true);
      const formattedDate = selectedDate.toISOString().split("T")[0];

      axios
        .get(`http://localhost:8000/api/booking/getBookedSlots?date=${formattedDate}`)
        .then((response) => {
          setBookedSlots(response.data.bookedSlots);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching booked slots:", error);
          setIsLoading(false);
        });
    }
  }, [selectedDate]);

  // Check if a slot is already booked
  const isSlotBooked = (slot) => bookedSlots.includes(slot);

  // Check if all slots for the selected date are booked
  const isDateFullyBooked = () => timeSlots.every((slot) => bookedSlots.includes(slot));

  // Handle slot selection
  const handleSlotClick = (slot) => {
    if (!isSlotBooked(slot)) {
      setSelectedSlot(slot);
    }
  };

  // Handle confirmation
  const handleConfirm = () => {
    if (!selectedDate || !selectedSlot) {
      alert("Please select a date and a time slot.");
      return;
    }

    if (isDateFullyBooked()) {
      alert("This date is fully booked. Please select another date.");
      return;
    }

    navigate("/BookingForm", { state: { selectedDate, selectedSlot } });
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-[#0b0b0c] shadow-lg rounded-lg text-white" style={{ paddingTop: "100px", paddingBottom: "100px" }}>
      <h2 className="text-2xl font-bold mb-4 text-[#fffff]">Select a Date & Time Slot</h2>

      {/* Calendar */}
      <center>
        <DayPicker
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          disabled={{ before: today, after: maxDate }}
        />
      </center>

      {/* Time Slots */}
      {isLoading ? (
        <p className="text-center mt-4 text-white-400">Loading available slots...</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 mt-4">
          {timeSlots.map((slot, index) => (
            <button
              key={index}
              className={`p-2 border rounded text-center font-medium ${
                selectedSlot === slot
                  ? "bg-[#D84040] text-white"
                  : isSlotBooked(slot)
                  ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                  : "bg-[#8E1616] hover:bg-[#D84040] text-white"
              }`}
              onClick={() => handleSlotClick(slot)}
              disabled={isSlotBooked(slot)}
            >
              {slot}
            </button>
          ))}
        </div>
      )}

      {/* Confirm Button */}
      <button
        className="mt-6 p-3 bg-[#8E1616] text-white w-full rounded-lg hover:bg-[#D84040]"
        onClick={handleConfirm}
      >
        Confirm Date & Time
      </button>
    </div>
  );
};

export default SlotSelection;
