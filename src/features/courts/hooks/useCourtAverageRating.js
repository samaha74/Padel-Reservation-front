import { useState, useEffect } from "react";
import { getCourtReviews } from "../../profile/api/profileApi";

export default function useCourtAverageRating(courtId) {
  const [averageRating, setAverageRating] = useState(null);
  const [reviewCount, setReviewCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      if (!courtId) return;
      
      setLoading(true);
      try {
        const reviews = await getCourtReviews(courtId);
        const reviewArray = Array.isArray(reviews) ? reviews : [];
        
        if (reviewArray.length === 0) {
          setAverageRating(null);
          setReviewCount(0);
          return;
        }

        const totalRating = reviewArray.reduce((sum, review) => sum + (review.rating || 0), 0);
        const average = totalRating / reviewArray.length;
        
        setAverageRating(average);
        setReviewCount(reviewArray.length);
      } catch (err) {
        console.error("Failed to fetch reviews", err);
        setAverageRating(null);
        setReviewCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [courtId]);

  return { averageRating, reviewCount, loading };
}
