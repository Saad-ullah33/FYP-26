import React, { useEffect, useRef, useState } from "react";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Bell, LogOut, User, TrendingUp, Gavel, FileCheck, Menu, X } from "lucide-react";

const Header = () => {
  const navigate = useNavigate();
  const { user, logout, loading } = useAuth();

  const [openProfile, setOpenProfile] = useState(false);
  const [openNotifications, setOpenNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
      <div className="flex md:grid md:grid-cols-3 justify-between items-center h-full px-4 sm:px-8 max-w-screen-2xl mx-auto">

        {/* LOGO */}
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-3 cursor-pointer group shrink-0"
        >
          <img
            src="/favicon-icon.png"
            alt="NextProperty Icon"
            className="w-10 h-10 object-contain group-hover:scale-105 transition-transform duration-300"
          />

          {/* Brand text lockup */}
          <div className="flex flex-col leading-none gap-[3px] text-left">
            <span className="text-[15px] font-black tracking-tight leading-none text-slate-900">
              Next<span className="text-blue-600">Property</span>
            </span>
            <span className="text-[8px] font-bold uppercase tracking-[0.16em] text-slate-400 leading-none">
              The Future of Real Estate
            </span>
          </div>
        </div>

        {/* NAVBAR */}
        <div className="hidden md:block justify-self-center">
          <Navbar />
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-3 sm:gap-5 justify-self-end">

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
              {(() => {
                const userRole = user?.role ? String(user.role).replace(/^ROLE_/, "").toUpperCase() : "";
                return (
                  <>
                    {/* AVATAR */}
                    <button
                      onClick={() => setOpenProfile(!openProfile)}
                      className="flex items-center gap-2 px-3 py-2 rounded-full bg-blue-600 text-white hover:shadow-md transition cursor-pointer"
                    >
                      <div className="w-7 h-7 bg-white text-blue-600 rounded-full flex items-center justify-center font-bold">
                        {user?.email?.charAt(0).toUpperCase()}
                      </div>

                      <span className="text-sm font-medium">{user.role}</span>
                    </button>

                    {/* DROPDOWN */}
                    {openProfile && (
                      <div className="absolute right-0 mt-3 w-52 bg-white shadow-xl rounded-xl border overflow-hidden z-50">

                        {userRole === "ADMIN" ? (
                          <button
                            onClick={() => {
                              setOpenProfile(false);
                              navigate("/admin/dashboard");
                            }}
                            className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100 text-sm text-blue-600 font-semibold cursor-pointer"
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
                              className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100 text-sm cursor-pointer"
                            >
                              <User size={16} />
                              My Profile
                            </button>
                            <button
                              onClick={() => {
                                setOpenProfile(false);
                                navigate("/dashboard");
                              }}
                              className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100 text-sm cursor-pointer"
                            >
                              <User size={16} />
                              Dashboard
                            </button>
                          </>
                        )}

                        <div className="border-t" />

                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-2 w-full px-4 py-2 text-red-500 hover:bg-red-50 text-sm cursor-pointer"
                        >
                          <LogOut size={16} />
                          Logout
                        </button>

                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          )}

          {/* HAMBURGER TOGGLE */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-slate-50 text-slate-700 hover:text-blue-600 rounded-lg cursor-pointer transition focus:ring-2 focus:ring-blue-500/25 focus:outline-none min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU DROPDOWN */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-white border-b border-slate-200 shadow-lg py-4 px-6 overflow-y-auto max-h-[calc(100vh-80px)] z-[1040] flex flex-col gap-4 animate-in slide-in-from-top duration-200">
          <div className="flex flex-col gap-1 text-left">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">Primary Pages</span>
            <a onClick={() => { setMobileMenuOpen(false); navigate("/"); }} className="py-3 text-slate-700 font-bold hover:text-blue-600 transition text-sm cursor-pointer border-b border-slate-100 min-h-[44px] flex items-center">Home</a>
            <a onClick={() => { setMobileMenuOpen(false); navigate("/property-finder"); }} className="py-3 text-slate-700 font-bold hover:text-blue-600 transition text-sm cursor-pointer border-b border-slate-100 min-h-[44px] flex items-center">Property Finder</a>
            <a onClick={() => { setMobileMenuOpen(false); navigate("/smart-build"); }} className="py-3 text-slate-700 font-bold hover:text-blue-600 transition text-sm cursor-pointer border-b border-slate-100 min-h-[44px] flex items-center">Smart Build</a>
            <a onClick={() => { setMobileMenuOpen(false); navigate("/auction"); }} className="py-3 text-slate-700 font-bold hover:text-blue-600 transition text-sm cursor-pointer border-b border-slate-100 min-h-[44px] flex items-center">Auction</a>
            <a onClick={() => { setMobileMenuOpen(false); navigate("/map"); }} className="py-3 text-slate-700 font-bold hover:text-blue-600 transition text-sm cursor-pointer border-b border-slate-100 min-h-[44px] flex items-center">Map</a>
          </div>
          <div className="flex flex-col gap-1 text-left mt-2">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">Explore More</span>
            <a onClick={() => { setMobileMenuOpen(false); navigate("/projects"); }} className="py-3 text-slate-750 font-bold hover:text-blue-600 transition text-sm cursor-pointer border-b border-slate-100 min-h-[44px] flex items-center">New Projects</a>
            <a onClick={() => { setMobileMenuOpen(false); navigate("/smart-build"); }} className="py-3 text-slate-750 font-bold hover:text-blue-600 transition text-sm cursor-pointer border-b border-slate-100 min-h-[44px] flex items-center">Cost Calculator</a>
            <a onClick={() => { setMobileMenuOpen(false); navigate("/area-guides"); }} className="py-3 text-slate-750 font-bold hover:text-blue-600 transition text-sm cursor-pointer border-b border-slate-100 min-h-[44px] flex items-center">Area Guides</a>
            <a onClick={() => { setMobileMenuOpen(false); navigate("/property-index"); }} className="py-3 text-slate-750 font-bold hover:text-blue-600 transition text-sm cursor-pointer border-b border-slate-100 min-h-[44px] flex items-center">Property Index</a>
            <a onClick={() => { setMobileMenuOpen(false); navigate("/plot-finder"); }} className="py-3 text-slate-750 font-bold hover:text-blue-600 transition text-sm cursor-pointer border-b border-slate-100 min-h-[44px] flex items-center">Plot Finder</a>
            <a onClick={() => { setMobileMenuOpen(false); navigate("/ai-assessor"); }} className="py-3 text-purple-750 font-bold hover:text-blue-600 transition text-sm cursor-pointer border-b border-slate-100 min-h-[44px] flex items-center justify-between">
              <span>AI Property Assessor</span>
              <span className="px-1.5 py-0.5 text-[8px] bg-purple-100 text-purple-700 rounded-full font-black uppercase tracking-wide">New</span>
            </a>
            <a onClick={() => { setMobileMenuOpen(false); navigate("/verify-deed"); }} className="py-3 text-amber-700 font-bold hover:text-blue-600 transition text-sm cursor-pointer min-h-[44px] flex items-center justify-between">
              <span>TrustDeed Verification</span>
              <span className="px-1.5 py-0.5 text-[8px] bg-amber-100 text-amber-800 rounded-full font-black uppercase tracking-wide">Verified</span>
            </a>
          </div>
        </div>
      )}

      {/* Glowy Blue Bottom Border Line (Static Premium Glow) */}
      <div className="absolute bottom-0 left-0 w-full h-[2.5px] bg-blue-500/90 shadow-[0_1.5px_8px_rgba(59,130,246,0.75)] pointer-events-none" />
    </header>
  );
};

export default Header;