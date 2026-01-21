import React from "react";
import { IconMail, IconMapPin, IconPhone } from "@tabler/icons-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">

        {/* Brand */}
        <div>
          <h3 className="text-xl font-bold text-white mb-3">
            PropSight
          </h3>
          <p className="text-sm leading-relaxed">
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
            <li className="hover:text-white cursor-pointer">Home</li>
            <li className="hover:text-white cursor-pointer">Properties</li>
            <li className="hover:text-white cursor-pointer">Sell Property</li>
            <li className="hover:text-white cursor-pointer">Contact Us</li>
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
            <span>info@propsight.com</span>
          </div>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 py-4 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} PropSight. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
