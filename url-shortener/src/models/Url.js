const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema({
  originalUrl: {
    type: String,
    required: [true, "Original URL is required"],
    trim: true,
  },
  shortCode: {
    type: String,
    required: [true, "Short code is required"],
    unique: true,
    trim: true,
    minlength: 4,
    maxlength: 10,
  },
  customAlias: {
    type: Boolean,
    default: false,
  },
  clicks: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    default: null,
  },
  lastAccessedAt: {
    type: Date,
    default: null,
  },
});

// Index for better query performance
urlSchema.index({ shortCode: 1 });
urlSchema.index({ createdAt: -1 });

// Method to check if URL is expired
urlSchema.methods.isExpired = function () {
  if (!this.expiresAt) return false;
  return new Date() > this.expiresAt;
};

// Method to increment clicks and update last accessed time
urlSchema.methods.incrementClicks = function () {
  this.clicks += 1;
  this.lastAccessedAt = new Date();
  return this.save();
};

module.exports = mongoose.model("Url", urlSchema);
