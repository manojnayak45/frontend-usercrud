import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../utils/axios";
import Navbar from "../components/Navbar";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

// ✅ Yup validation schema
const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phone: Yup.string().optional(),
  address: Yup.string().optional(),
  age: Yup.number()
    .typeError("Age must be a number")
    .min(1, "Age must be greater than 0")
    .optional(),
});

export default function UserForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    age: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      axios
        .get(`/userdetails/${id}`)
        .then((res) => setInitialValues(res.data))
        .catch((err) =>
          console.error(
            "Failed to fetch user:",
            err.response?.data || err.message
          )
        );
    }
  }, [id]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      if (id) {
        await axios.put(`/userdetails/${id}`, values);
      } else {
        await axios.post("/userdetails", values);
      }
      navigate("/users");
    } catch (err) {
      console.error("Failed to save user:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-semibold mb-4 text-blue-600">
          {id ? "Edit User" : "Create User"}
        </h2>

        <Formik
          initialValues={initialValues}
          enableReinitialize
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              {["name", "email", "phone", "address", "age"].map((field) => (
                <div key={field}>
                  <Field
                    name={field}
                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                    className="w-full border px-3 py-2 rounded"
                    type={field === "age" ? "number" : "text"}
                  />
                  <ErrorMessage
                    name={field}
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
              ))}

              <button
                type="submit"
                disabled={isSubmitting || loading}
                className={`w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex justify-center ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {loading ? (
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    ></path>
                  </svg>
                ) : null}
                {id ? "Update" : "Create"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
}
