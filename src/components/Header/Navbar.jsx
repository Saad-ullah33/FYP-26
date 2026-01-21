import React from 'react'
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  let urls = [
    { name: "Home", url: "/" },
    { name: "Property Finder", url: "/property-finder" },
<<<<<<< HEAD
    { name: "Smart Build", url: "/Smartbuild" },
    { name: "Auctions", url: "/auctions" },
   
=======
    { name: "Smart Build", url: "/smart-build" },
<<<<<<< HEAD
    { name: "Auction", url: "/auction" },
=======
>>>>>>> 6e8c5617bd9172a94d9c3e721d80354e502d7745
>>>>>>> d08eacd18ccca00886cba30e9eccfe02c18baa40
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

  return (
    <div className="flex justify-between h-full gap-5 text-mine-shaft-300 items-center px-6">

      {/* LEFT LINKS */}
      <div className="flex gap-5 mx-9 px-9 h-full">
        {leftLinks.map((link, index) => {
          const isActive = location.pathname === link.url;
          return (
            <Link key={index} to={link.url}
              className={`
                relative h-full flex items-center px-1 border-b-[3px] 
                ${isActive ? "border-white text-white" : "border-transparent text-gray-800"}
              `}
            >
              {link.name}
              
              {/* THE PULSE DOT: Only shows if active */}
              {isActive && (
                <div className="absolute bottom-[-10px] left-0 w-full flex justify-center">
                  <div className="h-2 w-2 bg-white rounded-full animate-ping"></div>
                </div>
              )}
            </Link>
          )
        })}
      </div>

      {/* RIGHT LINKS */}
      <div className="flex gap-5 mx-2 h-full">
        {rightLinks.map((link, index) => {
          const isActive = location.pathname === link.url;
          return (
            <Link key={index} to={link.url}
              className={`
                relative h-full flex items-center px-1 border-b-[3px] 
                ${isActive ? "border-white text-white" : "border-transparent text-gray-800"}
              `}
            >
              {link.name}

              {/* THE PULSE DOT: Only shows if active */}
              {isActive && (
                <div className="absolute bottom-[-10px] left-0 w-full flex justify-center">
                  <div className="h-2 w-2 bg-white rounded-full animate-ping"></div>
                </div>
              )}
            </Link>
          )
        })}
      </div>

    </div>
  )
}

export default Navbar 