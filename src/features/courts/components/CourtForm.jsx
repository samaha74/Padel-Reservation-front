import React, { useEffect, useState } from "react";

export default function CourtForm({ court, onSave, onCancel }) {
  const [courtData, setCourtData] = useState({
    name: "",
    location: "",
    pricePerHour: "",
    surface: "Padel",
    description: "",
    imageUrl: "",
    imageFile: null,
  });
  const [previewUrl, setPreviewUrl] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (!court) return;
    setCourtData({
      name: court.name || "",
      location: court.location || "",
      pricePerHour: court.pricePerHour || "",
      surface: court.surface || "Padel",
      description: court.description || "",
      imageUrl: court.imageUrl || "",
      imageFile: null,
    });
    if (court.imageUrl) {
      setPreviewUrl(court.imageUrl);
    }
  }, [court]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCourtData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0] || null;
    setCourtData((prev) => ({ ...prev, imageFile: file }));
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
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

      await onSave(court.id ?? court._id, payload);
      setMessage({ type: "success", text: "Court updated successfully!" });
    } catch (error) {
      setMessage({ type: "danger", text: error?.message || "Failed to update court." });
    } finally {
      setSaving(false);
    }
  };

  if (!court) return null;

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
          placeholder="Provide court details..."
        />
      </div>

      <div className="form-group">
        <label className="form-label">Main Court Image URL</label>
        <input
          type="text"
          name="imageUrl"
          value={courtData.imageUrl}
          onChange={handleChange}
          placeholder="https://example.com/court-photo.jpg"
        />
      </div>

      <div className="form-group">
        <label className="form-label">Replace Image File (Optional)</label>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        {previewUrl && (
          <div style={{ marginTop: "12px", borderRadius: "var(--radius-md)", overflow: "hidden", height: "160px" }}>
            <img src={previewUrl} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        )}
      </div>

      <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
        <button type="submit" className="btn btn-primary" style={{ flex: 1, padding: "12px" }} disabled={saving}>
          {saving ? "Saving Changes..." : "Save Changes"}
        </button>
        <button type="button" className="btn btn-ghost" style={{ padding: "12px 20px" }} onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}
