import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LOCAL_IMAGES = [
  "/OIP.webp",
  "/OIP (1).webp",
  "/OIP (2).webp",
  "/OIP (3).webp",
  "/OIP (4).webp",
  "/OIP (5).webp",
];

function getLocalImage(courtId) {
  const index = courtId
    ? courtId.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % LOCAL_IMAGES.length
    : 0;
  return LOCAL_IMAGES[index];
}

function Stars({ rating = 0 }) {
  const full = Math.round(rating);
  return (
    <span style={{ display: "inline-flex", gap: "1px" }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          style={{
            color: n <= full ? "var(--orange)" : "var(--gray-200)",
            fontSize: "14px",
          }}
        >
          ★
        </span>
      ))}
    </span>
  );
}

export default function CourtCard({ court }) {
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);

  const surface = court.surface || "Padel";

  let badgeClass = "tag tag-orange";
  if (surface.toLowerCase().includes("grass")) badgeClass = "tag tag-green";
  else if (surface.toLowerCase().includes("indoor")) badgeClass = "tag tag-blue";

  const imageUrl =
    !imgError && court.imageUrl && court.imageUrl.trim() !== ""
      ? court.imageUrl
      : getLocalImage(court._id);

  const handleNavigate = (e) => {
    e.stopPropagation();
    navigate(`/courts/${court._id}`);
  };

  return (
    <article
      onClick={handleNavigate}
      style={{
        background: "var(--white)",
        border: "1px solid var(--gray-200)",
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Banner */}
      <div style={{ height: "180px", position: "relative", overflow: "hidden" }}>
        <img
          src={imageUrl}
          alt={court.name}
          onError={() => setImgError(true)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            transition: "transform 0.3s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        />

        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 50%)",
            pointerEvents: "none",
          }}
        />

        <span className={badgeClass} style={{ position: "absolute", top: 12, left: 12 }}>
          {surface}
        </span>

        {court.isActive !== false && (
          <span className="tag tag-green" style={{ position: "absolute", top: 12, right: 12 }}>
            ● Available
          </span>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "8px" }}>
        <h3>{court.name}</h3>
        <p>📍 {court.location}</p>

        <div>
          <Stars rating={court.avgRating || 0} />
        </div>

        <div style={{ flex: 1 }} />

        {/* Footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderTop: "1px solid #eee",
            paddingTop: "10px",
          }}
        >
          <span style={{ color: "var(--orange)", fontWeight: "bold" }}>
            {court.pricePerHour} EGP/hr
          </span>

          <button onClick={handleNavigate} className="btn btn-primary btn-sm">
            View Details
          </button>
        </div>
      </div>
    </article>
  );
}
