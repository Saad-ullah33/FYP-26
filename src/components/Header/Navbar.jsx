import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
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
  const location = useLocation();
  const navigate = useNavigate();

  const [types, setTypes] = useState([]);
  const [open, setOpen] = useState(false);

  const urls = [
    { name: "Home", url: "/" },
    { name: "Property Finder", url: "/property-finder" },
    { name: "Smart Build", url: "/smart-build" },
    { name: "Auction", url: "/auction" },
    { name: "Maps", url: "/maps" }
  ];

  const gradientText =
    "bg-gradient-to-r from-blue-700 to-blue-500 text-transparent bg-clip-text font-bold";

  const simpleText =
    "text-gray-600 hover:text-blue-600 font-semibold transition-colors";

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
        return <FaCity />;
      default:
        return <FaBuilding />;
    }
  };

  return (
    <div className="flex items-center gap-6">

      {/* LINKS */}
      {urls.map((link, index) => (
        <Link
          key={index}
          to={link.url}
          className={
            location.pathname === link.url ? gradientText : simpleText
          }
        >
          {link.name}
        </Link>
      ))}

      {/* MORE */}
      <div
        className="relative"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        <span className="cursor-pointer text-gray-600 font-semibold hover:text-blue-600">
          More
        </span>

        {open && (
          <div className="absolute top-8 left-0 w-72 bg-white shadow-xl rounded-xl border z-50">

            <div className="p-3 border-b text-sm font-semibold text-gray-700">
              Property Types
            </div>

            {types.map((type) => (
              <div
                key={type}
                onClick={() => navigate(`/properties/type/${type}`)}
                className="flex items-center gap-3 p-3 hover:bg-blue-50 cursor-pointer transition"
              >
                <div className="text-blue-600">{getTypeIcon(type)}</div>
                <div>
                  <p className="font-medium">{type}</p>
                  <p className="text-xs text-gray-400">
                    View {type.toLowerCase()} listings
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default Navbar;