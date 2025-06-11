// context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

// 1. Create context
const AuthContext = createContext();

// 2. Create provider component
export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/auth/refresh", {
        withCredentials: true,
      })
      .then((res) => {
        console.log("✅ Token refreshed", res.data);
        setAuth(true);
      })
      .catch((err) => {
        console.log("❌ Refresh failed", err.response?.data || err.message);
        setAuth(false);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <AuthContext.Provider value={{ auth, loading, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. Create custom hook
export const useAuth = () => useContext(AuthContext);
