import React, { useState, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion"; // Corrected import from "motion/react" to "framer-motion"
import NavBarC from '../../components/customerWebsite/NavBarC';
import FooterC from '../../components/customerWebsite/FooterC';

const placeholderImage = "https://www.bmw.com/content/dam/bmw/marketBMWCOM/bmw_com/categories/automotive-life/bmwapp-wallpaper/bawp-27-media-portrait.jpg";

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

  // Set the max date to 30 days from today
  const maxDate = new Date();
  maxDate.setDate(today.getDate() + 30);

  // Define the range of months containing selectable days
  const fromMonth = new Date(today.getFullYear(), today.getMonth(), 1); // First day of the current month
  const toMonth = new Date(maxDate.getFullYear(), maxDate.getMonth(), 1); // First day of the ending month

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

  const linkVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={linkVariants}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <NavBarC />
      <div
        className="flex flex-col md:flex-row min-h-screen bg-[#0b0b0c] text-white"
        style={{ padding: "50px 20px 50px 60px" }}
      >
        {/* Left Section: Calendar and Time Slots */}
        <div className="md:w-1/2 bg-[#0b0b0c] shadow-lg rounded-lg">
          <h2 className="text-2xl font-bold mb-4 text-[#fffff]">Schedule Your Service</h2>
          <p className="text-gray-300 mb-4">
            Choose a convenient date and time slot for your service. Our team is ready to assist you with a seamless booking experience.
          </p>
          {/* Calendar and Time Slots in a Horizontal Layout */}
          <div className="flex flex-col md:flex-row gap-6">
            {/* Calendar */}
            <div className="md:w-1/2">
              <DayPicker
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={{ before: today, after: maxDate }} // Restrict to today through 30 days from today
                fromMonth={fromMonth} // Lock navigation to start of current month
                toMonth={toMonth}     // Lock navigation to end of range month
                className="bg-[#1a1a1a] p-1 rounded-lg"
              />
            </div>

            {/* Time Slots (Vertical Stack) */}
            <div className="md:w-1/2 flex flex-col py-20 gap-4">
              {isLoading ? (
                <p className="text-center mt-4 text-white-400">Loading available slots...</p>
              ) : (
                timeSlots.map((slot, index) => (
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
                ))
              )}
            </div>
          </div>

          {/* Confirm Button */}
          <button
            className="p-3 bg-[#8E1616] text-white w-full rounded-lg hover:bg-[#D84040]"
            onClick={handleConfirm}
          >
            Confirm Date & Time
          </button>
        </div>

        {/* Right Section: Image and Text */}
        <div className="md:w-1/2 flex flex-col items-center py-10">
          <img
            src={placeholderImage}
            alt="Pick a Date and Time"
            className="w-full max-w-md rounded-lg object-cover"
            style={{ height: "520px" }}
          />
        </div>
      </div>
      <FooterC />
    </motion.div>
  );
};

export default SlotSelection;