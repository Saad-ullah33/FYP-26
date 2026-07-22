import { Link } from "react-router-dom";
import { IconMail, IconMapPin, IconPhone } from "@tabler/icons-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 border-t border-gray-800 mt-0">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">

        {/* Brand */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <img
              src="/favicon-icon.png"
              alt="NextProperty Icon"
              className="w-10 h-10 object-contain"
            />
            <div className="flex flex-col leading-none gap-[3px]">
              <span className="text-lg font-black tracking-tight text-white">
                Next<span className="text-blue-400">Property</span>
              </span>
              <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-400">
                The Future of Real Estate
              </span>
            </div>
          </div>
          <p className="text-sm leading-relaxed text-gray-400">
            Buy, sell, and discover properties with confidence.  
            Trusted real estate solutions for modern living.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-3">
            Quick Links
          </h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-white transition">Home</Link></li>
            <li><Link to="/property-finder" className="hover:text-white transition">Property Finder</Link></li>
            <li><Link to="/auction" className="hover:text-white transition">Property Auctions</Link></li>
            <li><Link to="/verify-deed" className="hover:text-amber-400 font-bold transition flex items-center gap-1 text-amber-300">TrustDeed Verification</Link></li>
            <li><Link to="/smart-build" className="hover:text-white transition">Smart Build</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-3">
            Support
          </h4>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-white cursor-pointer">Help Center</li>
            <li className="hover:text-white cursor-pointer">Privacy Policy</li>
            <li className="hover:text-white cursor-pointer">Terms & Conditions</li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-3">
            Contact
          </h4>

          <div className="flex  gap-3 mb-3 text-sm items-center">
            <IconMapPin size={25} />
            <span>
              Plot #45, Commercial Zone,  
              Green Orchard, Faisalabad, Pakistan
            </span>
          </div>

          <div className="flex items-center gap-3 mb-3 text-sm">
            <IconPhone size={18} />
            <span>+92 300 1234567</span>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <IconMail size={18} />
            <span>info@nextproperty.com</span>
          </div>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 py-4 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} NextProperty. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
