import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../utils/axios"; // Centralized Axios instance
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

export default function UserTable() {
  const [userList, setUserList] = useState([]);
  const { setAuth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("/userdetails");
      setUserList(res.data);
    } catch (err) {
      console.error("Error fetching users:", err.response?.data || err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/userdetails/${id}`);
      fetchUsers();
    } catch (err) {
      console.error(
        "Failed to delete user:",
        err.response?.data || err.message
      );
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(
        "/auth/logout",
        {},
        {
          withCredentials: true, // ✅ This is required for cookies to be cleared
        }
      );

      setAuth(false); // clear local auth state
      navigate("/login"); // redirect to login
    } catch (err) {
      console.error("Logout failed:", err.response?.data || err.message);
    }
  };

  return (
    <>
      <Navbar />
      <div className="p-10 bg-blue-50 min-h-screen">
        <div className="max-w-5xl mx-auto bg-white p-6 rounded shadow">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
            <h2 className="text-2xl text-blue-600 font-bold">User Table</h2>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <Link
                to="/users/create"
                className="bg-blue-500 text-white px-4 py-2 rounded text-center"
              >
                + Add User
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Logout
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full border text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border p-2">Name</th>
                  <th className="border p-2">Email</th>
                  <th className="border p-2">Phone</th>
                  <th className="border p-2">Address</th>
                  <th className="border p-2">Age</th>
                  <th className="border p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {userList.map((u) => (
                  <tr key={u._id}>
                    <td className="border p-2">{u.name}</td>
                    <td className="border p-2">{u.email}</td>
                    <td className="border p-2">{u.phone}</td>
                    <td className="border p-2">{u.address}</td>
                    <td className="border p-2">{u.age}</td>
                    <td className="border p-2 space-x-2">
                      <Link
                        to={`/users/edit/${u._id}`}
                        className="text-blue-600 hover:underline"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(u._id)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
