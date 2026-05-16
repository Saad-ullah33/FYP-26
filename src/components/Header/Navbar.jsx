import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from "axios";

// ICONS
import {
  FaHome,
  FaBuilding,
  FaStore,
  FaWarehouse,
  FaIndustry,
  FaTree,
  FaCity,
} from "react-icons/fa";

const Navbar = () => {
  const urls = [
    { name: "Home", url: "/" },
    { name: "Property Finder", url: "/property-finder" },
    { name: "Smart Build", url: "/smart-build" },
    { name: "Auctions", url: "/auctions" },
    { name: "Maps", url: "/maps" },
    { name: "More", url: "#" },
    { name: "Search", url: "/search" },
    { name: "Buy/Rent", url: "/buy-rent" },
    { name: "Become a Seller", url: "/become-seller" },
    { name: "LogIn", url: "/login" },
  ];

  const leftLinks = urls.slice(0, 6);
  const rightLinks = urls.slice(6);

  const location = useLocation();
  const navigate = useNavigate();

  const [types, setTypes] = useState([]);
  const [open, setOpen] = useState(false);

  const gradientText =
    "bg-gradient-to-r from-blue-700 to-blue-500 text-transparent bg-clip-text font-bold text-base";
  const simpleText =
    "text-gray-600 hover:text-blue-600 font-semibold text-base transition-colors";

  // FETCH ENUM TYPES
  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8080/api/properties/property-types"
        );
        setTypes(res.data || []);
      } catch (err) {
        console.log("PropertyType fetch error", err);
      }
    };

    fetchTypes();
  }, []);

  const handleTypeClick = (type) => {
    setOpen(false);
    navigate(`/properties/type/${type}`);
  };

  // ICON MAPPER
  const getTypeIcon = (type) => {
    switch (type) {
      case "HOUSE":
        return <FaHome />;
      case "FLAT":
      case "APARTMENT":
        return <FaBuilding />;
      case "SHOP":
        return <FaStore />;
      case "WAREHOUSE":
        return <FaWarehouse />;
      case "INDUSTRIAL":
        return <FaIndustry />;
      case "AGRICULTURE":
      case "FARMHOUSE":
        return <FaTree />;
      case "COMMERCIAL":
      case "OFFICES":
        return <FaCity />;
      default:
        return <FaBuilding />;
    }
  };

  return (
    <div className="flex items-center h-full gap-6">

      {/* LEFT LINKS */}
      <div className="flex items-center gap-6 h-full">
        {leftLinks.map((link, index) => {
          const isActive = location.pathname === link.url;

          if (link.name === "More") {
            return (
              <div
                key={index}
                className="relative h-full flex items-center px-1"
                onMouseEnter={() => setOpen(true)}
                onMouseLeave={() => setOpen(false)}
              >
                <span className="text-gray-600 hover:text-blue-600 font-semibold text-base cursor-pointer">
                  More
                </span>


                {open && (
                  <div className="absolute top-10 left-0 w-72 bg-white shadow-2xl rounded-xl border z-50 overflow-hidden">

                    {/* HEADER */}
                    <div className="px-4 py-3 border-b bg-gradient-to-r from-blue-50 to-white">
                      <p className="text-sm font-semibold text-gray-700">
                        Property Types
                      </p>
                      <p className="text-xs text-gray-400">
                        Select category to filter properties
                      </p>
                    </div>

                    {/* GRID CONTENT */}
                    {types.length === 0 ? (
                      <p className="p-4 text-sm text-gray-500">Loading...</p>
                    ) : (
                      <div className="grid grid-cols-1 gap-1 p-2 max-h-80 overflow-y-auto">

                        {types.map((type) => (
                          <div
                            key={type}
                            onClick={() => handleTypeClick(type)}
                            className="flex items-center gap-3 p-3 rounded-lg cursor-pointer
                       hover:bg-blue-50 hover:shadow-sm transition-all"
                          >

                            {/* ICON BOX */}
                            <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-blue-100 text-blue-600 text-lg">
                              {getTypeIcon(type)}
                            </div>

                            {/* TEXT */}
                            <div className="flex flex-col">
                              <span className="text-gray-800 font-medium leading-tight">
                                {type.charAt(0) + type.slice(1).toLowerCase()}
                              </span>
                              <span className="text-xs text-gray-400">
                                View {type.toLowerCase()} listings
                              </span>
                            </div>

                          </div>
                        ))}

                      </div>
                    )}

                    {/* FOOTER */}
                    <div className="px-4 py-2 border-t bg-gray-50">
                      <p className="text-xs text-gray-500">
                        Total Types: {types.length}
                      </p>
                    </div>

                  </div>
                )}
              </div>
            );
          }

          return (
            <Link
              key={index}
              to={link.url}
              className={`relative h-full flex items-center px-1 transition-all
                ${isActive
                  ? "border-b-[3px] border-blue-600"
                  : "border-b-[3px] border-transparent hover:border-blue-100"
                }
              `}
            >
              <span className={isActive ? gradientText : simpleText}>
                {link.name}
              </span>
            </Link>
          );
        })}
      </div>

      {/* SEPARATOR */}
      <div className="h-6 w-[1.5px] bg-gray-200 hidden md:block"></div>

      {/* RIGHT LINKS */}
      <div className="flex items-center gap-6 h-full">
        {rightLinks.map((link, index) => {
          const isActive = location.pathname === link.url;

          if (link.name === "LogIn") {
            return (
              <Link key={index} to={link.url} className="ml-2">
                <button className="px-6 py-2 rounded-full bg-gradient-to-r from-blue-700 to-blue-500 text-white font-bold text-sm shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all">
                  Log In
                </button>
              </Link>
            );
          }

          return (
            <Link
              key={index}
              to={link.url}
              className={`relative h-full flex items-center px-1 transition-all
                ${isActive
                  ? "border-b-[3px] border-blue-600"
                  : "border-b-[3px] border-transparent hover:border-blue-100"
                }
              `}
            >
              <span className={isActive ? gradientText : simpleText}>
                {link.name}
              </span>
            </Link>
          );
        })}
      </div>

    </div>
  );
};

export default Navbar;