// backend/routes/serviceRoutes.js
const express = require("express");
const Service = require("../models/Service");
const Inventory = require("../models/inventorym");
const multer = require("multer");
const path = require("path");

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Store files in the uploads/ directory
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // e.g., 123456789-image.jpg
  },
});

const fileFilter = (req, file, cb) => {
  // Accept only image files
  const filetypes = /jpeg|jpg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error("Only image files (jpeg, jpg, png) are allowed!"));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 3 * 1024 * 1024 }, // Limit file size to 3MB
});

// Serve uploaded images statically
router.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Create a new service (Public access)
router.post("/create", upload.single("image"), async (req, res) => {
  try {
    const { name, description, items, unitPrice } = req.body;

    // Validate input
    if (!name || !description || !items || !unitPrice) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Parse items if sent as a JSON string (common when using multipart/form-data)
    let parsedItems;
    try {
      parsedItems = typeof items === "string" ? JSON.parse(items) : items;
    } catch (error) {
      return res.status(400).json({ message: "Invalid items format" });
    }

    // Validate items structure
    if (!Array.isArray(parsedItems) || parsedItems.length === 0) {
      return res.status(400).json({ message: "Items must be a non-empty array" });
    }

    for (const item of parsedItems) {
      if (!item.itemId || !item.quantities) {
        return res.status(400).json({ message: "Each item must have itemId and quantities" });
      }

      // Validate itemId exists in Inventory
      const inventoryItem = await Inventory.findById(item.itemId);
      if (!inventoryItem) {
        return res.status(400).json({ message: `Inventory item with ID ${item.itemId} not found` });
      }

      const validVehicleTypes = ["bike", "scooter", "car", "van", "suv", "cab", "bus", "truck"];
      for (const vehicleType of validVehicleTypes) {
        if (typeof item.quantities[vehicleType] !== "number" || item.quantities[vehicleType] < 0) {
          return res.status(400).json({ message: `Invalid quantity for ${vehicleType}` });
        }
      }
    }

    // Create a new service
    const newService = new Service({
      name,
      description,
      items: parsedItems,
      unitPrice,
      image: req.file ? `/uploads/${req.file.filename}` : undefined, // Store the image path
      isActive: true,
    });

    await newService.save();

    res.status(201).json({ message: "Service created successfully", service: newService });
  } catch (error) {
    console.error("Error creating service:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get all services (Public access for customer website)
router.get("/getAllServices", async (req, res) => {
  try {
    const services = await Service.find({ isActive: true }).populate("items.itemId");
    const formattedServices = services.map(service => ({
      ...service._doc,
      items: service.items.map(item => ({
        ...item._doc,
        itemName: item.itemId.itemName,
        itemId: item.itemId._id,
      })),
    }));
    res.status(200).json(formattedServices);
  } catch (error) {
    console.error("Error fetching services:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get a single service by ID (Public access)
router.get("/getService/:id", async (req, res) => {
  try {
    const service = await Service.findById(req.params.id).populate("items.itemId");
    if (!service || !service.isActive) {
      return res.status(404).json({ message: "Service not found" });
    }
    const formattedService = {
      ...service._doc,
      items: service.items.map(item => ({
        ...item._doc,
        itemName: item.itemId.itemName,
        itemId: item.itemId._id,
      })),
    };
    res.status(200).json(formattedService);
  } catch (error) {
    console.error("Error fetching service:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Update a service (Public access)
router.put("/update/:id", upload.single("image"), async (req, res) => {
  try {
    const { name, description, items, unitPrice, isActive } = req.body;

    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    // Parse items if sent as a JSON string
    let parsedItems;
    if (items) {
      try {
        parsedItems = typeof items === "string" ? JSON.parse(items) : items;
      } catch (error) {
        return res.status(400).json({ message: "Invalid items format" });
      }

      if (!Array.isArray(parsedItems) || parsedItems.length === 0) {
        return res.status(400).json({ message: "Items must be a non-empty array" });
      }

      for (const item of parsedItems) {
        if (!item.itemId || !item.quantities) {
          return res.status(400).json({ message: "Each item must have itemId and quantities" });
        }
        const inventoryItem = await Inventory.findById(item.itemId);
        if (!inventoryItem) {
          return res.status(400).json({ message: `Inventory item with ID ${item.itemId} not found` });
        }
        const validVehicleTypes = ["bike", "scooter", "car", "van", "suv", "cab", "bus", "truck"];
        for (const vehicleType of validVehicleTypes) {
          if (typeof item.quantities[vehicleType] !== "number" || item.quantities[vehicleType] < 0) {
            return res.status(400).json({ message: `Invalid quantity for ${vehicleType}` });
          }
        }
      }
      service.items = parsedItems;
    }

    service.name = name || service.name;
    service.description = description || service.description;
    service.unitPrice = unitPrice || service.unitPrice;
    service.isActive = isActive !== undefined ? isActive : service.isActive;
    if (req.file) {
      service.image = `/uploads/${req.file.filename}`; // Update image path if a new image is uploaded
    }

    await service.save();

    const updatedService = await Service.findById(req.params.id).populate("items.itemId");
    const formattedService = {
      ...updatedService._doc,
      items: updatedService.items.map(item => ({
        ...item._doc,
        itemName: item.itemId.itemName,
        itemId: item.itemId._id,
      })),
    };

    res.status(200).json({ message: "Service updated successfully", service: formattedService });
  } catch (error) {
    console.error("Error updating service:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Delete a service (soft delete) (Public access)
router.delete("/delete/:id", async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    service.isActive = false;
    await service.save();

    res.status(200).json({ message: "Service deleted successfully" });
  } catch (error) {
    console.error("Error deleting service:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;