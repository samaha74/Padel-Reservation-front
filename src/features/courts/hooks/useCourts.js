import { useCallback, useEffect, useState } from "react";
import * as courtsApi from "../api/courtsApi";

export default function useCourts() {
  const [courts, setCourts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadCourts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await courtsApi.getOwnerCourts();
      setCourts(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      setError(err?.message || "Unable to load courts");
      setCourts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCourts();
  }, [loadCourts]);

  const addCourt = async (courtData) => {
    const court = await courtsApi.createCourt(courtData);
    // Refresh courts to get full data with all fields
    await loadCourts();
    return court;
  };

  const updateCourt = async (id, courtData) => {
    const updated = await courtsApi.updateCourt(id, courtData);
    setCourts((prev) =>
      prev.map((court) =>
        court.id === id || court._id === id ? updated : court,
      ),
    );
    return updated;
  };

  const deleteCourt = async (id) => {
    await courtsApi.deleteCourt(id);
    setCourts((prev) => prev.filter((court) => court.id !== id && court._id !== id));
  };

  return {
    courts,
    loading,
    error,
    addCourt,
    updateCourt,
    deleteCourt,
    refresh: loadCourts,
  };
}
