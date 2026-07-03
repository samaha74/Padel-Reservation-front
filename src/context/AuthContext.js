import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();
const STORAGE_KEY = 'padel-user';
const API_BASE = 'http://localhost:5000';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const saveUser = (user) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch (error) {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    }
    setLoading(false);
  }, []);

  const login = async ({ email, password }) => {
    const response = await axios.post(`${API_BASE}/auth/login`, {
      email,
      password,
    });

    const data = response.data;
    const savedUser = {
      email,
      role: data.user?.role || data.role || 'Player',
      name: data.user?.name || data.name || email,
      token: data.token || data.user?.token || '',
      ...data.user,
    };

    setUser(savedUser);
    saveUser(savedUser);
    return savedUser;
  };

  const register = async ({ firstName, lastName, email, password, role }) => {
    const response = await axios.post(`${API_BASE}/auth/register`, {
      name: `${firstName} ${lastName}`,
      email,
      password,
      role,
    });

    const data = response.data;
    const savedUser = {
      email,
      role: data.user?.role || data.role || role || 'Player',
      name: data.user?.name || data.name || `${firstName} ${lastName}`,
      token: data.token || data.user?.token || '',
      ...data.user,
    };

    setUser(savedUser);
    saveUser(savedUser);
    return savedUser;
  };

  const logout = () => {
    setUser(null);
    window.localStorage.removeItem(STORAGE_KEY);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isOwner: user?.role === 'Owner',
    isPlayer: user?.role === 'Player',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};