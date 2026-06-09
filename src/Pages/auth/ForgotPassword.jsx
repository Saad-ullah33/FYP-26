import React, { useState } from "react";
import { motion } from "framer-motion";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // call forgot password API
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-700 via-blue-600 to-indigo-700 px-4">

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8"
      >

        <h2 className="text-2xl font-bold text-white text-center mb-4">
          Forgot Password
        </h2>

        <p className="text-white/70 text-center mb-6 text-sm">
          Enter your email to receive reset link
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-white/70 border border-white/20"
          />

          <button className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-3 rounded-lg hover:scale-105 transition">
            Send Reset Link
          </button>

        </form>

      </motion.div>
    </div>
  );
};

export default ForgotPassword;