import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { bookingService } from "../features/bookings/api/bookingService";
import "./MyBookings.css";

function StatusBadge({ status }) {
  const map = {
    Upcoming:  { color: "#f97316", bg: "#fff8f0", label: "⏳ Upcoming" },
    Completed: { color: "#16a34a", bg: "#f0fdf4", label: "✅ Completed" },
    Cancelled: { color: "#dc2626", bg: "#fef2f2", label: "❌ Cancelled" },
  };
  const s = map[status] || map.Upcoming;
  return (
    <span className="mb-badge" style={{ color: s.color, background: s.bg }}>
      {s.label}
    </span>
  );
}

function CancelModal({ booking, onConfirm, onClose }) {
  return (
    <div className="mb-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="mb-modal">
        <div className="mb-modal__icon">⚠️</div>
        <h3>Cancel Booking?</h3>
        <p>
          Are you sure you want to cancel your booking at{" "}
          <strong>{booking.court?.name || "this court"}</strong>?
        </p>
        <div className="mb-modal__refund">
          <span>💰</span>
          <p>
            If you paid by Visa, a refund of <strong>{booking.totalPrice} EGP</strong> will
            be processed within 3–5 business days. Cash bookings require no action.
          </p>
        </div>
        <div className="mb-modal__actions">
          <button className="mb-modal__cancel-btn" onClick={onClose}>
            Keep Booking
          </button>
          <button className="mb-modal__confirm-btn" onClick={onConfirm}>
            Yes, Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MyBookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelTarget, setCancelTarget] = useState(null); // booking to cancel
  const [cancelling, setCancelling] = useState(false);
  const [activeTab, setActiveTab] = useState("Upcoming"); // "Upcoming" | "Completed" | "Cancelled"

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await bookingService.getAllBookings();
      setBookings(data);
    } catch (err) {
      setError("Failed to load bookings.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelConfirm = async () => {
    if (!cancelTarget) return;
    setCancelling(true);
    try {
      await bookingService.cancelBooking(cancelTarget._id);
      setBookings((prev) =>
        prev.map((b) =>
          b._id === cancelTarget._id ? { ...b, status: "Cancelled" } : b
        )
      );
      setCancelTarget(null);
    } catch (err) {
      alert("Failed to cancel booking. Please try again.");
    } finally {
      setCancelling(false);
    }
  };

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-EG", {
      weekday: "short", day: "numeric", month: "short", year: "numeric",
    });

  const formatTime = (dateStr) =>
    new Date(dateStr).toLocaleTimeString("en-EG", {
      hour: "2-digit", minute: "2-digit", hour12: false,
    });

  const filtered = bookings.filter((b) => b.status === activeTab);
  const counts = {
    Upcoming:  bookings.filter((b) => b.status === "Upcoming").length,
    Completed: bookings.filter((b) => b.status === "Completed").length,
    Cancelled: bookings.filter((b) => b.status === "Cancelled").length,
  };

  return (
    <div className="mb-page">
      {/* Cancel Modal */}
      {cancelTarget && (
        <CancelModal
          booking={cancelTarget}
          onConfirm={handleCancelConfirm}
          onClose={() => setCancelTarget(null)}
        />
      )}

      <div className="mb-inner">
        {/* Header */}
        <div className="mb-header">
          <div>
            <h1 className="mb-title">My Bookings</h1>
            <p className="mb-sub">Manage your court reservations</p>
          </div>
          <button className="mb-explore-btn" onClick={() => navigate("/home")}>
            + Book a Court
          </button>
        </div>

        {/* Tabs */}
        <div className="mb-tabs">
          {["Upcoming", "Completed", "Cancelled"].map((tab) => (
            <button
              key={tab}
              className={`mb-tab ${activeTab === tab ? "mb-tab--active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
              {counts[tab] > 0 && (
                <span className="mb-tab__count">{counts[tab]}</span>
              )}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div className="mb-state">
            <div className="mb-spinner" />
            <p>Loading your bookings…</p>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="mb-error">⚠️ {error}</div>
        )}

        {/* Empty */}
        {!loading && !error && filtered.length === 0 && (
          <div className="mb-state">
            <div className="mb-state__icon">
              {activeTab === "Upcoming" ? "🎾" : activeTab === "Completed" ? "✅" : "❌"}
            </div>
            <h3>No {activeTab} bookings</h3>
            <p>
              {activeTab === "Upcoming"
                ? "You have no upcoming bookings. Find a court and book now!"
                : `You have no ${activeTab.toLowerCase()} bookings yet.`}
            </p>
            {activeTab === "Upcoming" && (
              <button className="mb-state__btn" onClick={() => navigate("/home")}>
                Browse Courts
              </button>
            )}
          </div>
        )}

        {/* Bookings List */}
        {!loading && !error && filtered.length > 0 && (
          <div className="mb-list">
            {filtered.map((booking) => (
              <div key={booking._id} className="mb-card">
                <div className="mb-card__left">
                  <div className="mb-card__court-icon">🏓</div>
                </div>

                <div className="mb-card__body">
                  <div className="mb-card__top">
                    <h3 className="mb-card__court-name">
                      {booking.court?.name || "Padel Court"}
                    </h3>
                    <StatusBadge status={booking.status} />
                  </div>

                  <div className="mb-card__details">
                    <span>📍 {booking.court?.location || "Cairo, Egypt"}</span>
                    <span>📅 {formatDate(booking.startTime)}</span>
                    <span>
                      🕒 {formatTime(booking.startTime)} – {formatTime(booking.endTime)}
                    </span>
                    <span>💰 {booking.totalPrice} EGP</span>
                  </div>
                </div>

                <div className="mb-card__actions">
                  <button
                    className="mb-card__view-btn"
                    onClick={() => navigate(`/courts/${booking.court?._id}`)}
                  >
                    View Court
                  </button>
                  {booking.status === "Upcoming" && (
                    <button
                      className="mb-card__cancel-btn"
                      onClick={() => setCancelTarget(booking)}
                      disabled={cancelling}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
