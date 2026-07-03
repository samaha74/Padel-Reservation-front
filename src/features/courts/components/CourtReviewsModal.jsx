import React, { useEffect, useState } from "react";
import { getCourtReviews } from "../../profile/api/profileApi";

export default function CourtReviewsModal({ courtId, courtName, onClose }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getCourtReviews(courtId);
        setReviews(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load reviews");
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };

    if (courtId) {
      fetchReviews();
    }
  }, [courtId]);

  const renderStars = (rating) => {
    return "★".repeat(rating) + "☆".repeat(5 - rating);
  };

  return (
    <div className="modal show d-block" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }} tabIndex="-1" role="dialog">
      <div className="modal-dialog modal-lg" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              Reviews for {courtName}
            </h5>
            <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
          </div>
          <div className="modal-body">
            {loading && <div className="alert alert-info">Loading reviews...</div>}
            {error && <div className="alert alert-danger">{error}</div>}
            
            {!loading && reviews.length === 0 && (
              <div className="alert alert-secondary">No reviews yet for this court.</div>
            )}

            {!loading && reviews.length > 0 && (
              <div>
                <p className="text-muted mb-3">
                  <strong>{reviews.length}</strong> review{reviews.length !== 1 ? "s" : ""} found
                </p>
                {reviews.map((review) => (
                  <div key={review.id || review._id} className="card mb-3">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div>
                          <h6 className="card-subtitle mb-1 text-muted">
                            {review.user?.name || review.customerName || "Anonymous"}
                          </h6>
                          <div className="text-warning small mb-2">
                            {renderStars(review.rating || 0)}
                          </div>
                        </div>
                        <small className="text-muted">
                          {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : ""}
                        </small>
                      </div>
                      <p className="card-text mb-0">
                        {review.comment || "No comment provided"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
