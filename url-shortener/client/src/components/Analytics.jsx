import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Message from "./Message";

const Analytics = () => {
  const { shortCode } = useParams();
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiBaseUrl =
    process.env.REACT_APP_API_URL || "http://localhost:3000/api";

  const loadAnalytics = useCallback(async () => {
    if (!shortCode) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${apiBaseUrl}/stats/${shortCode}`);

      if (response.data.success) {
        setAnalytics(response.data.data);
      } else {
        setError(
          response.data.message ||
            response.data.error ||
            "Failed to load analytics"
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
  }, [shortCode, apiBaseUrl]);

  useEffect(() => {
    if (shortCode) {
      loadAnalytics();
    }
  }, [shortCode, loadAnalytics]);

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

  const getStatusInfo = () => {
    if (!analytics) return { text: "-", color: "#333" };

    if (analytics.isExpired) {
      return { text: "Expired", color: "#e74c3c" };
    } else if (analytics.expiresAt) {
      return {
        text: `Active (Expires: ${formatDate(analytics.expiresAt)})`,
        color: "#f39c12",
      };
    } else {
      return { text: "Active (No expiration)", color: "#28a745" };
    }
  };

  const statusInfo = getStatusInfo();

  if (loading) {
    return (
      <section className="analytics-section">
        <div className="analytics-container">
          <div className="text-center">
            <div className="loading"></div>
            <p>Loading analytics...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <>
        <Message type="error" message={error} />
        <div className="analytics-actions">
          <button onClick={() => navigate("/")} className="btn btn-outline">
            <i className="fas fa-arrow-left"></i>
            Back to Home
          </button>
        </div>
      </>
    );
  }

  if (!analytics) {
    return (
      <section className="analytics-section">
        <div className="analytics-container">
          <h3>No Analytics Data Found</h3>
          <p>The requested URL analytics could not be found.</p>
          <div className="analytics-actions">
            <button onClick={() => navigate("/")} className="btn btn-outline">
              <i className="fas fa-arrow-left"></i>
              Back to Home
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="analytics-section">
      <div className="analytics-container">
        <h3>URL Analytics</h3>
        <div className="analytics-content">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-mouse-pointer"></i>
              </div>
              <div className="stat-info">
                <span className="stat-number">{analytics.clicks || 0}</span>
                <span className="stat-label">Total Clicks</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-calendar-plus"></i>
              </div>
              <div className="stat-info">
                <span className="stat-date">
                  {formatDate(analytics.createdAt)}
                </span>
                <span className="stat-label">Created Date</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-clock"></i>
              </div>
              <div className="stat-info">
                <span className="stat-date">
                  {analytics.lastAccessedAt
                    ? formatDate(analytics.lastAccessedAt)
                    : "Never"}
                </span>
                <span className="stat-label">Last Accessed</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-expand-arrows-alt"></i>
              </div>
              <div className="stat-info">
                <span
                  className="stat-status"
                  style={{ color: statusInfo.color }}
                >
                  {statusInfo.text}
                </span>
                <span className="stat-label">Status</span>
              </div>
            </div>
          </div>

          <div className="analytics-actions">
            <button onClick={loadAnalytics} className="btn btn-outline">
              <i className="fas fa-sync-alt"></i>
              Refresh Stats
            </button>
            <button onClick={() => navigate("/")} className="btn btn-outline">
              <i className="fas fa-arrow-left"></i>
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Analytics;
