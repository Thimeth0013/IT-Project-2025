// backend/routes/bookingRoutes.js
const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const Service = require("../models/Service");
const Inventory = require("../models/inventorym"); // Update to match collection name
const authMiddleware = require("../middleware/authMiddleware");
const nodemailer = require("nodemailer");

// Email setup (configure with your SMTP details)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "thimethsathmikacar@gmail.com",
    pass: "soqj plpv purn wtwu",
  },
});

// Function to check reorder level
const checkReorderLevel = async (item) => {
  if (item.stock <= item.reorderLevel) {
    console.log(`🔴 Low stock alert: ${item.itemName} has reached the reorder level. Current stock: ${item.stock}`);
  }
};

// POST - Create a new booking (Customer only)
router.post("/addBooking", authMiddleware(["Customer"]), async (req, res) => {
  const {
    name,
    vehicleNo,
    vehicleType,
    vehicleMake,
    serviceType, // Array of service IDs
    bookingDate,
    bookingTime,
    phoneNumber,
    email,
    mileage,
    initialPayment,
  } = req.body;

  try {
    const services = await Service.find({ _id: { $in: serviceType } }).populate("items.itemId");
    if (!services.length) return res.status(400).json({ error: "No valid services selected" });

    const serviceDetails = services.map((service) => {
      const items = service.items.map((item) => {
        const quantityKey = vehicleType.toLowerCase();
        const quantity = item.quantities[quantityKey] || 0;
        return {
          itemId: item.itemId._id,
          itemName: item.itemId.itemName, // Updated to match Inventory.js
          quantity,
          unitPrice: item.itemId.unitPrice || 0,
        };
      });

      return {
        _id: service._id,
        name: service.name,
        description: service.description,
        unitPrice: service.unitPrice,
        items,
      };
    });

    const totalCost = serviceDetails.reduce((sum, service) => sum + service.unitPrice, 0);

    const newBooking = new Booking({
      name,
      vehicleNo,
      vehicleType,
      vehicleMake,
      serviceType: serviceDetails,
      bookingDate: new Date(bookingDate),
      bookingTime,
      phoneNumber,
      email: req.userEmail || email,
      mileage,
      totalCost,
      initialPayment,
      status: "Active",
      paymentStatus: initialPayment >= totalCost ? "Fully Paid" : "Partially Paid",
    });

    await newBooking.save();

    const subject = `Booking Confirmation for Vehicle ${vehicleNo}`;
    const text = `Dear ${name},\n\nYour booking for vehicle ${vehicleNo} has been confirmed.\nDate: ${newBooking.bookingDate.toISOString().split("T")[0]}\nTime: ${bookingTime}\nServices: ${serviceDetails.map(s => s.name).join(", ")}\nTotal Cost: Rs.${totalCost}\n\nRegards,\nFixMate Service Team,\nThank You`;
    await transporter.sendMail({
      from: "fixmate@gmail.com",
      to: email,
      subject,
      text,
    });

    res.status(200).json({
      message: "Booking created successfully!",
      booking: newBooking,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creating booking" });
  }
});

// POST - Cancel a booking (Customer only)
router.post("/cancelBooking/:id", authMiddleware(["Customer"]), async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ error: "Booking not found" });

    if (booking.email !== req.userEmail) {
      return res.status(403).json({ error: "Unauthorized to cancel this booking" });
    }

    if (booking.status === "Complete") {
      return res.status(400).json({ error: "Cannot cancel a completed booking" });
    }

    booking.status = "Canceled";
    await booking.save();

    res.status(200).json({ message: "Booking canceled successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error canceling booking" });
  }
});

// POST - Send reminder emails for tomorrow's appointments (Customer Manager only)
router.post("/sendReminders", authMiddleware(["Customer Manager"]), async (req, res) => {
  const { customMessage = "" } = req.body;

  try {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const tomorrowEnd = new Date(tomorrow);
    tomorrowEnd.setHours(23, 59, 59, 999);

    const bookings = await Booking.find({
      bookingDate: { $gte: tomorrow, $lte: tomorrowEnd },
      status: { $in: ["Active", "Ongoing", "OnHold"] },
    });

    if (!bookings.length) {
      return res.status(200).json({ message: "No bookings for tomorrow" });
    }

    for (const booking of bookings) {
      const subject = `Reminder: Your Appointment Tomorrow for Vehicle ${booking.vehicleNo}`;
      const defaultText = `Dear ${booking.name},\n\nThis is a reminder for your appointment tomorrow.\nVehicle: ${booking.vehicleNo}\nDate: ${booking.bookingDate.toISOString().split("T")[0]}\nTime: ${booking.bookingTime}\n\n`;
      const text = defaultText + (customMessage ? `${customMessage}\n\n` : "") + "Regards,\nService Team";

      await transporter.sendMail({
        from: "fixmate@gmail.com",
        to: booking.email,
        subject,
        text,
      });
    }

    res.status(200).json({ message: "Reminder emails sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error sending reminders" });
  }
});

// GET - Get all bookings (Admin and Customer Manager)
router.get("/getAllBookings", authMiddleware(["Admin", "Customer Manager"]), async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.status(200).json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching bookings" });
  }
});

// GET - Get a specific booking by ID (Admin and Customer Manager)
router.get("/getBooking/:id", authMiddleware(["Admin", "Customer Manager"]), async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ error: "Booking not found" });
    res.status(200).json(booking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching booking" });
  }
});

// PUT - Update a booking (Admin and Customer Manager)
router.put("/updateBooking/:id", authMiddleware(["Admin", "Customer Manager"]), async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ error: "Booking not found" });

    const { serviceType, vehicleType } = req.body;

    // If serviceType is updated, recalculate quantities
    if (serviceType) {
      if (!Array.isArray(serviceType) || serviceType.length === 0) {
        return res.status(400).json({ error: "Service type must be a non-empty array" });
      }

      const serviceDetails = [];
      for (const serviceId of serviceType) {
        const service = await Service.findById(serviceId);
        if (!service) {
          return res.status(404).json({ error: `Service with ID ${serviceId} not found` });
        }

        const items = [];
        for (const item of service.items) {
          const inventoryItem = await Inventory.findById(item.itemId);
          if (!inventoryItem) {
            return res.status(404).json({ error: `Inventory item ${item.itemId} not found` });
          }

          const quantity = item.quantities[vehicleType.toLowerCase()] || 0;
          items.push({
            itemId: item.itemId,
            itemName: inventoryItem.itemName,
            quantity: quantity,
            unitPrice: inventoryItem.unitPrice,
          });
        }

        serviceDetails.push({
          _id: service._id,
          name: service.name,
          description: service.description,
          unitPrice: service.unitPrice,
          items: items,
        });
      }

      req.body.serviceType = serviceDetails;
      req.body.totalCost = serviceDetails.reduce((sum, service) => sum + service.unitPrice, 0);
    }

    const updatedBooking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({
      message: "Booking updated successfully",
      booking: updatedBooking,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error updating booking" });
  }
});

// PUT - Update booking status (Admin and Customer Manager)
router.put("/updateStatus/:id", authMiddleware(["Admin", "Customer Manager"]), async (req, res) => {
  const { status } = req.body;

  try {
    console.log(`Starting status update for booking ${req.params.id} to status: ${status}`);

    if (!["Active", "Ongoing", "Complete", "OnHold", "Canceled"].includes(status)) {
      console.log(`Invalid status value: ${status}`);
      return res.status(400).json({ error: "Invalid status value" });
    }

    console.log(`Fetching booking with ID: ${req.params.id}`);
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      console.log(`Booking not found: ${req.params.id}`);
      return res.status(404).json({ error: "Booking not found" });
    }

    console.log(`Current booking status: ${booking.status}, inventoryDeducted: ${booking.inventoryDeducted}`);

    // Warn if the booking is already in "Complete" status
    if (status === "Complete" && booking.status === "Complete") {
      console.log(`Booking ${booking._id} is already in Complete status. No changes made to inventory.`);
    }

    // Update inventory if status changes to "Complete"
    let inventoryDeductionSuccessful = true;
    if (status === "Complete" && booking.status !== "Complete" && (booking.inventoryDeducted !== true)) {
      console.log(`Processing inventory deduction for booking ${booking._id}`);
      for (const service of booking.serviceType) {
        console.log(`Service: ${service.name}, Items: ${service.items.length}`);
        if (!service.items || service.items.length === 0) {
          console.log(`No items found for service ${service.name}, skipping inventory deduction`);
          continue;
        }
        for (const item of service.items) {
          console.log(`Deducting item ${item.itemId}, Quantity: ${item.quantity}`);
          if (!item.itemId || !item.quantity) {
            console.log(`Invalid item data: itemId=${item.itemId}, quantity=${item.quantity}`);
            inventoryDeductionSuccessful = false;
            continue;
          }
          const inventoryItem = await Inventory.findById(item.itemId);
          if (!inventoryItem) {
            console.log(`Inventory item not found: ${item.itemId}`);
            return res.status(404).json({ error: `Inventory item ${item.itemId} not found` });
          }

          // Validate quantity
          if (typeof item.quantity !== "number" || item.quantity < 0) {
            console.log(`Invalid quantity for item ${item.itemId}: ${item.quantity}`);
            return res.status(400).json({ error: `Invalid quantity for item ${item.itemId}: ${item.quantity}` });
          }

          // Reduce stock
          const previousStock = inventoryItem.stock;
          inventoryItem.stock -= item.quantity;
          console.log(`Deducting ${item.quantity} units from ${inventoryItem.itemName}. Previous: ${previousStock}, New: ${inventoryItem.stock}`);
          if (inventoryItem.stock < 0) {
            console.log(`Insufficient stock for item ${inventoryItem.itemName}. Needed: ${item.quantity}, Available: ${previousStock}`);
            return res.status(400).json({ error: `Insufficient stock for item ${inventoryItem.itemName}. Needed: ${item.quantity}, Available: ${previousStock}` });
          }

          // Update totalCost
          inventoryItem.totalCost = inventoryItem.stock * inventoryItem.unitPrice;

          // Mark fields as modified
          inventoryItem.markModified("stock");
          inventoryItem.markModified("totalCost");

          console.log(`Saving inventory item ${inventoryItem._id} with new stock: ${inventoryItem.stock}`);
          try {
            await inventoryItem.save();
            console.log(`Successfully saved inventory item ${inventoryItem._id}`);
          } catch (saveError) {
            console.error(`Failed to save inventory item ${inventoryItem._id}:`, saveError);
            inventoryDeductionSuccessful = false;
            continue;
          }

          // Check reorder level
          console.log(`Checking reorder level for item ${inventoryItem._id}`);
          await checkReorderLevel(inventoryItem);
        }
      }
      if (inventoryDeductionSuccessful) {
        booking.inventoryDeducted = true;
        console.log(`Marked inventoryDeducted as true for booking ${booking._id}`);
      } else {
        console.log(`Inventory deduction failed for some items. inventoryDeducted remains false for booking ${booking._id}`);
      }
    } else {
      console.log(`Skipping inventory deduction. Conditions not met: status=${status}, booking.status=${booking.status}, inventoryDeducted=${booking.inventoryDeducted}`);
    }

    booking.status = status;
    console.log(`Saving booking ${booking._id} with new status: ${status}`);
    const updatedBooking = await booking.save();

    res.status(200).json({
      message: `Booking status updated to ${status}`,
      booking: updatedBooking,
    });
  } catch (error) {
    console.error(`Error in updateStatus for booking ${req.params.id}:`, error);
    res.status(500).json({ error: "Error updating booking status", details: error.message });
  }
});

// POST - Send notification based on status (Admin and Customer Manager)
router.post("/sendNotification/:id", authMiddleware(["Admin", "Customer Manager"]), async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ error: "Booking not found" });

    const { email, vehicleNo, name, bookingDate, bookingTime, serviceType, additionalCost, pendingServices, totalCost, initialPayment, additionalPayment } = booking;
    let subject, text;

    switch (booking.status) {
      case "Ongoing":
        subject = `Service Started on Your Vehicle ${vehicleNo}`;
        text = `Dear ${name},\n\nService has started on your vehicle ${vehicleNo} on ${bookingDate.toISOString().split("T")[0]} at ${bookingTime}.\n\nRegards,\nService Team`;
        break;
      case "OnHold":
        subject = `Additional Services Required for Vehicle ${vehicleNo}`;
        text = `Dear ${name},\n\nWe found additional issues with your vehicle ${vehicleNo}. Please confirm:\n${(pendingServices || []).map(s => `${s.name}: Rs.${s.unitPrice}`).join("\n") || "No additional services specified."}\nTotal Additional Cost: Rs.${additionalCost || 0}\nReply to this email or contact us to approve.\n\nRegards,\nService Team`;
        break;
      case "Complete":
        subject = `Service Completed for Vehicle ${vehicleNo}`;
        text = `Dear ${name},\n\nYour service for vehicle ${vehicleNo} is complete. Please visit the service center to collect your vehicle.\nServices:\n${serviceType.map(s => `${s.name}`).join("\n")}\nTotal Cost: Rs.${totalCost}\nInitial Payment: Rs.${initialPayment}\nAdditional Payment: Rs.${additionalPayment || 0}\n\nRegards,\nService Team`;
        break;
      default:
        return res.status(400).json({ error: "No notification for this status" });
    }

    await transporter.sendMail({
      from: "fixmate@gmail.com",
      to: email,
      subject,
      text,
    });

    res.status(200).json({ message: "Notification sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error sending notification" });
  }
});

// DELETE - Delete a booking (Admin and Customer Manager)
router.delete("/deleteBooking/:id", authMiddleware(["Admin", "Customer Manager"]), async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ error: "Booking not found" });

    await Booking.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error deleting booking" });
  }
});

// GET - Get booked slots for a specific date (Public access)
router.get("/getBookedSlots", async (req, res) => {
  const { date } = req.query;
  try {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const bookings = await Booking.find({
      bookingDate: { $gte: startOfDay, $lte: endOfDay },
      status: { $ne: "Canceled" },
    });

    const bookedSlots = bookings.map((booking) => booking.bookingTime);
    res.json({ bookedSlots });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching booked slots" });
  }
});

// GET - Get customer's own bookings (Customer only)
router.get("/myBookings", authMiddleware(["Customer"]), async (req, res) => {
  try {
    const bookings = await Booking.find({ email: req.userEmail });
    res.status(200).json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching your bookings" });
  }
});

module.exports = router;