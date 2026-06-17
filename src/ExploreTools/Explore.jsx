import React from 'react';
import { Link } from "react-router-dom";

export const Explore = () => {
  return (
    // Translucent slate-50/50 background with a thin top border to separate from AuctionBanner above
    <div className='py-20 bg-slate-50/50 border-t border-slate-100'>
      <div className='px-6 md:px-12 lg:px-20 max-w-[1600px] mx-auto'>
        
        {/* ── SECTION HEADER ── */}
        <div className='space-y-2 mb-10'>
          <h2 className='text-2xl font-extrabold text-slate-900 tracking-tight'>
            Explore more on PropSightAi
          </h2>
          <p className='text-slate-500 text-sm max-w-lg'>
            Discover specialized AI tools, analytical construction calculators, and interactive mapping systems.
          </p>
        </div>

        {/* ── BALANCED 5-COLUMN RESPONSIVE GRID ── */}
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6'>

          {/* CARD 1: New Projects */}
          <Link
            to="/new-project"
            className="flex items-center gap-4 p-5 bg-white border border-slate-100/80 hover:border-blue-200/80 rounded-2xl shadow-sm hover:shadow-xl hover:shadow-slate-200/40 hover:-translate-y-1.5 transition-all duration-300 group"
          >
            {/* Soft Pastel Blue Icon Backdrop */}
            <div className="p-3.5 bg-blue-50/70 text-blue-600 rounded-xl group-hover:scale-110 group-hover:bg-blue-100/80 transition-all duration-300 shadow-inner shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <span className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors duration-200 block">
                New Projects
              </span>
              <div className="text-xs text-slate-500 leading-relaxed mt-0.5">
                The best investment opportunities
              </div>
            </div>
          </Link>

          {/* CARD 2: Construction Cost */}
          <Link
            to="/smart-build"
            className="flex items-center gap-4 p-5 bg-white border border-slate-100/80 hover:border-blue-200/80 rounded-2xl shadow-sm hover:shadow-xl hover:shadow-slate-200/40 hover:-translate-y-1.5 transition-all duration-300 group"
          >
            {/* Soft Pastel Blue Icon Backdrop */}
            <div className="p-3.5 bg-blue-50/70 text-blue-600 rounded-xl group-hover:scale-110 group-hover:bg-blue-100/80 transition-all duration-300 shadow-inner shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <span className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors duration-200 block">
                Cost Calculator
              </span>
              <div className="text-xs text-slate-500 leading-relaxed mt-0.5">
                Estimate your building costs
              </div>
            </div>
          </Link>

          {/* CARD 3: Area Guides */}
          <Link
            to="/area-guides"
            className="flex items-center gap-4 p-5 bg-white border border-slate-100/80 hover:border-blue-200/80 rounded-2xl shadow-sm hover:shadow-xl hover:shadow-slate-200/40 hover:-translate-y-1.5 transition-all duration-300 group"
          >
            {/* Soft Pastel Blue Icon Backdrop */}
            <div className="p-3.5 bg-blue-50/70 text-blue-600 rounded-xl group-hover:scale-110 group-hover:bg-blue-100/80 transition-all duration-300 shadow-inner shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0121 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <div>
              <span className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors duration-200 block">
                Area Guides
              </span>
              <div className="text-xs text-slate-500 leading-relaxed mt-0.5">
                Explore top locations & maps
              </div>
            </div>
          </Link>

          {/* CARD 4: Property Index */}
          <Link
            to="/property-index"
            className="flex items-center gap-4 p-5 bg-white border border-slate-100/80 hover:border-blue-200/80 rounded-2xl shadow-sm hover:shadow-xl hover:shadow-slate-200/40 hover:-translate-y-1.5 transition-all duration-300 group"
          >
            {/* Soft Pastel Blue Icon Backdrop */}
            <div className="p-3.5 bg-blue-50/70 text-blue-600 rounded-xl group-hover:scale-110 group-hover:bg-blue-100/80 transition-all duration-300 shadow-inner shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                 <path strokeLinecap="round" strokeLinejoin="round" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
            </div>
            <div>
              <span className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors duration-200 block">
                Property Index
              </span>
              <div className="text-xs text-slate-500 leading-relaxed mt-0.5">
                Track market trends & pricing
              </div>
            </div>
          </Link>

          {/* CARD 5: Plot Finder */}
          <Link
            to="/plot-finder"
            className="flex items-center gap-4 p-5 bg-white border border-slate-100/80 hover:border-blue-200/80 rounded-2xl shadow-sm hover:shadow-xl hover:shadow-slate-200/40 hover:-translate-y-1.5 transition-all duration-300 group"
          >
            {/* Soft Pastel Blue Icon Backdrop */}
            <div className="p-3.5 bg-blue-50/70 text-blue-600 rounded-xl group-hover:scale-110 group-hover:bg-blue-100/80 transition-all duration-300 shadow-inner shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                 <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                 <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <span className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors duration-200 block">
                Plot Finder
              </span>
              <div className="text-xs text-slate-500 leading-relaxed mt-0.5">
                Find the perfect land
              </div>
            </div>
          </Link>

        </div>
      </div>
    </div>
  );
};