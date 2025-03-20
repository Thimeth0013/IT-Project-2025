const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const { createServer } = require("http");
const { Server } = require("socket.io");

// Import routes
const itemRoutes = require('./routes/items');
const orderRoutes = require('./routes/orders');
const stockTransactionRoutes = require('./routes/stock_transactions');
const supplierRoutes = require('./routes/suppliers');
//const serviceRoutes = require('./routes/serviceRoutes');
//const bookingtRouter = require('./routes/bookingRoutes');

const pettycashRoutes = require('./routes/pettycash');
const bookingRoutes = require('./routes/bookingRoutes')
const authRoutes = require('./routes/authRoutes');
const inventoryR = require('./routes/inventoryR');

const app = express(); 
const server = createServer(app);

// Create Socket.io instance
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "DELETE"],
  },
});

// Set io in app for use in routes
app.set("socketio", io);

const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));
  
// Welcome route
app.get('/', (req, res) => {
    res.send('Hello from Express!');
});

// Routes
app.use('/api/items', itemRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/stock_transactions', stockTransactionRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/pettycash', pettycashRoutes);
app.use('/api/booking', bookingRoutes);
app.use('/api/auth', authRoutes);
//app.use('api/service', serviceRoutes);
app.use("/api/inventory", inventoryR);
 
io.on("connection", (socket) => {
    console.log("✅ Client connected:", socket.id);

    socket.on("disconnect", () => {
        console.log("❌ Client disconnected:", socket.id);
    });
});

// Start server
server.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});

// Export 'io' and 'server' for use in other files
module.exports = {io, server};