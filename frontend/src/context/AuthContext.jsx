import { createContext, useContext, useState, useEffect } from "react";
import { api } from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("bizbloom_token"));
  const [user, setUser] = useState(null);

  // Set auth header on token change
  useEffect(() => {
    if (token) {
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
      localStorage.setItem("bizbloom_token", token);
      fetchUser();
    } else {
      delete api.defaults.headers.common.Authorization;
      localStorage.removeItem("bizbloom_token");
      setUser(null);
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const { data } = await api.get("/auth/me");
      setUser(data.user);
    } catch (err) {
      console.error("Failed to fetch user:", err);
      // Token might be invalid, clear it
      if (err.response?.status === 401) {
        setToken(null);
      }
    }
  };

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    setToken(data.access_token);
    return data;
  };

  const register = async (email, password) => {
    const { data } = await api.post("/auth/register", { email, password });
    setToken(data.access_token);
    return data;
  };

  const logout = () => {
    setToken(null);
  };

  const updateProfile = async (profile) => {
    const { data } = await api.put("/auth/profile", { profile });
    setUser(prev => ({ ...prev, profile }));
    return data;
  };

  const value = {
    token,
    user,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!token
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
