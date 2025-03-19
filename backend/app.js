// app.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import inventoryRoutes from "./Route/InventoryRoute.js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Remove all warnings (optional, but good for debugging)
process.removeAllListeners("warning");

// Create Express app and HTTP server
const app = express();
const server = createServer(app);

// Setup Socket.io
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST", "DELETE"],
    },
});

// Middleware
app.use(express.json());
app.use(cors());
app.set("socketio", io);

// API Routes
app.use("/api/inventory", inventoryRoutes);

// MongoDB Connection
mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch((err) => {
        console.error("❌ MongoDB Connection Error:", err);
        process.exit(1); // Stop server if MongoDB fails
    });

// Handle Socket.io Connections
io.on("connection", (socket) => {
    console.log("✅ Client connected:", socket.id);

    socket.on("disconnect", () => {
        console.log("❌ Client disconnected:", socket.id);
    });
});

// Export 'io' and 'server' for use in other files
export { io, server };

// Start Server
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
