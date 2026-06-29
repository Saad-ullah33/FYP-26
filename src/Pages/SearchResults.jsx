import React, { useEffect, useState, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  BedDouble,
  Bath,
  Ruler,
  Coins,
  Search,
  SlidersHorizontal,
  Sparkles,
  Inbox,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// =========================================================================
// MOCK PROPERTY DATABASE
// =========================================================================
const ALL_PROPERTIES = [
  // ── ISLAMABAD ──
  {
    id: 101,
    title: "1 Kanal Ultra-Modern Luxury Villa",
    address: "Sector F, DHA Phase 2, Islamabad",
    area: "1 Kanal",
    city: "Islamabad",
    price: "8.5 Crore",
    propertyType: "HOUSE",
    purpose: "Buy",
    bedrooms: 5,
    bathrooms: 6,
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80",
    featured: true,
  },
  {
    id: 102,
    title: "10 Marla Luxury Family Residence",
    address: "Phase 8, Bahria Town, Islamabad",
    area: "10 Marla",
    city: "Islamabad",
    price: "4.2 Crore",
    propertyType: "HOUSE",
    purpose: "Buy",
    bedrooms: 4,
    bathrooms: 5,
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80",
    featured: false,
  },
  {
    id: 103,
    title: "Premium Commercial Plaza Space",
    address: "Jinnah Avenue, Blue Area, Islamabad",
    area: "2000 Sq. Ft.",
    city: "Islamabad",
    price: "12 Crore",
    propertyType: "COMMERCIAL",
    purpose: "Buy",
    bedrooms: 0,
    bathrooms: 2,
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80",
    featured: true,
  },
  {
    id: 104,
    title: "5 Marla Residential Plot – DHA",
    address: "Block D, DHA Phase 2, Islamabad",
    area: "5 Marla",
    city: "Islamabad",
    price: "75 Lakh",
    propertyType: "PLOT",
    purpose: "Buy",
    bedrooms: 0,
    bathrooms: 0,
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80",
    featured: false,
  },
  {
    id: 105,
    title: "10 Marla Furnished Home for Rent",
    address: "F-10 Markaz, Islamabad",
    area: "10 Marla",
    city: "Islamabad",
    price: "1.2 Lakh / Month",
    propertyType: "HOUSE",
    purpose: "Rent",
    bedrooms: 4,
    bathrooms: 3,
    image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=600&q=80",
    featured: true,
  },
  {
    id: 106,
    title: "2-Bed Luxury Apartment for Rent",
    address: "E-11/4, Islamabad",
    area: "1200 Sq. Ft.",
    city: "Islamabad",
    price: "65,000 / Month",
    propertyType: "FLAT",
    purpose: "Rent",
    bedrooms: 2,
    bathrooms: 2,
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=600&q=80",
    featured: false,
  },
  // ── LAHORE ──
  {
    id: 201,
    title: "2 Kanal Spanish Styled Estate",
    address: "Phase 6, DHA, Lahore",
    area: "2 Kanal",
    city: "Lahore",
    price: "18.5 Crore",
    propertyType: "HOUSE",
    purpose: "Buy",
    bedrooms: 6,
    bathrooms: 7,
    image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=600&q=80",
    featured: true,
  },
  {
    id: 202,
    title: "10 Marla Brand New House – Bahria",
    address: "Sector C, Bahria Town, Lahore",
    area: "10 Marla",
    city: "Lahore",
    price: "3.8 Crore",
    propertyType: "HOUSE",
    purpose: "Buy",
    bedrooms: 4,
    bathrooms: 4,
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80",
    featured: false,
  },
  {
    id: 203,
    title: "1 Kanal House for Rent – DHA",
    address: "Phase 5, DHA, Lahore",
    area: "1 Kanal",
    city: "Lahore",
    price: "1.5 Lakh / Month",
    propertyType: "HOUSE",
    purpose: "Rent",
    bedrooms: 5,
    bathrooms: 5,
    image: "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?auto=format&fit=crop&w=600&q=80",
    featured: true,
  },
  // ── KARACHI ──
  {
    id: 301,
    title: "Sea-Facing Penthouse Apartment",
    address: "Clifton Block 2, Karachi",
    area: "3000 Sq. Ft.",
    city: "Karachi",
    price: "9 Crore",
    propertyType: "FLAT",
    purpose: "Buy",
    bedrooms: 4,
    bathrooms: 4,
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80",
    featured: true,
  },
  {
    id: 302,
    title: "Commercial Retail Storefront",
    address: "Zamzama, DHA Phase 5, Karachi",
    area: "1200 Sq. Ft.",
    city: "Karachi",
    price: "1.8 Lakh / Month",
    propertyType: "COMMERCIAL",
    purpose: "Rent",
    bedrooms: 0,
    bathrooms: 1,
    image: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=600&q=80",
    featured: false,
  },
  // ── FAISALABAD ──
  {
    id: 401,
    title: "1 Kanal Designer Luxury House",
    address: "Block G, Wapda City, Faisalabad",
    area: "1 Kanal",
    city: "Faisalabad",
    price: "6.8 Crore",
    propertyType: "HOUSE",
    purpose: "Buy",
    bedrooms: 5,
    bathrooms: 6,
    image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=600&q=80",
    featured: true,
  },
  {
    id: 402,
    title: "10 Marla Corner Plot – Eden Valley",
    address: "Jasmine Block, Eden Valley, Faisalabad",
    area: "10 Marla",
    city: "Faisalabad",
    price: "1.4 Crore",
    propertyType: "PLOT",
    purpose: "Buy",
    bedrooms: 0,
    bathrooms: 0,
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80",
    featured: false,
  },
  {
    id: 403,
    title: "10 Marla Furnished Family Home for Rent",
    address: "Canal Road, Peoples Colony, Faisalabad",
    area: "10 Marla",
    city: "Faisalabad",
    price: "95,000 / Month",
    propertyType: "HOUSE",
    purpose: "Rent",
    bedrooms: 4,
    bathrooms: 3,
    image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=600&q=80",
    featured: true,
  },
  {
    id: 404,
    title: "5 Marla Modern Apartment for Rent",
    address: "D-Ground, Gulberg III, Faisalabad",
    area: "5 Marla",
    city: "Faisalabad",
    price: "45,000 / Month",
    propertyType: "FLAT",
    purpose: "Rent",
    bedrooms: 3,
    bathrooms: 2,
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=600&q=80",
    featured: false,
  },
  {
    id: 405,
    title: "1 Kanal Bungalow for Rent – Millat Town",
    address: "Block B, Millat Town, Faisalabad",
    area: "1 Kanal",
    city: "Faisalabad",
    price: "1.8 Lakh / Month",
    propertyType: "HOUSE",
    purpose: "Rent",
    bedrooms: 6,
    bathrooms: 5,
    image: "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?auto=format&fit=crop&w=600&q=80",
    featured: true,
  },
  // ── RAWALPINDI ──
  {
    id: 501,
    title: "10 Marla Double Storey House",
    address: "Satellite Town, Block B, Rawalpindi",
    area: "10 Marla",
    city: "Rawalpindi",
    price: "3.5 Crore",
    propertyType: "HOUSE",
    purpose: "Buy",
    bedrooms: 5,
    bathrooms: 4,
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80",
    featured: true,
  },
  {
    id: 502,
    title: "5 Marla House for Rent – Chaklala",
    address: "Chaklala Scheme 3, Rawalpindi",
    area: "5 Marla",
    city: "Rawalpindi",
    price: "55,000 / Month",
    propertyType: "HOUSE",
    purpose: "Rent",
    bedrooms: 3,
    bathrooms: 2,
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80",
    featured: false,
  },
];

// =========================================================================
// TYPE MATCHING HELPER
// =========================================================================
const matchesType = (propertyType, typeQuery) => {
  const pt = (propertyType || "").toLowerCase();
  switch (typeQuery) {
    case "Homes":
      return pt.includes("house") || pt.includes("flat") || pt.includes("apartment") || pt.includes("villa") || pt.includes("home");
    case "Plots":
      return pt.includes("plot") || pt.includes("land");
    case "Commercial":
      return pt.includes("commercial") || pt.includes("office") || pt.includes("shop");
    default:
      return true;
  }
};

// =========================================================================
// COMPONENT
// =========================================================================
const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Read URL params
  const purpose = searchParams.get("purpose") || "Buy";
  const city = searchParams.get("city") || "Islamabad";
  const locationQuery = searchParams.get("location") || "";
  const typeQuery = searchParams.get("type") || "Homes";

  // Filter panel state
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [fCity, setFCity] = useState(city);
  const [fPurpose, setFPurpose] = useState(purpose);
  const [fLocation, setFLocation] = useState(locationQuery);
  const [fType, setFType] = useState(typeQuery);

  // Sync filter panel when URL changes
  useEffect(() => {
    setFCity(city);
    setFPurpose(purpose);
    setFLocation(locationQuery);
    setFType(typeQuery);
  }, [city, purpose, locationQuery, typeQuery]);

  // ── FILTER LOGIC (tiered fallback, computed synchronously via useMemo) ──
  const results = useMemo(() => {
    const cityLower = city.toLowerCase();
    const purposeLower = purpose.toLowerCase();
    const locLower = (locationQuery || "").toLowerCase().trim();

    // Tier 1: purpose + city + type + location
    const tier1 = ALL_PROPERTIES.filter((p) => {
      if (p.city.toLowerCase() !== cityLower) return false;
      if (p.purpose.toLowerCase() !== purposeLower) return false;
      if (!matchesType(p.propertyType, typeQuery)) return false;
      if (locLower && !p.address.toLowerCase().includes(locLower) && !p.area.toLowerCase().includes(locLower)) return false;
      return true;
    });
    if (tier1.length > 0) return tier1;

    // Tier 2: purpose + city + type (ignore location)
    const tier2 = ALL_PROPERTIES.filter((p) => {
      return p.city.toLowerCase() === cityLower && p.purpose.toLowerCase() === purposeLower && matchesType(p.propertyType, typeQuery);
    });
    if (tier2.length > 0) return tier2;

    // Tier 3: purpose + city (any type)
    const tier3 = ALL_PROPERTIES.filter((p) => {
      return p.city.toLowerCase() === cityLower && p.purpose.toLowerCase() === purposeLower;
    });
    if (tier3.length > 0) return tier3;

    // Tier 4: city only
    const tier4 = ALL_PROPERTIES.filter((p) => p.city.toLowerCase() === cityLower);
    if (tier4.length > 0) return tier4;

    // Tier 5: show everything
    return ALL_PROPERTIES;
  }, [city, purpose, locationQuery, typeQuery]);

  const applyFilters = () => {
    setSearchParams({ purpose: fPurpose, city: fCity, location: fLocation, type: fType });
    setIsFilterOpen(false);
  };

  // ── ANIMATION VARIANTS ──
  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.07 } } };
  const card = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120, damping: 16 } } };

  // ── CITIES & OPTIONS ──
  const cities = ["Islamabad", "Lahore", "Karachi", "Faisalabad", "Rawalpindi", "Multan"];
  const purposes = ["Buy", "Rent"];
  const types = ["Homes", "Plots", "Commercial"];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 relative pb-20 select-none">

      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:50px_50px] opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/20 via-transparent to-slate-950" />
        <div className="absolute top-[10%] left-[20%] w-[450px] h-[450px] bg-blue-600/5 rounded-full blur-[140px]" />
        <div className="absolute bottom-[20%] right-[10%] w-[550px] h-[550px] bg-indigo-600/5 rounded-full blur-[150px]" />
      </div>

      <div className="max-w-6xl mx-auto px-5 pt-8 relative z-10">

        {/* ── TOP NAV ── */}
        <div className="flex items-center justify-between mb-8 border-b border-slate-800/60 pb-5">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-slate-400 hover:text-white text-xs bg-slate-900/60 hover:bg-slate-800 border border-slate-700/60 px-4 py-2 rounded-full transition-all"
          >
            <ArrowLeft className="w-4 h-4 text-blue-400" />
            <span className="font-semibold tracking-wide">Back to Home</span>
          </button>
          <div className="hidden sm:flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
              {results.length} Properties Found
            </span>
          </div>
        </div>

        {/* ── FILTER HEADER ── */}
        <div className="mb-8 flex flex-col gap-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-900/50 border border-slate-800/60 p-4 rounded-2xl">

            {/* Active filter pills */}
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="text-slate-500 flex items-center gap-1.5 text-xs">
                <Search className="w-3.5 h-3.5 text-blue-400" /> Query:
              </span>
              <span className="bg-blue-500/15 border border-blue-500/30 text-blue-400 font-bold px-3 py-1 rounded-full text-xs">{city}</span>
              <span className="bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 font-bold px-3 py-1 rounded-full text-xs">{typeQuery}</span>
              <span className="bg-purple-500/15 border border-purple-500/30 text-purple-400 font-bold px-3 py-1 rounded-full text-xs">For {purpose}</span>
              {locationQuery && (
                <span className="bg-slate-800 border border-slate-700 text-slate-300 font-bold px-3 py-1 rounded-full text-xs">📍 {locationQuery}</span>
              )}
            </div>

            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center gap-2 font-bold text-xs px-5 py-2.5 rounded-xl transition-all ${
                isFilterOpen
                  ? "bg-blue-600 text-white"
                  : "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              {isFilterOpen ? "Close" : "Adjust Filters"}
            </button>
          </div>

          {/* Collapsible filter panel */}
          <AnimatePresence>
            {isFilterOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ type: "spring", stiffness: 100, damping: 17 }}
                className="overflow-hidden"
              >
                <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl flex flex-col gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* City */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] text-slate-500 uppercase tracking-widest pl-1 font-bold">City</label>
                      <select value={fCity} onChange={(e) => setFCity(e.target.value)}
                        className="bg-[#090d16] border border-slate-700 text-white text-sm rounded-xl px-3 py-2.5 outline-none focus:border-blue-500 cursor-pointer appearance-none">
                        {cities.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    {/* Purpose */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] text-slate-500 uppercase tracking-widest pl-1 font-bold">Purpose</label>
                      <select value={fPurpose} onChange={(e) => setFPurpose(e.target.value)}
                        className="bg-[#090d16] border border-slate-700 text-white text-sm rounded-xl px-3 py-2.5 outline-none focus:border-blue-500 cursor-pointer appearance-none">
                        {purposes.map((p) => <option key={p} value={p}>{p}</option>)}
                      </select>
                    </div>
                    {/* Location */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] text-slate-500 uppercase tracking-widest pl-1 font-bold">Location</label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input type="text" placeholder="e.g. DHA, Phase 2" value={fLocation}
                          onChange={(e) => setFLocation(e.target.value)}
                          className="w-full bg-[#090d16] border border-slate-700 text-white text-sm rounded-xl pl-9 pr-3 py-2.5 outline-none focus:border-blue-500 placeholder:text-slate-600" />
                      </div>
                    </div>
                    {/* Property Type */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] text-slate-500 uppercase tracking-widest pl-1 font-bold">Property Type</label>
                      <select value={fType} onChange={(e) => setFType(e.target.value)}
                        className="bg-[#090d16] border border-slate-700 text-white text-sm rounded-xl px-3 py-2.5 outline-none focus:border-blue-500 cursor-pointer appearance-none">
                        {types.map((t) => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-3 border-t border-slate-800/60">
                    <button onClick={() => { setFCity(city); setFPurpose(purpose); setFLocation(locationQuery); setFType(typeQuery); setIsFilterOpen(false); }}
                      className="text-xs font-semibold text-slate-400 hover:text-white px-4 py-2">
                      Cancel
                    </button>
                    <button onClick={applyFilters}
                      className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition-all">
                      Apply Filters
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── RESULTS GRID ── */}
        {results.length > 0 ? (
          <motion.div variants={container} initial="hidden" animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((p) => (
              <motion.div key={p.id} variants={card}
                onClick={() => navigate(`/property/${p.id}`)}
                className="bg-slate-900/70 border border-slate-800 hover:border-blue-500/50 rounded-2xl overflow-hidden cursor-pointer hover:shadow-[0_12px_36px_rgba(59,130,246,0.12)] hover:-translate-y-1 transition-all duration-300 group">
                
                {/* Image */}
                <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                  <img src={p.image} alt={p.title}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                  <div className="absolute top-3 left-3 flex gap-1.5">
                    <span className="bg-blue-600 text-white font-bold text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-lg">
                      For {p.purpose}
                    </span>
                    <span className="bg-slate-900/80 backdrop-blur text-slate-300 font-bold text-[9px] px-2.5 py-1 rounded-lg border border-slate-700">
                      {p.propertyType}
                    </span>
                  </div>
                  {p.featured && (
                    <span className="absolute top-3 right-3 bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-[9px] uppercase px-2.5 py-1 rounded-lg flex items-center gap-0.5">
                      <Sparkles className="w-3 h-3" /> Featured
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="font-bold text-[15px] text-slate-100 group-hover:text-blue-400 transition-colors leading-snug line-clamp-1">
                    {p.title}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1.5 flex items-start gap-1">
                    <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                    <span className="truncate">{p.address}</span>
                  </p>

                  {/* Specs */}
                  <div className="mt-4 flex items-center gap-2.5 flex-wrap">
                    {p.bedrooms > 0 && (
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400 bg-slate-800/70 px-2.5 py-1.5 rounded-lg">
                        <BedDouble className="w-3.5 h-3.5 text-slate-500" />
                        {p.bedrooms} Beds
                      </div>
                    )}
                    {p.bathrooms > 0 && (
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400 bg-slate-800/70 px-2.5 py-1.5 rounded-lg">
                        <Bath className="w-3.5 h-3.5 text-slate-500" />
                        {p.bathrooms} Baths
                      </div>
                    )}
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 bg-slate-800/70 px-2.5 py-1.5 rounded-lg">
                      <Ruler className="w-3.5 h-3.5 text-slate-500" />
                      {p.area}
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between">
                    <div>
                      <span className="text-[9px] text-slate-500 uppercase tracking-wider block">Price</span>
                      <span className="text-sm font-black text-blue-400 flex items-center gap-1">
                        <Coins className="w-4 h-4 text-yellow-500" /> {p.price}
                      </span>
                    </div>
                    <div className="bg-slate-800 border border-slate-700 hover:bg-slate-700 p-2 rounded-xl transition-all">
                      <ChevronRight className="w-4 h-4 text-blue-400" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          /* Empty State */
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-slate-800 text-slate-500 flex items-center justify-center mx-auto mb-4">
              <Inbox className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-slate-300 mb-1">No Matching Properties</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No listings for <strong>{typeQuery} ({purpose})</strong> in {city}.
            </p>
            <button
              onClick={() => setSearchParams({ purpose: "Buy", city: "Islamabad", location: "", type: "Homes" })}
              className="mt-6 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all"
            >
              Reset to Islamabad
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default SearchResults;
