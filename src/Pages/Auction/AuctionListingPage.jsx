import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api"; // Integrating your verified Axios utility instance
import { FAISALABAD_LOCATIONS } from "../../constants/faisalabadLocations";
import { 
  Search, 
  SlidersHorizontal, 
  MapPin, 
  Clock, 
  Tag, 
  TrendingUp, 
  Sparkles, 
  ChevronRight,
  Flame,
  Home,
  CheckCircle,
  AlertCircle
} from "lucide-react";

// Ticking Countdown Component for Cards
const CardCountdown = ({ endDate, status }) => {
  const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0, ended: false });

  useEffect(() => {
    if (status === "CLOSED" || status === "SOLD" || status === "CONCLUDED") {
      setTimeLeft(prev => ({ ...prev, ended: true }));
      return;
    }

    const calculateTime = () => {
      const difference = new Date(endDate) - new Date();
      if (difference <= 0) {
        setTimeLeft({ d: 0, h: 0, m: 0, s: 0, ended: true });
        return;
      }

      const d = Math.floor(difference / (1000 * 60 * 60 * 24));
      const h = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const m = Math.floor((difference / (1000 * 60)) % 60);
      const s = Math.floor((difference / 1000) % 60);

      setTimeLeft({ d, h, m, s, ended: false });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [endDate, status]);

  if (timeLeft.ended) {
    return (
      <span className="flex items-center gap-1 bg-red-50 text-red-600 px-2.5 py-1 rounded-full text-xs font-bold border border-red-100">
        <AlertCircle size={12} /> Auction Ended
      </span>
    );
  }

  const isEndingSoon = timeLeft.d === 0 && timeLeft.h < 3;

  return (
    <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition-colors ${
      isEndingSoon 
        ? "bg-amber-50 text-amber-600 border-amber-200 animate-pulse" 
        : "bg-blue-50 text-blue-600 border-blue-100"
    }`}>
      <Clock size={12} className={isEndingSoon ? "text-amber-500" : "text-blue-500"} />
      {timeLeft.d > 0 && `${timeLeft.d}d `}
      {`${timeLeft.h.toString().padStart(2, '0')}:${timeLeft.m.toString().padStart(2, '0')}:${timeLeft.s.toString().padStart(2, '0')}`}
      {isEndingSoon && <span className="ml-1 text-[10px] text-amber-500 uppercase tracking-wide font-black">Soon</span>}
    </span>
  );
};

const PreviewCard = ({ title, value }) => {
  return (
    <div className="bg-gray-50 border rounded-3xl p-5">
      <p className="text-sm text-gray-500">{title}</p>
      <h3 className="text-lg font-semibold text-gray-800 mt-1">
        {value || "-"}
      </h3>
    </div>
  );
};

const AuctionListingPage = () => {
  const navigate = useNavigate();

  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [priceRange, setPriceRange] = useState("ALL");

  // Fetch Approved/Live Public Auctions from Backend Pipeline
  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        setLoading(true);
        // Using your authorized api axios instance
        const response = await api.get("/auctions?view=PUBLIC");
        
        const result = response.data;
        // Handle variations in custom envelope parsing structures cleanly
        const data = Array.isArray(result) 
          ? result 
          : result?.data || result?.result || [];
          
        setAuctions(data);
      } catch (error) {
        console.error("❌ Failed to resolve public auction matrix streams:", error.message);
        setAuctions([]); // Safe fallback to clear state
      } finally {
        setLoading(false);
      }
    };
    fetchAuctions();
  }, []);

  // Filter Logic
  const filteredAuctions = useMemo(() => {
    return auctions.filter((item) => {
      const matchSearch = (item.title || item.propertyTitle || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (item.description || "").toLowerCase().includes(searchTerm.toLowerCase());

      const matchLocation = selectedLocation === "" || 
                            (item.location || "").toLowerCase().includes(selectedLocation.toLowerCase());

      const matchType = selectedType === "" || item.propertyType === selectedType;

      // Handle view status matches cleanly against public structures
      const matchStatus = selectedStatus === "ALL" || item.status === selectedStatus;

      let matchPrice = true;
      if (priceRange !== "ALL") {
        const price = item.currentHighestBid || item.currentBid || item.startingPrice || item.startPrice || 0;
        if (priceRange === "UNDER_30M") matchPrice = price < 30000000;
        else if (priceRange === "30M_50M") matchPrice = price >= 30000000 && price <= 50000000;
        else if (priceRange === "50M_100M") matchPrice = price >= 50000000 && price <= 100000000;
        else if (priceRange === "ABOVE_100M") matchPrice = price > 100000000;
      }

      return matchSearch && matchLocation && matchType && matchStatus && matchPrice;
    });
  }, [auctions, searchTerm, selectedLocation, selectedType, selectedStatus, priceRange]);

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedLocation("");
    setSelectedType("");
    setSelectedStatus("ALL");
    setPriceRange("ALL");
  };

  // Compute active item lengths safely dynamically
  const liveCount = auctions.filter(a => a.status === "ACTIVE").length;

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      
      {/* ── HEADER BANNER ── */}
      <div className="relative bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-900 text-white overflow-hidden py-14 px-6 md:px-12 border-b border-indigo-900/30">
        <div 
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-10 w-80 h-80 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-xs font-bold tracking-wider uppercase mb-3">
              <Sparkles size={12} /> NextProperty Live Auctions
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
              Real-Time Property <br />
              <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-teal-300 text-transparent bg-clip-text">
                Bidding Console
              </span>
            </h1>
            <p className="mt-3 text-slate-300 text-sm md:text-base max-w-xl font-medium">
              Transparent, verified, and secure bidding environment. Tap on active properties to participate in the live countdowns.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-2xl w-full md:w-80 shadow-2xl">
            <h3 className="text-xs font-extrabold text-blue-300 uppercase tracking-widest mb-2">Live Activity</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs border-b border-white/5 pb-2">
                <span className="text-slate-400">Active Auctions</span>
                <span className="font-bold text-teal-400">{liveCount} Active</span>
              </div>
              <div className="flex justify-between items-center text-xs border-b border-white/5 pb-2">
                <span className="text-slate-400">Total Available Catalog</span>
                <span className="font-bold text-blue-400">{auctions.length} Listed</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Secure Protocol</span>
                <span className="font-bold text-emerald-400 flex items-center gap-1">
                  <CheckCircle size={10} /> Escrow Checked
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── SEARCH & FILTER TABS BAR ── */}
      <div className="max-w-7xl mx-auto px-4 -mt-6 relative z-20">
        <div className="bg-white p-4 rounded-2xl shadow-lg border border-slate-100 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative w-full flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search properties by title, street, tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition"
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            {["ALL", "ACTIVE", "SCHEDULED", "CONCLUDED"].map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wide uppercase transition shrink-0 ${
                  selectedStatus === status
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-660"
                }`}
              >
                {status === "SCHEDULED" ? "UPCOMING" : status === "CONCLUDED" ? "CLOSED" : status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT GRID ── */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* ── FILTERS SIDEBAR ── */}
          <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-slate-150 shadow-sm h-fit space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <SlidersHorizontal size={16} className="text-blue-600" /> Filters
              </h2>
              <button 
                onClick={handleResetFilters}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition"
              >
                Reset All
              </button>
            </div>

            {/* LOCATION SELECT */}
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Location</label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full mt-2 border border-slate-200 p-2.5 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none text-slate-700 bg-slate-50/50"
              >
                <option value="">All Faisalabad Areas</option>
                {FAISALABAD_LOCATIONS.map((loc, i) => (
                  <option key={i} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            {/* PROPERTY TYPE SELECT */}
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Property Type</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full mt-2 border border-slate-200 p-2.5 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none text-slate-700 bg-slate-50/50"
              >
                <option value="">All Types</option>
                <option value="HOUSE">House / Villa</option>
                <option value="FLAT">Flat / Apartment</option>
                <option value="PLOT">Residential/Commercial Plot</option>
                <option value="COMMERCIAL">Commercial Plaza/Office</option>
              </select>
            </div>

            {/* PRICE RANGES */}
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Pricing Threshold</label>
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="w-full mt-2 border border-slate-200 p-2.5 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none text-slate-700 bg-slate-50/50"
              >
                <option value="ALL">Any Budget</option>
                <option value="UNDER_30M">Under PKR 30 Million</option>
                <option value="30M_50M">PKR 30M - 50 Million</option>
                <option value="50M_100M">PKR 50M - 100 Million</option>
                <option value="ABOVE_100M">Above PKR 100 Million</option>
              </select>
            </div>

            <div className="bg-slate-900 text-white rounded-xl p-4 space-y-2.5 relative overflow-hidden border border-slate-800">
              <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-full blur-xl pointer-events-none" />
              <div className="flex items-center gap-1.5 text-xs text-blue-300 font-bold uppercase tracking-wider">
                <Flame size={12} className="text-amber-400" /> Bidding Rules
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                All bids placed are legally binding. Security deposits are escrowed to ensure transaction transparency. Confirm details prior to placing bids.
              </p>
            </div>
          </div>

          {/* ── LISTINGS GRID ── */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-24 space-y-4">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-slate-400 text-sm font-semibold">Synchronizing real-time logs...</span>
              </div>
            ) : filteredAuctions.length === 0 ? (
              <div className="bg-white text-center py-20 rounded-2xl border border-slate-200 p-8">
                <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-800">No Auctions Match Filters</h3>
                <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
                  Try adjusting your search criteria, selecting a different location, or resetting the price filters.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="mt-5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition shadow-lg shadow-blue-500/15"
                >
                  Reset Active Filters
                </button>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredAuctions.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => navigate(`/auction/${item.id}`)}
                    className="group bg-white rounded-2xl border border-slate-150 hover:border-blue-200 hover:shadow-xl hover:shadow-slate-100/50 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                        <img
                          src={item.propertyImage || item.images?.[0] || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80"}
                          alt={item.title || item.propertyTitle}
                          className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-500"
                        />
                        
                        {/* Countdown Badge overlay */}
                        <div className="absolute bottom-3 left-3 z-10">
                          <CardCountdown endDate={item.endTime || item.endDate} status={item.status} />
                        </div>

                        {/* Status Label (Top-Left) */}
                        <div className="absolute top-3 left-3 z-10">
                          <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider shadow ${
                            item.status === "ACTIVE" 
                              ? "bg-teal-500 text-white" 
                              : item.status === "SCHEDULED" || item.status === "APPROVED"
                              ? "bg-indigo-600 text-white"
                              : "bg-slate-500 text-white"
                          }`}>
                            {item.status === "SCHEDULED" ? "UPCOMING" : item.status}
                          </span>
                        </div>
                      </div>

                      {/* Content Area */}
                      <div className="p-5">
                        <div className="flex gap-2 mb-2.5">
                          <span className="text-[10px] font-extrabold uppercase tracking-wide px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                            {item.propertyType || "HOUSE"}
                          </span>
                          <span className="text-[10px] font-extrabold uppercase tracking-wide px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                            {item.area || "5 Marla"}
                          </span>
                        </div>

                        <h2 className="font-bold text-slate-950 group-hover:text-blue-600 transition-colors line-clamp-1 text-base">
                          {item.title || item.propertyTitle}
                        </h2>

                        <p className="text-slate-500 text-xs flex items-center gap-1 mt-1 font-semibold">
                          <MapPin size={12} className="text-slate-400 shrink-0" />
                          {item.location || "Faisalabad"}
                        </p>

                        <p className="text-slate-500 text-xs mt-3 line-clamp-2 leading-relaxed">
                          {item.description || "No description catalog configured for this structural asset listings block."}
                        </p>
                      </div>
                    </div>

                    {/* Bidding Summary Bar */}
                    <div className="px-5 pb-5 pt-3 border-t border-slate-50 bg-slate-50/50 flex justify-between items-center">
                      <div>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Current Highest Bid</p>
                        <p className="text-blue-700 font-extrabold text-base mt-0.5">
                          PKR {(item.currentHighestBid || item.currentBid || item.startingPrice || item.startPrice || 0).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-blue-600 font-bold group-hover:translate-x-1 transition-transform">
                        Bid Now <ChevronRight size={14} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionListingPage;