import React, { useState } from "react";
import { Modal, Button, Form, Alert, Spinner } from "react-bootstrap";
import StarRating from "./StarRating";
import useReview from "../hooks/useReview";

export default function ReviewModal({
  show,
  onHide,
  booking,
  onReviewSubmitted,
}) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [success, setSuccess] = useState(false);

  const { submit, submitting, error } = useReview(() => {
    setSuccess(true);
    setTimeout(() => {
      onReviewSubmitted && onReviewSubmitted();
      onHide();
      setRating(0);
      setComment("");
      setSuccess(false);
    }, 1500);
  });

  const handleSubmit = async () => {
    if (!rating) return;
    await submit({
      courtId: booking?.court?._id || booking?.courtId,
      rating,
      comment,
    });
  };

  const handleClose = () => {
    setRating(0);
    setComment("");
    setSuccess(false);
    onHide();
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton style={{ borderBottom: "1px solid #F0EDE8" }}>
        <Modal.Title style={{ fontFamily: "Syne, sans-serif", fontSize: 18 }}>
          Rate Your Experience
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="px-4 py-3">
        {success ? (
          <div className="text-center py-3">
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                background: "#E8F5E2",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 26,
                margin: "0 auto 12px",
              }}
            >
              ✅
            </div>
            <p style={{ fontWeight: 600, color: "#2A6018" }}>
              Review submitted — thanks!
            </p>
          </div>
        ) : (
          <>
            {booking?.court?.name && (
              <p className="text-muted mb-3" style={{ fontSize: 14 }}>
                Reviewing:{" "}
                <strong style={{ color: "#0F0F0F" }}>
                  {booking.court.name}
                </strong>
              </p>
            )}

            {error && (
              <Alert variant="danger" style={{ fontSize: 13 }}>
                {error}
              </Alert>
            )}

            <Form.Group className="mb-3">
              <Form.Label
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#5A5752",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Your Rating *
              </Form.Label>
              <div className="mt-1">
                <StarRating
                  value={rating}
                  onChange={setRating}
                  interactive
                  size={32}
                />
                {!rating && (
                  <p style={{ fontSize: 12, color: "#999690", marginTop: 4 }}>
                    Tap a star to rate
                  </p>
                )}
              </div>
            </Form.Group>

            <Form.Group>
              <Form.Label
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#5A5752",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Comment (optional)
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="How was the court? Tell other players…"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                style={{
                  borderColor: "#DDD9D2",
                  fontSize: 14,
                  resize: "none",
                  borderRadius: 10,
                  marginTop: 6,
                }}
              />
            </Form.Group>
          </>
        )}
      </Modal.Body>

      {!success && (
        <Modal.Footer style={{ borderTop: "1px solid #F0EDE8" }}>
          <Button
            variant="light"
            onClick={handleClose}
            style={{ fontSize: 14, borderRadius: 8 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!rating || submitting}
            style={{
              background: rating ? "#E07B00" : "#DDD9D2",
              border: "none",
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              minWidth: 120,
            }}
          >
            {submitting ? (
              <Spinner animation="border" size="sm" />
            ) : (
              "Submit Review"
            )}
          </Button>
        </Modal.Footer>
      )}
    </Modal>
  );
}
