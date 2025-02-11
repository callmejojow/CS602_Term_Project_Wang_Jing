require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const passport = require('./config/passport');

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(passport.initialize());

// Connect to MongoDB
connectDB();

// Routes
app.get('/', (req, res) => {
  res.send('API is running...');
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes); 
app.use('/api/orders', orderRoutes); 

// Start Server
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));