import React, { useState } from "react";

/**
 * Interactive star rating component.
 * - Pass `interactive={true}` for review input (hover + click).
 * - Pass `interactive={false}` (default) for display only.
 */
export default function StarRating({
  value = 0,
  onChange,
  interactive = false,
  size = 24,
}) {
  const [hovered, setHovered] = useState(0);

  const display = interactive ? hovered || value : value;

  return (
    <div
      style={{
        display: "inline-flex",
        gap: 2,
        cursor: interactive ? "pointer" : "default",
      }}
      onMouseLeave={() => interactive && setHovered(0)}
      role={interactive ? "group" : undefined}
      aria-label={interactive ? "Star rating" : `Rating: ${value} out of 5`}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          style={{
            fontSize: size,
            color: star <= display ? "#E07B00" : "#DDD9D2",
            transition: "color 0.1s",
            lineHeight: 1,
          }}
          onMouseEnter={() => interactive && setHovered(star)}
          onClick={() => interactive && onChange && onChange(star)}
          role={interactive ? "button" : undefined}
          aria-label={
            interactive ? `${star} star${star !== 1 ? "s" : ""}` : undefined
          }
          tabIndex={interactive ? 0 : undefined}
          onKeyDown={(e) => {
            if (interactive && (e.key === "Enter" || e.key === " ")) {
              onChange && onChange(star);
            }
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
}
