const express = require('express');
const cors = require('cors');
require('./config/env');

const { checkHealth } = require('./controllers/health.controller');
const issueRoutes = require('./modules/issue-reporting/issue.routes');
const errorHandler = require('./middleware/errorHandler');
const { sendError, sendSuccess } = require('./utils/response');

const app = express();

// Enable CORS
app.use(cors({
  origin: '*',
}));

app.use(express.json());

// Standard Healthcheck Endpoints (checks Express + PostgreSQL + PostGIS)
app.get('/health', checkHealth);
app.get('/api/health', checkHealth);

// Root endpoint preserving Day 1 behavior
app.get('/', (req, res) => {
  sendSuccess(res, 'Welcome to CivicPulse AI Core API Monolith', {
    documentation: '/docs',
    module: 'Issue Reporting (Owner: Urvesh)',
    status: 'ACTIVE',
  });
});

// Mount Feature Modules
app.use('/api/issues', issueRoutes);

// Catch 404 routes
app.use((req, res) => {
  sendError(
    res,
    `Cannot ${req.method} ${req.originalUrl} - Endpoint not found.`,
    'ERR_NOT_FOUND',
    404
  );
});

// Global Error Handler
app.use(errorHandler);

module.exports = app;
