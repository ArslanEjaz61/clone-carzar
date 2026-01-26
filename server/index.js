const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Import Routes
const authRoutes = require('./routes/auth');
const carRoutes = require('./routes/cars');
const userRoutes = require('./routes/users');
const partRoutes = require('./routes/parts');
const adminRoutes = require('./routes/admin');
const orderRoutes = require('./routes/orders');

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/users', userRoutes);
app.use('/api/parts', partRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/orders', orderRoutes);

// Root route
app.get('/', (req, res) => {
    res.json({
        message: 'CarZar API Server',
        version: '1.0.0',
        status: 'running',
        endpoints: {
            auth: '/api/auth',
            cars: '/api/cars',
            users: '/api/users'
        }
    });
});

// Health check route
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err.message);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.method} ${req.url} not found`
    });
});

// Database connection and server start
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/carzar';

const startServer = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB');
        console.log(`📊 Database: ${mongoose.connection.name}`);

        // Start server
        app.listen(PORT, () => {
            console.log(`🚀 CarZar API Server running on port ${PORT}`);
            console.log(`📍 http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('❌ MongoDB connection failed:', error.message);
        console.error('CRITICAL: The server requires a database connection to function correctly.');
        process.exit(1); // Exit with error if DB connection fails
    }
};

startServer();

module.exports = app;
