/**
 * Standard API Response Wrappers for CivicPulse AI.
 * Adheres strictly to API_CONTRACT.md and CivicPulse_AI_Standards.pdf.
 */

/**
 * Send standard HTTP success response.
 * @param {import('express').Response} res
 * @param {string} message - Descriptive success message
 * @param {object} [data={}] - Response payload
 * @param {number} [statusCode=200] - HTTP status code
 */
function sendSuccess(res, message, data = {}, statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
}

/**
 * Send standard HTTP error response.
 * @param {import('express').Response} res
 * @param {string} message - Human-readable error explanation
 * @param {string} errorCode - Machine-readable error code (e.g. ERR_UNAUTHORIZED, ERR_VALIDATION)
 * @param {number} [statusCode=500] - HTTP status code
 */
function sendError(res, message, errorCode = 'ERR_INTERNAL_SERVER', statusCode = 500) {
  return res.status(statusCode).json({
    success: false,
    message,
    error_code: errorCode,
  });
}

module.exports = {
  sendSuccess,
  sendError,
};
