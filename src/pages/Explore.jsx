import React from "react";
import useExploreCourts from "../features/courts/hooks/useExploreCourts";
import CourtCard from "../components/CourtCard";
import "./Explore.css";

export default function Explore() {
  const { courts, loading, error, filters, handleFilterChange, handleSearch, handleClear } =
    useExploreCourts();

  const hasFilters = filters.name || filters.location || filters.price;

  return (
    <div className="explore-page">
      {/* Explore Header */}
      <div className="explore-header">
        <div className="explore-header-content">
          <span className="explore-badge">🎾 All Cairo Padel Courts</span>
          <h1 className="explore-title">Explore & Book Courts</h1>
          <p className="explore-sub">
            Filter by court name, neighborhood, or maximum price per hour.
          </p>
        </div>
      </div>

      <div className="explore-container">
        {/* Filter Bar */}
        <form onSubmit={handleSearch} className="explore-filter-bar">
          <div className="explore-filter-field">
            <span className="explore-filter-icon">🏟️</span>
            <input
              name="name"
              type="text"
              value={filters.name || ""}
              onChange={handleFilterChange}
              placeholder="Search by court name..."
              className="explore-filter-input"
            />
          </div>

          <div className="explore-filter-field">
            <span className="explore-filter-icon">📍</span>
            <input
              name="location"
              type="text"
              value={filters.location || ""}
              onChange={handleFilterChange}
              placeholder="Location e.g. Maadi, Tagamoa..."
              className="explore-filter-input"
            />
          </div>

          <div className="explore-filter-field">
            <span className="explore-filter-icon">💰</span>
            <input
              name="price"
              type="number"
              min="0"
              value={filters.price || ""}
              onChange={handleFilterChange}
              placeholder="Max price (EGP/hr)..."
              className="explore-filter-input"
            />
          </div>

          <div className="explore-actions">
            <button type="submit" className="btn btn-primary">
              🔍 Search
            </button>
            {hasFilters && (
              <button type="button" onClick={handleClear} className="btn btn-ghost">
                ✕ Clear
              </button>
            )}
          </div>
        </form>

        {/* State: Loading */}
        {loading && (
          <div className="explore-state-box">
            <div className="explore-spinner" />
            <h3>Searching Courts...</h3>
            <p>Fetching real-time court availability</p>
          </div>
        )}

        {/* State: Error */}
        {error && !loading && (
          <div className="explore-error-box">
            <span>⚠️</span>
            <p>{error}</p>
          </div>
        )}

        {/* Results Info Bar */}
        {!loading && !error && (
          <div className="explore-results-bar">
            <span>
              Showing <strong>{courts.length}</strong> padel court{courts.length !== 1 ? "s" : ""}
            </span>
          </div>
        )}

        {/* Court Cards Grid */}
        {!loading && !error && courts.length > 0 && (
          <div className="explore-grid">
            {courts.map((court) => (
              <CourtCard key={court.id || court._id} court={court} />
            ))}
          </div>
        )}

        {/* State: Empty */}
        {!loading && !error && courts.length === 0 && (
          <div className="explore-state-box">
            <div style={{ fontSize: "36px", marginBottom: "12px" }}>🎾</div>
            <h3>No courts match your search</h3>
            <p>Try adjusting your search query or clearing your filters.</p>
            {hasFilters && (
              <button
                type="button"
                onClick={handleClear}
                className="btn btn-secondary"
                style={{ marginTop: "16px" }}
              >
                Clear All Filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
