require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database Connection
const mongoURI = process.env.MONGODB_URI || 
  `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_CLUSTER}/${process.env.MONGO_DB}?retryWrites=true&w=majority`;

const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('✓ MongoDB connected');
    return true;
  } catch (err) {
    console.error('✗ MongoDB connection error:', err.message);
    console.log('⏳ Retrying connection in 5 seconds...');
    // Retry connection after 5 seconds
    await new Promise(resolve => setTimeout(resolve, 5000));
    return connectDB(); // Recursive retry
  }
};

// MongoDB connection event listeners
mongoose.connection.on('disconnected', () => {
  console.log('⚠️ MongoDB disconnected. Attempting to reconnect...');
  setTimeout(connectDB, 5000);
});

mongoose.connection.on('connected', () => {
  console.log('✓ MongoDB connected and ready');
});

mongoose.connection.on('error', (err) => {
  console.error('✗ MongoDB error:', err.message);
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/menu', require('./routes/menu'));
app.use('/api/staff', require('./routes/staff'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/bookings', require('./routes/bookings'));
// Contact route - Support form submissions and admin inbox
app.use('/api/contact', require('./routes/contact'));

// Health check - for Render keep-alive and monitoring
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState;
  const healthCheck = {
    status: 'running',
    timestamp: new Date().toISOString(),
    database: dbStatus === 1 ? 'connected' : 'disconnected',
    uptime: process.uptime()
  };
  res.json(healthCheck);
});

app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global Error Handler (must have 4 parameters: err, req, res, next)
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  const status = err.status || 500;
  const message = err.message || 'Internal server error';
  res.status(status).json({
    message: message,
    error: process.env.NODE_ENV === 'production' ? {} : err
  });
});

const PORT = process.env.PORT || 5000;

// Start server only after DB connects
const startServer = async () => {
  try {
    await connectDB();
    console.log('✓ Database connection established');
    
    app.listen(PORT, () => {
      console.log(`✓ Server running on http://localhost:${PORT}`);
      console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('✗ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();

module.exports = app;
