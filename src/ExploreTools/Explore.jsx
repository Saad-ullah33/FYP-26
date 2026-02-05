import React from 'react';
import { Link } from "react-router-dom";

export const Explore = () => {
  return (
    <div className='p-10 px-20 max-w-[1600px] mx-auto'>
      <div className='text-2xl font-bold mb-7 text-gray-800'>
        Explore more on PropSightAi
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>

        {/* CARD 1: New Projects (Building Icon) */}
        <Link
          to="/new-project"
          className="flex items-center gap-4 p-5 border rounded-xl hover:shadow-lg hover:border-blue-200 transition bg-white"
        >
          {/* Building SVG */}
          <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div>
            <span className="text-lg font-bold text-gray-800">New Projects</span>
            <div className="text-sm text-gray-500">
              The best investment opportunities
            </div>
          </div>
        </Link>

        {/* CARD 2: Construction Cost (Calculator Icon) */}
        <Link
          to="/construction-cost"
          className="flex items-center gap-4 p-5 border rounded-xl hover:shadow-lg hover:border-blue-200 transition bg-white"
        >
          {/* Calculator SVG */}
          <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <span className="text-lg font-bold text-gray-800">
              Cost Calculator
            </span>
            <div className="text-sm text-gray-500">
              Estimate your building costs
            </div>
          </div>
        </Link>

        {/* CARD 3: Area Guides (Map Icon) */}
        <Link
          to="/area-guides"
          className="flex items-center gap-4 p-5 border rounded-xl hover:shadow-lg hover:border-blue-200 transition bg-white"
        >
          {/* Map SVG */}
          <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0121 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </div>
          <div>
            <span className="text-lg font-bold text-gray-800">Area Guides</span>
            <div className="text-sm text-gray-500">
              Explore top locations & maps
            </div>
          </div>
        </Link>

        {/* CARD 4: Property Index (Graph Icon) */}
        <Link
          to="/property-index"
          className="flex items-center gap-4 p-5 border rounded-xl hover:shadow-lg hover:border-blue-200 transition bg-white"
        >
          {/* Graph SVG */}
          <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
               <path strokeLinecap="round" strokeLinejoin="round" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
          </div>
          <div>
            <span className="text-lg font-bold text-gray-800">Property Index</span>
            <div className="text-sm text-gray-500">
              Track market trends & pricing
            </div>
          </div>
        </Link>

        {/* CARD 5: Plot Finder (Location Pin Icon) */}
        <Link
          to="/plot-finder"
          className="flex items-center gap-4 p-5 border rounded-xl hover:shadow-lg hover:border-blue-200 transition bg-white"
        >
          {/* Pin SVG */}
          <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
               <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
               <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <span className="text-lg font-bold text-gray-800">Plot Finder</span>
            <div className="text-sm text-gray-500">
              Find the perfect land
            </div>
          </div>
        </Link>

      </div>
    </div>
  );
};