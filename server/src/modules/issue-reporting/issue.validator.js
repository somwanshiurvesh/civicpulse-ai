const { sendError } = require('../../utils/response');

const ALLOWED_CATEGORIES = [
  'ROAD',
  'WASTE',
  'WATER',
  'DRAINAGE',
  'STREETLIGHT',
  'TRAFFIC',
  'PUBLIC_INFRASTRUCTURE',
  'OTHER',
];

/**
 * Middleware to validate the payload for POST /api/issues.
 */
function validateIssueCreation(req, res, next) {
  const { description, category, subcategory, media_urls } = req.body;
  const latitude = req.body.latitude !== undefined ? req.body.latitude : req.body.lat;
  const longitude = req.body.longitude !== undefined ? req.body.longitude : req.body.lng;

  // Validate description
  if (!description || typeof description !== 'string' || description.trim().length < 10) {
    return sendError(
      res,
      'Validation failed: "description" is required and must be at least 10 characters long.',
      'ERR_VALIDATION',
      400
    );
  }

  // Validate category
  if (!category || typeof category !== 'string' || !ALLOWED_CATEGORIES.includes(category.trim().toUpperCase())) {
    return sendError(
      res,
      `Validation failed: "category" must be one of: ${ALLOWED_CATEGORIES.join(', ')}.`,
      'ERR_VALIDATION',
      400
    );
  }

  // Validate coordinates
  const latNum = parseFloat(latitude);
  const lngNum = parseFloat(longitude);

  if (latitude === undefined || isNaN(latNum) || latNum < -90 || latNum > 90) {
    return sendError(
      res,
      'Validation failed: "latitude" (or "lat") must be a valid numeric latitude between -90 and 90.',
      'ERR_VALIDATION',
      400
    );
  }

  if (longitude === undefined || isNaN(lngNum) || lngNum < -180 || lngNum > 180) {
    return sendError(
      res,
      'Validation failed: "longitude" (or "lng") must be a valid numeric longitude between -180 and 180.',
      'ERR_VALIDATION',
      400
    );
  }

  // Validate subcategory if present
  if (subcategory !== undefined && subcategory !== null && typeof subcategory !== 'string') {
    return sendError(
      res,
      'Validation failed: "subcategory" must be a string.',
      'ERR_VALIDATION',
      400
    );
  }

  // Validate media_urls if present
  if (media_urls !== undefined && media_urls !== null) {
    if (!Array.isArray(media_urls)) {
      return sendError(
        res,
        'Validation failed: "media_urls" must be an array of URL strings.',
        'ERR_VALIDATION',
        400
      );
    }

    for (const url of media_urls) {
      if (typeof url !== 'string' || url.trim().length === 0) {
        return sendError(
          res,
          'Validation failed: each item in "media_urls" must be a non-empty string.',
          'ERR_VALIDATION',
          400
        );
      }
    }
  }

  // Attach normalized values to request for controller/service consumption
  req.validatedIssue = {
    description: description.trim(),
    category: category.trim().toUpperCase(),
    subcategory: subcategory ? subcategory.trim() : null,
    latitude: latNum,
    longitude: lngNum,
    media_urls: Array.isArray(media_urls) ? media_urls.map((u) => u.trim()) : [],
  };

  next();
}

module.exports = {
  ALLOWED_CATEGORIES,
  validateIssueCreation,
};
