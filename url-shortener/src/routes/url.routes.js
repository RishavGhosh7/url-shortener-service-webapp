const express = require("express");
const router = express.Router();
const {
  createShortUrl,
  redirectToOriginal,
  getUrlStats,
  deleteShortUrl,
} = require("../controllers/url.controller");
const {
  validateUrlShorten,
  validateShortCode,
  handleValidationErrors,
} = require("../middleware/validation");

// POST /api/shorten - Create a short URL
router.post(
  "/shorten",
  validateUrlShorten,
  handleValidationErrors,
  createShortUrl
);

// GET /api/stats/:shortCode - Get URL statistics
router.get(
  "/stats/:shortCode",
  validateShortCode,
  handleValidationErrors,
  getUrlStats
);

// DELETE /api/url/:shortCode - Delete short URL (optional)
router.delete(
  "/url/:shortCode",
  validateShortCode,
  handleValidationErrors,
  deleteShortUrl
);

// GET /:shortCode - Redirect to original URL (handled in main server.js)
// This route is defined in server.js to catch all short code patterns

module.exports = router;
