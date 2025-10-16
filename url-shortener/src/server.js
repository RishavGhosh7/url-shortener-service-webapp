const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
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

// Serve static files from public directory
app.use(express.static("public"));

// Routes
app.use("/api", urlRoutes);

// GET /:shortCode - Redirect to original URL
app.get(
  "/:shortCode",
  validateShortCode,
  handleValidationErrors,
  redirectToOriginal
);

// Root endpoint
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

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

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
