/**
 * TravelWise Backend Server
 * Simple, beginner-friendly Express.js server providing API endpoints
 * for the TravelWise frontend application.
 */

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*', // Allow all origins in development (Vite runs on http://localhost:5173)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Beginner-friendly request logger
app.use((req, res, next) => {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
});

/**
 * GET /api/health
 * Simple health-check endpoint to verify that the backend server is running.
 */
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'TravelWise backend server is running successfully',
    timestamp: new Date().toISOString(),
    port: PORT
  });
});

/**
 * GET /api/app-config
 * Returns application branding, taglines, and initial configuration
 * for the TravelWise frontend.
 */
app.get('/api/app-config', (req, res) => {
  res.status(200).json({
    appName: 'TravelWise',
    tagline: 'Plan · Book · Explore',
    heading: 'Your Next Adventure Starts Here',
    description: 'Find the best hotels, transport options and plan your perfect trip — all in one place.',
    version: '1.0.0',
    status: 'online'
  });
});

/**
 * 404 Handler for undefined API routes
 */
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl,
    message: 'The requested API endpoint does not exist on this server.'
  });
});

/**
 * Central Error Handler
 */
app.use((err, req, res, next) => {
  console.error('Unexpected server error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: 'An unexpected error occurred on the TravelWise server.'
  });
});

// Start the server
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`===============================================`);
    console.log(`✈️  TravelWise Backend Server is running!`);
    console.log(`📡 URL: http://localhost:${PORT}`);
    console.log(`🩺 Health check: http://localhost:${PORT}/api/health`);
    console.log(`⚙️  App Config:   http://localhost:${PORT}/api/app-config`);
    console.log(`===============================================`);
  });
}

module.exports = app;
