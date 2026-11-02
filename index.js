/**
 * ============================================================================
 * CINESLATE — SHORT FILM & FESTIVAL SCREENING MANAGER
 * Main Server Entry Point
 * File: index.js
 * ============================================================================
 * 
 * VIVA / EVALUATION NOTE:
 * This is the entry point of our backend application.
 * 1. Loads environment variables (.env) via dotenv.
 * 2. Initializes the Express application instance.
 * 3. Applies built-in middlewares (express.json, express.static).
 * 4. Connects to MongoDB Atlas using Mongoose ODM.
 * 5. Mounts RESTful routes (/api/films).
 * 6. Starts the HTTP server on specified PORT.
 */

// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

// Import film routes
const filmRoutes = require('./routes/film.route');

// Initialize Express application
const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

// ============================================================================
// 1. MIDDLEWARE CONFIGURATION
// ============================================================================

// Parse incoming JSON request bodies (req.body)
app.use(express.json());

// Parse incoming URL-encoded form data (extended: true allows rich objects/arrays)
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files (index.html, style.css, assets) from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Simple request logger for terminal debugging during development/viva
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

// ============================================================================
// 2. ROUTE MOUNTING
// ============================================================================

// Mount all film-related CRUD API endpoints under '/api/films'
app.use('/api/films', filmRoutes);

// Health check endpoint for testing server responsiveness
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ONLINE',
    service: 'CineSlate Film & Screening Manager API',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    timestamp: new Date().toISOString()
  });
});

// Fallback 404 handler for unknown API routes
app.use('/api', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint "${req.originalUrl}" does not exist on CineSlate server.`
  });
});

// Global error handler middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: 'Internal server error encountered.',
    error: process.env.NODE_ENV === 'production' ? null : err.message
  });
});

// ============================================================================
// 3. DATABASE CONNECTION & SERVER STARTUP
// ============================================================================

if (!MONGO_URI) {
  console.error('CRITICAL ERROR: MONGO_URI is not defined in your .env file!');
  process.exit(1);
}

// Function to establish connection with MongoDB Atlas
const connectToMongoDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000 // 5 seconds timeout for connection check
    });
    console.log('----------------------------------------------------');
    console.log('✓ MongoDB Atlas Connected Successfully!');
    console.log(`  Database Host: ${mongoose.connection.host}`);
    console.log('----------------------------------------------------');
  } catch (error) {
    console.log('----------------------------------------------------');
    console.warn('⚠️  MongoDB Atlas Connection Notice:', error.message);
    console.log('👉 ACTION REQUIRED IN MONGODB ATLAS:');
    console.log('   1. In MongoDB Atlas > Network Access, click "Add IP Address"');
    console.log('      and choose "Allow Access from Anywhere" (0.0.0.0/0).');
    console.log('   2. In Database Access, verify user "milan25cse_db_user" is created.');
    console.log('   (The server is running with resilient in-memory fallback until Atlas is connected)');
    console.log('----------------------------------------------------');
    
    // Auto-retry connection every 15 seconds in the background
    setTimeout(connectToMongoDB, 15000);
  }
};

// Start HTTP server immediately
app.listen(PORT, () => {
  console.log('====================================================');
  console.log(`🎬 CineSlate Server is running at: http://localhost:${PORT}`);
  console.log(`📡 Film CRUD API Base URL:        http://localhost:${PORT}/api/films`);
  console.log(`🖥️  Frontend Interface:           http://localhost:${PORT}`);
  console.log('====================================================');
  
  // Initiate connection to MongoDB Atlas
  connectToMongoDB();
});

