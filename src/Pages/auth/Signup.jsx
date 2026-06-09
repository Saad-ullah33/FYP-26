import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useFormik } from "formik";

const Signup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // 🔐 PASSWORD STRENGTH
  const getStrength = (password) => {
    let score = 0;
    if (password.length > 5) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[@$!%*?&]/.test(password)) score++;
    return score;
  };

  // 🧠 VALIDATION
  const validationSchema = Yup.object({
    name: Yup.string().min(3).required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    phone: Yup.string().min(10).required("Phone is required"),
    password: Yup.string().min(6).required("Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
    },
    validationSchema,

    onSubmit: async (values) => {
      setLoading(true);

      try {
        await axios.post(
          "http://localhost:8080/api/auth/signup",
          values,
          { headers: { "Content-Type": "application/json" } }
        );

        alert("Signup successful! Please verify your email.");
        navigate("/login");

      } catch (err) {
        alert(err.response?.data || "Signup failed");
      } finally {
        setLoading(false);
      }
    },
  });

  const strength = getStrength(formik.values.password);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-white to-blue-100 px-4">

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 border border-blue-100"
      >

        {/* HEADER */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-blue-700">
            Create Account
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Join us and start your journey
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={formik.handleSubmit} className="space-y-4">

          {/* NAME */}
          <input
            name="name"
            placeholder="Full Name"
            onChange={formik.handleChange}
            value={formik.values.name}
            className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-400 outline-none"
          />
          {formik.errors.name && (
            <p className="text-red-500 text-sm">{formik.errors.name}</p>
          )}

          {/* EMAIL */}
          <input
            name="email"
            placeholder="Email Address"
            onChange={formik.handleChange}
            value={formik.values.email}
            className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-400 outline-none"
          />
          {formik.errors.email && (
            <p className="text-red-500 text-sm">{formik.errors.email}</p>
          )}

          {/* PHONE */}
          <input
            name="phone"
            placeholder="Phone Number"
            onChange={formik.handleChange}
            value={formik.values.phone}
            className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-400 outline-none"
          />
          {formik.errors.phone && (
            <p className="text-red-500 text-sm">{formik.errors.phone}</p>
          )}

          {/* PASSWORD */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={formik.handleChange}
            value={formik.values.password}
            className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-400 outline-none"
          />
          {formik.errors.password && (
            <p className="text-red-500 text-sm">{formik.errors.password}</p>
          )}

          {/* 🔐 PASSWORD STRENGTH */}
          <div className="text-sm">
            Password Strength:{" "}
            <span
              className={
                strength <= 1
                  ? "text-red-500"
                  : strength === 2
                  ? "text-yellow-500"
                  : "text-green-600"
              }
            >
              {strength <= 1
                ? "Weak"
                : strength === 2
                ? "Medium"
                : "Strong"}
            </span>
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-semibold transition"
          >
            {loading ? "Creating Account..." : "Signup"}
          </button>
        </form>

        {/* FOOTER */}
        <p className="text-center text-gray-500 text-sm mt-6">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-600 font-semibold cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>

      </motion.div>
    </div>
  );
};

export default Signup;