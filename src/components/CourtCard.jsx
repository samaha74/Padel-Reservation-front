import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CourtCard.css";

const LOCAL_IMAGES = [
  "/OIP.webp",
  "/OIP (1).webp",
  "/OIP (2).webp",
  "/OIP (3).webp",
  "/OIP (4).webp",
  "/OIP (5).webp",
];

function getLocalImage(courtId) {
  const str = String(courtId || "court");
  const index = str.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % LOCAL_IMAGES.length;
  return LOCAL_IMAGES[index];
}

function Stars({ rating = 0, reviewCount = 0 }) {
  const numRating = Number(rating) || 0;
  const full = Math.round(numRating);
  return (
    <div className="pc-stars-row">
      <span className="pc-stars">
        {[1, 2, 3, 4, 5].map((n) => (
          <span
            key={n}
            className={`pc-star ${n <= full ? "filled" : "empty"}`}
          >
            ★
          </span>
        ))}
      </span>
      {numRating > 0 ? (
        <span className="pc-rating-num">
          {numRating.toFixed(1)} {reviewCount > 0 ? `(${reviewCount})` : ""}
        </span>
      ) : (
        <span className="pc-rating-new">New Court</span>
      )}
    </div>
  );
}

// SVG Fallback graphics if images fail or aren't provided
function CourtFallbackBanner({ name }) {
  return (
    <div className="pc-fallback-banner">
      <svg className="pc-court-svg" viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="200" fill="#1C3D29" />
        {/* Court outer boundary */}
        <rect x="30" y="20" width="340" height="160" stroke="#E2E8F0" strokeWidth="2.5" strokeDasharray="none" fill="#234E35" rx="4" />
        {/* Service line & net */}
        <line x1="200" y1="20" x2="200" y2="180" stroke="#FF9A1F" strokeWidth="3" />
        <line x1="115" y1="20" x2="115" y2="180" stroke="#FFFFFF" strokeWidth="1.5" strokeOpacity="0.7" />
        <line x1="285" y1="20" x2="285" y2="180" stroke="#FFFFFF" strokeWidth="1.5" strokeOpacity="0.7" />
        <line x1="115" y1="100" x2="285" y2="100" stroke="#FFFFFF" strokeWidth="1.5" strokeOpacity="0.7" />
      </svg>
      <div className="pc-fallback-overlay">
        <span className="pc-fallback-icon">🎾</span>
        <span className="pc-fallback-name">{name || "Padel Court"}</span>
      </div>
    </div>
  );
}

export default function CourtCard({
  court,
  isOwnerView = false,
  onEdit,
  onDelete,
  onShowBookings,
  onShowReviews,
  averageRating,
  reviewCount,
}) {
  const navigate = useNavigate();
  const [imgErrorLevel, setImgErrorLevel] = useState(0); // 0: try court.imageUrl, 1: try getLocalImage, 2: fallback SVG

  if (!court) return null;

  const courtId = court.id || court._id;
  const surface = court.surface || "Padel";
  const price = court.pricePerHour || court.price || 0;

  // Surface badge styling
  let badgeClass = "pc-badge pc-badge-orange";
  if (surface.toLowerCase().includes("grass")) badgeClass = "pc-badge pc-badge-green";
  else if (surface.toLowerCase().includes("indoor")) badgeClass = "pc-badge pc-badge-blue";

  // Determine current image URL to render
  let imageUrl = null;
  if (imgErrorLevel === 0 && court.imageUrl && court.imageUrl.trim() !== "") {
    imageUrl = court.imageUrl;
  } else if (imgErrorLevel <= 1) {
    imageUrl = getLocalImage(courtId);
  }

  const handleImageError = () => {
    setImgErrorLevel((prev) => prev + 1);
  };

  const handleCardClick = () => {
    if (!isOwnerView) {
      navigate(`/courts/${courtId}`);
    }
  };

  const effectiveRating = averageRating ?? court.avgRating ?? court.rating ?? 0;
  const effectiveReviewCount = reviewCount ?? court.reviewCount ?? court.numReviews ?? 0;

  return (
    <article
      className={`pc-card ${isOwnerView ? "pc-card--owner" : ""}`}
      onClick={handleCardClick}
    >
      {/* Banner / Image Header */}
      <div className="pc-banner">
        {imageUrl && imgErrorLevel < 2 ? (
          <img
            src={imageUrl}
            alt={court.name}
            onError={handleImageError}
            className="pc-banner-img"
          />
        ) : (
          <CourtFallbackBanner name={court.name} />
        )}

        <div className="pc-banner-gradient" />

        <span className={badgeClass}>{surface}</span>

        {court.isActive !== false ? (
          <span className="pc-badge pc-badge-active">
            <span className="pc-dot" /> Available
          </span>
        ) : (
          <span className="pc-badge pc-badge-inactive">Unavailable</span>
        )}
      </div>

      {/* Card Body */}
      <div className="pc-body">
        <h3 className="pc-title">{court.name}</h3>

        <p className="pc-location">
          <span className="pc-loc-icon">📍</span>
          <span>{court.location || "Cairo, Egypt"}</span>
        </p>

        {court.description && isOwnerView && (
          <p className="pc-description">{court.description}</p>
        )}

        <Stars rating={effectiveRating} reviewCount={effectiveReviewCount} />

        <div className="pc-divider" />

        {/* Footer / Actions */}
        {!isOwnerView ? (
          <div className="pc-footer">
            <div className="pc-price-box">
              <span className="pc-price-amount">{price}</span>
              <span className="pc-price-unit">EGP/hr</span>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/courts/${courtId}`);
              }}
              className="pc-btn pc-btn-primary"
            >
              Book Court →
            </button>
          </div>
        ) : (
          <div className="pc-owner-controls" onClick={(e) => e.stopPropagation()}>
            <div className="pc-owner-price">
              <span>Price: <strong>{price} EGP/hr</strong></span>
            </div>

            <div className="pc-owner-grid">
              <button
                type="button"
                className="pc-owner-btn pc-owner-btn--edit"
                onClick={() => onEdit && onEdit(court)}
              >
                ✏️ Edit
              </button>

              <button
                type="button"
                className="pc-owner-btn pc-owner-btn--delete"
                onClick={() => onDelete && onDelete(courtId)}
              >
                🗑️ Delete
              </button>

              <button
                type="button"
                className="pc-owner-btn pc-owner-btn--bookings"
                onClick={() => onShowBookings && onShowBookings(courtId)}
              >
                📅 Bookings
              </button>

              <button
                type="button"
                className="pc-owner-btn pc-owner-btn--reviews"
                onClick={() => onShowReviews && onShowReviews(courtId)}
              >
                ⭐ Reviews
              </button>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
