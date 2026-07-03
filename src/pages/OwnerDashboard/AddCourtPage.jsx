import React from "react";
import { useNavigate } from "react-router-dom";
import AddCourtForm from "../../features/courts/components/AddCourtForm";
import { useAuth } from "../../context/AuthContext";
import useCourts from "../../features/courts/hooks/useCourts";

export default function AddCourtPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { addCourt } = useCourts();

  const handleAdd = async (courtData) => {
    await addCourt(courtData);
    navigate("/owner");
  };

  const handleCancel = () => {
    navigate("/owner");
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">Add New Court</h2>
              <AddCourtForm onAdd={handleAdd} ownerId={user?.id} />
              <div className="text-center mt-3">
                <button type="button" className="btn btn-outline-secondary" onClick={handleCancel}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}