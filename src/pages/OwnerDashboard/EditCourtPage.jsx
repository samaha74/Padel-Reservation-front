import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CourtForm from "../../features/courts/components/CourtForm";
import useCourts from "../../features/courts/hooks/useCourts";
import "./OwnerDashboard.css";

export default function EditCourtPage() {
  const { courtId } = useParams();
  const navigate = useNavigate();
  const { courts, updateCourt } = useCourts();
  const [court, setCourt] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const foundCourt = courts.find((c) => (c.id || c._id) === courtId);
    if (foundCourt) {
      setCourt(foundCourt);
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [courtId, courts]);

  const handleSave = async (id, courtData) => {
    await updateCourt(id, courtData);
    setTimeout(() => {
      navigate("/owner");
    }, 400);
  };

  const handleCancel = () => {
    navigate("/owner");
  };

  return (
    <div className="od-page">
      <div style={{ maxWidth: "680px", margin: "0 auto" }}>
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          style={{ marginBottom: "20px" }}
          onClick={handleCancel}
        >
          ← Back to Owner Dashboard
        </button>

        <div className="card shadow-sm">
          <div className="card-body">
            <h2 className="od-panel-title" style={{ fontSize: "22px", marginBottom: "6px" }}>
              Edit Court Details
            </h2>
            <p className="od-panel-sub" style={{ marginBottom: "24px" }}>
              Update pricing, description, location, or court image.
            </p>

            {loading ? (
              <div className="od-empty">
                <div className="od-empty-icon">⏳</div>
                <div className="od-empty-title">Loading court data...</div>
              </div>
            ) : !court ? (
              <div className="od-empty" style={{ borderColor: "var(--red-dark)" }}>
                <div className="od-empty-icon">⚠️</div>
                <div className="od-empty-title" style={{ color: "var(--red-dark)" }}>Court Not Found</div>
                <p className="od-empty-sub">The court you are trying to edit does not exist or was deleted.</p>
                <button type="button" className="btn btn-primary" style={{ marginTop: "16px" }} onClick={handleCancel}>
                  Return to Dashboard
                </button>
              </div>
            ) : (
              <CourtForm court={court} onSave={handleSave} onCancel={handleCancel} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}