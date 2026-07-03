import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Spinner, Alert } from "react-bootstrap";
import { useAuth } from "../../context/AuthContext";
import useProfile from "../../features/profile/hooks/useProfile";
import useMyBookings from "../../features/profile/hooks/useMyBookings";
import {
  EditProfileForm,
  ChangePasswordForm,
} from "../../features/profile/components/ProfileForm";
import BookingHistoryCard from "../../features/profile/components/BookingHistoryCard";
import ReviewModal from "../../features/profile/components/ReviewModal";
import "./Profile.css";

// ── Tab order: Profile Settings → Security → My Bookings ─────────────────────
const TABS = [
  { id: "settings", label: "Profile Settings", icon: "👤" },
  { id: "security", label: "Security", icon: "🔒" },
  { id: "bookings", label: "My Bookings", icon: "📅" },
];

// ── Filters: no "Confirmed", statuses match DB enum exactly ──────────────────
// DB values: 'Upcoming' | 'Completed' | 'Cancelled'
const FILTERS = [
  { key: "all", label: "All" },
  { key: "Upcoming", label: "Upcoming" },
  { key: "Completed", label: "Completed" },
  { key: "Cancelled", label: "Cancelled" },
];

export default function Profile() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  // Read tab from URL ?tab=bookings — default is "settings"
  const initialTab =
    TABS.find((t) => t.id === searchParams.get("tab"))?.id ?? "settings";
  const [activeTab, setActiveTab] = useState(initialTab);

  const {
    profile,
    loading: profileLoading,
    saving,
    error: profileError,
    saveProfile,
    changePassword,
  } = useProfile();

  const {
    bookings,
    loading: bookingsLoading,
    error: bookingsError,
    handleCancel,
    refetch,
  } = useMyBookings();

  const [filter, setFilter] = useState("all");
  const [reviewTarget, setReviewTarget] = useState(null);

  // Keep URL in sync when tab changes (so navbar links work)
  const switchTab = (id) => {
    setActiveTab(id);
    setSearchParams({ tab: id });
  };

  // React to external URL changes (e.g. user clicks "My Bookings" in navbar)
  useEffect(() => {
    const t = searchParams.get("tab");
    if (t && TABS.find((x) => x.id === t)) setActiveTab(t);
  }, [searchParams]);

  const initials = (profile?.name || user?.name || "U")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // Filter bookings — DB status values are capitalised ('Upcoming' not 'upcoming')
  const filteredBookings =
    filter === "all" ? bookings : bookings.filter((b) => b.status === filter);

  const counts = {
    all: bookings.length,
    Upcoming: bookings.filter((b) => b.status === "Upcoming").length,
    Completed: bookings.filter((b) => b.status === "Completed").length,
    Cancelled: bookings.filter((b) => b.status === "Cancelled").length,
  };

  return (
    <div className="profile-wrapper">
      {/* ── Header card ──────────────────────────────────────── */}
      <div className="profile-header-card">
        <div className="profile-avatar-circle">{initials}</div>
        <div className="profile-header-info">
          <h2 className="profile-display-name">
            {profile?.name || user?.name || "Player"}
          </h2>
          <p className="profile-display-email">
            {profile?.email || user?.email}
          </p>
          <div className="profile-meta-tags">
            <span className="meta-tag meta-tag--orange">
              {user?.role || "Player"}
            </span>
            <span className="meta-tag meta-tag--gray">
              🎾 {counts.Completed} session{counts.Completed !== 1 ? "s" : ""}{" "}
              played
            </span>
          </div>
        </div>
      </div>

      {/* ── Tabs ─────────────────────────────────────────────── */}
      <div className="profile-tabs">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`profile-tab ${activeTab === tab.id ? "profile-tab--active" : ""}`}
            onClick={() => switchTab(tab.id)}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Tab content ──────────────────────────────────────── */}
      <div className="profile-content">
        {/* ===== PROFILE SETTINGS ===== */}
        {activeTab === "settings" && (
          <div className="settings-card">
            <h3 className="settings-card__title">Personal Information</h3>
            <p className="settings-card__subtitle">
              Update your name and email address.
            </p>
            <hr style={{ borderColor: "#F0EDE8", margin: "16px 0" }} />
            {profileLoading ? (
              <div className="loading-center">
                <Spinner animation="border" style={{ color: "#E07B00" }} />
              </div>
            ) : profileError ? (
              <Alert variant="danger">{profileError}</Alert>
            ) : (
              <EditProfileForm
                profile={profile}
                onSave={saveProfile}
                saving={saving}
              />
            )}
          </div>
        )}

        {/* ===== SECURITY ===== */}
        {activeTab === "security" && (
          <div className="settings-card">
            <h3 className="settings-card__title">Change Password</h3>
            <p className="settings-card__subtitle">
              Choose a strong password with at least 6 characters.
            </p>
            <hr style={{ borderColor: "#F0EDE8", margin: "16px 0" }} />
            <ChangePasswordForm
              onChangePassword={changePassword}
              saving={saving}
            />
          </div>
        )}

        {/* ===== MY BOOKINGS ===== */}
        {activeTab === "bookings" && (
          <>
            {/* Stats: Total · Upcoming · Completed · Cancelled (no Confirmed) */}
            <div className="booking-stats-row">
              {[
                { label: "Total", value: counts.all, color: "#0F0F0F" },
                { label: "Upcoming", value: counts.Upcoming, color: "#B86200" },
                {
                  label: "Completed",
                  value: counts.Completed,
                  color: "#1A3D8C",
                },
                {
                  label: "Cancelled",
                  value: counts.Cancelled,
                  color: "#8C1F1F",
                },
              ].map((s) => (
                <div className="stat-pill" key={s.label}>
                  <span className="stat-pill__num" style={{ color: s.color }}>
                    {s.value}
                  </span>
                  <span className="stat-pill__label">{s.label}</span>
                </div>
              ))}
            </div>

            {/* Filter buttons */}
            <div className="booking-filter-bar">
              {FILTERS.map((f) => (
                <button
                  key={f.key}
                  className={`filter-btn ${filter === f.key ? "filter-btn--active" : ""}`}
                  onClick={() => setFilter(f.key)}
                >
                  {f.label}
                  {f.key !== "all" && counts[f.key] > 0 && (
                    <span className="filter-count">{counts[f.key]}</span>
                  )}
                </button>
              ))}
            </div>

            {bookingsLoading ? (
              <div className="loading-center">
                <Spinner animation="border" style={{ color: "#E07B00" }} />
                <p>Loading your bookings…</p>
              </div>
            ) : bookingsError ? (
              <Alert variant="danger">{bookingsError}</Alert>
            ) : filteredBookings.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state__icon">📅</div>
                <h4>
                  No {filter !== "all" ? filter.toLowerCase() : ""} bookings yet
                </h4>
                <p>
                  {filter === "all"
                    ? "Head to the Explore page to book your first padel session!"
                    : `No ${filter.toLowerCase()} bookings to show.`}
                </p>
                {filter === "all" && (
                  <a href="/explore" className="empty-cta">
                    Browse Courts →
                  </a>
                )}
              </div>
            ) : (
              <div>
                {filteredBookings.map((booking) => (
                  <BookingHistoryCard
                    key={booking._id}
                    booking={booking}
                    onCancel={handleCancel}
                    onReview={(b) => setReviewTarget(b)}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Review Modal ─────────────────────────────────────── */}
      <ReviewModal
        show={!!reviewTarget}
        onHide={() => setReviewTarget(null)}
        booking={reviewTarget}
        onReviewSubmitted={refetch}
      />
    </div>
  );
}
