import { useState, useEffect, useCallback } from "react";
import {
  getMyProfile,
  updateMyProfile,
  updatePassword,
} from "../api/profileApi";

export default function useProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getMyProfile();
      setProfile(data);
    } catch (err) {
      console.log(err.response?.data?.message);
      setError(err.response?.data?.message || "Failed to load profile.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const saveProfile = async (values) => {
    try {
      setSaving(true);
      setError(null);
      const updated = await updateMyProfile(values);
      setProfile(updated);
      // Sync to localStorage so Navbar stays updated
      const stored = localStorage.getItem("padel-user");
      if (stored) {
        const parsed = JSON.parse(stored);
        localStorage.setItem(
          "padel-user",
          JSON.stringify({
            ...parsed,
            name: updated.name,
            email: updated.email,
          }),
        );
      }
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Failed to save profile.",
      };
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async (values) => {
    try {
      setSaving(true);
      await updatePassword(values);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Failed to update password.",
      };
    } finally {
      setSaving(false);
    }
  };

  return {
    profile,
    loading,
    saving,
    error,
    saveProfile,
    changePassword,
    refetch: fetchProfile,
  };
}
