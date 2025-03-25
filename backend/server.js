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

// Import routes
const itemRoutes = require('./routes/items');
const orderRoutes = require('./routes/orders');
const stockTransactionRoutes = require('./routes/stock_transactions');
const supplierRoutes = require('./routes/suppliers');
const bookingRoutes = require('./routes/bookingRoutes')
const pettycashRoutes = require('./routes/pettycash');
<<<<<<< HEAD
const authRoutes = require('./routes/authRoutes');
=======
// const registercRoutes = require('./routes/registercRoutes')
// const authRoutes = require('./routes/authRoutes');
>>>>>>> 39e123e9e1bd334e9707ad3fb72cb8d133b72347
const inventoryR = require('./routes/inventoryR');
//const serviceRoutes = require('./routes/serviceRoutes');

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
<<<<<<< HEAD
=======
// app.use('/api/register', registercRoutes);
>>>>>>> 39e123e9e1bd334e9707ad3fb72cb8d133b72347
app.use('/api/pettycash', pettycashRoutes);
// app.use('/api/auth', authRoutes);
//app.use('api/service', serviceRoutes);

//app.use('/api', paymentRoutes);	
app.use("/inventory", inventoryR);

// Start server
app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});