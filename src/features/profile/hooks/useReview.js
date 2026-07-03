import { useState } from "react";
import { submitReview } from "../api/profileApi";

export default function useReview(onSuccess) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const submit = async ({ courtId, rating, comment }) => {
    try {
      setSubmitting(true);
      setError(null);
      await submitReview({ courtId, rating, comment });
      if (onSuccess) onSuccess();
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to submit review.";
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setSubmitting(false);
    }
  };

  return { submit, submitting, error };
}
