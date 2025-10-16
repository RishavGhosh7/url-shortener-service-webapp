const { nanoid } = require("nanoid");
const Url = require("../models/Url");

// Generate a unique short code
const generateShortCode = async (length = 6) => {
  let shortCode;
  let isUnique = false;

  while (!isUnique) {
    shortCode = nanoid(length);
    const existingUrl = await Url.findOne({ shortCode });
    if (!existingUrl) {
      isUnique = true;
    }
  }

  return shortCode;
};

// Create a short URL
const createShortUrl = async (req, res) => {
  try {
    const { originalUrl, customAlias, expiresAt } = req.body;

    // Check if custom alias is provided and if it's unique
    if (customAlias) {
      const existingUrl = await Url.findOne({ shortCode: customAlias });
      if (existingUrl) {
        return res.status(409).json({
          error: "Custom alias already exists",
          message: "Please choose a different custom alias",
        });
      }
    }

    // Generate short code
    const shortCode = customAlias || (await generateShortCode());

    // Create new URL document
    const urlData = {
      originalUrl,
      shortCode,
      customAlias: !!customAlias,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
    };

    const url = new Url(urlData);
    await url.save();

    // Return the shortened URL
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const shortUrl = `${baseUrl}/${shortCode}`;

    res.status(201).json({
      success: true,
      data: {
        originalUrl: url.originalUrl,
        shortUrl,
        shortCode: url.shortCode,
        customAlias: url.customAlias,
        expiresAt: url.expiresAt,
        createdAt: url.createdAt,
      },
    });
  } catch (error) {
    console.error("Error creating short URL:", error);
    res.status(500).json({
      error: "Failed to create short URL",
      message: error.message,
    });
  }
};

// Redirect to original URL
const redirectToOriginal = async (req, res) => {
  try {
    const { shortCode } = req.params;

    // Find URL by short code
    const url = await Url.findOne({ shortCode });

    if (!url) {
      return res.status(404).json({
        error: "Short URL not found",
        message: "The requested short URL does not exist",
      });
    }

    // Check if URL is expired
    if (url.isExpired()) {
      return res.status(410).json({
        error: "Short URL expired",
        message: "This short URL has expired and is no longer available",
      });
    }

    // Increment click count and update last accessed time
    await url.incrementClicks();

    // Redirect to original URL
    res.redirect(301, url.originalUrl);
  } catch (error) {
    console.error("Error redirecting:", error);
    res.status(500).json({
      error: "Failed to redirect",
      message: error.message,
    });
  }
};

// Get URL statistics
const getUrlStats = async (req, res) => {
  try {
    const { shortCode } = req.params;

    // Find URL by short code
    const url = await Url.findOne({ shortCode });

    if (!url) {
      return res.status(404).json({
        error: "Short URL not found",
        message: "The requested short URL does not exist",
      });
    }

    // Return statistics
    res.json({
      success: true,
      data: {
        originalUrl: url.originalUrl,
        shortCode: url.shortCode,
        customAlias: url.customAlias,
        clicks: url.clicks,
        createdAt: url.createdAt,
        lastAccessedAt: url.lastAccessedAt,
        expiresAt: url.expiresAt,
        isExpired: url.isExpired(),
      },
    });
  } catch (error) {
    console.error("Error getting URL stats:", error);
    res.status(500).json({
      error: "Failed to get URL statistics",
      message: error.message,
    });
  }
};

// Delete short URL (optional feature)
const deleteShortUrl = async (req, res) => {
  try {
    const { shortCode } = req.params;

    // Find and delete URL by short code
    const url = await Url.findOneAndDelete({ shortCode });

    if (!url) {
      return res.status(404).json({
        error: "Short URL not found",
        message: "The requested short URL does not exist",
      });
    }

    res.json({
      success: true,
      message: "Short URL deleted successfully",
      data: {
        shortCode: url.shortCode,
        originalUrl: url.originalUrl,
      },
    });
  } catch (error) {
    console.error("Error deleting short URL:", error);
    res.status(500).json({
      error: "Failed to delete short URL",
      message: error.message,
    });
  }
};

module.exports = {
  createShortUrl,
  redirectToOriginal,
  getUrlStats,
  deleteShortUrl,
};
