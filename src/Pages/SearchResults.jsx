import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { 
  ArrowLeft, 
  MapPin, 
  BedDouble, 
  Bath, 
  Grid, 
  Coins, 
  Search, 
  SlidersHorizontal,
  Building,
  Sparkles,
  Inbox,
  X,
  ChevronRight,
  Filter,
  CheckCircle,
  Home
} from "lucide-react";
import { Select, TextInput } from '@mantine/core';
import { motion, AnimatePresence } from "framer-motion";

// =========================================================================
// PREMIUM MOCK PROPERTIES (FALLBACK)
// =========================================================================
const FALLBACK_PROPERTIES = [
  {
    id: 101,
    title: "1 Kanal Ultra-Modern Luxury Villa",
    address: "Sector F, DHA Phase 2, Islamabad",
    area: "1 Kanal",
    city: { name: "Islamabad" },
    price: "8.5 Crore",
    propertyType: "HOUSE",
    purpose: "Buy",
    bedrooms: 5,
    bathrooms: 6,
    description: "Designed by a renowned architect, this stunning smart home features a double-height lobby, Italian marble flooring, built-in kitchen appliances, and private cinema.",
    images: [{ cloudinary_src: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80" }],
    featured: true
  },
  {
    id: 102,
    title: "10 Marla Luxury Family Residence",
    address: "Phase 8, Bahria Town, Rawalpindi/Islamabad",
    area: "10 Marla",
    city: { name: "Islamabad" },
    price: "4.2 Crore",
    propertyType: "HOUSE",
    purpose: "Buy",
    bedrooms: 4,
    bathrooms: 5,
    description: "Brand new double unit house with imported fixtures, spacious backyard, and dual parking porch. Located close to the commercial area and main boulevard.",
    images: [{ cloudinary_src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80" }],
    featured: false
  },
  {
    id: 103,
    title: "Premium Commercial Plaza Space",
    address: "Jinnah Avenue, Blue Area, Islamabad",
    area: "2000 Sq. Ft.",
    city: { name: "Islamabad" },
    price: "12 Crore",
    propertyType: "COMMERCIAL",
    purpose: "Buy",
    bedrooms: 0,
    bathrooms: 2,
    description: "High-exposure corporate office/retail space in the heart of Islamabad's primary business hub, complete with central cooling and high-speed elevator access.",
    images: [{ cloudinary_src: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80" }],
    featured: true
  },
  {
    id: 104,
    title: "5 Marla Residential Plot in Giga City",
    address: "Block D, DHA Phase 2, Islamabad",
    area: "5 Marla",
    city: { name: "Islamabad" },
    price: "75 Lakh",
    propertyType: "PLOT",
    purpose: "Buy",
    bedrooms: 0,
    bathrooms: 0,
    description: "Prime location plot, level ground, near park and commercial street. Ready for immediate construction. Utility fees fully cleared.",
    images: [{ cloudinary_src: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80" }],
    featured: false
  },
  {
    id: 201,
    title: "2 Kanal Spanish Styled Estate",
    address: "Phase 6, DHA, Lahore",
    area: "2 Kanal",
    city: { name: "Lahore" },
    price: "18.5 Crore",
    propertyType: "HOUSE",
    purpose: "Buy",
    bedrooms: 6,
    bathrooms: 7,
    description: "An architectural masterpiece in Spanish design, featuring a luxury swimming pool, sprawling lawns, dual basement, and automated security controls.",
    images: [{ cloudinary_src: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=600&q=80" }],
    featured: true
  },
  {
    id: 202,
    title: "Furnished Executive Penthouse",
    address: "Zafar Ali Road, Gulberg V, Lahore",
    area: "3500 Sq. Ft.",
    city: { name: "Lahore" },
    price: "3.2 Lakh / Month",
    propertyType: "APARTMENT",
    purpose: "Rent",
    bedrooms: 3,
    bathrooms: 4,
    description: "Fully serviced luxury apartment featuring a private roof garden, chef's kitchen, high-definition home theater, and gorgeous skyline views of Lahore.",
    images: [{ cloudinary_src: "https://images.unsplash.com/photo-1567496898669-ee935f5f647a?auto=format&fit=crop&w=600&q=80" }],
    featured: false
  },
  {
    id: 301,
    title: "Sea-Facing Premium Apartment",
    address: "Emaar Oceanfront, DHA Phase 8, Karachi",
    area: "2800 Sq. Ft.",
    city: { name: "Karachi" },
    price: "9.8 Crore",
    propertyType: "APARTMENT",
    purpose: "Buy",
    bedrooms: 3,
    bathrooms: 4,
    description: "Spectacular uninterrupted Arabian sea views, temperature-controlled pools, state-of-the-art gym, and direct beach access. 24/7 security and concierge.",
    images: [{ cloudinary_src: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80" }],
    featured: true
  },
  {
    id: 302,
    title: "Commercial Retail Storefront",
    address: "Zamzama Commercial, DHA Phase 5, Karachi",
    area: "1200 Sq. Ft.",
    city: { name: "Karachi" },
    price: "1.8 Lakh / Month",
    propertyType: "COMMERCIAL",
    purpose: "Rent",
    bedrooms: 0,
    bathrooms: 1,
    description: "Highly visible retail location on Karachi's premium commercial hub, ideal for fashion brands, jewelry outlets, or premium dining cafes.",
    images: [{ cloudinary_src: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=600&q=80" }],
    featured: false
  },
  {
    id: 401,
    title: "1 Kanal Designer Luxury House",
    address: "Block G, Wapda City, Faisalabad",
    area: "1 Kanal",
    city: { name: "Faisalabad" },
    price: "6.8 Crore",
    propertyType: "HOUSE",
    purpose: "Buy",
    bedrooms: 5,
    bathrooms: 6,
    description: "Newly constructed luxury home on Wapda City main road, featuring high ceiling rooms, solid ash wood doors, premium Turkish bath fittings, and kitchen terrace.",
    images: [{ cloudinary_src: "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=600&q=80" }],
    featured: true
  },
  {
    id: 402,
    title: "10 Marla Corner Plot in Prime Locality",
    address: "Jasmine Block, Eden Valley, Faisalabad",
    area: "10 Marla",
    city: { name: "Faisalabad" },
    price: "1.4 Crore",
    propertyType: "PLOT",
    purpose: "Buy",
    bedrooms: 0,
    bathrooms: 0,
    description: "Double road corner plot in Eden Valley. Gas, water, electricity meters ready. Facing green community park. Highly secure society gated boundary.",
    images: [{ cloudinary_src: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80" }],
    featured: false
  }
];

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // URL State values
  const purpose = searchParams.get("purpose") || "Buy";
  const city = searchParams.get("city") || "Islamabad";
  const locationQuery = searchParams.get("location") || "";
  const typeQuery = searchParams.get("type") || "Homes";

  // Data State
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // Accordion state for filter panel
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);

  // Edit Filters form states
  const [localPurpose, setLocalPurpose] = useState(purpose);
  const [localCity, setLocalCity] = useState(city);
  const [localLocation, setLocalLocation] = useState(locationQuery);
  const [localType, setLocalType] = useState(typeQuery);

  // Load properties
  useEffect(() => {
    const fetchAllProperties = async () => {
      try {
        setLoading(true);
        const res = await api.get("/properties/getAllProperties");
        
        const dbProps = Array.isArray(res.data) 
          ? res.data 
          : res.data?.data || [];

        // Normalize DB properties
        const normalized = dbProps.map((p) => ({
          ...p,
          imageUrl: p.images?.[0]?.cloudinary_src || p.image?.cloudinary_src || p.photoUrl || p.url || null
        }));

        // Merge DB properties with mock fallback properties
        const merged = [...normalized];
        FALLBACK_PROPERTIES.forEach(mockProp => {
          if (!merged.some(p => p.title.toLowerCase() === mockProp.title.toLowerCase())) {
            merged.push(mockProp);
          }
        });

        setProperties(merged);
      } catch (err) {
        console.warn("Backend API offline, falling back to mock database", err);
        setProperties(FALLBACK_PROPERTIES);
      } finally {
        setLoading(false);
      }
    };

    fetchAllProperties();
  }, []);

  // Filter application trigger
  useEffect(() => {
    if (properties.length === 0) return;

    const filtered = properties.filter((p) => {
      // 1. Purpose Filter
      const pPurpose = p.purpose || "Buy";
      const matchesPurpose = pPurpose.toLowerCase() === purpose.toLowerCase();

      // 2. City Filter
      const pCity = p.city?.name || p.city || "";
      const matchesCity = pCity.toLowerCase() === city.toLowerCase();

      // 3. Location/Area Substring Match
      const pArea = p.area || "";
      const pAddress = p.address || "";
      const query = locationQuery.toLowerCase().trim();
      const matchesLocation = 
        query === "" || 
        pArea.toLowerCase().includes(query) || 
        pAddress.toLowerCase().includes(query);

      // 4. Property Category Match
      const pType = (p.propertyType || "").toLowerCase();
      let matchesType = false;

      if (typeQuery === "Homes") {
        matchesType = pType.includes("house") || pType.includes("flat") || pType.includes("apartment") || pType.includes("villa") || pType.includes("home");
      } else if (typeQuery === "Plots") {
        matchesType = pType.includes("plot") || pType.includes("land") || pType.includes("agriculture");
      } else if (typeQuery === "Commercial") {
        matchesType = pType.includes("commercial") || pType.includes("office") || pType.includes("shop") || pType.includes("industrial");
      } else {
        matchesType = true;
      }

      return matchesPurpose && matchesCity && matchesLocation && matchesType;
    });

    setFilteredProperties(filtered);
  }, [properties, purpose, city, locationQuery, typeQuery]);

  // Apply inputs to search parameters in URL
  const applyFilters = () => {
    setSearchParams({
      purpose: localPurpose,
      city: localCity,
      location: localLocation,
      type: localType
    });
    setIsFilterExpanded(false); // Smoothly collapse filter board
  };

  const getCleanPrice = (p) => {
    if (typeof p === "number") {
      return p >= 10000000 
        ? `PKR ${(p / 10000000).toFixed(2)} Crore` 
        : `PKR ${(p / 100000).toFixed(2)} Lakh`;
    }
    return p;
  };

  // Framer Motion variants for lists
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120, damping: 15 } }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans relative pb-20 select-none">
      
      {/* ── DESIGN BACKGROUND: RADIAL RADIANTS & GEOMETRIC GRIDS ── */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        {/* Deep grid lines overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:50px_50px] opacity-40" />
        {/* Soft edge fade overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/20 via-transparent to-slate-950" />
        
        {/* Glowing spatial node spots */}
        <div className="absolute top-[10%] left-[20%] w-[450px] h-[450px] bg-blue-600/5 rounded-full blur-[140px]" />
        <div className="absolute bottom-[20%] right-[10%] w-[550px] h-[550px] bg-indigo-600/5 rounded-full blur-[150px]" />
      </div>

      <div className="max-w-6xl mx-auto px-5 pt-8 relative z-10">
        
        {/* ── 1. PORTAL NAV BAR (TOP LEVEL BACK CONTROL) ── */}
        <div className="flex items-center justify-between mb-8 border-b border-slate-900 pb-5">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-all text-xs bg-slate-900/50 hover:bg-slate-900 border border-slate-800/80 hover:border-slate-700/80 px-4 py-2 rounded-full shadow-lg"
          >
            <ArrowLeft className="w-4 h-4 text-blue-400" />
            <span className="font-semibold tracking-wide">Back to Portal Home</span>
          </button>
          
          <div className="hidden sm:flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Live Spatial Nodes Syncing</span>
          </div>
        </div>

        {/* ── 2. UNIFIED CAPSULE FILTER HEADER (Interactive pill console) ── */}
        <div className="mb-10 flex flex-col gap-4">
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-900/40 backdrop-blur-xl border border-slate-850 p-4 rounded-3xl shadow-2xl">
            
            {/* Expanded status indicators */}
            <div className="flex flex-wrap items-center gap-2 text-sm pl-2">
              <span className="text-slate-400 flex items-center gap-1.5"><Search className="w-4 h-4 text-blue-400" /> Query:</span>
              <span className="bg-blue-600/10 border border-blue-500/20 text-blue-400 font-bold px-3 py-1 rounded-full text-xs">
                {city}
              </span>
              <span className="bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 font-bold px-3 py-1 rounded-full text-xs">
                {typeQuery}
              </span>
              <span className="bg-purple-600/10 border border-purple-500/20 text-purple-400 font-bold px-3 py-1 rounded-full text-xs">
                For {purpose}
              </span>
              {locationQuery && (
                <span className="bg-slate-800 border border-slate-700 text-slate-300 font-bold px-3 py-1 rounded-full text-xs max-w-[150px] truncate">
                  📍 {locationQuery}
                </span>
              )}
            </div>

            {/* Adjust trigger button */}
            <button
              onClick={() => setIsFilterExpanded(!isFilterExpanded)}
              className={`flex items-center gap-2 font-bold text-xs px-5 py-2.5 rounded-2xl transition-all shadow-md ${
                isFilterExpanded 
                  ? "bg-blue-600 text-white shadow-blue-600/20" 
                  : "bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 hover:border-slate-700"
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" /> 
              <span>{isFilterExpanded ? "Close Panel" : "Adjust Filters"}</span>
            </button>
          </div>

          {/* Collapsible glassmorphic edit filters desk */}
          <AnimatePresence>
            {isFilterExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ type: "spring", stiffness: 100, damping: 17 }}
                className="overflow-hidden bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-5 rounded-3xl shadow-3xl flex flex-col gap-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* City */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-slate-500 uppercase tracking-widest pl-1 font-bold">Select City</label>
                    <Select
                      value={localCity}
                      onChange={setLocalCity}
                      data={['Islamabad', 'Lahore', 'Karachi', 'Faisalabad']}
                      styles={{
                        input: { backgroundColor: '#090d16', border: '1px solid #1e293b', color: '#fff', fontSize: '13px', borderRadius: '12px' },
                        dropdown: { backgroundColor: '#090d16', border: '1px solid #1e293b', color: '#fff', borderRadius: '12px' }
                      }}
                    />
                  </div>

                  {/* Purpose */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-slate-500 uppercase tracking-widest pl-1 font-bold">Purpose</label>
                    <Select
                      value={localPurpose}
                      onChange={setLocalPurpose}
                      data={['Buy', 'Rent', 'Projects']}
                      styles={{
                        input: { backgroundColor: '#090d16', border: '1px solid #1e293b', color: '#fff', fontSize: '13px', borderRadius: '12px' },
                        dropdown: { backgroundColor: '#090d16', border: '1px solid #1e293b', color: '#fff', borderRadius: '12px' }
                      }}
                    />
                  </div>

                  {/* Location */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-slate-500 uppercase tracking-widest pl-1 font-bold">Specific Location</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                      <TextInput
                        placeholder="e.g. DHA, Phase 2"
                        value={localLocation}
                        onChange={(e) => setLocalLocation(e.currentTarget.value)}
                        styles={{
                          input: { backgroundColor: '#090d16', border: '1px solid #1e293b', color: '#fff', paddingLeft: '36px', fontSize: '13px', borderRadius: '12px' }
                        }}
                      />
                    </div>
                  </div>

                  {/* Property Type */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-slate-500 uppercase tracking-widest pl-1 font-bold">Property Type</label>
                    <Select
                      value={localType}
                      onChange={setLocalType}
                      data={['Homes', 'Plots', 'Commercial']}
                      styles={{
                        input: { backgroundColor: '#090d16', border: '1px solid #1e293b', color: '#fff', fontSize: '13px', borderRadius: '12px' },
                        dropdown: { backgroundColor: '#090d16', border: '1px solid #1e293b', color: '#fff', borderRadius: '12px' }
                      }}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-2 border-t border-slate-800/60 pt-4">
                  <button
                    onClick={() => {
                      setLocalPurpose(purpose);
                      setLocalCity(city);
                      setLocalLocation(locationQuery);
                      setLocalType(typeQuery);
                      setIsFilterExpanded(false);
                    }}
                    className="text-xs font-semibold text-slate-400 hover:text-white px-4 py-2"
                  >
                    Reset Changes
                  </button>
                  <button
                    onClick={applyFilters}
                    className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition-all shadow-md shadow-blue-900/10 border border-blue-500/20"
                  >
                    Apply New Query
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── 3. RESULTS AREA DISPLAY ── */}
        <div>
          {loading ? (
            <div className="text-center py-24 text-slate-400">
              <div className="relative w-14 h-14 mx-auto mb-4">
                <div className="absolute inset-0 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <div className="absolute inset-2 border-2 border-indigo-500 border-b-transparent rounded-full animate-spin animate-duration-1000" />
              </div>
              <p className="text-sm font-bold bg-gradient-to-r from-blue-400 to-indigo-400 text-transparent bg-clip-text">Connecting to spatial registry...</p>
              <p className="text-[10px] text-slate-500 uppercase font-medium mt-1">Checking secure database</p>
            </div>
          ) : filteredProperties.length > 0 ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredProperties.map((p) => {
                const imageSrc = p.imageUrl || p.images?.[0]?.cloudinary_src || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80";
                
                return (
                  <motion.div
                    key={p.id}
                    variants={cardVariants}
                    onClick={() => navigate(`/property/${p.id}`)}
                    className="bg-slate-900/20 hover:bg-slate-900/35 border border-slate-850 hover:border-blue-500/40 rounded-3xl overflow-hidden cursor-pointer hover:shadow-[0_15px_40px_rgba(59,130,246,0.1)] hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between"
                  >
                    {/* Image Section */}
                    <div className="relative h-48 w-full overflow-hidden bg-slate-950">
                      <img
                        src={imageSrc}
                        alt={p.title}
                        className="h-full w-full object-cover group-hover:scale-105 transition-all duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-85" />
                      
                      {/* Floating badging */}
                      <div className="absolute top-4 left-4 flex gap-1.5">
                        <span className="bg-blue-600 text-white font-black text-[9px] uppercase tracking-widest px-3 py-1 rounded-lg shadow-md border border-blue-500/25">
                          For {p.purpose || "Sale"}
                        </span>
                        
                        <span className="bg-slate-950/80 backdrop-blur-md text-slate-300 font-bold text-[9px] px-2.5 py-1 rounded-lg border border-slate-800 shadow">
                          {p.propertyType}
                        </span>
                      </div>

                      {p.featured && (
                        <span className="absolute top-4 right-4 bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-[9px] uppercase tracking-wider px-2.5 py-1 rounded-lg flex items-center gap-0.5 shadow-md shadow-amber-500/10">
                          <Sparkles className="w-3 h-3 fill-slate-950" /> Featured
                        </span>
                      )}
                    </div>

                    {/* Meta Body info */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-bold text-base text-slate-100 group-hover:text-blue-400 transition-colors line-clamp-1">
                          {p.title}
                        </h3>
                        <p className="text-[11px] text-slate-400 mt-1.5 flex items-start gap-1 leading-normal">
                          <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                          <span className="truncate">{p.address}</span>
                        </p>

                        {/* Specs display */}
                        <div className="mt-4 flex items-center gap-3 border-b border-slate-900 pb-4">
                          {p.bedrooms > 0 && (
                            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 bg-slate-950/60 px-2.5 py-1.5 rounded-lg border border-slate-900">
                              <BedDouble className="w-3.5 h-3.5 text-slate-500" />
                              <span>{p.bedrooms} Beds</span>
                            </div>
                          )}
                          {p.bathrooms > 0 && (
                            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 bg-slate-950/60 px-2.5 py-1.5 rounded-lg border border-slate-900">
                              <Bath className="w-3.5 h-3.5 text-slate-500" />
                              <span>{p.bathrooms} Baths</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 bg-slate-950/60 px-2.5 py-1.5 rounded-lg border border-slate-900">
                            <Grid className="w-3.5 h-3.5 text-slate-500" />
                            <span>{p.area}</span>
                          </div>
                        </div>
                      </div>

                      {/* Pricing block */}
                      <div className="mt-4 pt-1 flex items-center justify-between">
                        <div>
                          <span className="text-[9px] text-slate-500 uppercase tracking-wider block">Estimated Price</span>
                          <span className="text-base font-black text-blue-400 mt-0.5 block flex items-center gap-1">
                            <Coins className="w-4 h-4 text-yellow-500" /> {getCleanPrice(p.price)}
                          </span>
                        </div>
                        
                        <button className="bg-slate-900 border border-slate-800 hover:bg-slate-850 hover:text-white text-slate-300 p-2 rounded-xl transition-all flex items-center justify-center">
                          <ChevronRight className="w-4 h-4 text-blue-400 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-slate-900/10 border border-slate-900 rounded-3xl p-12 text-center shadow-lg relative overflow-hidden"
            >
              {/* Overlay styling for empty page */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

              <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800/80 text-slate-500 flex items-center justify-center mx-auto mb-4">
                <Inbox className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-300 mb-1">No Matching Properties Found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                We couldn't find any listings for <strong>{typeQuery} ({purpose})</strong> matching <strong>"{locationQuery || "Any"}"</strong> in {city}.
              </p>

              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <button 
                  onClick={() => {
                    setSearchParams({
                      purpose: "Buy",
                      city: "Islamabad",
                      location: "",
                      type: "Homes"
                    });
                    setLocalLocation("");
                    setLocalType("Homes");
                    setLocalPurpose("Buy");
                    setLocalCity("Islamabad");
                  }}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-md shadow-blue-900/10"
                >
                  Clear Search Fields
                </button>
                <button 
                  onClick={() => {
                    setSearchParams({
                      purpose: "Buy",
                      city: "Faisalabad",
                      location: "",
                      type: "Homes"
                    });
                    setLocalLocation("");
                    setLocalType("Homes");
                    setLocalPurpose("Buy");
                    setLocalCity("Faisalabad");
                  }}
                  className="bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs px-5 py-2.5 rounded-xl transition border border-slate-800"
                >
                  Show Faisalabad Properties
                </button>
              </div>
            </motion.div>
          )}

          {/* SUGGESTED RECOMMENDATIONS PANEL (if search returned empty) */}
          {!loading && filteredProperties.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-12 pt-6 border-t border-slate-900"
            >
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" /> Featured PropSight Suggestions
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {FALLBACK_PROPERTIES.slice(0, 3).map((p) => (
                  <div
                    key={`suggest-${p.id}`}
                    onClick={() => navigate(`/property/${p.id}`)}
                    className="bg-slate-900/20 hover:bg-slate-900/35 border border-slate-850 hover:border-slate-800 rounded-3xl overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300 group flex flex-col justify-between"
                  >
                    <div className="relative h-36 w-full overflow-hidden bg-slate-950">
                      <img
                        src={p.images[0].cloudinary_src}
                        alt={p.title}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-85" />
                      <span className="absolute top-3 left-3 bg-blue-600 text-white font-bold text-[8px] uppercase tracking-widest px-2.5 py-0.5 rounded shadow">
                        For {p.purpose}
                      </span>
                    </div>

                    <div className="p-4">
                      <h4 className="font-bold text-xs text-slate-100 group-hover:text-blue-400 transition-colors truncate">
                        {p.title}
                      </h4>
                      <p className="text-[10px] text-slate-400 mt-1 truncate">
                        {p.address}
                      </p>
                      <p className="text-xs font-black text-blue-400 mt-3 flex items-center gap-1">
                        <Coins className="w-3.5 h-3.5 text-yellow-500" /> {getCleanPrice(p.price)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

        </div>

      </div>

    </div>
  );
};

export default SearchResults;
