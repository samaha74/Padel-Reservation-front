// import React, { useState, useEffect, useCallback } from "react";
// import { useNavigate } from "react-router-dom";
// import CourtCard from "../../components/CourtCard";
// import { getPublicCourts } from "../../features/courts/api/courtsApi";
// import { useAuth } from "../../context/AuthContext";
// import "./Home.css";

// export default function Home() {
//   const navigate = useNavigate();
//   const { user } = useAuth();

//   const [courts, setCourts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const [filters, setFilters] = useState({
//     location: "",
//     name: "",
//     price: "",
//   });

//   const fetchCourts = useCallback(async (activeFilters) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const data = await getPublicCourts({
//         location: activeFilters.location,
//         price: activeFilters.price,
//       });
//       const filtered = activeFilters.name
//         ? data.filter((c) =>
//             c.name.toLowerCase().includes(activeFilters.name.toLowerCase())
//           )
//         : data;
//       setCourts(filtered);
//     } catch (err) {
//       console.error(err);
//       setError("Failed to load courts.");
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchCourts(filters);
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFilters((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSearch = (e) => {
//     e.preventDefault();
//     fetchCourts(filters);
//   };

//   const handleClear = () => {
//     const empty = { location: "", name: "", price: "" };
//     setFilters(empty);
//     fetchCourts(empty);
//   };

//   const hasFilters = filters.location || filters.name || filters.price;

//   return (
//     <div className="home-page">

//       {/* ── HERO ── */}
//       <section className="home-hero">
//         <div className="home-hero__bg">
//           <div className="home-hero__orb home-hero__orb--1" />
//           <div className="home-hero__orb home-hero__orb--2" />
//           <div className="home-hero__orb home-hero__orb--3" />
//         </div>
//         <div className="home-hero__content">
//           <div className="home-hero__badge">🎾 Egypt's #1 Padel Platform</div>
//           <h1 className="home-hero__title">
//             Find &amp; Book Your<br />
//             <span className="home-hero__accent">Perfect Court</span>
//           </h1>
//           <p className="home-hero__sub">
//             Browse top-rated padel courts across Cairo and book your session instantly.
//           </p>
//           <div className="home-hero__actions">
//             {user ? (
//               <button
//                 className="home-hero__cta"
//                 onClick={() => navigate(user.role === "Owner" ? "/owner" : "/explore")}
//               >
//                 {user.role === "Owner" ? "My Dashboard" : "Browse Courts"}
//                 <span className="home-hero__cta-arrow">→</span>
//               </button>
//             ) : (
//               <button className="home-hero__cta" onClick={() => navigate("/register")}>
//                 Get Started
//                 <span className="home-hero__cta-arrow">→</span>
//               </button>
//             )}
//             <button
//               className="home-hero__secondary"
//               onClick={() => document.getElementById('courts').scrollIntoView({ behavior: 'smooth' })}
//             >
//               Explore Below ↓
//             </button>
//           </div>
//           <div className="home-hero__stats">
//             <div className="home-hero__stat">
//               <span className="home-hero__stat-num">50+</span>
//               <span className="home-hero__stat-label">Courts</span>
//             </div>
//             <div className="home-hero__stat-divider" />
//             <div className="home-hero__stat">
//               <span className="home-hero__stat-num">1k+</span>
//               <span className="home-hero__stat-label">Bookings</span>
//             </div>
//             <div className="home-hero__stat-divider" />
//             <div className="home-hero__stat">
//               <span className="home-hero__stat-num">4.8★</span>
//               <span className="home-hero__stat-label">Rating</span>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* ── COURTS SECTION ── */}
//       <section className="home-courts" id="courts">
//         <div className="home-courts__inner">

//           {/* Section Header */}
//           <div className="home-section-header">
//             <div>
//               <h2 className="home-section-title">Available Courts</h2>
//               <p className="home-section-sub">Pick your court and lock in your slot</p>
//             </div>
//             {!loading && !error && (
//               <span className="home-count">
//                 <strong>{courts.length}</strong> court{courts.length !== 1 ? "s" : ""} found
//               </span>
//             )}
//           </div>

//           {/* Filter Bar */}
//           <form className="home-filter-bar" onSubmit={handleSearch}>
//             <div className="home-filter-field">
//               <span className="home-filter-icon">📍</span>
//               <input
//                 className="home-filter-input"
//                 name="location"
//                 value={filters.location}
//                 onChange={handleChange}
//                 placeholder="Location"
//               />
//             </div>

//             <div className="home-filter-field">
//               <span className="home-filter-icon">🏟️</span>
//               <input
//                 className="home-filter-input"
//                 name="name"
//                 value={filters.name}
//                 onChange={handleChange}
//                 placeholder="Court name"
//               />
//             </div>

//             <div className="home-filter-field">
//               <span className="home-filter-icon">💰</span>
//               <input
//                 className="home-filter-input"
//                 name="price"
//                 type="number"
//                 value={filters.price}
//                 onChange={handleChange}
//                 placeholder="Max price (EGP)"
//               />
//             </div>

//             <button className="home-filter-search" type="submit">
//               Search
//             </button>

//             {hasFilters && (
//               <button className="home-filter-clear" type="button" onClick={handleClear}>
//                 Clear
//               </button>
//             )}
//           </form>

//           {/* Loading */}
//           {loading && (
//             <div className="home-state">
//               <div className="home-spinner" />
//               <h3>Finding courts…</h3>
//               <p>Just a moment</p>
//             </div>
//           )}

//           {/* Error */}
//           {error && !loading && (
//             <div className="home-error">
//               <span>⚠️</span>
//               <p>{error}</p>
//             </div>
//           )}

//           {/* Grid */}
//           {!loading && !error && courts.length > 0 && (
//             <div className="home-grid">
//               {courts.map((court) => (
//                 <CourtCard key={court._id} court={court} />
//               ))}
//             </div>
//           )}

//           {/* Empty */}
//           {!loading && !error && courts.length === 0 && (
//             <div className="home-state">
//               <div className="home-state__icon">🎾</div>
//               <h3>No courts found</h3>
//               <p>Try adjusting your filters or clear them to see all courts.</p>
//               {hasFilters && (
//                 <button className="home-state__btn" onClick={handleClear}>
//                   Clear Filters
//                 </button>
//               )}
//             </div>
//           )}

//         </div>
//       </section>
//     </div>
//   );
// }


import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import CourtCard from "../../components/CourtCard";
import { getPublicCourts } from "../../features/courts/api/courtsApi";
import { useAuth } from "../../context/AuthContext";
import "./Home.css";

// ── How It Works steps ───────────────────────────────────────────────────────
const HOW_STEPS = [
  { icon: "🔍", title: "Find a Court",   desc: "Browse courts across Cairo filtered by location, price, and availability." },
  { icon: "📅", title: "Pick a Slot",    desc: "Choose your date and time slot. Instant availability check — no waiting." },
  { icon: "✅", title: "Confirm & Play", desc: "Confirm your booking in seconds and show up ready to play." },
];

// ── Why Us features ──────────────────────────────────────────────────────────
const FEATURES = [
  { icon: "⚡", title: "Instant Booking",    desc: "No phone calls. Book your slot online in under 60 seconds." },
  { icon: "🏆", title: "Verified Courts",    desc: "Every court is verified, rated, and reviewed by real players." },
  { icon: "💳", title: "Transparent Pricing", desc: "See the full price before you book. Zero hidden fees." },
  { icon: "🔒", title: "Secure & Reliable",  desc: "Your data and bookings are protected end-to-end." },
];

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [courts,  setCourts]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);
  const [filters, setFilters] = useState({ location: "", name: "", price: "" });

  const fetchCourts = useCallback(async (activeFilters) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPublicCourts({
        location: activeFilters.location,
        price:    activeFilters.price,
      });
      const filtered = activeFilters.name
        ? data.filter((c) => c.name.toLowerCase().includes(activeFilters.name.toLowerCase()))
        : data;
      setCourts(filtered);
    } catch (err) {
      setError("Failed to load courts.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCourts(filters); }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = (e) => { e.preventDefault(); fetchCourts(filters); };

  const handleClear = () => {
    const empty = { location: "", name: "", price: "" };
    setFilters(empty);
    fetchCourts(empty);
  };

  const hasFilters = filters.location || filters.name || filters.price;

  return (
    <div className="home-page">

      {/* ══════════════════════ HERO ══════════════════════ */}
      <section className="home-hero">
        <div className="home-hero__bg">
          <div className="home-hero__orb home-hero__orb--1" />
          <div className="home-hero__orb home-hero__orb--2" />
          <div className="home-hero__orb home-hero__orb--3" />
        </div>
        <div className="home-hero__content">
          <div className="home-hero__badge">🎾 Egypt's #1 Padel Platform</div>
          <h1 className="home-hero__title">
            Find &amp; Book Your<br />
            <span className="home-hero__accent">Perfect Court</span>
          </h1>
          <p className="home-hero__sub">
            Browse top-rated padel courts across Cairo and book your session instantly.
          </p>
          <div className="home-hero__actions">
            {user ? (
              <button
                className="home-hero__cta"
                onClick={() => navigate(user.role === "Owner" ? "/owner" : "/explore")}
              >
                {user.role === "Owner" ? "My Dashboard" : "Browse Courts"}
                <span>→</span>
              </button>
            ) : (
              <button className="home-hero__cta" onClick={() => navigate("/register")}>
                Get Started <span>→</span>
              </button>
            )}
            <button
              className="home-hero__secondary"
              onClick={() => document.getElementById("courts").scrollIntoView({ behavior: "smooth" })}
            >
              Explore Below ↓
            </button>
          </div>

          {/* Stats */}
          <div className="home-hero__stats">
            {[
              { num: "50+",  label: "Courts"   },
              { num: "1k+",  label: "Bookings" },
              { num: "4.8★", label: "Rating"   },
            ].map((s, i) => (
              <React.Fragment key={s.label}>
                {i > 0 && <div className="home-hero__stat-divider" />}
                <div className="home-hero__stat">
                  <span className="home-hero__stat-num">{s.num}</span>
                  <span className="home-hero__stat-label">{s.label}</span>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════ HOW IT WORKS ══════════════════════ */}
      <section className="home-how">
        <div className="home-section-inner">
          <div className="home-section-header home-section-header--center">
            <h2 className="home-section-title">How It Works</h2>
            <p className="home-section-sub">Book your court in 3 easy steps</p>
          </div>
          <div className="home-how__grid">
            {HOW_STEPS.map((step, i) => (
              <div className="home-how__card" key={step.title}>
                <div className="home-how__num">{i + 1}</div>
                <div className="home-how__icon">{step.icon}</div>
                <h3 className="home-how__title">{step.title}</h3>
                <p className="home-how__desc">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════ COURTS SECTION ══════════════════════ */}
      <section className="home-courts" id="courts">
        <div className="home-section-inner">

          <div className="home-section-header">
            <div>
              <h2 className="home-section-title">Available Courts</h2>
              <p className="home-section-sub">Pick your court and lock in your slot</p>
            </div>
            {!loading && !error && (
              <span className="home-count">
                <strong>{courts.length}</strong> court{courts.length !== 1 ? "s" : ""} found
              </span>
            )}
          </div>

          {/* Filter bar */}
          <form className="home-filter-bar" onSubmit={handleSearch}>
            <div className="home-filter-field">
              <span className="home-filter-icon">📍</span>
              <input className="home-filter-input" name="location" value={filters.location} onChange={handleChange} placeholder="Location" />
            </div>
            <div className="home-filter-field">
              <span className="home-filter-icon">🏟️</span>
              <input className="home-filter-input" name="name" value={filters.name} onChange={handleChange} placeholder="Court name" />
            </div>
            <div className="home-filter-field">
              <span className="home-filter-icon">💰</span>
              <input className="home-filter-input" name="price" type="number" value={filters.price} onChange={handleChange} placeholder="Max price (EGP)" />
            </div>
            <button className="home-filter-search" type="submit">Search</button>
            {hasFilters && (
              <button className="home-filter-clear" type="button" onClick={handleClear}>✕ Clear</button>
            )}
          </form>

          {loading && (
            <div className="home-state">
              <div className="home-spinner" />
              <h3>Finding courts…</h3>
              <p>Just a moment</p>
            </div>
          )}

          {error && !loading && (
            <div className="home-error"><span>⚠️</span><p>{error}</p></div>
          )}

          {!loading && !error && courts.length > 0 && (
            <div className="home-grid">
              {courts.map((court) => (
                <CourtCard key={court._id} court={court} />
              ))}
            </div>
          )}

          {!loading && !error && courts.length === 0 && (
            <div className="home-state">
              <div className="home-state__icon">🎾</div>
              <h3>No courts found</h3>
              <p>Try adjusting your filters or clear them to see all courts.</p>
              {hasFilters && (
                <button className="home-state__btn" onClick={handleClear}>Clear Filters</button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ══════════════════════ WHY US ══════════════════════ */}
      <section className="home-why">
        <div className="home-section-inner">
          <div className="home-section-header home-section-header--center">
            <h2 className="home-section-title">Why PadelClub?</h2>
            <p className="home-section-sub">Everything you need, nothing you don't</p>
          </div>
          <div className="home-why__grid">
            {FEATURES.map((f) => (
              <div className="home-why__card" key={f.title}>
                <div className="home-why__icon">{f.icon}</div>
                <h3 className="home-why__title">{f.title}</h3>
                <p className="home-why__desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════ CTA BANNER ══════════════════════ */}
      {!user && (
        <section className="home-cta-banner">
          <div className="home-section-inner home-cta-banner__inner">
            <div>
              <h2 className="home-cta-banner__title">Ready to play?</h2>
              <p className="home-cta-banner__sub">
                Join thousands of players booking padel courts across Cairo.
              </p>
            </div>
            <div className="home-cta-banner__btns">
              <button className="home-hero__cta" onClick={() => navigate("/register")}>
                Create Free Account →
              </button>
              <button className="home-hero__secondary" onClick={() => navigate("/login")}>
                Sign In
              </button>
            </div>
          </div>
        </section>
      )}

    </div>
  );
}