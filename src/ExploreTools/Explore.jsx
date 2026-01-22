import React from 'react';
import { Link } from "react-router-dom";
import craneIcon from '../assets/images/crane.svg';

export const Explore = () => {
  return (
    <div className='p-10 px-20'>
      <div className='text-2xl font-bold mb-7'>
        Explore more on PropSightAi
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10'>

        {/* CARD 1 */}
        <Link
          to="/new-project"
          className="flex items-center gap-4 p-4 border rounded-lg hover:shadow-md transition cursor-pointer"
        >
          <img className="w-10 h-10" src={craneIcon} alt="Crane" />
          <div>
            <span className="text-xl font-semibold">New Projects</span>
            <div className="text-sm text-gray-500">
              The best investment opportunities
            </div>
          </div>
        </Link>

        {/* CARD 2 */}
        <Link
          to="/construction-cost"
          className="flex items-center gap-4 p-4 border rounded-lg hover:shadow-md transition cursor-pointer"
        >
          <img className="w-10 h-10" src={craneIcon} alt="Crane" />
          <div>
            <span className="text-xl font-semibold">
              Construction Cost Calculator
            </span>
            <div className="text-sm text-gray-500">
              The best investment opportunities
            </div>
          </div>
        </Link>

        {/* CARD 3 */}
        <Link
          to="/area-guides"
          className="flex items-center gap-4 p-4 border rounded-lg hover:shadow-md transition cursor-pointer"
        >
          <img className="w-10 h-10" src={craneIcon} alt="Crane" />
          <div>
            <span className="text-xl font-semibold">Area Guides</span>
            <div className="text-sm text-gray-500">
              The best investment opportunities
            </div>
          </div>
        </Link>

        {/* CARD 4 */}
        <Link
          to="/property-index"
          className="flex items-center gap-4 p-4 border rounded-lg hover:shadow-md transition cursor-pointer"
        >
          <img className="w-10 h-10" src={craneIcon} alt="Crane" />
          <div>
            <span className="text-xl font-semibold">Property Index</span>
            <div className="text-sm text-gray-500">
              The best investment opportunities
            </div>
          </div>
        </Link>

        {/* CARD 5 */}
        <Link
          to="/plot-finder"
          className="flex items-center gap-4 p-4 border rounded-lg hover:shadow-md transition cursor-pointer"
        >
          <img className="w-10 h-10" src={craneIcon} alt="Crane" />
          <div>
            <span className="text-xl font-semibold">Plot Finder</span>
            <div className="text-sm text-gray-500">
              The best investment opportunities
            </div>
          </div>
        </Link>

      </div>
    </div>
  );
};
