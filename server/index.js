const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend integration
app.use(cors({
  origin: '*'
}));

app.use(express.json());

// Standard healthcheck endpoint adhering to the team's API contract wrapper
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Core API server is running and healthy.',
    data: {
      status: 'UP',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    }
  });
});

// Root endpoint introducing the server
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to CivicPulse AI Core API Monolith',
    data: {
      documentation: '/docs',
      module: 'Issue Reporting (Owner: Urvesh)'
    }
  });
});

// Global error handler adhering to the standard error JSON format
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'An unexpected internal server error occurred.',
    error_code: 'ERR_INTERNAL_SERVER'
  });
});

app.listen(PORT, () => {
  console.log(`[CivicPulse API] Core Server is running on port ${PORT}`);
});
