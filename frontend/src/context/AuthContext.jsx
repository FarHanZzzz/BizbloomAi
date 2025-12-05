import { createContext, useContext, useState } from "react";
import { api } from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    setToken(data.access_token);
    api.defaults.headers.common.Authorization = `Bearer ${data.access_token}`;
  };

  const register = async (email, password) => {
    const { data } = await api.post("/auth/register", { email, password });
    setToken(data.access_token);
    api.defaults.headers.common.Authorization = `Bearer ${data.access_token}`;
  };

  const value = { token, login, register };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

