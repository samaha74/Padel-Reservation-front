import React from "react";
import UnifiedCourtCard from "../../../components/CourtCard";
import useCourtAverageRating from "../hooks/useCourtAverageRating";

export default function CourtCard({ court, onEdit, onDelete, onShowBookings, onShowReviews }) {
  const courtId = court ? (court.id ?? court._id) : null;
  const { averageRating, reviewCount } = useCourtAverageRating(courtId);

  return (
    <UnifiedCourtCard
      court={court}
      isOwnerView={true}
      onEdit={onEdit}
      onDelete={onDelete}
      onShowBookings={onShowBookings}
      onShowReviews={onShowReviews}
      averageRating={averageRating}
      reviewCount={reviewCount}
    />
  );
}
