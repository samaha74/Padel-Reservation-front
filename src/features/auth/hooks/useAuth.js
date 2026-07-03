import { useEffect, useState } from "react";

const DEFAULT_OWNER = {
  id: "owner-1",
  role: "owner",
  name: "Padel Owner",
  email: "owner@padel.com",
};

export default function useAuth() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = window.localStorage.getItem("padel-user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
        return;
      } catch {
        window.localStorage.removeItem("padel-user");
      }
    }
    setUser(DEFAULT_OWNER);
    window.localStorage.setItem("padel-user", JSON.stringify(DEFAULT_OWNER));
  }, []);

  const loginAsOwner = () => {
    window.localStorage.setItem("padel-user", JSON.stringify(DEFAULT_OWNER));
    setUser(DEFAULT_OWNER);
  };

  const logout = () => {
    window.localStorage.removeItem("padel-user");
    setUser(null);
  };

  return {
    user,
    isOwner: user?.role === "owner",
    loginAsOwner,
    logout,
  };
}
