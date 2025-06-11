import React, { useEffect, useState } from "react";
import axios from "axios";
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
    const res = await axios.get("http://localhost:8000/api/userdetails", {
      withCredentials: true,
    });
    setUserList(res.data);
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

    if (editingId) {
      await axios.put(
        `http://localhost:8000/api/userdetails/${editingId}`,
        form,
        {
          withCredentials: true,
        }
      );
    } else {
      await axios.post("http://localhost:8000/api/userdetails", form, {
        withCredentials: true,
      });
    }

    setForm({ name: "", email: "", phone: "", address: "", age: "" });
    setEditingId(null);
    fetchUsers();
  };

  const handleEdit = (user) => {
    setForm(user);
    setEditingId(user._id);
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:8000/api/userdetails/${id}`, {
      withCredentials: true,
    });
    fetchUsers();
  };

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:8000/api/auth/logout",
        {},
        { withCredentials: true }
      );
      setAuth(false); // update context
      navigate("/login"); // redirect to login page
    } catch (err) {
      console.error("Logout failed:", err.response?.data || err.message);
    }
  };

  return (
    <div className="min-h-screen p-10 bg-gradient-to-br from-blue-100 via-white to-blue-200">
      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-xl p-8">
        <h2 className="text-2xl font-semibold mb-6 text-blue-600">
          User Details Form
        </h2>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition"
        >
          Logout
        </button>

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
