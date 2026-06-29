import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
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
    { name: "Map", url: "/map" }
  ];

  const urls = [...baseUrls];
  if (user) {
    if (user.role === "ADMIN") {
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
        const res = await axios.get(
          "http://localhost:8080/api/properties/property-types"
        );
        setTypes(res.data || []);
      } catch (err) {
        console.log(err);
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
          <div className="absolute top-[100%] left-1/2 -translate-x-1/2 mt-2.5 w-80 bg-white shadow-2xl shadow-slate-200/80 rounded-2xl border border-slate-100/90 z-50 overflow-hidden transition-all duration-300 animate-in fade-in slide-in-from-top-2">

            <div className="px-4 py-3 bg-slate-50/50 border-b border-slate-100 text-xs font-bold tracking-wider text-slate-400 uppercase">
              Property Types
            </div>

            <div className="max-h-[340px] overflow-y-auto py-1">
              {types.map((type) => (
                <div
                  key={type}
                  onClick={() => navigate(`/properties/type/${type}`)}
                  className="group flex items-center gap-3.5 px-4 py-3 hover:bg-slate-50 cursor-pointer transition-colors duration-150"
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-200 shrink-0 shadow-sm shadow-blue-100/40">
                    {getTypeIcon(type)}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-700 text-sm group-hover:text-blue-600 transition-colors duration-150">
                      {type}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Explore premium {type.toLowerCase()} listings
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default Navbar;