import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "../utils/axios"; // ✅ Centralized Axios instance

// 1. Create context
const AuthContext = createContext();

// 2. Create provider component
export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get("/auth/refresh");
        console.log("✅ Token refreshed:", res.data);
        setAuth(true);
      } catch (err) {
        console.log("❌ Refresh failed:", err.response?.data || err.message);
        setAuth(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ auth, loading, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. Custom hook for accessing auth context
export const useAuth = () => useContext(AuthContext);
