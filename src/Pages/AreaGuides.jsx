import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Polygon, Marker, Popup, Tooltip, useMap } from "react-leaflet";
import { 
  ArrowLeft, 
  MapPin, 
  ShieldAlert, 
  CheckCircle2, 
  GraduationCap, 
  HeartPulse, 
  Trees, 
  ShoppingBag, 
  Sliders,
  DollarSign,
  TrendingUp,
  Activity,
  Layers,
  Sparkles,
  Info
} from "lucide-react";
import { colonies } from "./Map/coloniesData";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";

// ==========================
// HIGH-FIDELITY LIFESTYLE & AMENITY DATA
// ==========================
const AREA_GUIDE_DATA = {
  "fda-city": {
    roiScore: 8.8,
    avgHousePrice: "PKR 1.8 Crore - 4.5 Crore",
    avgPlotPrice: "PKR 45 Lac - 1.8 Crore",
    pros: [
      "FDA Backed Government Security",
      "Wide 150-feet main boulevard infrastructure",
      "Sargodha Road bypass access",
      "Dedicated commercial sectors & green belts"
    ],
    cons: [
      "Ongoing development; utilities in blocks C & D are still underway",
      "Distance from main Faisalabad city center is high",
      "Slow colonization rate in outer blocks"
    ],
    amenities: [
      { id: "s1", name: "Allied School FDA Campus", category: "education", coords: [31.4890, 73.0210], desc: "Standard private school offering elementary & secondary education." },
      { id: "s2", name: "FDA City Central College", category: "education", coords: [31.4810, 73.0230], desc: "Higher secondary education institution." },
      { id: "h1", name: "FDA City Community Hospital", category: "healthcare", coords: [31.4820, 73.0290], desc: "24/7 emergency clinic and medical center." },
      { id: "h2", name: "Grafton Pharmacy & Clinic", category: "healthcare", coords: [31.4870, 73.0200], desc: "Pharmacy with general physician consultancy." },
      { id: "p1", name: "FDA City Sector A Park", category: "recreation", coords: [31.4850, 73.0260], desc: "Spacious family park with jogging tracks." },
      { id: "p2", name: "FDA Block B Kids Play Area", category: "recreation", coords: [31.4780, 73.0280], desc: "Playground for children with swings." },
      { id: "m1", name: "FDA Central Commercial Hub", category: "shopping", coords: [31.4870, 73.0230], desc: "Under-construction corporate offices & retail shops." },
      { id: "m2", name: "Sargodha Road Food Court", category: "shopping", coords: [31.4920, 73.0180], desc: "Fast-food outlets and tea stalls." }
    ]
  },
  "wapda-city": {
    roiScore: 9.4,
    avgHousePrice: "PKR 2.4 Crore - 6.5 Crore",
    avgPlotPrice: "PKR 65 Lac - 2.8 Crore",
    pros: [
      "Fully developed gated community with strict security",
      "High colonization rate (above 85%)",
      "Excellent location near Canal Expressway",
      "Continuous power grid backup availability"
    ],
    cons: [
      "Extremely high property prices (premium valuation)",
      "High monthly security and maintenance fees",
      "Rush hours on Canal Road during peak office timings"
    ],
    amenities: [
      { id: "s1", name: "Beaconhouse School System", category: "education", coords: [31.4520, 73.1915], desc: "Premium Cambridge education institution." },
      { id: "s2", name: "The City School WAPDA Campus", category: "education", coords: [31.4450, 73.1930], desc: "Reputed international school network." },
      { id: "h1", name: "WAPDA City Hospital", category: "healthcare", coords: [31.4440, 73.1990], desc: "Multispeciality hospital with qualified surgeons." },
      { id: "h2", name: "MedCare Clinic", category: "healthcare", coords: [31.4500, 73.1870], desc: "Outpatient clinical services." },
      { id: "p1", name: "WAPDA G-Block Main Park", category: "recreation", coords: [31.4485, 73.1890], desc: "Beautifully landscaped botanical park." },
      { id: "p2", name: "WAPDA Central Park & Club", category: "recreation", coords: [31.4430, 73.2020], desc: "Features a gym, tennis courts, and walking trail." },
      { id: "m1", name: "Gloria Jean's WAPDA City", category: "shopping", coords: [31.4510, 73.1970], desc: "Popular upscale coffee shop and eatery." },
      { id: "m2", name: "WAPDA Commercial Market", category: "shopping", coords: [31.4460, 73.1945], desc: "Supermarkets, banks, and utility stores." }
    ]
  },
  "eden-valley": {
    roiScore: 9.1,
    avgHousePrice: "PKR 2.2 Crore - 5.5 Crore",
    avgPlotPrice: "PKR 85 Lac - 2.2 Crore",
    pros: [
      "Canal Road prime connectivity",
      "FDA approved developer layout guidelines",
      "Modern sewerage, gas, and fiber optics ready",
      "Beautiful aesthetic landscape with high-end houses"
    ],
    cons: [
      "Plots availability is very scarce; resale premium is high",
      "Narrow entrance roads during peak hours",
      "Commercial sector is compact and parking is limited"
    ],
    amenities: [
      { id: "s1", name: "Roots Millennium School", category: "education", coords: [31.4350, 73.1380], desc: "Executive standard private school system." },
      { id: "h1", name: "Eden Valley Medical Clinic", category: "healthcare", coords: [31.4290, 73.1450], desc: "General clinic with emergency care." },
      { id: "p1", name: "Jasmine Block Park", category: "recreation", coords: [31.4325, 73.1390], desc: "Manicured lawn with swings and benches." },
      { id: "p2", name: "Tulip Block Park", category: "recreation", coords: [31.4270, 73.1430], desc: "Lush green space facing the mosque." },
      { id: "m1", name: "Eden Valley Plaza Mall", category: "shopping", coords: [31.4335, 73.1410], desc: "Retail outlets, pharmacy, and grocery store." },
      { id: "m2", name: "The Valley Café & Restaurant", category: "shopping", coords: [31.4310, 73.1400], desc: "Chic café serving continental food." }
    ]
  },
  "peoples-colony": {
    roiScore: 8.5,
    avgHousePrice: "PKR 3.5 Crore - 10 Crore+",
    avgPlotPrice: "PKR 1.2 Crore - 4.5 Crore",
    pros: [
      "Faisalabad's most prestigious central address",
      "Walking distance to D-Ground main commercial markets",
      "Established networks of top colleges, hospitals, and banks",
      "High rental demand and premium rental yields"
    ],
    cons: [
      "Densely populated; traffic congestion is common",
      "Older structures require remodeling or reconstruction",
      "Air pollution due to high road activity"
    ],
    amenities: [
      { id: "s1", name: "Divisional Public School (DPS)", category: "education", coords: [31.4070, 73.0920], desc: "Historic educational institute." },
      { id: "s2", name: "Government College Women University", category: "education", coords: [31.4110, 73.0890], desc: "Reputed women university campus." },
      { id: "h1", name: "Faisalabad International Hospital", category: "healthcare", coords: [31.3990, 73.1040], desc: "State of the art private healthcare center." },
      { id: "h2", name: "Pinum Cancer Hospital", category: "healthcare", coords: [31.3960, 73.0950], desc: "Specialist nuclear medicine hospital." },
      { id: "p1", name: "D-Ground Ladies Park", category: "recreation", coords: [31.4025, 73.0970], desc: "Huge central park with running track." },
      { id: "m1", name: "McDonald's D-Ground", category: "shopping", coords: [31.4035, 73.0990], desc: "Global fast-food franchise." },
      { id: "m2", name: "ChenOne Tower Mall", category: "shopping", coords: [31.4050, 73.1010], desc: "High-end fashion retail and department store." }
    ]
  },
  "madina-town": {
    roiScore: 8.7,
    avgHousePrice: "PKR 2.2 Crore - 6.5 Crore",
    avgPlotPrice: "PKR 70 Lac - 2.5 Crore",
    pros: [
      "Highly educational hub containing top universities",
      "Safe, family-oriented established community",
      "Excellent commercial accessibility (Susan Road, East Canal)",
      "Excellent medical coverage (Allied / Mujahid Hospitals)"
    ],
    cons: [
      "Extremely dense building structures; limited green belts",
      "Groundwater quality in some sectors is brackish",
      "High traffic volume near Susan Road intersections"
    ],
    amenities: [
      { id: "s1", name: "GC University Faisalabad", category: "education", coords: [31.4200, 73.1180], desc: "Leading government university campus." },
      { id: "h1", name: "Mujahid Hospital Faisalabad", category: "healthcare", coords: [31.4120, 73.1255], desc: "Respected non-profit medical care trust." },
      { id: "h2", name: "Faisal Hospital", category: "healthcare", coords: [31.4150, 73.1140], desc: "Experienced cardiology and pediatric clinic." },
      { id: "p1", name: "Madina Town Central Park", category: "recreation", coords: [31.4165, 73.1230], desc: "Wide public park with basketball court." },
      { id: "m1", name: "Susan Road Commercial Strip", category: "shopping", coords: [31.4180, 73.1205], desc: "Packed with restaurants, bakeries, and brand stores." },
      { id: "m2", name: "Al-Fateh Supermarket", category: "shopping", coords: [31.4220, 73.1130], desc: "Premium grocery shopping mall." }
    ]
  },
  "city-housing": {
    roiScore: 9.3,
    avgHousePrice: "PKR 2.0 Crore - 5.5 Crore",
    avgPlotPrice: "PKR 55 Lac - 2.0 Crore",
    pros: [
      "Theme parks, dancing fountains, and active zoo inside",
      "Underground utilities and premium standard carpeted roads",
      "Gold standard gate and gated boundary security protocols",
      "Modern commercial centers and corporate office setups"
    ],
    cons: [
      "Higher tax bracket zone under FDA guidelines",
      "Utility connections take time in newly announced extensions",
      "Distance from the city center is moderate"
    ],
    amenities: [
      { id: "s1", name: "City Housing Grammar School", category: "education", coords: [31.4720, 73.1580], desc: "English medium private school system." },
      { id: "h1", name: "City Medical Complex", category: "healthcare", coords: [31.4640, 73.1700], desc: "In-house clinic and diagnostic center." },
      { id: "p1", name: "City Theme Park & Dancing Fountain", category: "recreation", coords: [31.4685, 73.1630], desc: "Famous leisure spot for families." },
      { id: "p2", name: "City Horse Riding Club", category: "recreation", coords: [31.4610, 73.1720], desc: "Horse riding tracks and stabling facilities." },
      { id: "m1", name: "The Grand Marquee & Food Court", category: "shopping", coords: [31.4700, 73.1670], desc: "Banqueting hall and local fast-food block." },
      { id: "m2", name: "City Commercial Market A", category: "shopping", coords: [31.4660, 73.1550], desc: "Banks, pharmacies, and department store." }
    ]
  }
};

// ==========================
// MAP CONTROLLER (Fly-to coordinator)
// ==========================
const MapFlyToController = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, zoom || 14, {
        animate: true,
        duration: 1.5
      });
    }
  }, [center, zoom, map]);
  return null;
};

export default function AreaGuides() {
  const navigate = useNavigate();
  
  // States
  const [selectedId, setSelectedId] = useState("wapda-city");
  const [activeCategory, setActiveCategory] = useState("all"); // 'all', 'education', 'healthcare', 'recreation', 'shopping'

  // Fetch colony geo details
  const activeColony = useMemo(() => {
    return colonies.find(c => c.id === selectedId) || colonies[1];
  }, [selectedId]);

  // Fetch lifestyle details
  const activeGuide = useMemo(() => {
    return AREA_GUIDE_DATA[selectedId] || AREA_GUIDE_DATA["wapda-city"];
  }, [selectedId]);

  // Filter amenities
  const filteredAmenities = useMemo(() => {
    if (activeCategory === "all") return activeGuide.amenities;
    return activeGuide.amenities.filter(item => item.category === activeCategory);
  }, [activeGuide, activeCategory]);

  return (
    <div className="bg-slate-50 min-h-screen pt-20 flex flex-col lg:flex-row items-stretch font-sans">
      
      {/* ── LEFT SIDEBAR (Detailed Info) ── */}
      <div className="w-full lg:w-[45%] xl:w-[40%] bg-white border-r border-slate-200 flex flex-col h-[calc(100vh-80px)] overflow-y-auto z-10">
        
        {/* Sticky Header inside Sidebar */}
        <div className="p-6 border-b border-slate-100 bg-white sticky top-0 z-20 space-y-4">
          
          <button 
            onClick={() => navigate(-1)} 
            className="group inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 transition font-bold text-xs"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Go Back
          </button>

          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600" /> Area Guides
            </h1>
            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Faisalabad</span>
          </div>

          {/* Selector Dropdown */}
          <div className="relative">
            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-blue-600" />
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 hover:border-blue-300 rounded-2xl font-bold text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition cursor-pointer appearance-none"
            >
              {colonies.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Scrollable Sidebar Content */}
        <div className="p-6 space-y-8 flex-1">

          {/* SOCIETY SUMMARY */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black text-slate-900">{activeColony.name} Overview</h2>
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                activeColony.developmentStatus === "Fully Developed" 
                  ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
                  : "bg-blue-50 text-blue-700 border-blue-100"
              }`}>
                {activeColony.developmentStatus}
              </span>
            </div>
            
            <p className="text-slate-600 text-sm leading-relaxed font-medium">
              {activeColony.description}
            </p>

            {/* Vitals Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 border border-slate-200/50 rounded-2xl">
                <div className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Investment Rating</div>
                <div className="text-xl font-black text-blue-900 mt-1 flex items-center gap-1.5">
                  {activeGuide.roiScore} / 10
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-full font-black">High</span>
                </div>
              </div>
              
              <div className="p-4 bg-slate-50 border border-slate-200/50 rounded-2xl">
                <div className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Approval Authority</div>
                <div className="text-base font-black text-slate-800 mt-1.5 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> {activeColony.approvalStatus}
                </div>
              </div>
            </div>
          </div>

          {/* AMENITIES FILTER CONTROLS */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-extrabold text-sm pb-2 border-b border-slate-100">
              <Sliders className="w-4.5 h-4.5 text-blue-600" />
              <span>Explore Nearby Amenities</span>
            </div>

            <div className="grid grid-cols-5 gap-2">
              <button
                onClick={() => setActiveCategory("all")}
                className={`py-2 px-1 rounded-xl text-xs font-bold transition flex flex-col items-center justify-center gap-1 border ${
                  activeCategory === "all"
                    ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/10"
                    : "bg-white text-slate-650 hover:bg-slate-50 border-slate-200/80"
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>All</span>
              </button>
              
              <button
                onClick={() => setActiveCategory("education")}
                className={`py-2 px-1 rounded-xl text-xs font-bold transition flex flex-col items-center justify-center gap-1 border ${
                  activeCategory === "education"
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/10"
                    : "bg-white text-slate-650 hover:bg-slate-50 border-slate-200/80"
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                <span>School</span>
              </button>

              <button
                onClick={() => setActiveCategory("healthcare")}
                className={`py-2 px-1 rounded-xl text-xs font-bold transition flex flex-col items-center justify-center gap-1 border ${
                  activeCategory === "healthcare"
                    ? "bg-red-600 text-white border-red-600 shadow-md shadow-red-500/10"
                    : "bg-white text-slate-650 hover:bg-slate-50 border-slate-200/80"
                }`}
              >
                <HeartPulse className="w-4 h-4" />
                <span>Health</span>
              </button>

              <button
                onClick={() => setActiveCategory("recreation")}
                className={`py-2 px-1 rounded-xl text-xs font-bold transition flex flex-col items-center justify-center gap-1 border ${
                  activeCategory === "recreation"
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-500/10"
                    : "bg-white text-slate-650 hover:bg-slate-50 border-slate-200/80"
                }`}
              >
                <Trees className="w-4 h-4" />
                <span>Parks</span>
              </button>

              <button
                onClick={() => setActiveCategory("shopping")}
                className={`py-2 px-1 rounded-xl text-xs font-bold transition flex flex-col items-center justify-center gap-1 border ${
                  activeCategory === "shopping"
                    ? "bg-amber-600 text-white border-amber-600 shadow-md shadow-amber-500/10"
                    : "bg-white text-slate-650 hover:bg-slate-50 border-slate-200/80"
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Food</span>
              </button>
            </div>

            {/* List of active amenities in Sidebar */}
            <div className="space-y-3 pt-2">
              <div className="text-slate-400 text-[10px] uppercase font-extrabold tracking-wider">
                Showing {filteredAmenities.length} Places Nearby
              </div>
              
              <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                {filteredAmenities.map(item => (
                  <div key={item.id} className="p-3 bg-slate-50 hover:bg-slate-100/70 border border-slate-200/40 rounded-xl flex gap-3 transition">
                    <div className={`p-2 rounded-lg text-white shrink-0 self-start ${
                      item.category === "education" ? "bg-indigo-600" :
                      item.category === "healthcare" ? "bg-red-600" :
                      item.category === "recreation" ? "bg-emerald-600" : "bg-amber-600"
                    }`}>
                      {item.category === "education" && <GraduationCap className="w-4 h-4" />}
                      {item.category === "healthcare" && <HeartPulse className="w-4 h-4" />}
                      {item.category === "recreation" && <Trees className="w-4 h-4" />}
                      {item.category === "shopping" && <ShoppingBag className="w-4 h-4" />}
                    </div>
                    
                    <div className="space-y-1">
                      <div className="text-xs font-extrabold text-slate-900">{item.name}</div>
                      <div className="text-[10px] text-slate-500 font-semibold">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* PRICING VITALS */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-extrabold text-sm pb-2 border-b border-slate-100">
              <DollarSign className="w-4.5 h-4.5 text-blue-600" />
              <span>Current Market Price Ranges</span>
            </div>

            <div className="space-y-3">
              <div className="p-4 bg-blue-50/40 border border-blue-100 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-600 text-white rounded-lg"><Activity className="w-4.5 h-4.5" /></div>
                  <div>
                    <div className="text-xs font-black text-slate-800">Constructed Houses</div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">Average Cost range</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-black text-slate-900">{activeGuide.avgHousePrice}</div>
                </div>
              </div>

              <div className="p-4 bg-emerald-50/40 border border-emerald-100 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-600 text-white rounded-lg"><Layers className="w-4.5 h-4.5" /></div>
                  <div>
                    <div className="text-xs font-black text-slate-800">Residential Plots</div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">Average Cost range</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-black text-slate-900">{activeGuide.avgPlotPrice}</div>
                </div>
              </div>
            </div>
          </div>

          {/* PROS & CONS */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-extrabold text-sm pb-2 border-b border-slate-100">
              <Info className="w-4.5 h-4.5 text-blue-600" />
              <span>Pros & Cons of Living Here</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Pros List */}
              <div className="space-y-3">
                <div className="text-emerald-700 text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600" /> Advantages
                </div>
                <ul className="space-y-2.5">
                  {activeGuide.pros.map((p, i) => (
                    <li key={i} className="text-xs text-slate-650 leading-relaxed font-semibold flex items-start gap-2">
                      <span className="text-emerald-600 mt-0.5 font-bold">•</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Cons List */}
              <div className="space-y-3">
                <div className="text-red-700 text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldAlert className="w-4.5 h-4.5 text-red-500" /> Drawbacks
                </div>
                <ul className="space-y-2.5">
                  {activeGuide.cons.map((c, i) => (
                    <li key={i} className="text-xs text-slate-650 leading-relaxed font-semibold flex items-start gap-2">
                      <span className="text-red-500 mt-0.5 font-bold">•</span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* ── RIGHT MAP SIDE (React-Leaflet) ── */}
      <div className="flex-1 min-h-[400px] lg:h-[calc(100vh-80px)] relative z-0">
        <MapContainer
          center={activeColony.center}
          zoom={activeColony.zoom || 14}
          scrollWheelZoom={true}
          className="w-full h-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* Fly-to Coordinator */}
          <MapFlyToController center={activeColony.center} zoom={activeColony.zoom} />

          {/* Society Boundary Polygon */}
          {activeColony.boundary && (
            <Polygon
              positions={activeColony.boundary}
              pathOptions={{
                color: activeColony.color || "#3b82f6",
                fillColor: activeColony.color || "#3b82f6",
                fillOpacity: 0.12,
                weight: 3.5,
                dashArray: "6, 6"
              }}
            >
              <Tooltip sticky>
                <div className="font-extrabold text-xs text-slate-900">{activeColony.name} Gated Boundary</div>
              </Tooltip>
            </Polygon>
          )}

          {/* Central Society Marker */}
          <Marker position={activeColony.center}>
            <Popup>
              <div className="space-y-1.5 max-w-[200px]">
                <h4 className="font-black text-slate-900 text-sm leading-tight">{activeColony.name} Center</h4>
                <p className="text-[11px] text-slate-500 leading-normal font-semibold">{activeColony.approvalStatus} ({activeColony.developmentStatus})</p>
              </div>
            </Popup>
          </Marker>

          {/* Dynamic Amenities Markers */}
          {filteredAmenities.map(item => (
            <Marker 
              key={item.id} 
              position={item.coords}
            >
              <Popup>
                <div className="space-y-1.5 p-0.5 max-w-[220px]">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${
                      item.category === "education" ? "bg-indigo-600" :
                      item.category === "healthcare" ? "bg-red-650" :
                      item.category === "recreation" ? "bg-emerald-650" : "bg-amber-500"
                    }`}></span>
                    <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider">{item.category}</span>
                  </div>
                  <h4 className="font-black text-slate-900 text-xs leading-tight">{item.name}</h4>
                  <p className="text-[10px] text-slate-500 leading-normal font-semibold">{item.desc}</p>
                </div>
              </Popup>
            </Marker>
          ))}

        </MapContainer>
        
        {/* Category Legend floating on Map */}
        <div className="absolute bottom-5 right-5 bg-white/90 backdrop-blur-md border border-slate-200 p-3.5 rounded-2xl shadow-xl z-[400] space-y-2 pointer-events-none hidden md:block">
          <div className="text-slate-800 text-[10px] uppercase font-black tracking-wider pb-1.5 border-b border-slate-200/60">
            Map Legend
          </div>
          <div className="space-y-1.5 text-xs font-semibold text-slate-650">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 block"></span>
              <span>Society Center Pin</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 block"></span>
              <span>Schools & Colleges</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 block"></span>
              <span>Hospitals & Clinics</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 block"></span>
              <span>Parks & Sports Fields</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 block"></span>
              <span>Restaurants & Markets</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
