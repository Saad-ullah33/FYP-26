import React, { useEffect, useRef, useState } from "react";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Bell, LogOut, User, TrendingUp, Gavel, FileCheck } from "lucide-react";

const Header = () => {
  const navigate = useNavigate();
  const { user, logout, loading } = useAuth();

  const [openProfile, setOpenProfile] = useState(false);
  const [openNotifications, setOpenNotifications] = useState(false);
  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);

  const [notificationList, setNotificationList] = useState([
    { id: 1, text: "AI Price index update: WAPDA City ROI increased by 1.2%", time: "10m ago", type: "trend", unread: true },
    { id: 2, text: "New bid placed on DHA Phase 8 Plot: PKR 14.5M", time: "1h ago", type: "bid", unread: true },
    { id: 3, text: "Deed Registry verification completed for ID #XP-202", time: "5h ago", type: "deed", unread: true }
  ]);

  const unreadCount = notificationList.filter(n => n.unread).length;

  const handleMarkAllRead = () => {
    setNotificationList(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const handleNotificationClick = (id) => {
    setNotificationList(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
  };

  // CLOSE DROPDOWNS ON OUTSIDE CLICK
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close profile menu
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenProfile(false);
      }
      // Close notifications menu
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setOpenNotifications(false);
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
          className="justify-self-start flex items-center gap-3 cursor-pointer group"
        >
          {/* Logo Icon with Engaging Pulse Animation */}
          <div className="relative flex items-center justify-center">
            <span className="absolute inline-flex h-6 w-6 rounded-full bg-blue-400 opacity-40 animate-ping" />
            <img
              src="/propsight-logo.png"
              alt="PropSight Logo"
              className="relative w-8 h-8 rounded-lg object-contain shadow-[0_0_8px_rgba(59,130,246,0.25)] group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          
          <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-900 to-blue-600 tracking-tight">
            PropSight
          </span>
        </div>

        {/* NAVBAR */}
        <div className="justify-self-center">
          <Navbar />
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-5 justify-self-end">

          {/* NOTIFICATIONS */}
          {user && (
            <div ref={notificationRef} className="relative">
              <div 
                onClick={() => setOpenNotifications(!openNotifications)} 
                className="relative cursor-pointer hover:scale-105 transition-transform duration-200" 
                style={{ transformOrigin: 'center' }}
              >
                <Bell className={`w-6 h-6 text-gray-700 hover:text-blue-600 transition ${unreadCount > 0 ? "animate-bell-ring" : ""}`} />

                {unreadCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 flex h-[18px] w-[18px]">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-[18px] w-[18px] bg-gradient-to-r from-red-500 to-rose-600 text-[9px] font-black text-white items-center justify-center shadow-sm border border-white/20">
                      {unreadCount}
                    </span>
                  </span>
                )}
              </div>

              {/* NOTIFICATION DROPDOWN */}
              {openNotifications && (
                <div className="absolute right-0 mt-3 w-80 bg-white shadow-2xl rounded-2xl border border-slate-150 overflow-hidden z-50 animate-fade-in-up">
                  {/* Dropdown Header */}
                  <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <span className="font-extrabold text-sm text-slate-800">Notifications</span>
                    {unreadCount > 0 && (
                      <button 
                        onClick={handleMarkAllRead}
                        className="text-xs text-blue-600 hover:text-blue-700 font-bold cursor-pointer"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>

                  {/* Notification Items List */}
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                    {notificationList.length > 0 ? (
                      notificationList.map((item) => (
                        <div 
                          key={item.id} 
                          onClick={() => handleNotificationClick(item.id)}
                          className={`p-3.5 flex gap-3 items-start hover:bg-slate-50 transition cursor-pointer text-left ${item.unread ? 'bg-blue-50/20' : ''}`}
                        >
                          {/* Left icon wrapper */}
                          <div className={`mt-0.5 p-2 rounded-lg shrink-0 ${
                            item.type === 'trend' ? 'bg-emerald-50 text-emerald-600' :
                            item.type === 'bid' ? 'bg-amber-50 text-amber-600' :
                            'bg-blue-50 text-blue-600'
                          }`}>
                            {item.type === 'trend' && <TrendingUp size={15} />}
                            {item.type === 'bid' && <Gavel size={15} />}
                            {item.type === 'deed' && <FileCheck size={15} />}
                          </div>
                          
                          {/* Text content */}
                          <div className="space-y-1">
                            <p className="text-xs text-slate-700 leading-normal font-semibold">
                              {item.text}
                            </p>
                            <span className="text-[10px] text-slate-400 font-bold block">{item.time}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center text-slate-450 text-xs font-semibold">
                        No notifications at this moment.
                      </div>
                    )}
                  </div>
                </div>
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

      {/* Glowy Blue Bottom Border Line (Static Premium Glow) */}
      <div className="absolute bottom-0 left-0 w-full h-[2.5px] bg-blue-500/90 shadow-[0_1.5px_8px_rgba(59,130,246,0.75)] pointer-events-none" />
    </header>
  );
};

export default Header;