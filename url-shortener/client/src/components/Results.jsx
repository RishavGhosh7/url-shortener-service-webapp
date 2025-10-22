import React, { useState } from "react";

const Results = ({ data, onViewAnalytics, onShortenAnother }) => {
  const [copySuccess, setCopySuccess] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(data.shortUrl);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  return (
    <section className="results-section">
      <div className="result-container">
        <h3>Your Short URL is Ready!</h3>
        <div className="result-content">
          <div className="url-display">
            <label>Short URL:</label>
            <div className="url-box">
              <input type="text" value={data.shortUrl} readOnly />
              <button
                onClick={copyToClipboard}
                className={`btn ${
                  copySuccess ? "btn-success" : "btn-secondary"
                }`}
              >
                <i
                  className={`fas ${copySuccess ? "fa-check" : "fa-copy"}`}
                ></i>
                {copySuccess ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>

          <div className="url-info">
            <div className="info-item">
              <span className="label">Original URL:</span>
              <span className="value">{data.originalUrl}</span>
            </div>
            <div className="info-item">
              <span className="label">Short Code:</span>
              <span className="value">{data.shortCode}</span>
            </div>
            <div className="info-item">
              <span className="label">Created:</span>
              <span className="value">{formatDate(data.createdAt)}</span>
            </div>
            {data.expiresAt && (
              <div className="info-item">
                <span className="label">Expires:</span>
                <span className="value">{formatDate(data.expiresAt)}</span>
              </div>
            )}
          </div>

          <div className="action-buttons">
            <button onClick={onViewAnalytics} className="btn btn-outline">
              <i className="fas fa-chart-bar"></i>
              View Analytics
            </button>
            <button onClick={onShortenAnother} className="btn btn-outline">
              <i className="fas fa-plus"></i>
              Shorten Another
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Results;
