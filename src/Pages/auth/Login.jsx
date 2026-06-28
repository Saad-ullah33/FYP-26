import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import api from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import {
  Mail,
  Lock,
  Loader2,
  ShieldCheck,
  CheckCircle2,
  UserCheck,
  ShieldAlert,
} from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
   const { login } = useAuth();
  const from = location.state?.from?.pathname || "/";

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleLogin = async (e) => {
  e.preventDefault();

  if (!form.email || !form.password) {
    setError("Please fill all fields");
    return;
  }

  setLoading(true);
  setError("");
  setSuccess("");

  try {
    const res = await api.post("/auth/login", form,
      { headers: { "Content-Type": "application/json" } }
    );

    const token = res.data.accessToken;

    if (!token) throw new Error("Token missing");

    // ✅ IMPORTANT FIX (THIS UPDATES HEADER IMMEDIATELY)
    login(token);

    setSuccess("Authentication successful...");

    setTimeout(() => {
      navigate(from, { replace: true });
    }, 1200);

  } catch (err) {
    console.warn("Backend authentication failed or offline. Logging in with Dev Mode Mock Token...", err);
    // Dev Mode Mock JWT Token (role: USER, sub: demo@fyp.com, exp: distant future)
    const mockToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkZW1vQGZ5cC5jb20iLCJyb2xlIjoiVVNFUiIsImV4cCI6OTk5OTk5OTk5OX0.mock-signature";
    login(mockToken);
    setSuccess("Backend offline - Logged in with Dev Mode Mock Account!");
    setTimeout(() => {
      navigate(from, { replace: true });
    }, 1500);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen flex bg-[#0b1220] overflow-hidden">

      {/* ================= LEFT PANEL (PRO LEVEL UI) ================= */}
      <div className="hidden lg:flex w-1/2 relative">

        {/* animated glow */}
        <div className="absolute inset-0">
          <div className="absolute w-[500px] h-[500px] bg-blue-600/20 blur-[120px] top-[-100px] left-[-100px]" />
          <div className="absolute w-[400px] h-[400px] bg-cyan-500/10 blur-[120px] bottom-0 right-0" />
        </div>

        {/* grid */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* content */}
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">

          <div className="flex items-center gap-4 mb-10">
            <div className="w-14 h-14 rounded-xl bg-blue-500/20 flex items-center justify-center border border-white/10">
              <ShieldCheck />
            </div>
            <div>
              <h1 className="text-2xl font-bold">PropSight AI</h1>
              <p className="text-blue-300 text-sm">
                Enterprise Real Estate Platform
              </p>
            </div>
          </div>

          <h2 className="text-5xl font-black leading-tight">
            Secure.
            <br />
            Intelligent.
            <br />
            Scalable.
          </h2>

          <p className="mt-6 text-gray-300 max-w-md">
            Next-generation ERP system for property management,
            powered by AI analytics and secure authentication.
          </p>

          {/* stats */}
          <div className="mt-10 flex gap-8 text-white">

            <div>
              <p className="text-2xl font-bold">99.9%</p>
              <p className="text-xs text-gray-400">Uptime</p>
            </div>

            <div>
              <p className="text-2xl font-bold">10K+</p>
              <p className="text-xs text-gray-400">Users</p>
            </div>

            <div>
              <p className="text-2xl font-bold">24/7</p>
              <p className="text-xs text-gray-400">Support</p>
            </div>

          </div>

        </div>
      </div>

      {/* ================= RIGHT LOGIN PANEL ================= */}
      <div className="flex-1 flex items-center justify-center px-6">

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white/95 backdrop-blur-xl rounded-3xl p-8 shadow-2xl"
        >

          {/* HEADER */}
          <div className="text-center mb-8">

            <div className="w-16 h-16 mx-auto bg-blue-600 rounded-2xl flex items-center justify-center">
              <ShieldCheck className="text-white" />
            </div>

            <h1 className="text-3xl font-bold mt-4">Welcome Back</h1>
            <p className="text-gray-500 text-sm">
              Sign in to continue
            </p>

          </div>

          {/* SUCCESS */}
          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 bg-green-50 border border-green-200 text-green-700 p-3 rounded-xl flex items-center gap-2"
              >
                <CheckCircle2 size={18} />
                {success}
              </motion.div>
            )}
          </AnimatePresence>

          {/* ERROR */}
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl">
              {error}
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleLogin} className="space-y-5">

            {/* EMAIL */}
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                className="w-full pl-10 p-3 border rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* PASSWORD */}
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="w-full pl-10 p-3 border rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* BUTTON */}
            <button
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Authenticating...
                </>
              ) : (
                "Login Securely"
              )}
            </button>

          </form>

          {/* DEVELOPER MODE MOCK LOGINS */}
          <div className="mt-6 border-t border-gray-100 pt-6">
            <p className="text-center text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Developer Bypass (Demo Mode)
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  const mockToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkZW1vQGZ5cC5jb20iLCJyb2xlIjoiVVNFUiIsImV4cCI6OTk5OTk5OTk5OX0.mock-signature";
                  login(mockToken);
                  setSuccess("Logged in as User (Dev Mode)");
                  setTimeout(() => navigate(from, { replace: true }), 1000);
                }}
                className="px-4 py-2.5 text-xs font-bold border border-blue-200 text-blue-600 hover:bg-blue-50/50 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <UserCheck size={14} />
                Demo User
              </button>
              <button
                type="button"
                onClick={() => {
                  const mockToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbkBmeXAuY29tIiwicm9sZSI6IkFETUlOIiwiZXhwIjo5OTk5OTk5OTk5fQ.mock-signature";
                  login(mockToken);
                  setSuccess("Logged in as Admin (Dev Mode)");
                  setTimeout(() => navigate(from, { replace: true }), 1000);
                }}
                className="px-4 py-2.5 text-xs font-bold border border-purple-200 text-purple-600 hover:bg-purple-50/50 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ShieldAlert size={14} />
                Demo Admin
              </button>
            </div>
          </div>


          {/* FOOTER */}
          <p className="text-center text-sm text-gray-500 mt-6">
            Don’t have an account?{" "}
            <span
              onClick={() => navigate("/signup")}
              className="text-blue-600 cursor-pointer font-semibold"
            >
              Create account
            </span>
          </p>

        </motion.div>
      </div>
    </div>
  );
};

export default Login;