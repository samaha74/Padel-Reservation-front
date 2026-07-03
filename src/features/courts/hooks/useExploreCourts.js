import { useState, useEffect, useCallback } from "react";
import { getPublicCourts } from "../api/courtsApi";

export default function useExploreCourts() {
  const [courts, setCourts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    location: "",
    price: "",
    name: "",
  });

  // ─── Fetch courts from backend ─────────
  const fetchCourts = useCallback(async (activeFilters) => {
    setLoading(true);
    setError(null);

    try {
      const params = {
        location: activeFilters.location || undefined,
        price: activeFilters.price || undefined,
      };

      const data = await getPublicCourts(params);

      const list = Array.isArray(data) ? data : data.courts || [];

      // name filter frontend only
      const filtered = activeFilters.name
        ? list.filter((c) =>
            c.name.toLowerCase().includes(activeFilters.name.toLowerCase())
          )
        : list;

      setCourts(filtered);
    } catch (err) {
      setError("Could not load courts. Please make sure backend is running.");
      setCourts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // ─── initial load ─────────
  useEffect(() => {
    fetchCourts(filters);
  }, []);

  // ─── input change ─────────
  const handleFilterChange = (e) => {
    const { name, value } = e.target;

    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ─── search button ─────────
  const handleSearch = (e) => {
    e.preventDefault();
    fetchCourts(filters);
  };

  // ─── clear filters ─────────
  const handleClear = () => {
    const empty = {
      location: "",
      price: "",
      name: "",
    };

    setFilters(empty);
    fetchCourts(empty);
  };

  return {
    courts,
    loading,
    error,
    filters,
    handleFilterChange,
    handleSearch,
    handleClear,
  };
}