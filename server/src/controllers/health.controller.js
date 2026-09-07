const { testDbConnection } = require('../config/db');
const { sendSuccess, sendError } = require('../utils/response');

/**
 * Health check endpoint verifying backend and database connectivity.
 */
async function checkHealth(req, res) {
  const dbHealth = await testDbConnection();

  if (!dbHealth.healthy) {
    return sendError(
      res,
      `Backend is running, but database connectivity failed: ${dbHealth.error}`,
      'ERR_DB_UNAVAILABLE',
      503
    );
  }

  return sendSuccess(
    res,
    'Core API server and database are healthy.',
    {
      status: 'UP',
      database: 'CONNECTED',
      postgis: dbHealth.postgisVersion,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    },
    200
  );
}

module.exports = {
  checkHealth,
};
