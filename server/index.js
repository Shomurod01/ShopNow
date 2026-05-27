const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');

// routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const cartRoutes = require('./routes/cart');
const paymentRoutes = require('./routes/payment');
const adminRoutes = require('./routes/admin');

// connect to database
connectDB();

const app = express();

// security headers
app.use(helmet());

// rate limiting - only in production
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  skip: function () {
    return process.env.NODE_ENV !== 'production';
  },
  message: { success: false, message: 'Too many requests, please try again later.' },
});
app.use('/api', limiter);

// allow requests from the frontend
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));

// body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// prevent mongo injection attacks
app.use(mongoSanitize());

// serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// register all routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/admin', adminRoutes);

// simple health check endpoint
app.get('/api/health', function (req, res) {
  res.json({ success: true, message: 'Server is running' });
});

// global error handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, function () {
  console.log('Server running on port ' + PORT);
});
