import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

export default function Navbar() {
  const { user, logout, isOwner } = useAuth();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Shrink/elevate navbar on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
    setDropdownOpen(false);
  }, [location.pathname]);

  const initials = user
    ? (user.name || user.email || "U")
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav className={`pnav ${scrolled ? "pnav--scrolled" : ""}`}>
        <div className="pnav__inner">
          {/* ── Logo ──────────────────────────────────── */}
          <Link className="pnav__logo" to="/">
            <span className="pnav__logo-icon">🎾</span>
            <span>
              Padel<strong>Club</strong>
            </span>
          </Link>

          {/* ── Desktop Nav Links ─────────────────────── */}
          <div className="pnav__links">
            {user && (
              <>
                <Link
                  className={`pnav__link ${isActive("/home") || isActive("/") ? "pnav__link--active" : ""}`}
                  to="/home"
                >
                  Home
                </Link>
                <Link
                  className={`pnav__link ${isActive("/explore") ? "pnav__link--active" : ""}`}
                  to="/explore"
                >
                  Explore Courts
                </Link>
                {isOwner && (
                  <Link
                    className={`pnav__link ${isActive("/owner") ? "pnav__link--active" : ""}`}
                    to="/owner"
                  >
                    Dashboard
                  </Link>
                )}
              </>
            )}
          </div>

          {/* ── Desktop Right ─────────────────────────── */}
          <div className="pnav__right">
            {user ? (
              <>
                {/* Bookings shortcut */}
                <Link
                  className={`pnav__link pnav__link--bookings ${isActive("/profile") ? "pnav__link--active" : ""}`}
                  to="/profile?tab=bookings"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  My Bookings
                </Link>

                {/* Avatar dropdown */}
                <div className="pnav__avatar-wrap" ref={dropdownRef}>
                  <button
                    className="pnav__avatar"
                    onClick={() => setDropdownOpen((v) => !v)}
                    aria-label="User menu"
                  >
                    <span className="pnav__avatar-initials">{initials}</span>
                    <svg
                      className={`pnav__caret ${dropdownOpen ? "pnav__caret--open" : ""}`}
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                    >
                      <path
                        d="M2 4l4 4 4-4"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>

                  {dropdownOpen && (
                    <div className="pnav__dropdown">
                      <div className="pnav__dropdown-header">
                        <p className="pnav__dropdown-name">
                          {user.name || "Player"}
                        </p>
                        <p className="pnav__dropdown-email">{user.email}</p>
                        <span className="pnav__dropdown-role">
                          {user.role || "Player"}
                        </span>
                      </div>
                      <div className="pnav__dropdown-divider" />
                      <Link
                        className="pnav__dropdown-item"
                        to="/profile?tab=settings"
                      >
                        <svg
                          width="15"
                          height="15"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                        Profile Settings
                      </Link>
                      <Link
                        className="pnav__dropdown-item"
                        to="/profile?tab=bookings"
                      >
                        <svg
                          width="15"
                          height="15"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect
                            x="3"
                            y="4"
                            width="18"
                            height="18"
                            rx="2"
                            ry="2"
                          />
                          <line x1="16" y1="2" x2="16" y2="6" />
                          <line x1="8" y1="2" x2="8" y2="6" />
                          <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                        My Bookings
                      </Link>
                      <Link
                        className="pnav__dropdown-item"
                        to="/profile?tab=security"
                      >
                        <svg
                          width="15"
                          height="15"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect
                            x="3"
                            y="11"
                            width="18"
                            height="11"
                            rx="2"
                            ry="2"
                          />
                          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                        Security
                      </Link>
                      <div className="pnav__dropdown-divider" />
                      <button
                        className="pnav__dropdown-item pnav__dropdown-item--logout"
                        onClick={logout}
                      >
                        <svg
                          width="15"
                          height="15"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                          <polyline points="16 17 21 12 16 7" />
                          <line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link className="pnav__link" to="/login">
                  Sign In
                </Link>
                <Link className="pnav__cta" to="/register">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* ── Mobile hamburger ──────────────────────── */}
          <button
            className={`pnav__burger ${menuOpen ? "pnav__burger--open" : ""}`}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>

      {/* ── Mobile Drawer ──────────────────────────────────────────── */}
      <div className={`pnav__drawer ${menuOpen ? "pnav__drawer--open" : ""}`}>
        {user ? (
          <>
            <div className="pnav__drawer-user">
              <div className="pnav__drawer-avatar">{initials}</div>
              <div>
                <p style={{ fontWeight: 700, margin: 0 }}>{user.name}</p>
                <p style={{ fontSize: 12, color: "#6b7280", margin: 0 }}>
                  {user.email}
                </p>
              </div>
            </div>
            <Link className="pnav__drawer-link" to="/home">
              🏠 Home
            </Link>
            <Link className="pnav__drawer-link" to="/explore">
              🎾 Explore Courts
            </Link>
            {isOwner && (
              <Link className="pnav__drawer-link" to="/owner">
                📊 Dashboard
              </Link>
            )}
            <Link className="pnav__drawer-link" to="/profile?tab=settings">
              👤 Profile Settings
            </Link>
            <Link className="pnav__drawer-link" to="/profile?tab=bookings">
              📅 My Bookings
            </Link>
            <Link className="pnav__drawer-link" to="/profile?tab=security">
              🔒 Security
            </Link>
            <button className="pnav__drawer-logout" onClick={logout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link className="pnav__drawer-link" to="/login">
              Sign In
            </Link>
            <Link className="pnav__drawer-link" to="/register">
              Register
            </Link>
          </>
        )}
      </div>

      {/* Overlay to close mobile menu */}
      {menuOpen && (
        <div className="pnav__overlay" onClick={() => setMenuOpen(false)} />
      )}
    </>
  );
}
