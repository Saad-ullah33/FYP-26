import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search, Sliders, LineChart as ChartIcon, Sparkles, Building2, Landmark, ArrowRight, TrendingUp } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export default function AiPredictionHub() {
  const [activeTab, setActiveTab] = useState("search"); // "search" or "estimate"
  const [sectors, setSectors] = useState([]);
  
  // Tab 1: Budget Search Local States
  const [minPrice, setMinPrice] = useState("10000000");
  const [maxPrice, setMaxPrice] = useState("40000000");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [activeForecast, setActiveForecast] = useState(null);

  // Tab 2: Raw Appraiser Local States
  const [area, setArea] = useState("5 Marla");
  const [selectedSector, setSelectedSector] = useState("");
  const [propertyType, setPropertyType] = useState("HOUSE");
  const [purpose, setPurpose] = useState("RESIDENTIAL");
  const [appraisalResult, setAppraisalResult] = useState(null);
  const [appraisalLoading, setAppraisalLoading] = useState(false);

  // Fetch dynamic location configuration from backend on mount
  useEffect(() => {
    axios.get("http://localhost:8080/api/predictions/faisalabad-sectors")
      .then(res => {
        setSectors(res.data);
        if (res.data.length > 0) setSelectedSector(res.data[0]);
      })
      .catch(err => console.error("Failed to map dynamic structural regions.", err));
  }, []);

  const handleBudgetSearch = async (e) => {
    e.preventDefault();
    setSearchLoading(true);
    try {
      const res = await axios.get(`http://localhost:8080/api/predictions/search-by-budget?minPrice=${minPrice}&maxPrice=${maxPrice}`);
      setSearchResults(res.data);
      if (res.data.length > 0) setActiveForecast(res.data[0]);
    } catch (err) {
      console.error("Budget pipeline failed.", err);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleInstantAppraisal = async (e) => {
    e.preventDefault();
    setAppraisalLoading(true);
    try {
      const res = await axios.post("http://localhost:8080/api/predictions/estimate-price", {
        area, sector: selectedSector, propertyType, purpose
      });
      setAppraisalResult(res.data);
    } catch (err) {
      console.error("Appraisal execution failure.", err);
    } finally {
      setAppraisalLoading(false);
    }
  };

  const formatCurrency = (val) => val ? `PKR ${(val / 1000000).toFixed(2)} M` : "N/A";

  return (
    <div className="bg-slate-950 text-white min-h-screen p-6 sm:p-8 font-sans">
      {/* Title Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="text-indigo-400 animate-pulse" size={20} />
          <span className="text-indigo-400 font-mono tracking-widest uppercase text-xs font-bold">PropSight Enterprise Matrix</span>
        </div>
        <h1 className="text-3xl font-black tracking-tight text-slate-100">Intelligent AI Prediction Center</h1>
        <p className="text-slate-400 text-sm mt-1">Execute micro-targeted real estate evaluations driven by localized machine learning nodes.</p>
      </div>

      {/* Tabs Switcher Layout */}
      <div className="max-w-7xl mx-auto border-b border-slate-800 flex gap-6 mb-8">
        <button
          onClick={() => setActiveTab("search")}
          className={`pb-4 text-sm font-bold tracking-wide transition flex items-center gap-2 border-b-2 ${activeTab === "search" ? "border-indigo-500 text-indigo-400" : "border-transparent text-slate-400 hover:text-slate-200"}`}
        >
          <Search size={16} /> Budget Arbitrage Radar
        </button>
        <button
          onClick={() => setActiveTab("estimate")}
          className={`pb-4 text-sm font-bold tracking-wide transition flex items-center gap-2 border-b-2 ${activeTab === "estimate" ? "border-indigo-500 text-indigo-400" : "border-transparent text-slate-400 hover:text-slate-200"}`}
        >
          <Sliders size={16} /> Instant Asset Appraiser
        </button>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* ======================= TAB 1: BUDGET SCANNER ======================= */}
        {activeTab === "search" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Input Controls Panel */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 h-fit space-y-4">
              <h3 className="font-extrabold text-base text-slate-200">Set Investment Spread</h3>
              <form onSubmit={handleBudgetSearch} className="space-y-4">
                <div>
                  <label className="text-[10px] text-slate-400 uppercase tracking-wider font-bold block mb-1">Minimum Budget</label>
                  <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm font-mono text-indigo-400 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 uppercase tracking-wider font-bold block mb-1">Maximum Budget</label>
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm font-mono text-indigo-400 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={searchLoading}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 transition text-xs font-bold py-3 rounded-xl flex items-center justify-center gap-2"
                >
                  {searchLoading ? "Analyzing Arrays..." : "Scan Market Matches"} <ArrowRight size={14} />
                </button>
              </form>
            </div>

            {/* Middle Grid Results Viewer */}
            <div className="lg:col-span-2 space-y-6">
              {searchResults.length === 0 ? (
                <div className="border border-dashed border-slate-800 rounded-2xl p-12 text-center text-slate-500 text-sm">
                  <Building2 size={36} className="mx-auto mb-3 text-slate-600" />
                  No assets mapped to target configurations yet. Click scan to search.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Results List View Container */}
                  <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                    {searchResults.map((deal) => (
                      <div
                        key={deal.propertyId}
                        onClick={() => setActiveForecast(deal)}
                        className={`p-4 rounded-xl border transition cursor-pointer flex flex-col justify-between ${activeForecast?.propertyId === deal.propertyId ? "bg-slate-900 border-indigo-500" : "bg-slate-900/40 border-slate-800 hover:border-slate-700"}`}
                      >
                        <div>
                          <div className="flex justify-between items-start">
                            <h4 className="font-bold text-sm text-slate-200 truncate max-w-[180px]">{deal.title}</h4>
                            <span className="bg-emerald-500/10 text-emerald-400 font-mono text-[9px] px-2 py-0.5 rounded border border-emerald-500/20 flex items-center gap-0.5">
                              <TrendingUp size={10} /> +{deal.expectedGrowthPercentage}%
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 font-mono mt-0.5">{deal.address}</p>
                        </div>
                        <div className="mt-4 pt-2 border-t border-slate-950 flex justify-between text-[11px]">
                          <div>
                            <span className="text-slate-500 block uppercase text-[9px]">List Price</span>
                            <span className="font-mono text-slate-300 font-medium">{formatCurrency(deal.listingPrice)}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-indigo-400 block uppercase text-[9px]">AI Projection</span>
                            <span className="font-mono text-indigo-300 font-bold">{formatCurrency(deal.aiPredictedPrice)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Active Future Forecasting Graph View Panel */}
                  {activeForecast && (
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
                      <div>
                        <span className="text-indigo-400 font-mono text-[9px] uppercase tracking-wider font-bold">Forecast Matrix</span>
                        <h3 className="text-sm font-extrabold text-slate-200 mt-1 mb-4 truncate">{activeForecast.title}</h3>
                      </div>
                      <div className="h-44 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={activeForecast.futureForecast}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                            <XAxis dataKey="period" stroke="#64748b" style={{ fontSize: "10px", fontFamily: "monospace" }} />
                            <YAxis stroke="#64748b" hide />
                            <Tooltip contentStyle={{ backgroundColor: "#020617", borderColor: "#334155", borderRadius: "8px", fontSize: "11px", color: "#fff" }} tickFormatter={(v) => `${(v/1000000).toFixed(1)}M`} />
                            <Area type="monotone" dataKey="value" stroke="#6366f1" fillOpacity={0.15} fill="url(#colorVal)" strokeWidth={2} />
                            <defs>
                              <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                      <p className="text-[10px] text-slate-500 italic mt-4 text-center">12-Month predictive forecast appreciation values estimated by local Faisalabad market metrics.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ======================= TAB 2: INSTANT APPRAISER ======================= */}
        {activeTab === "estimate" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Input Spec Param Config Form */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 h-fit space-y-4">
              <h3 className="font-extrabold text-base text-slate-200">Asset Specification Blueprint</h3>
              <form onSubmit={handleInstantAppraisal} className="space-y-4">
                <div>
                  <label className="text-[10px] text-slate-400 uppercase tracking-wider font-bold block mb-1">Property Area Size</label>
                  <input
                    type="text"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    placeholder="e.g. 5 Marla, 1 Kanal"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 uppercase tracking-wider font-bold block mb-1">Target Sector Region</label>
                  <select
                    value={selectedSector}
                    onChange={(e) => setSelectedSector(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-indigo-500"
                  >
                    {sectors.map((sec, i) => <option key={i} value={sec}>{sec}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-slate-400 uppercase tracking-wider font-bold block mb-1">Property Configuration</label>
                    <select
                      value={propertyType}
                      onChange={(e) => setPropertyType(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-300 focus:outline-none"
                    >
                      <option value="HOUSE">House</option>
                      <option value="COMMERCIAL">Commercial Plaza</option>
                      <option value="APARTMENT">Apartment</option>
                      <option value="LAND">Plot/Land</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 uppercase tracking-wider font-bold block mb-1">Execution Purpose</label>
                    <select
                      value={purpose}
                      onChange={(e) => setPurpose(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-300 focus:outline-none"
                    >
                      <option value="RESIDENTIAL">For Living</option>
                      <option value="COMMERCIAL">For Business</option>
                      <option value="INVESTMENT">High Yield Lock</option>
                    </select>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={appraisalLoading}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 transition text-xs font-bold py-3 rounded-xl flex items-center justify-center gap-2"
                >
                  {appraisalLoading ? "Computing Vectors..." : "Execute AI Valuation"}
                </button>
              </form>
            </div>

            {/* Evaluation Framework Displays */}
            <div className="lg:col-span-2">
              {!appraisalResult ? (
                <div className="border border-dashed border-slate-800 rounded-2xl p-12 text-center text-slate-500 text-sm h-full flex flex-col justify-center items-center">
                  <Landmark size={36} className="mb-3 Richmond text-slate-600" />
                  Configure structural asset values on the left panel to execute real-time evaluation indices.
                </div>
              ) : (
                <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-2xl space-y-6">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                    <div>
                      <span className="bg-indigo-500/10 text-indigo-400 text-[10px] font-bold px-2 py-0.5 rounded border border-indigo-500/20 uppercase tracking-wider">Estimated Target Valuation Matrix</span>
                      <h2 className="text-3xl font-black font-mono tracking-tight mt-2 text-slate-100">{formatCurrency(appraisalResult.predictedPrice)}</h2>
                    </div>
                    <span className="text-emerald-400 font-mono text-xs bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-md">{appraisalResult.confidence}% Certainty</span>
                  </div>

                  {/* Factor Distribution Visual Row Mapping */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(appraisalResult.factors || {}).map(([key, value]) => (
                      <div key={key} className="bg-slate-950 p-3 rounded-xl border border-slate-900">
                        <span className="text-slate-500 uppercase font-mono text-[9px] block tracking-wide">{key.replace("_", " ")}</span>
                        <span className="font-mono text-xs text-slate-300 font-semibold block mt-1">{formatCurrency(value)}</span>
                      </div>
                    ))}
                  </div>

                  <p className="text-xs text-slate-400 bg-slate-950/50 p-3 rounded-xl border border-slate-900/60 leading-relaxed italic">{appraisalResult.predictionNotes}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}