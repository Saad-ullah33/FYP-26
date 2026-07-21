import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import {
  FaHome,
  FaBuilding,
  FaStore,
  FaWarehouse,
  FaIndustry,
  FaTree,
  FaCity,
  FaChevronDown,
} from "react-icons/fa";
import { Building2, Calculator, Map as LucideMap, LineChart, MapPin, Sparkles } from "lucide-react";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [types, setTypes] = useState([]);
  const [open, setOpen] = useState(false);

  const baseUrls = [
    { name: "Home", url: "/" },
    { name: "Property Finder", url: "/property-finder" },
    { name: "Smart Build", url: "/smart-build" },
    { name: "Auction", url: "/auction" },
    { name: "Map", url: "/map" },
    // { name: "AI Prediction", url: "/ai-prediction" } // 👈 AI HUBS INTEGRATION PATH ADDED CLEANLY HERE
  ];

  const urls = [...baseUrls];
  if (user) {
    const userRole = user.role ? String(user.role).replace(/^ROLE_/, "").toUpperCase() : "";
    if (userRole === "ADMIN") {
      urls.push({ name: "Admin Panel", url: "/admin/dashboard" });
    } else {
      urls.push({ name: "Dashboard", url: "/dashboard" });
    }
  }

  // Matched to the exact royal blue of your brand logo and login button
  // Added whitespace-nowrap to guarantee single-line vertical alignment
  const activeText =
    "relative py-1.5 text-blue-600 font-bold whitespace-nowrap transition-all after:absolute after:bottom-0 after:left-0 after:h-[2.5px] after:w-full after:bg-blue-600 after:rounded-full after:transition-all after:duration-300";

  const simpleText =
    "relative py-1.5 text-slate-600 hover:text-blue-600 font-semibold whitespace-nowrap transition-all duration-200 after:absolute after:bottom-0 after:left-1/2 after:h-[2.5px] after:w-0 after:bg-blue-600 after:rounded-full hover:after:w-full hover:after:left-0 after:transition-all after:duration-250";

  useEffect(() => {
const fetchTypes = async () => {
  try {
    const res = await api.get("/properties/property-types");
    setTypes(res.data || []);
  } catch (err) {
    console.log("Failed to fetch property types:", err);
  }
};

    fetchTypes();
  }, []);

  const getTypeIcon = (type) => {
    const iconClass = "w-4 h-4";
    switch (type) {
      case "HOUSE":
        return <FaHome className={iconClass} />;
      case "FLAT":
      case "APARTMENT":
        return <FaBuilding className={iconClass} />;
      case "SHOP":
        return <FaStore className={iconClass} />;
      case "WAREHOUSE":
        return <FaWarehouse className={iconClass} />;
      case "INDUSTRIAL":
        return <FaIndustry className={iconClass} />;
      case "AGRICULTURE":
      case "FARMHOUSE":
        return <FaTree className={iconClass} />;
      case "COMMERCIAL":
        return <FaCity className={iconClass} />;
      default:
        return <FaBuilding className={iconClass} />;
    }
  };

  return (
    // Used responsive gaps to prevent horizontal overflow on smaller desktop screens
    <div className="flex items-center gap-4 lg:gap-6 xl:gap-7">

      {/* LINKS */}
      {urls.map((link, index) => (
        <Link
          key={index}
          to={link.url}
          className={
            location.pathname === link.url ? activeText : simpleText
          }
        >
          {link.name}
        </Link>
      ))}

      {/* MORE */}
      <div
        className="relative py-1.5"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        <button 
          className="flex items-center gap-1.5 focus:outline-none cursor-pointer text-slate-600 font-semibold hover:text-blue-600 transition-colors duration-200 whitespace-nowrap"
          aria-expanded={open}
        >
          <span>More</span>
          <FaChevronDown 
            className={`w-3.5 h-3.5 transition-transform duration-300 ${
              open ? "rotate-180 text-blue-600" : "text-slate-400"
            }`} 
          />
        </button>

        {open && (
          <div className="absolute top-[100%] right-[-20px] mt-2.5 w-80 bg-white/95 backdrop-blur-md shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] rounded-2xl border border-slate-200/50 z-50 p-2 transition-all duration-300 animate-in fade-in slide-in-from-top-2 flex flex-col gap-0.5">
            
            {/* Card 1: New Projects */}
            <div
              onClick={() => {
                setOpen(false);
                navigate("/projects");
              }}
              className="group flex items-center gap-3.5 p-2.5 rounded-xl hover:bg-slate-50/70 cursor-pointer transition-all duration-200"
            >
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-indigo-50 text-indigo-650 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-200 shrink-0 shadow-sm shadow-indigo-100/20">
                <Building2 className="w-4 h-4" />
              </div>
              <div className="flex flex-col transform group-hover:translate-x-0.5 transition-transform duration-200">
                <span className="font-extrabold text-slate-800 text-xs group-hover:text-indigo-650 transition-colors leading-tight">
                  New Projects
                </span>
                <span className="text-[10px] text-slate-450 font-bold mt-0.5 leading-tight">
                  The best investment opportunities
                </span>
              </div>
            </div>

            {/* Card 2: Cost Calculator */}
            <div
              onClick={() => {
                setOpen(false);
                navigate("/smart-build");
              }}
              className="group flex items-center gap-3.5 p-2.5 rounded-xl hover:bg-slate-50/70 cursor-pointer transition-all duration-200"
            >
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-blue-50 text-blue-650 group-hover:bg-blue-600 group-hover:text-white transition-all duration-200 shrink-0 shadow-sm shadow-blue-100/20">
                <Calculator className="w-4 h-4" />
              </div>
              <div className="flex flex-col transform group-hover:translate-x-0.5 transition-transform duration-200">
                <span className="font-extrabold text-slate-800 text-xs group-hover:text-blue-650 transition-colors leading-tight">
                  Cost Calculator
                </span>
                <span className="text-[10px] text-slate-450 font-bold mt-0.5 leading-tight">
                  Estimate your building costs
                </span>
              </div>
            </div>

            {/* Card 3: Area Guides */}
            <div
              onClick={() => {
                setOpen(false);
                navigate("/area-guides");
              }}
              className="group flex items-center gap-3.5 p-2.5 rounded-xl hover:bg-slate-50/70 cursor-pointer transition-all duration-200"
            >
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-emerald-50 text-emerald-650 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-200 shrink-0 shadow-sm shadow-emerald-100/20">
                <LucideMap className="w-4 h-4" />
              </div>
              <div className="flex flex-col transform group-hover:translate-x-0.5 transition-transform duration-200">
                <span className="font-extrabold text-slate-800 text-xs group-hover:text-emerald-650 transition-colors leading-tight">
                  Area Guides
                </span>
                <span className="text-[10px] text-slate-450 font-bold mt-0.5 leading-tight">
                  Explore top locations & maps
                </span>
              </div>
            </div>

            {/* Card 4: Property Index */}
            <div
              onClick={() => {
                setOpen(false);
                navigate("/property-index");
              }}
              className="group flex items-center gap-3.5 p-2.5 rounded-xl hover:bg-slate-50/70 cursor-pointer transition-all duration-200"
            >
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-violet-50 text-violet-650 group-hover:bg-violet-600 group-hover:text-white transition-all duration-200 shrink-0 shadow-sm shadow-violet-100/20">
                <LineChart className="w-4 h-4" />
              </div>
              <div className="flex flex-col transform group-hover:translate-x-0.5 transition-transform duration-200">
                <span className="font-extrabold text-slate-800 text-xs group-hover:text-violet-650 transition-colors leading-tight">
                  Property Index
                </span>
                <span className="text-[10px] text-slate-450 font-bold mt-0.5 leading-tight">
                  Track market trends & pricing
                </span>
              </div>
            </div>

            {/* Card 5: Plot Finder */}
            <div
              onClick={() => {
                setOpen(false);
                navigate("/plot-finder");
              }}
              className="group flex items-center gap-3.5 p-2.5 rounded-xl hover:bg-slate-50/70 cursor-pointer transition-all duration-200"
            >
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-amber-50 text-amber-650 group-hover:bg-amber-600 group-hover:text-white transition-all duration-200 shrink-0 shadow-sm shadow-amber-100/20">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="flex flex-col transform group-hover:translate-x-0.5 transition-transform duration-200">
                <span className="font-extrabold text-slate-800 text-xs group-hover:text-amber-650 transition-colors leading-tight">
                  Plot Finder
                </span>
                <span className="text-[10px] text-slate-450 font-bold mt-0.5 leading-tight">
                  Find the perfect land
                </span>
              </div>
            </div>
            

            {/* Card 6: AI Property Assessor */}
            <div
              onClick={() => {
                setOpen(false);
                navigate("/ai-assessor");
              }}
              className="group flex items-center gap-3.5 p-2.5 rounded-xl hover:bg-slate-50/70 cursor-pointer transition-all duration-200"
            >
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-all duration-200 shrink-0 shadow-sm shadow-purple-100/20">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="flex flex-col transform group-hover:translate-x-0.5 transition-transform duration-200">
                <span className="font-extrabold text-slate-800 text-xs group-hover:text-purple-600 transition-colors leading-tight flex items-center gap-1">
                  AI Property Assessor
                  <span className="px-1.5 py-0.5 text-[8px] bg-purple-100 text-purple-700 rounded-full font-black uppercase tracking-wide">
                    New
                  </span>
                </span>
                <span className="text-[10px] text-slate-450 font-bold mt-0.5 leading-tight">
                  Valuation, trends & projections
                </span>
              </div>
            </div>

          </div>
        )}
      </div>

    </div>
  );
};

export default Navbar;