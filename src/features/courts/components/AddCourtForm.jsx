import React, { useState } from "react";

const initialValues = {
  name: "",
  location: "",
  pricePerHour: "",
  description: "",
  imageUrl: "",
  imageFile: null,
};

const fileToDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export default function AddCourtForm({ onAdd, ownerId }) {
  const [courtData, setCourtData] = useState(initialValues);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCourtData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0] || null;
    setCourtData((prev) => ({ ...prev, imageFile: file }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!courtData.name || !courtData.location || !courtData.pricePerHour) {
      setMessage("Name, location, and price are required.");
      return;
    }

    setSaving(true);
    setMessage(null);

    try {
      const imageUrl = courtData.imageFile
        ? await fileToDataUrl(courtData.imageFile)
        : courtData.imageUrl;

      const payload = {
        name: courtData.name,
        location: courtData.location,
        pricePerHour: Number(courtData.pricePerHour),
        description: courtData.description,
        imageUrl,
      };

      await onAdd(payload);
      setCourtData(initialValues);
      setMessage("Court added successfully.");
    } catch (error) {
      console.error("Add court failed", error);
      setMessage(
        error?.response?.data?.message || error?.message || "Failed to add court."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="card mb-4">
      <div className="card-body">
        <h5 className="card-title">Add New Court</h5>
        {message && <div className="alert alert-info">{message}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Court Name</label>
            <input
              type="text"
              name="name"
              value={courtData.name}
              onChange={handleChange}
              className="form-control"
              placeholder="E.g. Downtown Padel Club"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Location</label>
            <input
              type="text"
              name="location"
              value={courtData.location}
              onChange={handleChange}
              className="form-control"
              placeholder="City, neighborhood, or address"
            />
          </div>
          <div className="mb-3 row">
            <div className="col-md-6">
              <label className="form-label">Price per hour</label>
              <input
                type="number"
                min="0"
                name="pricePerHour"
                value={courtData.pricePerHour}
                onChange={handleChange}
                className="form-control"
                placeholder="25"
              />
            </div>
            
          </div>
          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea
              name="description"
              value={courtData.description}
              onChange={handleChange}
              className="form-control"
              rows="3"
              placeholder="Optional court details"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Main Court Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="form-control"
            />
            {courtData.imageFile && (
              <small className="text-muted">Selected file: {courtData.imageFile.name}</small>
            )}
          </div>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? "Saving..." : "Add Court"}
          </button>
        </form>
      </div>
    </div>
  );
}
