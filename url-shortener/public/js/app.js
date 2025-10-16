// URL Shortener Frontend JavaScript
class URLShortener {
  constructor() {
    this.apiBaseUrl = "http://localhost:3000/api";
    this.currentShortCode = null;
    this.initializeEventListeners();
  }

  initializeEventListeners() {
    // Form submission
    document.getElementById("shortenForm").addEventListener("submit", (e) => {
      e.preventDefault();
      this.handleShortenUrl();
    });

    // Copy button
    document.getElementById("copyBtn").addEventListener("click", () => {
      this.copyToClipboard();
    });

    // View stats button
    document.getElementById("viewStatsBtn").addEventListener("click", () => {
      this.showAnalytics();
    });

    // Shorten another button
    document
      .getElementById("shortenAnotherBtn")
      .addEventListener("click", () => {
        this.resetForm();
      });

    // Refresh stats button
    document.getElementById("refreshStatsBtn").addEventListener("click", () => {
      this.loadAnalytics();
    });

    // Back to results button
    document
      .getElementById("backToResultsBtn")
      .addEventListener("click", () => {
        this.showResults();
      });
  }

  async handleShortenUrl() {
    const form = document.getElementById("shortenForm");
    const formData = new FormData(form);

    const data = {
      originalUrl: formData.get("originalUrl"),
      customAlias: formData.get("customAlias") || undefined,
      expiresAt: formData.get("expiresAt") || undefined,
    };

    // Validate URL
    if (!this.isValidUrl(data.originalUrl)) {
      this.showError(
        "Please enter a valid URL starting with http:// or https://"
      );
      return;
    }

    // Show loading state
    this.showLoading(true);

    try {
      const response = await fetch(`${this.apiBaseUrl}/shorten`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        this.currentShortCode = result.data.shortCode;
        this.displayResults(result.data);
        this.hideMessages();
      } else {
        this.showError(
          result.message || result.error || "Failed to shorten URL"
        );
      }
    } catch (error) {
      console.error("Error:", error);
      this.showError("Network error. Please check if the server is running.");
    } finally {
      this.showLoading(false);
    }
  }

  displayResults(data) {
    // Populate result fields
    document.getElementById("shortUrl").value = data.shortUrl;
    document.getElementById("originalUrlDisplay").textContent =
      data.originalUrl;
    document.getElementById("shortCodeDisplay").textContent = data.shortCode;
    document.getElementById("createdAtDisplay").textContent = this.formatDate(
      data.createdAt
    );

    // Show expiration if exists
    if (data.expiresAt) {
      document.getElementById("expiresAtItem").style.display = "block";
      document.getElementById("expiresAtDisplay").textContent = this.formatDate(
        data.expiresAt
      );
    } else {
      document.getElementById("expiresAtItem").style.display = "none";
    }

    // Show results section
    document.getElementById("resultsSection").style.display = "block";
    document.getElementById("analyticsSection").style.display = "none";

    // Scroll to results
    document.getElementById("resultsSection").scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  async showAnalytics() {
    if (!this.currentShortCode) return;

    this.showLoading(true);
    await this.loadAnalytics();
    this.showLoading(false);
  }

  async loadAnalytics() {
    if (!this.currentShortCode) return;

    try {
      const response = await fetch(
        `${this.apiBaseUrl}/stats/${this.currentShortCode}`
      );
      const result = await response.json();

      if (response.ok) {
        this.displayAnalytics(result.data);
        document.getElementById("analyticsSection").style.display = "block";
        document.getElementById("resultsSection").style.display = "none";

        // Scroll to analytics
        document.getElementById("analyticsSection").scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      } else {
        this.showError(
          result.message || result.error || "Failed to load analytics"
        );
      }
    } catch (error) {
      console.error("Error:", error);
      this.showError("Network error. Please check if the server is running.");
    }
  }

  displayAnalytics(data) {
    document.getElementById("clickCount").textContent = data.clicks || 0;
    document.getElementById("createdDate").textContent = this.formatDate(
      data.createdAt
    );
    document.getElementById("lastAccessed").textContent = data.lastAccessedAt
      ? this.formatDate(data.lastAccessedAt)
      : "Never";

    const statusElement = document.getElementById("expirationStatus");
    if (data.isExpired) {
      statusElement.textContent = "Expired";
      statusElement.style.color = "#e74c3c";
    } else if (data.expiresAt) {
      statusElement.textContent =
        "Active (Expires: " + this.formatDate(data.expiresAt) + ")";
      statusElement.style.color = "#f39c12";
    } else {
      statusElement.textContent = "Active (No expiration)";
      statusElement.style.color = "#28a745";
    }
  }

  showResults() {
    document.getElementById("resultsSection").style.display = "block";
    document.getElementById("analyticsSection").style.display = "none";
  }

  resetForm() {
    document.getElementById("shortenForm").reset();
    document.getElementById("resultsSection").style.display = "none";
    document.getElementById("analyticsSection").style.display = "none";
    this.hideMessages();
    this.currentShortCode = null;

    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async copyToClipboard() {
    const shortUrlInput = document.getElementById("shortUrl");
    const copyBtn = document.getElementById("copyBtn");

    try {
      await navigator.clipboard.writeText(shortUrlInput.value);

      // Update button text temporarily
      const originalText = copyBtn.innerHTML;
      copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
      copyBtn.style.background = "#28a745";

      setTimeout(() => {
        copyBtn.innerHTML = originalText;
        copyBtn.style.background = "";
      }, 2000);

      this.showSuccess("URL copied to clipboard!");
    } catch (error) {
      console.error("Failed to copy:", error);
      this.showError("Failed to copy URL. Please copy manually.");
    }
  }

  showLoading(show) {
    const submitBtn = document.querySelector(
      '#shortenForm button[type="submit"]'
    );
    if (show) {
      submitBtn.innerHTML = '<div class="loading"></div> Shortening...';
      submitBtn.disabled = true;
    } else {
      submitBtn.innerHTML = '<i class="fas fa-compress-alt"></i> Shorten URL';
      submitBtn.disabled = false;
    }
  }

  showError(message) {
    const errorElement = document.getElementById("errorMessage");
    const errorText = document.getElementById("errorText");
    errorText.textContent = message;
    errorElement.style.display = "flex";

    // Hide success message if visible
    document.getElementById("successMessage").style.display = "none";

    // Auto-hide after 5 seconds
    setTimeout(() => {
      errorElement.style.display = "none";
    }, 5000);
  }

  showSuccess(message) {
    const successElement = document.getElementById("successMessage");
    const successText = document.getElementById("successText");
    successText.textContent = message;
    successElement.style.display = "flex";

    // Hide error message if visible
    document.getElementById("errorMessage").style.display = "none";

    // Auto-hide after 3 seconds
    setTimeout(() => {
      successElement.style.display = "none";
    }, 3000);
  }

  hideMessages() {
    document.getElementById("errorMessage").style.display = "none";
    document.getElementById("successMessage").style.display = "none";
  }

  isValidUrl(string) {
    try {
      const url = new URL(string);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch (_) {
      return false;
    }
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }
}

// Initialize the application when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new URLShortener();
});

// Add some utility functions for better UX
document.addEventListener("DOMContentLoaded", () => {
  // Auto-focus on URL input
  const urlInput = document.getElementById("originalUrl");
  if (urlInput) {
    urlInput.focus();
  }

  // Set minimum date for expiration to today
  const expiresInput = document.getElementById("expiresAt");
  if (expiresInput) {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    expiresInput.min = tomorrow.toISOString().slice(0, 16);
  }

  // Add input validation feedback
  const inputs = document.querySelectorAll("input[required]");
  inputs.forEach((input) => {
    input.addEventListener("blur", () => {
      if (input.checkValidity()) {
        input.style.borderColor = "#28a745";
      } else {
        input.style.borderColor = "#e74c3c";
      }
    });
  });
});
