import React from "react";
import useCourtAverageRating from "../hooks/useCourtAverageRating";

export default function CourtCard({ court, onEdit, onDelete, onShowBookings, onShowReviews }) {
  const courtId = court.id ?? court._id;
  const { averageRating, reviewCount } = useCourtAverageRating(courtId);

  const renderStars = (rating) => {
    if (!rating) return null;
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    return (
      <>
        {"★".repeat(fullStars)}
        {hasHalfStar ? "½" : ""}
        {"☆".repeat(5 - fullStars - (hasHalfStar ? 1 : 0))}
      </>
    );
  };

  const handleShowBookings = () => {
    if (onShowBookings) {
      onShowBookings(courtId);
    }
  };

  const handleShowReviews = () => {
    if (onShowReviews) {
      onShowReviews(courtId);
    }
  };

  return (
    <div className="card shadow-sm mb-3">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <div>
            <h5 className="card-title">{court.name}</h5>
            <p className="card-text text-muted mb-1">{court.location}</p>
          </div>
          <div className="text-end">
            <span className="badge bg-primary">{court.surface || "Padel"}</span>
          </div>
        </div>
        <p className="mb-1">{court.description || "No description added yet."}</p>
        <p className="mb-2">
          <strong>Price:</strong> ${court.pricePerHour || 0}/hr
        </p>
        {averageRating !== null && (
          <p className="mb-2">
            <strong>Rating:</strong>
            <span className="text-warning ms-2">
              {renderStars(averageRating)}
            </span>
            <span className="ms-2 text-muted">
              {averageRating.toFixed(1)} ({reviewCount} {reviewCount === 1 ? "review" : "reviews"})
            </span>
          </p>
        )}

        <div className="d-flex gap-2 mb-3">
          <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => onEdit(court)}>
            Edit
          </button>
          <button
            type="button"
            className="btn btn-sm btn-outline-danger"
            onClick={() => onDelete(courtId)}
          >
            Delete
          </button>
          <button
            type="button"
            className="btn btn-sm btn-outline-info"
            onClick={handleShowBookings}
          >
            Show Bookings
          </button>
          <button
            type="button"
            className="btn btn-sm btn-outline-primary"
            onClick={handleShowReviews}
          >
            View Reviews
          </button>
        </div>

      </div>
    </div>
  );
}
