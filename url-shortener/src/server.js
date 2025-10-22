const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const urlRoutes = require("./routes/url.routes");
const { redirectToOriginal } = require("./controllers/url.controller");
const {
  validateShortCode,
  handleValidationErrors,
} = require("./middleware/validation");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api", urlRoutes);

// Root endpoint for development
if (process.env.NODE_ENV !== "production") {
  app.get("/", (req, res) => {
    res.json({
      message: "URL Shortener API",
      version: "1.0.0",
      endpoints: {
        "POST /api/shorten": "Create a short URL",
        "GET /:shortCode": "Redirect to original URL",
        "GET /api/stats/:shortCode": "Get URL statistics",
      },
    });
  });
}

// GET /:shortCode - Redirect to original URL (must be after /api routes)
app.get(
  "/:shortCode",
  validateShortCode,
  handleValidationErrors,
  redirectToOriginal
);

// Serve static files from React build directory (production only)
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));

  // Catch all handler: send back React's index.html file for client-side routing
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/build", "index.html"));
  });
}

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/urlshortener")
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  });

module.exports = app;
