import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import React from "react";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef();

  useEffect(() => {
    // Fetch user profile
    axios
      .get("http://localhost:8000/api/auth/profile", {
        withCredentials: true,
      })
      .then((res) => setUser(res.data))
      .catch((err) => {
        console.error("Failed to fetch user:", err.message);
        navigate("/login");
      });
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await axios.post(
      "http://localhost:8000/api/auth/logout",
      {},
      { withCredentials: true }
    );
    setAuth(false);
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow px-6 py-4 flex justify-between items-center sticky top-0 z-50">
      <h1 className="text-xl font-bold text-blue-600">User Dashboard</h1>
      {user && (
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded hover:bg-gray-200"
          >
            <span>{user.name}</span>
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 bg-white shadow rounded w-40">
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 hover:bg-red-50 text-red-600"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
