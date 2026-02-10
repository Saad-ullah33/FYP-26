import React, { useState } from 'react';

// --- Mock Data ---
const PROPERTIES = [
  { id: 1, title: "Luxury Villa in DHA", price: 45000000, city: "Lahore", area: "DHA", colony: "Phase 6", beds: 5, baths: 6, size: "1 Kanal", image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=600&q=80", type: "House" },
  { id: 2, title: "Modern Apartment", price: 12000000, city: "Islamabad", area: "Bahria Town", colony: "Civic Center", beds: 2, baths: 2, size: "5 Marla", image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=600&q=80", type: "Flat" },
  { id: 3, title: "Commercial Plot", price: 85000000, city: "Lahore", area: "Gulberg", colony: "Liberty", beds: 0, baths: 0, size: "10 Marla", image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80", type: "Plot" },
  { id: 4, title: "Corner House", price: 25000000, city: "Faisalabad", area: "Madina Town", colony: "Susan Road", beds: 4, baths: 4, size: "10 Marla", image: "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?auto=format&fit=crop&w=600&q=80", type: "House" }
];

const LOCATIONS = {
  Lahore: { "DHA": ["Phase 6", "Phase 8"], "Gulberg": ["Liberty", "MM Alam"], "Bahria Town": ["Sector A", "Sector C"] },
  Islamabad: { "Bahria Town": ["Civic Center", "Phase 1"], "DHA": ["DHA 1", "DHA 2"], "F-10": ["Markaz"] },
  Faisalabad: { "Madina Town": ["Susan Road", "Kohinoor"], "Canal Road": ["Abdullah Garden"], "D Ground": ["Peoples Colony"] }
};

const PostedProperty = () => {
  // 1. State
  const [filters, setFilters] = useState({ city: 'Lahore', area: '', colony: '', type: 'All' });
  const [results, setResults] = useState(null); // null = Start Screen

  // 2. Derived Data (Simplifies Dropdown Logic)
  const cities = Object.keys(LOCATIONS);
  const areas = filters.city ? Object.keys(LOCATIONS[filters.city] || {}) : [];
  const colonies = filters.area ? (LOCATIONS[filters.city]?.[filters.area] || []) : [];

  // 3. Handlers
  const handleSearch = () => {
    const filtered = PROPERTIES.filter(p => 
      (filters.city === 'All' || p.city === filters.city) &&
      (filters.area === '' || p.area === filters.area) &&
      (filters.type === 'All' || p.type === filters.type)
    );
    setResults(filtered);
  };

  const handleReset = () => {
    setFilters({ city: 'Lahore', area: '', colony: '', type: 'All' });
    setResults(null);
  };

  const formatPrice = (p) => p >= 10000000 ? `${(p/10000000).toFixed(2)} Crore` : `${(p/100000).toFixed(2)} Lakh`;

  return (
    <div className="min-h-screen bg-slate-50 font-sans py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* === LEFT SIDE: FILTERS === */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 sticky top-6">
            
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-800">Find Property</h2>
              <button onClick={handleReset} className="text-sm text-blue-600 font-semibold hover:underline">Reset</button>
            </div>

            {/* Filters */}
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">City</label>
                <select 
                  value={filters.city} 
                  onChange={(e) => setFilters({ ...filters, city: e.target.value, area: '', colony: '' })}
                  className="w-full bg-slate-50 border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {cities.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Area</label>
                <select 
                  value={filters.area} 
                  onChange={(e) => setFilters({ ...filters, area: e.target.value, colony: '' })}
                  disabled={!filters.city}
                  className="w-full bg-slate-50 border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  <option value="">Select Area</option>
                  {areas.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Colony</label>
                <select 
                  value={filters.colony} 
                  onChange={(e) => setFilters({ ...filters, colony: e.target.value })}
                  disabled={!filters.area}
                  className="w-full bg-slate-50 border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  <option value="">Select Colony</option>
                  {colonies.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="mb-8">
                <label className="block text-sm font-bold text-slate-700 mb-2">Type</label>
                <div className="flex gap-2 flex-wrap">
                  {['All', 'House', 'Flat', 'Plot'].map(type => (
                    <button
                      key={type}
                      onClick={() => setFilters({ ...filters, type })}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase ${filters.type === type ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button onClick={handleSearch} className="w-full mt-6 bg-slate-900 text-white font-bold py-3.5 rounded-xl hover:bg-blue-600 transition-colors">
              Search Properties
            </button>
          </div>
        </div>


        {/* === RIGHT SIDE: RESULTS === */}
        <div className="lg:col-span-9">
          
          {/* 1. START SCREEN (Initial State) */}
          {!results && (
            <div className="h-[500px] flex flex-col items-center justify-center text-center bg-white rounded-3xl border-2 border-dashed border-slate-200">
              <div className="bg-blue-50 p-6 rounded-full mb-4">
                <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-800">Find your dream home</h3>
              <p className="text-slate-500 mt-2">Select filters from the left to start searching.</p>
            </div>
          )}

          {/* 2. NO RESULTS FOUND */}
          {results && results.length === 0 && (
            <div className="h-[400px] flex flex-col items-center justify-center text-center bg-white rounded-3xl border border-slate-100">
               <h3 className="text-xl font-bold text-slate-800">No Properties Found</h3>
               <button onClick={handleReset} className="mt-4 text-blue-600 font-bold hover:underline">Clear Filters</button>
            </div>
          )}

          {/* 3. RESULTS GRID */}
          {results && results.length > 0 && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-800">Results</h2>
                <p className="text-slate-500 text-sm">Showing {results.length} properties in {filters.city}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map((p) => (
                  <div key={p.id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl border border-slate-100 overflow-hidden transition-all group cursor-pointer">
                    <div className="relative h-48 overflow-hidden">
                      <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      <span className="absolute top-3 right-3 bg-white/90 text-xs font-bold px-2 py-1 rounded">{p.type}</span>
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-bold text-slate-800 truncate">{p.title}</h3>
                      <p className="text-sm text-slate-500 mb-4">{p.colony}, {p.area}</p>
                      <div className="flex gap-3 text-xs font-medium text-slate-600 mb-4">
                        <span className="bg-slate-100 px-2 py-1 rounded">{p.beds} Beds</span>
                        <span className="bg-slate-100 px-2 py-1 rounded">{p.size}</span>
                      </div>
                      <div className="pt-3 border-t flex justify-between items-center">
                        <span className="text-lg font-extrabold text-blue-900">PKR {formatPrice(p.price)}</span>
                        <span className="text-blue-600">View &rarr;</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default PostedProperty;