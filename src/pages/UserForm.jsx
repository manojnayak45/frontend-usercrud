import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../utils/axios"; // using shared instance
import Navbar from "../components/Navbar";

export default function UserForm() {
  const { id } = useParams(); // If id exists, we're editing
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    age: "",
  });

  useEffect(() => {
    if (!id) return; // ✅ Skip fetching if creating a new user

    axios
      .get(`/userdetails/${id}`)
      .then((res) => {
        setFormData(res.data);
      })
      .catch((err) => {
        console.error(
          "Failed to fetch user:",
          err.response?.data || err.message
        );
      });
  }, [id]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await axios.put(`/userdetails/${id}`, formData);
      } else {
        await axios.post("/userdetails", formData);
      }
      navigate("/users");
    } catch (err) {
      console.error("Failed to save user:", err.response?.data || err.message);
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-semibold mb-4 text-blue-600">
          {id ? "Edit User" : "Create User"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
            className="w-full border px-3 py-2 rounded"
            required
          />
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full border px-3 py-2 rounded"
            required
          />
          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone"
            className="w-full border px-3 py-2 rounded"
          />
          <input
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Address"
            className="w-full border px-3 py-2 rounded"
          />
          <input
            name="age"
            type="number"
            value={formData.age}
            onChange={handleChange}
            placeholder="Age"
            className="w-full border px-3 py-2 rounded"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {id ? "Update" : "Create"}
          </button>
        </form>
      </div>
    </>
  );
}
