import React, { useEffect, useRef, useState } from "react";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Bell, LogOut, User } from "lucide-react";

const Header = () => {
  const navigate = useNavigate();
  const { user, logout, loading } = useAuth();

  const [openProfile, setOpenProfile] = useState(false);
  const dropdownRef = useRef(null);

  const [notifications] = useState(3);

  // CLOSE DROPDOWN ON OUTSIDE CLICK
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenProfile(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLoginClick = () => {
    if (user) {
      navigate("/");
      return;
    }
    navigate("/login");
  };

  const handleLogout = () => {
    logout();
    setOpenProfile(false);
    navigate("/login");
  };

  if (loading) {
    return (
      <header className="h-20 bg-white shadow-sm flex items-center px-8">
        <div className="text-gray-400 animate-pulse">Loading...</div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-[1050] w-full h-20 bg-white/70 backdrop-blur-md shadow-sm border-b border-white/30">
      <div className="grid grid-cols-3 items-center h-full px-8 max-w-screen-2xl mx-auto">

        {/* LOGO */}
        <div
          onClick={() => navigate("/")}
          className="justify-self-start text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-900 to-blue-600 cursor-pointer"
        >
          PropSight
        </div>

        {/* NAVBAR */}
        <div className="justify-self-center">
          <Navbar />
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-5 justify-self-end">

          {/* NOTIFICATIONS */}
          {user && (
            <div className="relative cursor-pointer">
              <Bell className="w-6 h-6 text-gray-700 hover:text-blue-600 transition" />

              {notifications > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 rounded-full">
                  {notifications}
                </span>
              )}
            </div>
          )}

          {/* LOGIN / USER */}
          {!user ? (
            <button
              onClick={handleLoginClick}
              className="px-5 py-2 rounded-full bg-blue-600 text-white font-semibold hover:shadow-md transition"
            >
              Login
            </button>
          ) : (
            <div className="relative" ref={dropdownRef}>

              {/* AVATAR */}
              <button
                onClick={() => setOpenProfile(!openProfile)}
                className="flex items-center gap-2 px-3 py-2 rounded-full bg-blue-600 text-white hover:shadow-md transition"
              >
                <div className="w-7 h-7 bg-white text-blue-600 rounded-full flex items-center justify-center font-bold">
                  {user?.email?.charAt(0).toUpperCase()}
                </div>

                <span className="text-sm font-medium">{user.role}</span>
              </button>

              {/* DROPDOWN */}
              {openProfile && (
                <div className="absolute right-0 mt-3 w-52 bg-white shadow-xl rounded-xl border overflow-hidden">

                  {user.role === "ADMIN" ? (
                    <button
                      onClick={() => {
                        setOpenProfile(false);
                        navigate("/admin/dashboard");
                      }}
                      className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100 text-sm text-blue-600 font-semibold"
                    >
                      <User size={16} />
                      Admin Panel
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setOpenProfile(false);
                          navigate("/dashboard?tab=profile");
                        }}
                        className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100 text-sm"
                      >
                        <User size={16} />
                        My Profile
                      </button>
                      <button
                        onClick={() => {
                          setOpenProfile(false);
                          navigate("/dashboard");
                        }}
                        className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100 text-sm"
                      >
                        <User size={16} />
                        Dashboard
                      </button>
                    </>
                  )}

                  <div className="border-t" />

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full px-4 py-2 text-red-500 hover:bg-red-50 text-sm"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>

                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;