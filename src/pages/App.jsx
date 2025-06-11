import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Login from "./Login";
import Signup from "./Signup";
import Todo from "./Todo";
import UserDetails from "./UserDetails";
import { useAuth } from "../context/AuthContext";
import UserForm from "./UserForm";
import UserTable from "./UserTable";

export default function App() {
  const { auth, loading } = useAuth();

  if (loading) {
    return (
      <div className="text-center p-10 text-gray-600">
        Checking authentication...
      </div>
    );
  }

  // ✅ ProtectedRoute component
  const ProtectedRoute = ({ children }) => {
    return auth ? children : <Navigate to="/login" />;
  };

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />

      <Route
        path="/login"
        element={auth ? <Navigate to="/users" /> : <Login />}
      />
      <Route
        path="/signup"
        element={auth ? <Navigate to="/userform" /> : <Signup />}
      />

      {/* ✅ Protected routes */}
      <Route
        path="/todo"
        element={
          <ProtectedRoute>
            <Todo />
          </ProtectedRoute>
        }
      />
      <Route
        path="/userdetails"
        element={
          <ProtectedRoute>
            <UserDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/users"
        element={
          <ProtectedRoute>
            <UserTable />
          </ProtectedRoute>
        }
      />
      <Route
        path="/users/create"
        element={
          <ProtectedRoute>
            <UserForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/users/edit/:id"
        element={
          <ProtectedRoute>
            <UserForm />
          </ProtectedRoute>
        }
      />

      {/* Catch-all route */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
