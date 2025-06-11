import React, { useEffect, useState } from "react";
import axios from "../utils/axios"; // centralized Axios
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function UserDetails() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    age: "",
  });
  const [userList, setUserList] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate();
  const { setAuth } = useAuth();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("/userdetails");
      setUserList(res.data);
    } catch (err) {
      console.error(
        "Failed to fetch users:",
        err.response?.data || err.message
      );
    }
  };

  const validate = () => {
    const { name, email, phone, address, age } = form;
    if (!name || !email || !phone || !address || !age) {
      alert("All fields are required");
      return false;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      alert("Invalid email");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      if (editingId) {
        await axios.put(`/userdetails/${editingId}`, form);
      } else {
        await axios.post("/userdetails", form);
      }
      setForm({ name: "", email: "", phone: "", address: "", age: "" });
      setEditingId(null);
      fetchUsers();
    } catch (err) {
      console.error("Submit failed:", err.response?.data || err.message);
    }
  };

  const handleEdit = (user) => {
    setForm(user);
    setEditingId(user._id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/userdetails/${id}`);
      fetchUsers();
    } catch (err) {
      console.error("Delete failed:", err.response?.data || err.message);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post("/auth/logout");
      setAuth(false);
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err.response?.data || err.message);
    }
  };

  return (
    <div className="min-h-screen p-10 bg-gradient-to-br from-blue-100 via-white to-blue-200">
      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-xl p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-blue-600">
            User Details Form
          </h2>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition"
          >
            Logout
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <input
            className="border p-2 rounded"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            className="border p-2 rounded"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            className="border p-2 rounded"
            placeholder="Phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          <input
            className="border p-2 rounded"
            placeholder="Address"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />
          <input
            className="border p-2 rounded"
            placeholder="Age"
            type="number"
            value={form.age}
            onChange={(e) => setForm({ ...form, age: e.target.value })}
          />
        </div>

        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          {editingId ? "Update Details" : "Add Details"}
        </button>

        <hr className="my-6" />

        <h3 className="text-xl font-semibold text-gray-700 mb-4">
          User Details Table
        </h3>
        <table className="w-full text-left border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Phone</th>
              <th className="p-2 border">Address</th>
              <th className="p-2 border">Age</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {userList.map((user) => (
              <tr key={user._id} className="border-t">
                <td className="p-2 border">{user.name}</td>
                <td className="p-2 border">{user.email}</td>
                <td className="p-2 border">{user.phone}</td>
                <td className="p-2 border">{user.address}</td>
                <td className="p-2 border">{user.age}</td>
                <td className="p-2 border space-x-2">
                  <button
                    onClick={() => handleEdit(user)}
                    className="text-blue-500 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="text-red-500 hover:underline"
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
  );
}
