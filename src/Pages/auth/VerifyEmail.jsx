import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../../utils/api";

  // 🎯 CONFETTI EFFECT (simple emoji burst)
  const confetti = ["🎉", "✨", "🎊", "🔥"];
const VerifyEmail = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState("loading");
  const [timeLeft, setTimeLeft] = useState(60);
  const [email, setEmail] = useState("");

  const token = params.get("token");



  // ⏳ TIMER (expiry UI simulation)
  useEffect(() => {
    if (status !== "success") return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [status]);

  // 🔐 VERIFY EMAIL
  useEffect(() => {
    if (!token) {
      setStatus("error");
      return;
    }

    const verifyEmail = async () => {
      try {
        const res = await api.get(
  `/auth/verify-email?token=${token}`
);

        setEmail(res.data?.email || "");

        setStatus("success");

        // 🔐 AUTO LOGIN AFTER SUCCESS
        const fakeToken = res.data?.token;
        const role = res.data?.role;

        if (fakeToken) {
          localStorage.setItem("token", fakeToken);
          localStorage.setItem("role", role || "USER");

          const decoded = JSON.parse(atob(fakeToken.split(".")[1]));
          localStorage.setItem("token_exp", decoded.exp * 1000);
        }

        setTimeout(() => {
          navigate("/");
        }, 3000);

      } catch (error) {
        console.log(error);
        setStatus("error");
      }
    };

    verifyEmail();
  }, [token, navigate]);

  // 🔁 RESEND EMAIL
  const resendEmail = async () => {
    try {
      await api.post(
  "/auth/resend-verification",
  {
    email,
  }
);

      alert("Verification email sent again!");
      setTimeLeft(60);
    } catch (error) {
  console.error(
    "Email verification failed:",
    error.response?.data || error.message
  );

  setStatus("error");
}
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-700 via-purple-600 to-indigo-700">

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center bg-white/10 backdrop-blur-xl p-10 rounded-2xl border border-white/20 shadow-xl w-[380px]"
      >

        {/* LOADING */}
        {status === "loading" && (
          <>
            <div className="text-5xl mb-4">📩</div>
            <h2 className="text-2xl font-bold text-white">
              Verifying your email...
            </h2>
            <p className="text-white/70 mt-2">
              Please wait...
            </p>
          </>
        )}

        {/* SUCCESS */}
        {status === "success" && (
          <>
            <div className="text-5xl mb-2">
              {confetti[Math.floor(Math.random() * confetti.length)]}
            </div>

            <h2 className="text-2xl font-bold text-white">
              Email Verified!
            </h2>

            <p className="text-white/70 mt-2">
              Welcome {email}
            </p>

            {/* ⏳ TIMER */}
            <div className="mt-4 text-white text-sm">
              Redirecting in {timeLeft}s...
            </div>

            {/* EXTRA CONFETTI LINE */}
            <div className="text-xl mt-2">
              🎉 🎊 ✨ 🎉
            </div>
          </>
        )}

        {/* ERROR */}
        {status === "error" && (
          <>
            <div className="text-5xl mb-4">❌</div>
            <h2 className="text-2xl font-bold text-white">
              Verification Failed
            </h2>
            <p className="text-white/70 mt-2">
              Link expired or invalid
            </p>

            {/* 🔁 RESEND BUTTON */}
            <button
              onClick={resendEmail}
              className="mt-5 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              Resend Verification Email
            </button>
          </>
        )}

      </motion.div>
    </div>
  );
};

export default VerifyEmail;