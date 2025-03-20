
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Import routes
const itemRoutes = require('./routes/items');
const orderRoutes = require('./routes/orders');
const stockTransactionRoutes = require('./routes/stock_transactions');
const supplierRoutes = require('./routes/suppliers');
const bookingtRouter = require('./routes/bookingRoutes')
const registercRouter = require('./routes/registercRoutes');
const pettycashRoutes = require('./routes/pettycash');
const paymentRoutes = require('./routes/payment');
//const authRoutes = require('./routes/authRoutes');
const inventoryR = require('./routes/inventoryR');

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
app.use('/api/booking', bookingtRouter);
app.use('/api/registerc', registercRouter);
app.use('/api/pettycash', pettycashRoutes);
//app.use('/api/booking', bookingtRoutes);
app.use('/api', paymentRoutes);	
app.use("/inventory", inventoryR);

// Start server
app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});