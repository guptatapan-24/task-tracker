const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const connectDB = require('./config/db');
const taskRoutes = require('./routes/taskRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// Security & parsing middleware
app.use(helmet());

// CORS — supports comma-separated origins in CLIENT_ORIGIN for flexibility
const allowedOrigins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim().replace(/\/$/, '')); // Remove trailing slashes

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. mobile apps, curl, health checks)
    if (!origin) {
      return callback(null, true);
    }
    
    const cleanedOrigin = origin.trim().replace(/\/$/, '');
    if (allowedOrigins.includes(cleanedOrigin)) {
      callback(null, true);
    } else {
      // Log rejected origin to server logs for debugging
      console.warn(`[CORS Blocked] Origin: ${origin}. Allowed: ${allowedOrigins.join(', ')}`);
      callback(null, false);
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
}));

app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/tasks', taskRoutes);

// Centralized error handling — must be after routes
app.use(errorHandler);

// Connect to DB then start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

module.exports = app;

