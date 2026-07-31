import React from "react";
import { useNavigate } from "react-router-dom";
import AddCourtForm from "../../features/courts/components/AddCourtForm";
import { useAuth } from "../../context/AuthContext";
import useCourts from "../../features/courts/hooks/useCourts";
import "./OwnerDashboard.css";

export default function AddCourtPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { addCourt } = useCourts();

  const handleAdd = async (courtData) => {
    await addCourt(courtData);
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
              Add New Padel Court
            </h2>
            <p className="od-panel-sub" style={{ marginBottom: "24px" }}>
              Fill in the court details to list it for online player bookings.
            </p>

            <AddCourtForm onAdd={handleAdd} ownerId={user?.id} />

            <div style={{ textAlign: "center", marginTop: "16px" }}>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={handleCancel}
                style={{ width: "100%" }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}