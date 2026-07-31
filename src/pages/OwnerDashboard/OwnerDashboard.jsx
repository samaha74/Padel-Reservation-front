import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import CourtCard from "../../features/courts/components/CourtCard";
import CourtReviewsModal from "../../features/courts/components/CourtReviewsModal";
import useCourts from "../../features/courts/hooks/useCourts";
import { bookingService } from "../../features/bookings/api/bookingService";
import "./OwnerDashboard.css";

function getBookingCourtId(booking) {
  if (!booking) return null;
  const { court } = booking;
  if (court != null) {
    if (typeof court === "string") return court;
    const id = court.id ?? court._id;
    if (id != null) return id;
  }
  if (booking.courtId != null) return booking.courtId;
  return null;
}

function bookingBelongsToCourt(booking, courtId) {
  if (courtId == null || booking == null) return false;
  const id = String(courtId);
  const cid = getBookingCourtId(booking);
  return cid != null && String(cid) === id;
}

function isReservationVisibleForOwnerCourts(booking, ownerCourts) {
  const validIds = new Set(ownerCourts.map((c) => String(c.id ?? c._id)));
  const cid = getBookingCourtId(booking);
  if (cid != null) {
    return validIds.has(String(cid));
  }
  return Boolean(booking.court?.name) || Boolean(booking.courtName);
}

function getOwnerReservationBadge(booking) {
  if (booking.status === "Cancelled") {
    return { label: "Cancelled", badgeClass: "od-badge od-badge-danger" };
  }
  if (booking.status === "Completed") {
    return { label: "Completed", badgeClass: "od-badge od-badge-success" };
  }
  const end = booking.endTime != null ? new Date(booking.endTime) : null;
  const ended = end != null && !Number.isNaN(end.getTime()) && end.getTime() < Date.now();
  if (ended) {
    return { label: "Completed", badgeClass: "od-badge od-badge-success" };
  }
  return { label: booking.status || "Upcoming", badgeClass: "od-badge od-badge-warning" };
}

export default function OwnerDashboard() {
  const navigate = useNavigate();
  const { courts, loading, error, deleteCourt } = useCourts();
  const [reservations, setReservations] = useState([]);
  const [reservationsLoading, setReservationsLoading] = useState(false);
  const [reservationsError, setReservationsError] = useState(null);
  const [selectedCourtId, setSelectedCourtId] = useState(null);
  const [statusFilter, setStatusFilter] = useState("ALL"); // ALL, UPCOMING, COMPLETED, CANCELLED
  const [reviewCourtId, setReviewCourtId] = useState(null);
  const [reviewCourtName, setReviewCourtName] = useState("");

  const handleAddClick = () => {
    navigate("/owner/add-court");
  };

  const handleEdit = (court) => {
    const courtId = court.id || court._id;
    navigate(`/owner/edit-court/${courtId}`);
  };

  const handleDelete = async (courtId) => {
    if (!window.confirm("Are you sure you want to delete this court?")) {
      return;
    }

    await deleteCourt(courtId);
    setReservations((prev) => prev.filter((b) => !bookingBelongsToCourt(b, courtId)));
    setSelectedCourtId((selected) =>
      selected != null && String(selected) === String(courtId) ? null : selected
    );
  };

  const handleShowBookings = (courtId) => {
    setSelectedCourtId((prev) => (prev === courtId ? null : courtId));
  };

  const handleShowReviews = (courtId) => {
    const court = courts.find((c) => (c.id || c._id) === courtId);
    setReviewCourtId(courtId);
    setReviewCourtName(court?.name || "Court");
  };

  const handleCloseReviews = () => {
    setReviewCourtId(null);
    setReviewCourtName("");
  };

  const fetchReservations = async () => {
    setReservationsLoading(true);
    setReservationsError(null);

    try {
      const data = await bookingService.getAllBookings();
      setReservations(Array.isArray(data) ? data : data?.bookings || data?.data || []);
    } catch (error) {
      setReservations([]);
      setReservationsError(
        error?.response?.data?.message || error.message || "Unable to load reservations."
      );
    } finally {
      setReservationsLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const visibleReservations = useMemo(() => {
    let list = reservations;
    if (!loading) {
      list = list.filter((b) => isReservationVisibleForOwnerCourts(b, courts));
    }
    if (selectedCourtId) {
      list = list.filter((b) => bookingBelongsToCourt(b, selectedCourtId));
    }
    if (statusFilter !== "ALL") {
      list = list.filter((b) => {
        const badge = getOwnerReservationBadge(b);
        return badge.label.toUpperCase() === statusFilter;
      });
    }
    return list;
  }, [reservations, courts, loading, selectedCourtId, statusFilter]);

  // Total Revenue Calculation
  const totalRevenue = useMemo(() => {
    return visibleReservations.reduce((acc, b) => {
      if (b.status !== "Cancelled") {
        return acc + (Number(b.totalPrice) || Number(b.price) || 0);
      }
      return acc;
    }, 0);
  }, [visibleReservations]);

  const selectedCourt = courts.find((c) => (c.id || c._id) === selectedCourtId);

  return (
    <div className="od-page">
      {/* Header Banner */}
      <div className="od-header">
        <div>
          <h1 className="od-header-title">Owner Management Dashboard</h1>
          <p className="od-header-sub">
            Monitor court status, view customer reservations, and track business growth.
          </p>
        </div>
        <button type="button" className="od-add-btn" onClick={handleAddClick}>
          <span>+</span> Add New Court
        </button>
      </div>

      {/* Metrics Strip */}
      <div className="od-metrics">
        <div className="od-metric-card accent">
          <div className="od-metric-icon">🏟️</div>
          <div className="od-metric-info">
            <span className="od-metric-label">Managed Courts</span>
            <span className="od-metric-val">{courts.length}</span>
          </div>
        </div>

        <div className="od-metric-card">
          <div className="od-metric-icon">📅</div>
          <div className="od-metric-info">
            <span className="od-metric-label">Reservations</span>
            <span className="od-metric-val">{visibleReservations.length}</span>
          </div>
        </div>

        <div className="od-metric-card">
          <div className="od-metric-icon">💰</div>
          <div className="od-metric-info">
            <span className="od-metric-label">Total Revenue</span>
            <span className="od-metric-val">{totalRevenue.toLocaleString()} EGP</span>
          </div>
        </div>

        <div className="od-metric-card">
          <div className="od-metric-icon">⭐</div>
          <div className="od-metric-info">
            <span className="od-metric-label">Court Health</span>
            <span className="od-metric-val">100% Active</span>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="od-grid">
        {/* Courts Section */}
        <div className="od-panel">
          <div className="od-panel-header">
            <div>
              <h2 className="od-panel-title">Your Courts ({courts.length})</h2>
              <p className="od-panel-sub">Click on any court to filter its reservations</p>
            </div>
            {selectedCourtId && (
              <button
                type="button"
                className="od-res-filter-btn active"
                onClick={() => setSelectedCourtId(null)}
              >
                Clear Filter (Showing {selectedCourt?.name})
              </button>
            )}
          </div>

          {loading && (
            <div className="od-empty">
              <div className="od-empty-icon">⏳</div>
              <div className="od-empty-title">Loading courts...</div>
            </div>
          )}

          {error && (
            <div className="od-empty" style={{ borderColor: "var(--red-dark)" }}>
              <div className="od-empty-icon">⚠️</div>
              <div className="od-empty-title" style={{ color: "var(--red-dark)" }}>{error}</div>
            </div>
          )}

          {!loading && courts.length === 0 && (
            <div className="od-empty">
              <div className="od-empty-icon">🎾</div>
              <div className="od-empty-title">No Courts Created Yet</div>
              <p className="od-empty-sub">Add your first court to start accepting online bookings.</p>
              <button type="button" className="od-add-btn" style={{ marginTop: "16px" }} onClick={handleAddClick}>
                + Add First Court
              </button>
            </div>
          )}

          <div className="od-courts-list">
            {courts.map((court) => (
              <CourtCard
                key={court.id || court._id}
                court={court}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onShowBookings={handleShowBookings}
                onShowReviews={handleShowReviews}
              />
            ))}
          </div>
        </div>

        {/* Reservations Section */}
        <div className="od-panel">
          <div className="od-panel-header">
            <div>
              <h2 className="od-panel-title">
                {selectedCourtId ? `Reservations: ${selectedCourt?.name}` : "All Reservations"}
              </h2>
              <p className="od-panel-sub">Customer bookings and payment statuses</p>
            </div>
          </div>

          {/* Status Filter Tabs */}
          <div className="od-res-filters">
            {["ALL", "UPCOMING", "COMPLETED", "CANCELLED"].map((status) => (
              <button
                key={status}
                type="button"
                className={`od-res-filter-btn ${statusFilter === status ? "active" : ""}`}
                onClick={() => setStatusFilter(status)}
              >
                {status === "ALL" ? "All Statuses" : status}
              </button>
            ))}
          </div>

          {reservationsLoading && (
            <div className="od-empty">
              <div className="od-empty-icon">⏳</div>
              <div className="od-empty-title">Loading reservations...</div>
            </div>
          )}

          {reservationsError && (
            <div className="od-empty">
              <div className="od-empty-icon">⚠️</div>
              <div className="od-empty-title">{reservationsError}</div>
            </div>
          )}

          {!reservationsLoading && visibleReservations.length === 0 && (
            <div className="od-empty">
              <div className="od-empty-icon">📋</div>
              <div className="od-empty-title">No Reservations Found</div>
              <p className="od-empty-sub">
                {selectedCourtId
                  ? "No bookings recorded for this court yet."
                  : "No reservations match the selected filter."}
              </p>
            </div>
          )}

          {visibleReservations.map((booking) => {
            const badge = getOwnerReservationBadge(booking);
            const startDate = booking.startTime ? new Date(booking.startTime) : null;
            const endDate = booking.endTime ? new Date(booking.endTime) : null;
            const userName = booking.user?.name || booking.user?.email || booking.customerName || "Player";

            return (
              <div key={booking.id || booking._id} className="od-res-card">
                <div className="od-res-top">
                  <div>
                    <h4 className="od-res-court-name">
                      {booking.court?.name || booking.courtName || "Padel Court"}
                    </h4>
                    <div className="od-res-user">
                      👤 Booked by <strong>{userName}</strong>
                    </div>
                  </div>
                  <span className={badge.badgeClass}>{badge.label}</span>
                </div>

                <div className="od-res-details">
                  <div className="od-res-detail-item">
                    <span>📅</span>
                    <span>{startDate ? startDate.toLocaleDateString("en-EG", { weekday: "short", day: "numeric", month: "short", year: "numeric" }) : "-"}</span>
                  </div>

                  <div className="od-res-detail-item">
                    <span>🕒</span>
                    <span>
                      {startDate ? startDate.toLocaleTimeString("en-EG", { hour: "2-digit", minute: "2-digit", hour12: false }) : "-"} - {endDate ? endDate.toLocaleTimeString("en-EG", { hour: "2-digit", minute: "2-digit", hour12: false }) : "-"}
                    </span>
                  </div>

                  <div className="od-res-detail-item">
                    <span>💰</span>
                    <span>Price: <strong>{booking.totalPrice || booking.price || 0} EGP</strong></span>
                  </div>

                  <div className="od-res-detail-item">
                    <span>📍</span>
                    <span>{booking.court?.location || "Cairo, Egypt"}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reviews Modal */}
      {reviewCourtId && (
        <CourtReviewsModal
          courtId={reviewCourtId}
          courtName={reviewCourtName}
          onClose={handleCloseReviews}
        />
      )}
    </div>
  );
}
