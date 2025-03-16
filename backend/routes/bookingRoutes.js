const express = require("express");
const router = express.Router();

const Booking = require("../models/Booking"); // Import the Booking model

// POST - Create a new booking
router.post("/addBooking", async (req, res) => {
  const { name, vehicleNo, vehicleType, serviceType, bookingDate, bookingTime, phoneNumber, email, mileage } = req.body;

  try {
    const newBooking = new Booking({
      name,
      vehicleNo,
      vehicleType,
      serviceType,
      bookingDate,
      bookingTime,
      phoneNumber,
      email,
      mileage,
      status: "Active",  // Default status when booking is created
    });

    await newBooking.save();

    res.status(200).send({
      message: "Booking created successfully!",
      booking: newBooking,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Error creating booking" });
  }
});

// GET - Get all bookings
router.get("/getAllBookings", async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.status(200).json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching bookings" });
  }
});

// GET - Get a specific booking by ID
router.get("/getBooking/:id", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }
    res.status(200).json(booking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching booking" });
  }
});

// PUT - Update a booking (general update, e.g., status change)
router.put("/updateBooking/:id", async (req, res) => {
  try {
    const updatedBooking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedBooking) {
      return res.status(404).json({ error: "Booking not found" });
    }
    res.status(200).json({
      message: "Booking updated successfully",
      booking: updatedBooking,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error updating booking" });
  }
});

// PUT - Update booking status (active -> ongoing, completed, onhold, canceled)
router.put("/updateStatus/:id", async (req, res) => {
  const { status } = req.body; // Expected status: 'Active', 'Ongoing', 'Complete', 'OnHold', 'Canceled'

  try {
    // Validate that the status is valid
    if (!["Active", "Ongoing", "Complete", "OnHold", "Canceled"].includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updatedBooking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    res.status(200).json({
      message: `Booking status updated to ${status}`,
      booking: updatedBooking,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error updating booking status" });
  }
});

// DELETE - Delete a booking
router.delete("/deleteBooking/:id", async (req, res) => {
  try {
    const deletedBooking = await Booking.findByIdAndDelete(req.params.id);
    if (!deletedBooking) {
      return res.status(404).json({ error: "Booking not found" });
    }
    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error deleting booking" });
  }
});

module.exports = router;
