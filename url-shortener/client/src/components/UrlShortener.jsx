import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Results from "./Results";
import Message from "./Message";

const UrlShortener = () => {
  const [formData, setFormData] = useState({
    originalUrl: "",
    customAlias: "",
    expiresAt: "",
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const navigate = useNavigate();
  const apiBaseUrl =
    process.env.REACT_APP_API_URL || "http://localhost:3000/api";

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const isValidUrl = (string) => {
    try {
      const url = new URL(string);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValidUrl(formData.originalUrl)) {
      setError("Please enter a valid URL starting with http:// or https://");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const data = {
        originalUrl: formData.originalUrl,
        customAlias: formData.customAlias || undefined,
        expiresAt: formData.expiresAt || undefined,
      };

      const response = await axios.post(`${apiBaseUrl}/shorten`, data);

      if (response.data.success) {
        setResult(response.data.data);
        setSuccess("URL shortened successfully!");
      } else {
        setError(
          response.data.message ||
            response.data.error ||
            "Failed to shorten URL"
        );
      }
    } catch (error) {
      console.error("Error:", error);
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Network error. Please check if the server is running.");
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      originalUrl: "",
      customAlias: "",
      expiresAt: "",
    });
    setResult(null);
    setError(null);
    setSuccess(null);
  };

  const handleViewAnalytics = () => {
    if (result) {
      navigate(`/analytics/${result.shortCode}`);
    }
  };

  return (
    <>
      {/* URL Shortening Form */}
      <section className="shorten-section">
        <div className="form-container">
          <h2>Shorten Your URL</h2>
          <form onSubmit={handleSubmit} className="shorten-form">
            <div className="input-group">
              <label htmlFor="originalUrl">Enter your long URL:</label>
              <input
                type="url"
                id="originalUrl"
                name="originalUrl"
                value={formData.originalUrl}
                onChange={handleInputChange}
                placeholder="https://www.example.com/very/long/url/path"
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="customAlias">Custom alias (optional):</label>
              <input
                type="text"
                id="customAlias"
                name="customAlias"
                value={formData.customAlias}
                onChange={handleInputChange}
                placeholder="my-custom-link"
                pattern="[a-zA-Z0-9_-]{4,10}"
                title="4-10 characters, letters, numbers, hyphens, and underscores only"
              />
            </div>

            <div className="input-group">
              <label htmlFor="expiresAt">Expiration date (optional):</label>
              <input
                type="datetime-local"
                id="expiresAt"
                name="expiresAt"
                value={formData.expiresAt}
                onChange={handleInputChange}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="loading"></div>
                  Shortening...
                </>
              ) : (
                <>
                  <i className="fas fa-compress-alt"></i>
                  Shorten URL
                </>
              )}
            </button>
          </form>
        </div>
      </section>

      {/* Results Section */}
      {result && (
        <Results
          data={result}
          onViewAnalytics={handleViewAnalytics}
          onShortenAnother={resetForm}
        />
      )}

      {/* Messages */}
      {error && <Message type="error" message={error} />}
      {success && <Message type="success" message={success} />}
    </>
  );
};

export default UrlShortener;
