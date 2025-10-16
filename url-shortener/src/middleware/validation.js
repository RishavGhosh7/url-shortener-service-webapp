const { body, param, validationResult } = require("express-validator");

// Validation rules for URL shortening
const validateUrlShorten = [
  body("originalUrl")
    .isURL({ protocols: ["http", "https"], require_protocol: true })
    .withMessage("Please provide a valid URL with http or https protocol"),
  body("customAlias")
    .optional()
    .isLength({ min: 4, max: 10 })
    .withMessage("Custom alias must be between 4 and 10 characters")
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage(
      "Custom alias can only contain letters, numbers, hyphens, and underscores"
    ),
  body("expiresAt")
    .optional()
    .isISO8601()
    .withMessage("Expiration date must be a valid ISO 8601 date")
    .custom((value) => {
      if (new Date(value) <= new Date()) {
        throw new Error("Expiration date must be in the future");
      }
      return true;
    }),
];

// Validation rules for short code parameter
const validateShortCode = [
  param("shortCode")
    .isLength({ min: 4, max: 10 })
    .withMessage("Short code must be between 4 and 10 characters")
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage(
      "Short code can only contain letters, numbers, hyphens, and underscores"
    ),
];

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: "Validation failed",
      details: errors.array(),
    });
  }
  next();
};

module.exports = {
  validateUrlShorten,
  validateShortCode,
  handleValidationErrors,
};
