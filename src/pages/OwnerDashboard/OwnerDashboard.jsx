import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import CourtCard from "../../features/courts/components/CourtCard";
import CourtReviewsModal from "../../features/courts/components/CourtReviewsModal";
import useCourts from "../../features/courts/hooks/useCourts";
import { bookingService } from "../../features/bookings/api/bookingService";
import { useAuth } from "../../context/AuthContext";

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

/** Hide bookings for deleted courts (stale API rows) and bare "Unknown Court" orphans. */
function isReservationVisibleForOwnerCourts(booking, ownerCourts) {
  const validIds = new Set(ownerCourts.map((c) => String(c.id ?? c._id)));
  const cid = getBookingCourtId(booking);
  if (cid != null) {
    return validIds.has(String(cid));
  }
  const hasCourtLabel = Boolean(booking.court?.name) || Boolean(booking.courtName);
  return hasCourtLabel;
}

function getOwnerReservationBadge(booking) {
  if (booking.status === "Cancelled") {
    return { label: "Cancelled", badgeClass: "bg-danger" };
  }
  if (booking.status === "Completed") {
    return { label: "Completed", badgeClass: "bg-success" };
  }
  const end = booking.endTime != null ? new Date(booking.endTime) : null;
  const ended = end != null && !Number.isNaN(end.getTime()) && end.getTime() < Date.now();
  if (ended) {
    return { label: "Done", badgeClass: "bg-success" };
  }
  return { label: booking.status || "Upcoming", badgeClass: "bg-warning text-dark" };
}

export default function OwnerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { courts, loading, error, deleteCourt } = useCourts();
  const [reservations, setReservations] = useState([]);
  const [reservationsLoading, setReservationsLoading] = useState(false);
  const [reservationsError, setReservationsError] = useState(null);
  const [selectedCourtId, setSelectedCourtId] = useState(null);
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
    if (!window.confirm("Delete this court?")) {
      return;
    }

    await deleteCourt(courtId);
    setReservations((prev) => prev.filter((b) => !bookingBelongsToCourt(b, courtId)));
    setSelectedCourtId((selected) =>
      selected != null && String(selected) === String(courtId) ? null : selected,
    );
  };

  const handleShowBookings = (courtId) => {
    setSelectedCourtId(courtId);
  };

  const handleShowReviews = (courtId) => {
    const court = courts.find(c => (c.id || c._id) === courtId);
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
      setReservationsError(error?.response?.data?.message || error.message || "Unable to load reservations.");
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
    return list;
  }, [reservations, courts, loading, selectedCourtId]);

  return (
    <div className="container py-5">
      <div className="mb-4">
        <h2>Owner Dashboard</h2>
        <p className="text-muted">Manage your courts and reservations from one place.</p>
      </div>

      <div className="row gx-4">
        <div className="col-lg-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h5 className="mb-0">Your Courts</h5>
              <p className="text-muted small mb-0">Add or manage courts here.</p>
            </div>
            <button type="button" className="btn btn-warning text-white" onClick={handleAddClick}>
              Add Court
            </button>
          </div>

          {loading && <div className="alert alert-info">Loading your courts...</div>}
          {error && <div className="alert alert-danger">{error}</div>}

          {!loading && courts.length === 0 && (
            <div className="alert alert-secondary">No courts found. Click Add Court to create your first court.</div>
          )}

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

        <div className="col-lg-8">
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="card-title mb-0">
                    {selectedCourtId ? "Court Reservations" : "All Reservations"}
                  </h5>
                  <p className="text-muted mb-0">
                    {selectedCourtId ? "Reservations for the selected court." : "All current reservations for your courts."}
                  </p>
                </div>
                {selectedCourtId && (
                  <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => setSelectedCourtId(null)}>
                    Show All
                  </button>
                )}
              </div>
            </div>
          </div>

          {reservationsLoading && <div className="alert alert-info">Loading reservations...</div>}
          {reservationsError && <div className="alert alert-danger">{reservationsError}</div>}
          {!reservationsLoading && visibleReservations.length === 0 && (
            <div className="alert alert-secondary">No reservations found yet.</div>
          )}

          {visibleReservations.map((booking) => {
            const badge = getOwnerReservationBadge(booking);
            return (
              <div key={booking.id || booking._id} className="card mb-3 shadow-sm">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <h6 className="mb-1">{booking.court?.name || booking.courtName || "Unknown Court"}</h6>
                      <p className="mb-1 text-muted">Booked by {booking.user?.name || booking.user?.email || booking.customerName || "Guest"}</p>
                    </div>
                    <span className={`badge ${badge.badgeClass}`}>{badge.label}</span>
                  </div>
                  <p className="mb-1">
                    <strong>Date:</strong> {booking.startTime ? new Date(booking.startTime).toLocaleDateString() : "-"}
                  </p>
                  <p className="mb-0">
                    <strong>Time:</strong>{" "}
                    {booking.startTime ? new Date(booking.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "-"} - {booking.endTime ? new Date(booking.endTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "-"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

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
