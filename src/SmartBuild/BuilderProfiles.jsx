import React from 'react';

const builders = [
  {
    id: 1,
    name: "Ahmed Hassan",
    city: "Lahore",
    experience: "12 Years",
    projectsCompleted: 45,
    specialty: "Residential Complexes",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    rating: 4.9,
  },
  {
    id: 2,
    name: "Sarah Khan",
    city: "Karachi",
    experience: "8 Years",
    projectsCompleted: 32,
    specialty: "Commercial High-rises",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    rating: 4.8,
  },
  {
    id: 3,
    name: "Usman Tariq",
    city: "Islamabad",
    experience: "15 Years",
    projectsCompleted: 60,
    specialty: "Smart Homes & Villas",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    rating: 5.0,
  },
  {
    id: 4,
    name: "Zainab Malik",
    city: "Faisalabad",
    experience: "6 Years",
    projectsCompleted: 24,
    specialty: "Eco-friendly Structures",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    rating: 4.7,
  },
  {
    id: 5,
    name: "Bilal Ahmed",
    city: "Multan",
    experience: "10 Years",
    projectsCompleted: 38,
    specialty: "Industrial Warehouses",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    rating: 4.9,
  }
];

const BuilderProfiles = () => {
  return (
    // Main Background: Light Blue
    <div className="min-h-screen bg-blue-50 py-16 px-4 sm:px-6 lg:px-8 font-sans">
      
      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-16 text-center">
        <h2 className="text-3xl font-extrabold text-slate-800 sm:text-4xl tracking-tight">
          Verified Builders
        </h2>
        <p className="mt-4 text-lg text-slate-500 max-w-2xl mx-auto">
          Top-rated professionals vetted by <span className="text-blue-600 font-semibold">PropSight AI</span>.
        </p>
      </div>

      {/* Grid Layout */}
      <div className="max-w-7xl mx-auto grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {builders.map((builder) => (
          <div 
            key={builder.id} 
            className="bg-white rounded-3xl p-6 shadow-xl shadow-blue-100/50 border border-blue-100 flex flex-col justify-between"
          >
            
            {/* Top Row: Avatar + Name + Badge */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <img 
                  className="h-16 w-16 rounded-2xl object-cover shadow-sm" 
                  src={builder.image} 
                  alt={builder.name} 
                />
                <div>
                  <h3 className="text-lg font-bold text-slate-800 leading-tight">
                    {builder.name}
                  </h3>
                  <div className="flex items-center gap-1 mt-1">
                    {/* Blue Tick Icon */}
                    <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-xs font-medium text-blue-500 uppercase tracking-wide">Verified</span>
                  </div>
                </div>
              </div>
              
              {/* Rating Pill */}
              <div className="bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                <span className="text-slate-700 text-sm font-bold flex items-center gap-1">
                  <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                  {builder.rating}
                </span>
              </div>
            </div>

            {/* Specialty & Location */}
            <div className="mb-6 space-y-2">
              <div className="flex items-center text-sm text-slate-500">
                <svg className="w-4 h-4 mr-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                {builder.specialty}
              </div>
              <div className="flex items-center text-sm text-slate-500">
                <svg className="w-4 h-4 mr-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                {builder.city}
              </div>
            </div>

            {/* Metrics Container - Clean aesthetic */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-blue-50/50 rounded-2xl p-4 text-center border border-blue-50">
                <span className="block text-2xl font-bold text-slate-800">{builder.projectsCompleted}</span>
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Projects</span>
              </div>
              <div className="bg-blue-50/50 rounded-2xl p-4 text-center border border-blue-50">
                <span className="block text-2xl font-bold text-slate-800">{builder.experience}</span>
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Experience</span>
              </div>
            </div>

            {/* Button - Flat and clean, no shadow */}
            <button className="w-full py-3.5 px-4 rounded-xl text-sm font-semibold text-white bg-slate-900 transition-colors">
              View Portfolio
            </button>
            
          </div>
        ))}
      </div>
    </div>
  );
};

export default BuilderProfiles;