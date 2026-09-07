const { sendError } = require('../utils/response');

/**
 * Central Express error-handling middleware.
 * Formats all unhandled errors into the CivicPulse AI standard error envelope.
 */
function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  console.error('[Error Handler]', err);

  const statusCode = err.statusCode || err.status || 500;
  const errorCode = err.errorCode || err.code || 'ERR_INTERNAL_SERVER';
  const message = err.message || 'An unexpected internal server error occurred.';

  return sendError(res, message, errorCode, statusCode);
}

module.exports = errorHandler;
