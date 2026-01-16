import React from 'react'
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  let urls = [
    { name: "Home", url: "/" },
    { name: "Property Finder", url: "/property-finder" },
    { name: "Smart Build", url: "/smart-build" },
    { name: "Auctions", url: "/auctions" },
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
      <div className="flex gap-5 mx-9 px-9">
        {leftLinks.map((link, index) => (
          <Link key={index} 
           className={`
  border-t-[3px] h-full flex items-center px-1
  ${location.pathname === link.url 
    ? "border-white text-white" 
    : "border-transparent text-gray-800"}
`}
 to={link.url}>
            {link.name}
          </Link>
        ))}
      </div>

      {/* RIGHT LINKS */}
      <div className="flex gap-5 mx-2">
        {rightLinks.map((link, index) => (
          <Link key={index} 
          className={`
  border-t-[3px] h-full flex items-center px-1
  ${location.pathname === link.url 
    ? "border-white text-white" 
    : "border-transparent text-gray-800"}
`} to={link.url}>
            {link.name}
          </Link>
        ))}
      </div>

    </div>
  )
}

export default Navbar
