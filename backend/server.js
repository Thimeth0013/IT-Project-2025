// // Import routes
// const itemRoutes = require('./routes/items');
// const orderRoutes = require('./routes/orders');
// const stockTransactionRoutes = require('./routes/stock_transactions');
// const supplierRoutes = require('./routes/suppliers');
// const bookingtRouter = require('./routes/bookingRoutes');

// const pettycashRoutes = require('./routes/pettycash');
// const bookingtRoutes = require('./routes/bookingRoutes')
// const authRoutes = require('./routes/authRoutes');
// const inventoryR = require('./routes/inventoryR');

// const app = express();
// const server = createServer(app);
// const PORT = process.env.PORT || 8000;

// app.use(cors());
// app.use(express.json());

// // API Routes
// app.use("/api/inventory", inventoryR);

// // Routes
// app.use('/api/items', itemRoutes);
// app.use('/api/orders', orderRoutes);
// app.use('/api/stock_transactions', stockTransactionRoutes);
// app.use('/api/suppliers', supplierRoutes);
// app.use('/api/pettycash', pettycashRoutes);
// app.use('/api/booking', bookingtRoutes);

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const path = require("path");

// Import routes
const itemRoutes = require('./routes/items');
const orderRoutes = require('./routes/orders');
const stockTransactionRoutes = require('./routes/stock_transactions');
const supplierRoutes = require('./routes/suppliers');
const bookingRoutes = require('./routes/bookingRoutes')
const pettycashRoutes = require('./routes/pettycash');
const authRoutes = require('./routes/authRoutes');
const inventoryR = require('./routes/inventoryR');

const staffRoutes = require('./routes/staffs');  
const salaryRoutes = require('./routes/salaries'); 
const scheduleRoutes = require('./routes/schedules'); 

const serviceRoutes = require('./routes/serviceRoutes');
const paymentRoutes = require('./routes/payment');

const app = express();
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
app.use('/api/booking', bookingRoutes);
app.use('/api/pettycash', pettycashRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/service', serviceRoutes);
// Serve static files from the uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use('/api', paymentRoutes);	
app.use("/api/inventory", inventoryR);

// Start server
app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});