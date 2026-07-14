import React, { useState, useEffect } from "react";
import PremiumGate from "./subscription/PremiumGate";
import { geminiService } from "../services/geminiService";
import { 
  Sparkles, 
  MapPin, 
  Building, 
  Coins, 
  ArrowRight, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Loader2, 
  ArrowUpRight, 
  ArrowDownRight,
  Info,
  Key,
  Calendar,
  Layers,
  Shield,
  Navigation
} from "lucide-react";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import { MapContainer, TileLayer, CircleMarker, Popup, Circle, useMap, useMapEvents } from "react-leaflet";

// Faisalabad standard coordinates lookup table
const AREA_COORDINATES = {
  "Canal Road": { lat: 31.4384, lng: 73.1362 },
  "Madina Town": { lat: 31.4173, lng: 73.1118 },
  "FDA City": { lat: 31.4925, lng: 73.0694 },
  "Eden Valley": { lat: 31.4285, lng: 73.1491 },
  "People's Colony No. 1": { lat: 31.4081, lng: 73.1042 },
  "People's Colony No. 2": { lat: 31.3995, lng: 73.1126 },
  "WAPDA City": { lat: 31.4421, lng: 73.1812 },
  "Citi Housing": { lat: 31.4883, lng: 73.1172 },
  "Sargodha Road": { lat: 31.4552, lng: 73.0698 },
  "Samanabad": { lat: 31.3908, lng: 73.0682 },
  "D-Ground": { lat: 31.4109, lng: 73.1092 },
  "Jhang Road": { lat: 31.3965, lng: 73.0180 },
  "Jaranwala Road": { lat: 31.4011, lng: 73.1425 }
};

// Helper component for dynamic map recentering
const MapRecenter = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView([center.lat, center.lng], 14, { animate: true });
    }
  }, [center, map]);
  return null;
};

// Helper component to capture click triggers on the interactive selector map
const MapClickHandler = ({ onClick }) => {
  useMapEvents({
    click: (e) => {
      onClick({ lat: e.latlng.lat, lng: e.latlng.lng });
    }
  });
  return null;
};

export default function AIPropertyAssessor() {
  const [formData, setFormData] = useState({
    propertyType: "Plot",
    location: "Canal Road",
    size: "",
    sizeUnit: "Marla",
    userBudget: ""
  });

  const [selectedCoords, setSelectedCoords] = useState({ lat: 31.4384, lng: 73.1362 });
  const [loading, setLoading] = useState(false);
  const [loadingPhase, setLoadingPhase] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  
  // Custom location state when 'Other' is picked
  const [customLocation, setCustomLocation] = useState("");
  
  // Local state to override API key in case of missing .env variable
  const [localApiKey, setLocalApiKey] = useState("");
  const [showKeyInput, setShowKeyInput] = useState(false);

  // Faisalabad standard locations list including custom fallback 'Other'
  const areas = [...Object.keys(AREA_COORDINATES), "Other"];

  useEffect(() => {
    // Check if API key is missing on mount
    const envKey = import.meta.env.VITE_GEMINI_API_KEY;
    const storedKey = localStorage.getItem("propsight_local_gemini_key");
    if (!envKey && !storedKey) {
      setShowKeyInput(true);
    } else if (storedKey) {
      setLocalApiKey(storedKey);
    }
  }, []);

  const handleSaveLocalKey = (e) => {
    e.preventDefault();
    if (localApiKey.trim()) {
      localStorage.setItem("propsight_local_gemini_key", localApiKey.trim());
      // Set the service API key dynamically
      geminiService.apiKey = localApiKey.trim();
      setShowKeyInput(false);
      setError("");
    }
  };

  const handleClearLocalKey = () => {
    localStorage.removeItem("propsight_local_gemini_key");
    setLocalApiKey("");
    geminiService.apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";
    setShowKeyInput(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Automatically center coordinates map when area selection alters
    if (name === "location") {
      const targetCoords = AREA_COORDINATES[value];
      if (targetCoords) {
        setSelectedCoords(targetCoords);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);

    // Validate
    if (!formData.size || isNaN(formData.size) || Number(formData.size) <= 0) {
      setError("Please enter a valid property size.");
      return;
    }
    if (!formData.userBudget || isNaN(formData.userBudget) || Number(formData.userBudget) <= 0) {
      setError("Please enter a valid asking price.");
      return;
    }
    const targetLocation = formData.location === "Other" ? customLocation : formData.location;
    if (formData.location === "Other" && !customLocation.trim()) {
      setError("Please enter a custom colony / area name.");
      return;
    }

    // Configure api key check
    const currentApiKey = geminiService.apiKey || import.meta.env.VITE_GEMINI_API_KEY;
    if (!currentApiKey) {
      setError("Gemini API Key is missing. Please add it to your .env file or enter it below.");
      setShowKeyInput(true);
      return;
    }

    setLoading(true);
    
    // Simulate phases of analysis for premium UX
    const phases = [
      "Analyzing Faisalabad spatial index...",
      "Comparing historical registry data for " + formData.location + "...",
      "Locating spatial amenities and computing area quality scores...",
      "Simulating future CPEC and highway connectivity growth...",
      "Running investment verdict algorithm..."
    ];

    let phaseIdx = 0;
    setLoadingPhase(phases[0]);
    const phaseInterval = setInterval(() => {
      phaseIdx++;
      if (phaseIdx < phases.length) {
        setLoadingPhase(phases[phaseIdx]);
      }
    }, 1000);

    try {
      const data = await geminiService.analyzeProperty({
        propertyType: formData.propertyType,
        location: targetLocation,
        size: Number(formData.size),
        sizeUnit: formData.sizeUnit,
        userBudget: Number(formData.userBudget),
        mapData: selectedCoords
      });
      setResult(data);
    } catch (err) {
      console.error(err);
      setError(err.message || "An unexpected error occurred during property assessment.");
    } finally {
      clearInterval(phaseInterval);
      setLoading(false);
    }
  };

  // Helper to format currency
  const formatPKR = (amount) => {
    if (amount >= 10000000) {
      return `PKR ${(amount / 10000000).toFixed(2)} Crore`;
    } else if (amount >= 100000) {
      return `PKR ${(amount / 100000).toFixed(2)} Lac`;
    }
    return `PKR ${amount.toLocaleString()}`;
  };

  // Calculation for asking price per marla
  const getAskingPricePerMarla = () => {
    const sizeMultiplier = formData.sizeUnit === "Kanal" ? 20 : 1;
    const totalMarla = Number(formData.size) * sizeMultiplier;
    return totalMarla > 0 ? Math.round(Number(formData.askingPrice) / totalMarla) : 0;
  };

  const getVerdictStyle = (decision) => {
    switch (decision) {
      case "Worth It":
      case "Highly Recommended":
      case "Within Budget":
      case "Good Buy":
      case "Stretch Required":
        return {
          bg: "from-emerald-500 to-teal-600",
          text: "text-emerald-705",
          badge: "bg-emerald-600",
          iconBg: "bg-emerald-50 text-emerald-600 border border-emerald-100",
          icon: <CheckCircle className="w-9 h-9 text-emerald-600" />,
          title: decision
        };
      case "Not Worth It":
      case "Overpriced":
      case "Financial Risk":
      case "Out of Budget":
        return {
          bg: "from-red-500 to-rose-600",
          text: "text-red-700",
          badge: "bg-red-650",
          iconBg: "bg-red-50 text-red-600 border border-red-100",
          icon: <XCircle className="w-9 h-9 text-red-600" />,
          title: decision
        };
      default:
        const isWorthIt = decision === "Worth It";
        return {
          bg: isWorthIt ? "from-emerald-500 to-teal-600" : "from-red-500 to-rose-600",
          text: isWorthIt ? "text-emerald-700" : "text-red-700",
          badge: isWorthIt ? "bg-emerald-600" : "bg-red-600",
          iconBg: isWorthIt ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-red-50 text-red-600 border border-red-100",
          icon: isWorthIt ? <CheckCircle className="w-9 h-9 text-emerald-600" /> : <XCircle className="w-9 h-9 text-red-600" />,
          title: decision
        };
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER SECTION */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold mb-3 border border-blue-150 animate-pulse">
            <Sparkles className="w-3.5 h-3.5" />
            AI-Powered Valuation Engine
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl">
            AI Property <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-600">Assessor</span>
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-sm text-slate-500 font-medium">
            Evaluate Faisalabad property investments in real-time. Analyze 5-year historical benchmarks, future infrastructural appreciation growth, and receive an instant investment verdict.
          </p>
        </div>

        {/* API KEY CONFIGURATION FALLBACK */}
        {showKeyInput && (
          <div className="mb-8 max-w-md mx-auto bg-amber-50 border border-amber-200 rounded-2xl p-5 shadow-sm">
            <div className="flex gap-3">
              <Key className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-amber-900 text-sm">Gemini API Key Required</h3>
                <p className="text-xs text-amber-700 mt-1 leading-relaxed">
                  No frontend key detected in the workspace variables. Enter a temporary key below to run the AI features in your browser session.
                </p>
                <form onSubmit={handleSaveLocalKey} className="mt-3 flex gap-2">
                  <input
                    type="password"
                    placeholder="AIzaSy..."
                    required
                    value={localApiKey}
                    onChange={(e) => setLocalApiKey(e.target.value)}
                    className="flex-1 bg-white border border-amber-300 rounded-xl px-3 py-1.5 text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold px-3 py-1.5 rounded-xl transition duration-150"
                  >
                    Apply Key
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {!showKeyInput && localApiKey && (
          <div className="mb-8 max-w-max mx-auto bg-slate-100 border border-slate-200 rounded-full px-4 py-1.5 flex items-center gap-2 text-xs font-semibold text-slate-600">
            <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
            Using Custom Session Gemini Key
            <button 
              onClick={handleClearLocalKey}
              className="text-red-500 hover:underline ml-2"
            >
              Clear Key
            </button>
          </div>
        )}

        {/* MAIN LAYOUT */}
        <PremiumGate feature="aiPriceEstimation">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* INPUT FORM PANEL */}
          <div className="lg:col-span-4 bg-white shadow-xl shadow-slate-100/50 rounded-3xl border border-slate-100 overflow-hidden">
            <div className="bg-slate-900 p-6 text-white relative">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Building className="w-24 h-24" />
              </div>
              <h2 className="text-xl font-bold flex items-center gap-2.5">
                <Layers className="w-5 h-5 text-blue-400" />
                Property Details
              </h2>
              <p className="text-[11px] text-slate-400 mt-1 font-semibold">
                Provide parameters for Faisalabad neighborhood valuation
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* PROPERTY TYPE */}
              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Property Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {["Plot", "House", "Commercial"].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, propertyType: type }))}
                      className={`py-2 px-3 text-xs font-bold rounded-xl border text-center transition-all duration-200 cursor-pointer ${
                        formData.propertyType === type
                          ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200"
                          : "bg-slate-50 text-slate-650 hover:bg-slate-100 border-slate-200"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* LOCATION */}
              <div>
                <label htmlFor="location" className="block text-xs font-extrabold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Faisalabad Area / Locality
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                  <select
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-blue-500/25 focus:border-blue-500 focus:outline-none appearance-none cursor-pointer"
                  >
                    {areas.map((area) => (
                      <option key={area} value={area}>{area}</option>
                    ))}
                  </select>
                </div>
                {formData.location === "Other" && (
                  <div className="mt-3 animate-in fade-in duration-200">
                    <label htmlFor="customLocation" className="block text-[10px] font-extrabold text-slate-500 mb-1 uppercase tracking-wider">
                      Specify Colony / Area Name
                    </label>
                    <input
                      type="text"
                      id="customLocation"
                      name="customLocation"
                      required
                      value={customLocation}
                      onChange={(e) => setCustomLocation(e.target.value)}
                      placeholder="e.g. D-Ground, Mansoorabad"
                      className="w-full bg-slate-55 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-blue-500/25 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                )}
              </div>

              {/* SELECTOR MAP */}
              <div className="space-y-2">
                <label className="block text-[10px] font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Navigation className="w-3.5 h-3.5 text-blue-605" />
                  Precise Coordinates (Click Map to Relocate)
                </label>
                <div className="h-44 w-full rounded-2xl overflow-hidden border border-slate-200 shadow-sm relative z-0">
                  <MapContainer
                    center={[selectedCoords.lat, selectedCoords.lng]}
                    zoom={13}
                    style={{ height: "100%", width: "100%" }}
                    zoomControl={false}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <CircleMarker
                      center={[selectedCoords.lat, selectedCoords.lng]}
                      radius={10}
                      pathOptions={{ fillColor: "#2563EB", color: "#FFFFFF", weight: 2.5, fillOpacity: 0.9 }}
                    >
                      <Popup>
                        <div className="text-xs font-bold leading-normal font-sans">
                          <span className="text-blue-600 font-extrabold block">Assessed Coordinate</span>
                          Lat: {selectedCoords.lat.toFixed(5)}<br/>
                          Lng: {selectedCoords.lng.toFixed(5)}
                        </div>
                      </Popup>
                    </CircleMarker>
                    <MapRecenter center={selectedCoords} />
                    <MapClickHandler onClick={setSelectedCoords} />
                  </MapContainer>
                </div>
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 bg-slate-50 border border-slate-150 p-2.5 rounded-xl">
                  <span>Lat: <strong className="text-slate-700">{selectedCoords.lat.toFixed(5)}</strong></span>
                  <span>Lng: <strong className="text-slate-700">{selectedCoords.lng.toFixed(5)}</strong></span>
                </div>
              </div>

              {/* SIZE */}
              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Property Size
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    name="size"
                    value={formData.size}
                    onChange={handleChange}
                    required
                    min="0.1"
                    step="any"
                    placeholder="e.g. 5, 10, 1"
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-blue-500/25 focus:border-blue-500 focus:outline-none"
                  />
                  <select
                    name="sizeUnit"
                    value={formData.sizeUnit}
                    onChange={handleChange}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-blue-500/25 focus:border-blue-500 focus:outline-none cursor-pointer"
                  >
                    <option value="Marla">Marla</option>
                    <option value="Kanal">Kanal</option>
                  </select>
                </div>
              </div>

              {/* USER BUDGET / ASKING PRICE */}
              <div>
                <label htmlFor="userBudget" className="block text-xs font-extrabold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Asking Price (PKR)
                </label>
                <div className="relative">
                  <Coins className="absolute left-3 top-3.5 w-4 h-4 text-slate-450" />
                  <input
                    type="number"
                    id="userBudget"
                    name="userBudget"
                    value={formData.userBudget}
                    onChange={handleChange}
                    required
                    placeholder="e.g. 12000000"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-blue-500/25 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                {formData.userBudget && !isNaN(formData.userBudget) && (
                  <div className="mt-1.5 text-right text-xs font-extrabold text-indigo-650">
                    Price: {formatPKR(Number(formData.userBudget))}
                  </div>
                )}
              </div>

              {/* ERROR ALERT */}
              {error && (
                <div className="bg-red-50 border border-red-150 rounded-xl p-3 flex gap-2 items-start text-xs font-semibold text-red-650">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {/* VALUATION METRIC */}
              {formData.size && formData.userBudget && !isNaN(formData.size) && !isNaN(formData.userBudget) && (
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-550">Asking Price Per Marla:</span>
                  <span className="font-black text-slate-800">
                    {(() => {
                      const sizeMultiplier = formData.sizeUnit === "Kanal" ? 20 : 1;
                      const totalMarla = Number(formData.size) * sizeMultiplier;
                      return totalMarla > 0 ? `${formatPKR(Math.round(Number(formData.userBudget) / totalMarla))} / Marla` : "0";
                    })()}
                  </span>
                </div>
              )}

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-extrabold text-sm py-3.5 px-4 rounded-xl transition duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-blue-200/50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <span>Run AI Evaluation</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* RESULTS DISPLAY PANEL */}
          <div className="lg:col-span-8">
            
            {/* INITIAL EMPTY STATE */}
            {!loading && !result && (
              <div className="bg-white border border-slate-100 rounded-3xl shadow-xl shadow-slate-100/50 p-12 text-center flex flex-col items-center justify-center min-h-[500px]">
                <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-650 mb-4 border border-indigo-100">
                  <Sparkles className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-800">AI Valuation Laboratory Ready</h3>
                <p className="text-slate-450 text-xs font-semibold max-w-sm mt-2 leading-relaxed">
                  Enter property variables on the left pane and trigger the AI agent. The Gemini evaluation model will render real-time valuation audits, growth curves, and verdicts.
                </p>
                <div className="grid grid-cols-2 gap-3 max-w-md mt-6 text-left">
                  <div className="bg-slate-50 border border-slate-100 p-3 rounded-2xl flex gap-2.5 items-center">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                    <span className="text-[10px] font-extrabold text-slate-650">5-Yr Price Projection</span>
                  </div>
                  <div className="bg-slate-50 border border-slate-100 p-3 rounded-2xl flex gap-2.5 items-center">
                    <CheckCircle className="w-4 h-4 text-emerald-650" />
                    <span className="text-[10px] font-extrabold text-slate-650">Clear Verdict Index</span>
                  </div>
                </div>
              </div>
            )}

            {/* PREMIUM SCANNING LOADING STATE */}
            {loading && (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-10 text-center flex flex-col items-center justify-center min-h-[500px] text-white overflow-hidden relative">
                {/* Neon Background Accents */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-blue-500/10 blur-[80px]" />
                
                {/* Rotating scanner ring */}
                <div className="relative mb-8">
                  <div className="absolute inset-0 rounded-full border-2 border-dashed border-blue-500/20 animate-spin" style={{ animationDuration: '10s' }} />
                  <div className="absolute inset-2 rounded-full border border-indigo-500/40 animate-spin" style={{ animationDuration: '4s', animationDirection: 'reverse' }} />
                  <div className="w-24 h-24 rounded-full bg-blue-900/50 border border-blue-500/60 flex items-center justify-center relative shadow-[0_0_30px_rgba(59,130,246,0.3)]">
                    <Building className="w-10 h-10 text-blue-400 animate-pulse" />
                  </div>
                </div>
                
                <h3 className="text-xl font-bold tracking-tight text-white z-10">AI Agent Processing</h3>
                <p className="text-slate-400 text-xs font-semibold max-w-sm mt-2 leading-relaxed z-10">
                  Formulating analytical response matching dynamic market registers in Faisalabad...
                </p>

                {/* Animated status indicators */}
                <div className="mt-8 space-y-2.5 w-full max-w-xs text-left text-xs font-bold text-slate-450 z-10">
                  <div className="flex items-center justify-between p-2 rounded-xl bg-slate-800/40 border border-slate-800">
                    <span className="animate-pulse">{loadingPhase}</span>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-500" />
                  </div>
                </div>
              </div>
            )}

            {/* RESULT SHOWN */}
            {result && !loading && (
              <div className="space-y-6">
                
                {/* VERDICT SUMMARY HERO */}
                {(() => {
                  const style = getVerdictStyle(result.verdict.decision);
                  return (
                    <div className="bg-white border border-slate-100 rounded-3xl shadow-xl shadow-slate-100/50 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
                      
                      {/* Decorative corner tag */}
                      <div className="absolute top-0 right-0">
                        <span className={`inline-flex items-center px-4 py-1.5 text-[9px] font-black uppercase tracking-wider text-white rounded-bl-2xl bg-gradient-to-r ${style.bg}`}>
                          AI Investment Verdict
                        </span>
                      </div>

                      <div className="flex gap-4 items-start md:items-center">
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 ${style.iconBg}`}>
                          {style.icon}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`text-2xl font-black bg-gradient-to-r ${style.bg} bg-clip-text text-transparent`}>
                              {style.title}
                            </span>
                            
                            <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 text-slate-700 rounded-lg text-[10px] font-bold">
                              Accuracy Score: {result.verdict.score}/100
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-1 font-semibold max-w-md leading-relaxed">
                            Evaluated for <span className="text-slate-800 font-extrabold">{formData.size} {formData.sizeUnit} {formData.propertyType}</span> at coordinates <span className="text-slate-800 font-extrabold">[{selectedCoords.lat.toFixed(4)}, {selectedCoords.lng.toFixed(4)}]</span>.
                          </p>
                        </div>
                      </div>

                      <div className="border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6 shrink-0 flex flex-col">
                        <span className="text-[10px] font-extrabold text-slate-450 uppercase tracking-wider">Estimated Market Value</span>
                        <span className="text-xl font-black text-slate-800 mt-0.5">
                          {formatPKR(result.verdict.estimatedValueMarlaPKR)}
                          <span className="text-xs text-slate-400 font-semibold"> / Marla</span>
                        </span>
                        <span className="text-[10px] font-extrabold text-slate-500 mt-1">
                          Realistic Total: {formatPKR(result.verdict.estimatedValueMarlaPKR * (formData.sizeUnit === "Kanal" ? formData.size * 20 : formData.size))}
                        </span>
                      </div>
                    </div>
                  );
                })()}

                {/* GOOGLE SEARCH GROUNDING SOURCES */}
                {result.groundingSources && result.groundingSources.groundingChunks && result.groundingSources.groundingChunks.length > 0 && (
                  <div className="bg-white border border-slate-100 rounded-3xl shadow-xl shadow-slate-100/50 p-6">
                    <h3 className="text-sm font-extrabold text-slate-900 mb-3 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      Google Search Grounding Sources
                    </h3>
                    <p className="text-xs text-slate-500 mb-3 font-semibold">
                      This analysis is grounded in real-time market records fetched from these live web sources:
                    </p>
                    <div className="flex flex-wrap gap-2.5">
                      {result.groundingSources.groundingChunks.map((chunk, idx) => (
                        <a
                          key={idx}
                          href={chunk.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-xl border border-blue-150 transition"
                        >
                          <span>{chunk.title}</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* BUDGET FIT AUDIT REPORT */}
                <div className="bg-white border border-slate-100 rounded-3xl shadow-xl shadow-slate-100/50 p-6">
                  <h3 className="text-sm font-extrabold text-slate-900 mb-3 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-blue-600" />
                    Asking Price vs. Market Averages
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="bg-slate-50 border border-slate-100 p-3 rounded-2xl flex flex-col">
                      <span className="text-[10px] font-bold text-slate-455 uppercase">Asking Price</span>
                      <span className="text-sm font-black text-indigo-650 mt-0.5">{formatPKR(Number(formData.userBudget))}</span>
                    </div>
                    <div className="bg-slate-50 border border-slate-100 p-3 rounded-2xl flex flex-col">
                      <span className="text-[10px] font-bold text-slate-455 uppercase">Est. Market Value</span>
                      <span className="text-sm font-black text-blue-600 mt-0.5">
                        {(() => {
                          const totalVal = result.verdict.estimatedValueMarlaPKR * (formData.sizeUnit === "Kanal" ? formData.size * 20 : formData.size);
                          return formatPKR(totalVal);
                        })()}
                      </span>
                    </div>
                    <div className="bg-slate-55 border border-slate-100 p-3 rounded-2xl flex flex-col">
                      <span className="text-[10px] font-bold text-slate-455 uppercase">Price Feasibility</span>
                      {(() => {
                        const calculatedTotalValue = result.verdict.estimatedValueMarlaPKR * (formData.sizeUnit === "Kanal" ? formData.size * 20 : formData.size);
                        const diff = calculatedTotalValue - Number(formData.userBudget);
                        const diffPct = Math.round((diff / Number(formData.userBudget)) * 100);
                        if (diff <= 0) {
                          return <span className="text-sm font-black text-rose-600 mt-0.5">+{Math.abs(diffPct)}% Over Value</span>;
                        } else {
                          return <span className="text-sm font-black text-emerald-600 mt-0.5">Within Value ({diffPct}% discount)</span>;
                        }
                      })()}
                    </div>
                  </div>
                  <p className="text-xs font-semibold text-slate-650 leading-relaxed bg-slate-50 border border-slate-100 p-4 rounded-2xl">
                    {result.verdict.budgetComparisonAnalysis || result.verdict.valuationAnalysis}
                  </p>
                </div>

                {/* GEOSPATIAL & MAP FEATURE INTEGRATION (SPATIAL INSIGHTS) */}
                {result.spatialInsights && (
                  <div className="bg-white border border-slate-100 rounded-3xl shadow-xl shadow-slate-100/50 p-6">
                    <h3 className="text-sm font-extrabold text-slate-900 mb-3.5 flex items-center gap-2">
                      <Navigation className="w-4 h-4 text-blue-600" />
                      Geospatial & Spatial Insights
                    </h3>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                      {/* Leaflet Dynamic Results Map */}
                      <div className="lg:col-span-8 space-y-2">
                        <div className="h-64 w-full rounded-2xl overflow-hidden border border-slate-200 shadow-sm relative z-0">
                          <MapContainer
                            center={[selectedCoords.lat, selectedCoords.lng]}
                            zoom={15}
                            style={{ height: "100%", width: "100%" }}
                            zoomControl={true}
                          >
                            <TileLayer
                              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            
                            {/* Selected coordinate property center */}
                            <CircleMarker
                              center={[selectedCoords.lat, selectedCoords.lng]}
                              radius={11}
                              pathOptions={{ fillColor: "#1D4ED8", color: "#FFFFFF", weight: 3, fillOpacity: 0.95 }}
                            >
                              <Popup>
                                <div className="text-xs font-bold font-sans">
                                  <span className="text-blue-600 font-extrabold block">Property Valuation Point</span>
                                  Est. Market Value: {(() => {
                                    const totalVal = result.verdict.estimatedValueMarlaPKR * (formData.sizeUnit === "Kanal" ? formData.size * 20 : formData.size);
                                    return formatPKR(totalVal);
                                  })()}
                                </div>
                              </Popup>
                            </CircleMarker>

                            {/* Spatial Heat Zone Circle (apreciation radius) */}
                            <Circle
                              center={[selectedCoords.lat, selectedCoords.lng]}
                              radius={350}
                              pathOptions={{ 
                                color: result.spatialInsights.heatZoneColor || "#3B82F6", 
                                fillColor: result.spatialInsights.heatZoneColor || "#3B82F6", 
                                fillOpacity: 0.12, 
                                weight: 1.5,
                                dashArray: "5, 5"
                              }}
                            />

                            {/* Surrounding amenities indicators */}
                            {result.spatialInsights.amenities && result.spatialInsights.amenities.map((amenity, index) => {
                              const amenityColors = {
                                school: "#10B981",      // education
                                park: "#059669",        // leisure
                                commercial: "#F59E0B",  // commercial
                                road: "#6366F1"         // connectivity
                              };
                              const color = amenityColors[amenity.type] || "#3B82F6";
                              return (
                                <CircleMarker
                                  key={index}
                                  center={[selectedCoords.lat + amenity.latOffset, selectedCoords.lng + amenity.lngOffset]}
                                  radius={7}
                                  pathOptions={{ fillColor: color, color: "#FFFFFF", weight: 1.5, fillOpacity: 0.9 }}
                                >
                                  <Popup>
                                    <div className="text-xs font-sans leading-normal">
                                      <strong className="text-slate-800 block">{amenity.name}</strong>
                                      <span className="capitalize text-slate-500 font-semibold block text-[10px]">Type: {amenity.type}</span>
                                      <span className="text-blue-600 font-extrabold text-[10px] block mt-0.5">Approx. {amenity.distanceMeters}m away</span>
                                    </div>
                                  </Popup>
                                </CircleMarker>
                              );
                            })}
                            <MapRecenter center={selectedCoords} />
                          </MapContainer>
                        </div>
                        {/* Map Color Legend */}
                        <div className="flex flex-wrap justify-between gap-2 text-[9px] font-bold text-slate-550 bg-slate-50 border border-slate-100 p-2.5 rounded-xl">
                          <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-blue-650 inline-block border border-white shadow-sm" />
                            <span>Property Point</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block border border-white shadow-sm" />
                            <span>Education / Schools</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-650 inline-block border border-white shadow-sm" />
                            <span>Parks & Recreation</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block border border-white shadow-sm" />
                            <span>Commercial Hubs</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block border border-white shadow-sm" />
                            <span>Main Access Roads</span>
                          </div>
                        </div>
                      </div>

                      {/* Map-Based Quality Metrics Pane */}
                      <div className="lg:col-span-4 flex flex-col justify-between gap-4">
                        {/* Score Circular Gauge */}
                        <div className="flex flex-col items-center justify-center p-4 bg-slate-50 border border-slate-100 rounded-2xl shadow-sm">
                          <span className="text-[9px] font-black text-slate-450 uppercase tracking-wider mb-2">Location Quality Score</span>
                          <div className="relative flex items-center justify-center">
                            <svg className="w-24 h-24 transform -rotate-90">
                              <circle
                                cx="48"
                                cy="48"
                                r="36"
                                className="stroke-slate-200 fill-none"
                                strokeWidth="6.5"
                              />
                              <circle
                                cx="48"
                                cy="48"
                                r="36"
                                className="fill-none stroke-blue-600 transition-all duration-1000 ease-out"
                                strokeWidth="6.5"
                                strokeDasharray={2 * Math.PI * 36}
                                strokeDashoffset={2 * Math.PI * 36 - (result.spatialInsights.locationScore / 100) * 2 * Math.PI * 36}
                                strokeLinecap="round"
                              />
                            </svg>
                            <div className="absolute flex flex-col items-center">
                              <span className="text-xl font-black text-slate-800">{result.spatialInsights.locationScore}</span>
                              <span className="text-[8px] font-extrabold text-slate-400">/ 100</span>
                            </div>
                          </div>
                        </div>

                        {/* Location Badges and details */}
                        <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl flex-1 flex flex-col justify-between space-y-3">
                          <div>
                            <span className="text-[9px] font-extrabold text-slate-450 uppercase tracking-wider block mb-1">Spatial Heat-Zone</span>
                            <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-black text-white" style={{ backgroundColor: result.spatialInsights.heatZoneColor }}>
                              {result.spatialInsights.heatZoneCategory}
                            </span>
                          </div>
                          <div>
                            <span className="text-[9px] font-extrabold text-slate-450 uppercase tracking-wider block mb-1">Local Security Rating</span>
                            <span className="inline-flex items-center gap-1 text-xs font-black text-slate-700">
                              <Shield className="w-3.5 h-3.5 text-blue-600" />
                              {result.spatialInsights.securityLevel} Security Index
                            </span>
                          </div>
                          <div>
                            <span className="text-[9px] font-extrabold text-slate-450 uppercase tracking-wider block mb-0.5">Connectivity Details</span>
                            <p className="text-[10px] font-bold text-slate-600 leading-snug">
                              {result.spatialInsights.connectivity}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* VALUATION REVIEW AND COMPARISON */}
                <div className="bg-white border border-slate-100 rounded-3xl shadow-xl shadow-slate-100/50 p-6">
                  <h3 className="text-sm font-extrabold text-slate-900 mb-2.5 flex items-center gap-2">
                    <Info className="w-4 h-4 text-blue-600" />
                    Valuation Audit Explanation
                  </h3>
                  <p className="text-xs font-semibold text-slate-600 leading-relaxed bg-slate-50 border border-slate-100 p-4 rounded-2xl">
                    {result.verdict.valuationAnalysis}
                  </p>
                </div>

                {/* CHART AND NUMBERS GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* PAST 5 YEARS TRAJECTORY */}
                  <div className="bg-white border border-slate-100 rounded-3xl shadow-xl shadow-slate-100/50 p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-xs font-extrabold text-slate-900 flex items-center gap-2 uppercase tracking-wider">
                        <Calendar className="w-4 h-4 text-blue-600" />
                        5-Year Past Trajectory
                      </h4>
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-black rounded-lg border border-blue-150">
                        +{result.historicalTrend.growthRatePast5YearsPct}% Growth
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 font-semibold leading-relaxed mb-5">
                      {result.historicalTrend.summary}
                    </p>

                    {/* CUSTOM PROGRESS-BAR CHART */}
                    <div className="space-y-3">
                      {result.historicalTrend.data.map((item, idx, arr) => {
                        const prices = arr.map(d => d.averagePriceMarlaPKR);
                        const maxVal = Math.max(...prices);
                        const pctOfMax = maxVal > 0 ? (item.averagePriceMarlaPKR / maxVal) * 100 : 0;

                        return (
                          <div key={item.year} className="flex items-center justify-between text-xs font-bold">
                            <span className="w-10 text-slate-500">{item.year}</span>
                            <div className="flex-1 mx-3 h-2.5 bg-slate-50 border border-slate-100 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-500"
                                style={{ width: `${pctOfMax}%` }}
                              />
                            </div>
                            <span className="w-20 text-right text-slate-700">{formatPKR(item.averagePriceMarlaPKR)}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* FUTURE 5 YEARS PROJECTION */}
                  <div className="bg-white border border-slate-100 rounded-3xl shadow-xl shadow-slate-100/50 p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-xs font-extrabold text-slate-900 flex items-center gap-2 uppercase tracking-wider">
                        <TrendingUp className="w-4 h-4 text-indigo-650" />
                        5-Year Growth Projections
                      </h4>
                      <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-[10px] font-black rounded-lg border border-indigo-150">
                        +{result.futureProjection.growthRateNext5YearsPct}% ROI
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 font-semibold leading-relaxed mb-5">
                      {result.futureProjection.summary}
                    </p>

                    {/* CUSTOM PROGRESS-BAR CHART */}
                    <div className="space-y-3">
                      {result.futureProjection.data.map((item, idx, arr) => {
                        const prices = arr.map(d => d.projectedPriceMarlaPKR);
                        const maxVal = Math.max(...prices);
                        const pctOfMax = maxVal > 0 ? (item.projectedPriceMarlaPKR / maxVal) * 100 : 0;

                        return (
                          <div key={item.year} className="flex items-center justify-between text-xs font-bold">
                            <span className="w-10 text-slate-500">{item.year}</span>
                            <div className="flex-1 mx-3 h-2.5 bg-slate-50 border border-slate-100 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-indigo-400 to-indigo-600 rounded-full transition-all duration-500"
                                style={{ width: `${pctOfMax}%` }}
                              />
                            </div>
                            <span className="w-20 text-right text-slate-700">{formatPKR(item.projectedPriceMarlaPKR)}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* DRIVERS & RISKS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* LOCAL DRIVERS */}
                  <div className="bg-emerald-50/40 border border-emerald-100 rounded-3xl p-6">
                    <h4 className="text-xs font-extrabold text-emerald-800 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <ArrowUpRight className="w-4 h-4 text-emerald-600" />
                      Key Development Drivers
                    </h4>
                    <ul className="space-y-2.5">
                      {result.futureProjection.keyDrivers.map((driver, index) => (
                        <li key={index} className="flex gap-2 text-xs font-semibold text-emerald-700 items-start">
                          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{driver}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* RISK FACTORS */}
                  <div className="bg-red-50/40 border border-red-100 rounded-3xl p-6">
                    <h4 className="text-xs font-extrabold text-red-800 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <ArrowDownRight className="w-4 h-4 text-red-655" />
                      Risk Evaluation factors
                    </h4>
                    <ul className="space-y-2.5">
                      {result.verdict.risks.map((risk, index) => (
                        <li key={index} className="flex gap-2 text-xs font-semibold text-red-700 items-start">
                          <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                          <span>{risk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

              </div>
            )}

          </div>

        </div>
        </PremiumGate>

      </div>
    </div>
  );
}
