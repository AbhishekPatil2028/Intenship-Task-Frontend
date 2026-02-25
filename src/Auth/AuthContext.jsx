import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [initialized, setInitialized] = useState(false);

  // ✅ Load token once
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
    }
    setInitialized(true);
  }, []);

  const login = (jwtToken) => {
    localStorage.setItem("token", jwtToken);
    setToken(jwtToken);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    toast.success("Logged out successfully 👋");
  };

  // ⛔ Prevent render loop before init
  if (!initialized) return null;

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
