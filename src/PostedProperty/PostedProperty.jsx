import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PropertyCard from './PropertyCard';

const PostedProperty = () => {
  
  const [filters, setFilters] = useState({ city: 'All', area: '', colony: '', type: 'All' });
  const [allProperties, setAllProperties] = useState([]);
  const [results, setResults] = useState(null); // filtered results
  const [initialResults, setInitialResults] = useState([]); // random properties before filter
  const [loading, setLoading] = useState(false);

  const LOCATIONS = {
    Lahore: { "DHA": ["Phase 6", "Phase 8"], "Gulberg": ["Liberty", "MM Alam"], "Bahria Town": ["Sector A", "Sector C"] },
    Islamabad: { "Bahria Town": ["Civic Center", "Phase 1"], "DHA": ["DHA 1", "DHA 2"], "F-10": ["Markaz"] },
    Faisalabad: { "Madina Town": ["Susan Road", "Kohinoor"], "Canal Road": ["Abdullah Garden"], "D Ground": ["Peoples Colony"] }
  };

  // --- Derived dropdown data ---
  const cities = Object.keys(LOCATIONS);
  const areas = filters.city && filters.city !== 'All' ? Object.keys(LOCATIONS[filters.city] || {}) : [];
  const colonies = filters.area ? (LOCATIONS[filters.city]?.[filters.area] || []) : [];

  // Fetch all properties from backend
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const res = await axios.get('http://localhost:8080/api/properties/getAllProperties');
        const props = res.data;
        setAllProperties(props);

        // Pick 6 random properties to show initially
        const shuffled = props.sort(() => 0.5 - Math.random());
        setInitialResults(shuffled.slice(0, 6));

      } catch (err) {
        console.error('Error fetching properties:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  // --- Handlers ---
  const handleSearch = () => {
    const filtered = allProperties.filter(p => 
      (filters.city === 'All' || p.city === filters.city) &&
      (filters.area === '' || p.area === filters.area) &&
      (filters.type === 'All' || p.propertyType === filters.type)
    );
    setResults(filtered);
  };

  const handleReset = () => {
    setFilters({ city: 'All', area: '', colony: '', type: 'All' });
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
                  <option value="All">All</option>
                  {cities.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Area</label>
                <select 
                  value={filters.area} 
                  onChange={(e) => setFilters({ ...filters, area: e.target.value, colony: '' })}
                  disabled={!filters.city || filters.city === 'All'}
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
                  {['All', 'House', 'Apartment', 'Plot'].map(type => (
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
          {loading && (
            <div className="h-[400px] flex justify-center items-center text-slate-700 text-xl">
              Loading properties...
            </div>
          )}

          {/* Initial random properties */}
          {!loading && !results && initialResults.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-slate-800 mb-6">Featured Properties</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {initialResults.map(p => (
                  <PropertyCard key={p.id} property={p} formatPrice={formatPrice} />
                ))}
              </div>
            </div>
          )}

          {/* No results */}
          {results && results.length === 0 && (
            <div className="h-[400px] flex flex-col items-center justify-center text-center bg-white rounded-3xl border border-slate-100">
              <h3 className="text-xl font-bold text-slate-800">No Properties Found</h3>
              <button onClick={handleReset} className="mt-4 text-blue-600 font-bold hover:underline">Clear Filters</button>
            </div>
          )}

          {/* Filtered results */}
          {results && results.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-slate-800 mb-6">Results</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map(p => (
                  <PropertyCard key={p.id} property={p} formatPrice={formatPrice} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Reusable Property Card ---
// const PropertyCard = ({ property, formatPrice }) => (
//   <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl border border-slate-100 overflow-hidden transition-all group cursor-pointer">
//     <div className="relative h-48 overflow-hidden">
// <img
//   src={
//     property.images && property.images.length > 0
//       ? (typeof property.images[0] === 'string' ? property.images[0] : property.images[0].url)
//       : 'https://via.placeholder.com/300'
//   }
//   alt={property.title}
//   className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
// />

//       <span className="absolute top-3 right-3 bg-white/90 text-xs font-bold px-2 py-1 rounded">{property.propertyType}</span>
//     </div>
//     <div className="p-5">
//       <h3 className="text-lg font-bold text-slate-800 truncate">{property.title}</h3>
//       <p className="text-sm text-slate-500 mb-4">{property.colony}, {property.area}</p>
//       <div className="flex gap-3 text-xs font-medium text-slate-600 mb-4">
//         <span className="bg-slate-100 px-2 py-1 rounded">{property.beds} Beds</span>
//         <span className="bg-slate-100 px-2 py-1 rounded">{property.size}</span>
//       </div>
//       <div className="pt-3 border-t flex justify-between items-center">
//         <span className="text-lg font-extrabold text-blue-900">PKR {formatPrice(property.price)}</span>
//         <span className="text-blue-600">View &rarr;</span>
//       </div>
//     </div>
//   </div>
// );

export default PostedProperty;
