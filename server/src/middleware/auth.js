require('../config/env');
const jwt = require('jsonwebtoken');
const { sendError } = require('../utils/response');

const getJwtSecret = () => process.env.JWT_SECRET || 'supersecretkey';

/**
 * Middleware to authenticate requests using JSON Web Tokens (JWT).
 * Expects "Authorization: Bearer <token>" header.
 */
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];

  if (!authHeader) {
    return sendError(
      res,
      'Authorization header is required.',
      'ERR_UNAUTHORIZED',
      401
    );
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0].toLowerCase() !== 'bearer') {
    return sendError(
      res,
      'Authorization token must follow the Bearer format: Bearer <token>',
      'ERR_UNAUTHORIZED',
      401
    );
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, getJwtSecret());

    // Standardize user entity reference from token
    const userId = decoded.id || decoded.user_id || decoded.sub;
    if (!userId) {
      return sendError(
        res,
        'Token payload is missing user identification.',
        'ERR_INVALID_TOKEN',
        401
      );
    }

    req.user = {
      id: userId,
      email: decoded.email,
      role: decoded.role || 'CITIZEN',
      ...decoded,
    };

    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return sendError(
        res,
        'Authorization token has expired.',
        'ERR_TOKEN_EXPIRED',
        401
      );
    }

    return sendError(
      res,
      'Invalid authorization token.',
      'ERR_INVALID_TOKEN',
      401
    );
  }
}

/**
 * Helper to generate a JWT token for testing and authorization.
 * @param {object} payload
 * @param {string} [expiresIn='24h']
 * @returns {string}
 */
function generateToken(payload, expiresIn = '24h') {
  return jwt.sign(payload, getJwtSecret(), { expiresIn });
}

module.exports = {
  authenticateToken,
  generateToken,
};
