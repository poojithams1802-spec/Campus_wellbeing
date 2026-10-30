
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const counsellingRoutes = require('./routes/counsellingRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for local development and deployed frontend
const allowedOrigins = [
  'https://main.d2u7xyw5yab9fb.amplifyapp.com',
  'https://campus-wellbeing-1kr4.vercel.app',
  'https://campus-wellbeing.vercel.app',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  process.env.FRONTEND_URL,
  process.env.CLIENT_URL
]
  .filter(Boolean)
  .map((origin) => origin.trim().replace(/\/+$/, ''));

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests without an Origin header
    // (curl, server-to-server requests, etc.)
    if (!origin) {
      return callback(null, true);
    }

    const normalizedOrigin = origin.trim().replace(/\/+$/, '');

    if (
      allowedOrigins.includes(normalizedOrigin) ||
      normalizedOrigin.endsWith('.vercel.app') ||
      process.env.NODE_ENV !== 'production'
    ) {
      return callback(null, true);
    }

    return callback(
      new Error(`CORS policy: Origin ${origin} not allowed`)
    );
  },

  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],

  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin'
  ],

  credentials: true,
  optionsSuccessStatus: 200
};

// Apply CORS before routes and other middleware.
// The cors middleware also handles OPTIONS preflight requests.
app.use(cors(corsOptions));

// Parse incoming JSON requests
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api', authRoutes);
app.use('/api', counsellingRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'College ERP Counselling backend is running successfully.'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API route not found: ${req.method} ${req.originalUrl}`
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
