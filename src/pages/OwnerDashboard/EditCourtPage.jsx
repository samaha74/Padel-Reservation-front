import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CourtForm from "../../features/courts/components/CourtForm";
import useCourts from "../../features/courts/hooks/useCourts";

export default function EditCourtPage() {
  const { courtId } = useParams();
  const navigate = useNavigate();
  const { courts, updateCourt } = useCourts();
  const [court, setCourt] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const foundCourt = courts.find(c => (c.id || c._id) === courtId);
    if (foundCourt) {
      setCourt(foundCourt);
      setLoading(false);
    } else {
      // If not found in current courts, could fetch individually, but for now assume it's loaded
      setLoading(false);
    }
  }, [courtId, courts]);

  const handleSave = async (id, courtData) => {
    await updateCourt(id, courtData);
    navigate("/owner");
  };

  const handleCancel = () => {
    navigate("/owner");
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">Loading court...</div>
      </div>
    );
  }

  if (!court) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">Court not found.</div>
        <button className="btn btn-primary" onClick={() => navigate("/owner")}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">Edit Court</h2>
              <CourtForm court={court} onSave={handleSave} onCancel={handleCancel} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}