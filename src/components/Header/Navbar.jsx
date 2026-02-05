import React from 'react'
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const urls = [
    { name: "Home", url: "/" },
    { name: "Property Finder", url: "/property-finder" },
    { name: "Auctions", url: "/auctions" },
    { name: "Smart Build", url: "/smart-build" },
    { name: "Auction", url: "/auction" },
    { name: "Maps", url: "/maps" },
    { name: "More", url: "/more" },
    { name: "Search", url: "/search" },
    { name: "Buy/Rent", url: "/buy-rent" },
    { name: "Become a Seller", url: "/become-seller" },
    { name: "LogIn", url: "/login" },
  ];

  const leftLinks = urls.slice(0, 6);
  const rightLinks = urls.slice(6);
  const location = useLocation();

  // STYLE SETTINGS
  // 1. text-base: The standard "Medium" size (16px).
  // 2. font-bold: Keeps it readable and premium.
  const gradientText = "bg-gradient-to-r from-blue-700 to-blue-500 text-transparent bg-clip-text font-bold text-base";
  const simpleText = "text-gray-600 hover:text-blue-600 font-semibold text-base transition-colors";

  return (
    <div className="flex items-center h-full gap-6">

      {/* LEFT LINKS */}
      <div className="flex items-center gap-6 h-full">
        {leftLinks.map((link, index) => {
          const isActive = location.pathname === link.url;
          return (
            <Link 
              key={index} 
              to={link.url}
              className={`relative h-full flex items-center px-1 transition-all
                ${isActive ? "border-b-[3px] border-blue-600" : "border-b-[3px] border-transparent hover:border-blue-100"}
              `}
            >
              <span className={isActive ? gradientText : simpleText}>
                {link.name}
              </span>
            </Link>
          )
        })}
      </div>

      {/* SEPARATOR */}
      <div className="h-6 w-[1.5px] bg-gray-200 hidden md:block"></div>

      {/* RIGHT LINKS */}
      <div className="flex items-center gap-6 h-full">
        {rightLinks.map((link, index) => {
          const isActive = location.pathname === link.url;
          
          // LOGIN BUTTON - Adjusted to match medium text
          if (link.name === "LogIn") {
             return (
               <Link key={index} to={link.url} className="ml-2">
                 <button className="px-6 py-2 rounded-full bg-gradient-to-r from-blue-700 to-blue-500 text-white font-bold text-sm shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all">
                   Log In
                 </button>
               </Link>
             )
          }

          return (
            <Link 
              key={index} 
              to={link.url}
              className={`relative h-full flex items-center px-1 transition-all
                ${isActive ? "border-b-[3px] border-blue-600" : "border-b-[3px] border-transparent hover:border-blue-100"}
              `}
            >
              <span className={isActive ? gradientText : simpleText}>
                {link.name}
              </span>
            </Link>
          )
        })}
      </div>

    </div>
  )
}

export default Navbar