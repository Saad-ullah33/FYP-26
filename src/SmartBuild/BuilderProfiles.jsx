import React, { useState } from 'react';

// --- Extended Data with Portfolio Images & Contact Info ---
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
    phone: "+923001234567",
    whatsapp: "+923001234567",
    about: "Ahmed is a veteran in Lahore's construction sector, known for delivering high-end residential complexes on time. His team specializes in modern grey structures and premium finishing.",
    portfolio: [
      "https://images.unsplash.com/photo-1600596542815-6008990f4948?auto=format&fit=crop&w=400&q=60",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=60",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=400&q=60"
    ]
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
    phone: "+923007654321",
    whatsapp: "+923007654321",
    about: "Sarah brings a modern architectural perspective to Karachi's skyline. Specializing in steel structures and commercial plazas, she ensures durability and aesthetic appeal.",
    portfolio: [
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=400&q=60",
      "https://images.unsplash.com/photo-1479839672679-a46483c0e7c8?auto=format&fit=crop&w=400&q=60",
      "https://images.unsplash.com/photo-1554469384-e58fac16e23a?auto=format&fit=crop&w=400&q=60"
    ]
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
    phone: "+923331122334",
    whatsapp: "+923331122334",
    about: "Usman is the go-to builder for smart homes in DHA and Bahria Town. He integrates home automation directly into the construction phase for seamless living.",
    portfolio: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=60",
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=400&q=60",
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=400&q=60"
    ]
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
    phone: "+923218899776",
    whatsapp: "+923218899776",
    about: "Zainab champions sustainable construction in Faisalabad. She uses locally sourced materials and energy-efficient designs to lower long-term maintenance costs.",
    portfolio: [
      "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=400&q=60",
      "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=400&q=60",
      "https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&w=400&q=60"
    ]
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
    phone: "+923456677889",
    whatsapp: "+923456677889",
    about: "Bilal specializes in heavy-duty industrial construction in the Multan industrial estate. His warehouses are built for high load-bearing and thermal efficiency.",
    portfolio: [
      "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=400&q=60",
      "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=400&q=60",
      "https://images.unsplash.com/photo-1565514020176-db7936a70445?auto=format&fit=crop&w=400&q=60"
    ]
  }
];

const BuilderProfiles = () => {
  const [selectedBuilder, setSelectedBuilder] = useState(null);

  // --- 1. Detail View Component (Portfolio) ---
  if (selectedBuilder) {
    return (
      <div className="min-h-screen bg-blue-50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
        <div className="max-w-4xl mx-auto">
          
          {/* Back Button */}
          <button 
            onClick={() => setSelectedBuilder(null)}
            className="mb-6 flex items-center text-blue-700 font-semibold hover:bg-blue-100 px-4 py-2 rounded-lg transition-colors w-fit"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Back to Builders
          </button>

          {/* Profile Card Header */}
          <div className="bg-white rounded-3xl shadow-xl shadow-blue-100/50 border border-blue-100 overflow-hidden mb-8">
            <div className="p-8 sm:flex sm:items-start sm:justify-between bg-white relative overflow-hidden">
               {/* Decorative Background Blob */}
               <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-blue-50 opacity-50 blur-2xl"></div>

               <div className="flex items-center gap-6 relative z-10">
                <img 
                  className="h-24 w-24 rounded-2xl object-cover shadow-md border-2 border-white" 
                  src={selectedBuilder.image} 
                  alt={selectedBuilder.name} 
                />
                <div>
                  <h2 className="text-3xl font-extrabold text-slate-800">{selectedBuilder.name}</h2>
                  <p className="text-blue-600 font-medium flex items-center gap-1 mt-1">
                    {selectedBuilder.specialty}
                    <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full ml-2">Verified</span>
                  </p>
                  <div className="flex items-center text-slate-500 text-sm mt-2">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    {selectedBuilder.city}
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="mt-6 sm:mt-0 flex gap-4 relative z-10">
                <div className="text-center px-4 py-2 bg-blue-50 rounded-xl">
                    <span className="block text-xl font-bold text-slate-800">{selectedBuilder.rating}</span>
                    <span className="text-xs text-slate-500 font-bold uppercase">Rating</span>
                </div>
                <div className="text-center px-4 py-2 bg-blue-50 rounded-xl">
                    <span className="block text-xl font-bold text-slate-800">{selectedBuilder.projectsCompleted}</span>
                    <span className="text-xs text-slate-500 font-bold uppercase">Projects</span>
                </div>
              </div>
            </div>

            {/* About Section */}
            <div className="px-8 pb-8">
              <h3 className="text-lg font-bold text-slate-800 mb-2">About the Builder</h3>
              <p className="text-slate-600 leading-relaxed">{selectedBuilder.about}</p>
            </div>

            {/* Action Buttons */}
            <div className="bg-slate-50 px-8 py-6 border-t border-slate-100 flex flex-col sm:flex-row gap-4">
              <button className="flex-1 flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-200">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                Call Now
              </button>
              <button className="flex-1 flex justify-center items-center gap-2 bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-bold transition-all shadow-lg shadow-green-200">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                WhatsApp
              </button>
            </div>
          </div>

          {/* Portfolio Grid */}
          <h3 className="text-2xl font-bold text-slate-800 mb-6 px-2">Recent Projects</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {selectedBuilder.portfolio.map((img, index) => (
              <div key={index} className="group relative aspect-video rounded-2xl overflow-hidden shadow-md border border-blue-50">
                 <img src={img} alt="Project" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                   <span className="text-white font-medium text-sm">View Details</span>
                 </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    );
  }

  // --- 2. Main Grid View (Default) ---
  return (
    <div className="min-h-screen bg-blue-50 py-16 px-4 sm:px-6 lg:px-8 font-sans">
      
      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-16 text-center">
        <h2 className="text-3xl font-extrabold text-slate-800 sm:text-4xl tracking-tight">Verified Builders</h2>
        <p className="mt-4 text-lg text-slate-500 max-w-2xl mx-auto">
          Top-rated professionals vetted by <span className="text-blue-600 font-semibold">PropSight AI</span>.
        </p>
      </div>

      {/* Grid Layout */}
      <div className="max-w-7xl mx-auto grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {builders.map((builder) => (
          <div 
            key={builder.id} 
            className="bg-white rounded-3xl p-6 shadow-xl shadow-blue-100/50 border border-blue-100 flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300"
          >
            {/* Top Row: Avatar + Name + Badge */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <img 
                  className="h-16 w-16 rounded-2xl object-cover shadow-sm border border-slate-100" 
                  src={builder.image} 
                  alt={builder.name} 
                />
                <div>
                  <h3 className="text-lg font-bold text-slate-800 leading-tight">{builder.name}</h3>
                  <div className="flex items-center gap-1 mt-1">
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

            {/* Metrics */}
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

            {/* View Portfolio Button */}
            <button 
              onClick={() => setSelectedBuilder(builder)}
              className="w-full py-3.5 px-4 rounded-xl text-sm font-semibold text-white bg-slate-900 hover:bg-blue-700 transition-colors duration-200"
            >
              View Portfolio
            </button>
            
          </div>
        ))}
      </div>
    </div>
  );
};

export default BuilderProfiles;