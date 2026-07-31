import React, { useState } from "react";

const initialValues = {
  name: "",
  location: "",
  pricePerHour: "",
  surface: "Padel",
  description: "",
  imageUrl: "",
  imageFile: null,
};

export default function AddCourtForm({ onAdd, ownerId }) {
  const [courtData, setCourtData] = useState(initialValues);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCourtData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0] || null;
    setCourtData((prev) => ({ ...prev, imageFile: file }));
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl(null);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!courtData.name || !courtData.location || !courtData.pricePerHour) {
      setMessage({ type: "danger", text: "Name, location, and price per hour are required." });
      return;
    }

    setSaving(true);
    setMessage(null);

    try {
      const payload = {
        name: courtData.name,
        location: courtData.location,
        pricePerHour: Number(courtData.pricePerHour),
        surface: courtData.surface,
        description: courtData.description,
        imageUrl: courtData.imageUrl,
        imageFile: courtData.imageFile,
      };

      await onAdd(payload);
      setCourtData(initialValues);
      setPreviewUrl(null);
      setMessage({ type: "success", text: "Court created successfully! Returning to dashboard..." });
    } catch (error) {
      console.error("Add court failed", error);
      setMessage({
        type: "danger",
        text: error?.response?.data?.message || error?.message || "Failed to add court.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {message && (
        <div
          className={`tag ${message.type === "success" ? "tag-green" : "tag-red"}`}
          style={{ padding: "12px 16px", borderRadius: "var(--radius-md)", fontSize: "14px", width: "100%" }}
        >
          {message.type === "success" ? "✅" : "⚠️"} {message.text}
        </div>
      )}

      <div className="form-group">
        <label className="form-label">Court Name *</label>
        <input
          type="text"
          name="name"
          value={courtData.name}
          onChange={handleChange}
          placeholder="e.g. Downtown Padel Arena"
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label">Location *</label>
        <input
          type="text"
          name="location"
          value={courtData.location}
          onChange={handleChange}
          placeholder="e.g. 15 Road 9, Maadi, Cairo"
          required
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        <div className="form-group">
          <label className="form-label">Price Per Hour (EGP) *</label>
          <input
            type="number"
            min="0"
            name="pricePerHour"
            value={courtData.pricePerHour}
            onChange={handleChange}
            placeholder="e.g. 350"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Court Surface Type</label>
          <select name="surface" value={courtData.surface} onChange={handleChange}>
            <option value="Padel">Standard Padel</option>
            <option value="Grass">Grass Court</option>
            <option value="Indoor">Indoor Court</option>
            <option value="Panoramica">Panoramic Glass</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Court Description</label>
        <textarea
          name="description"
          value={courtData.description}
          onChange={handleChange}
          rows="3"
          placeholder="Provide details such as lighting, equipment rental, locker rooms, or parking..."
        />
      </div>

      <div className="form-group">
        <label className="form-label">Court Image URL (Optional)</label>
        <input
          type="text"
          name="imageUrl"
          value={courtData.imageUrl}
          onChange={handleChange}
          placeholder="https://example.com/court-photo.jpg"
        />
      </div>

      <div className="form-group">
        <label className="form-label">Or Upload Main Court Image</label>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        {previewUrl && (
          <div style={{ marginTop: "12px", borderRadius: "var(--radius-md)", overflow: "hidden", height: "160px" }}>
            <img src={previewUrl} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        )}
      </div>

      <button type="submit" className="btn btn-primary" style={{ marginTop: "8px", padding: "14px" }} disabled={saving}>
        {saving ? "Saving Court..." : "+ Create Court"}
      </button>
    </form>
  );
}
