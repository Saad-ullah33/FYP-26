import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  MapPin, 
  Building, 
  Search, 
  Sparkles, 
  LineChart, 
  Percent, 
  Activity, 
  ArrowUpRight, 
  Plus, 
  X,
  Layers,
  ArrowRightLeft,
  ChevronRight,
  Info,
  ArrowLeft
} from "lucide-react";
import { 
  CITIES, 
  PROPERTY_TYPES, 
  SIZES, 
  TIMEFRAMES, 
  TIMELINE_LABELS, 
  propertyIndexData,
  getPropertyIndexDetails,
  getLocalityList
} from "../Data/propertyIndexData";

export default function PropertyIndex() {
  const navigate = useNavigate();
  // Primary Filter State
  const [city, setCity] = useState("Faisalabad");
  const [locality, setLocality] = useState("Canal Road");
  const [type, setType] = useState("HOUSE");
  const [size, setSize] = useState("10 Marla");
  const [timeframe, setTimeframe] = useState("5Y");

  // Comparison State
  const [compareMode, setCompareMode] = useState(false);
  const [compareCity, setCompareCity] = useState("Lahore");
  const [compareLocality, setCompareLocality] = useState("DHA Phase 6");
  const [compareType, setCompareType] = useState("HOUSE");
  const [compareSize, setCompareSize] = useState("10 Marla");

  // Tooltip State (Hover interaction on charts)
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [hoveredCompareIndex, setHoveredCompareIndex] = useState(null);

  // Available Localities based on selected City
  const localities = useMemo(() => getLocalityList(city), [city]);
  const compareLocalities = useMemo(() => getLocalityList(compareCity), [compareCity]);

  // Adjust locality if city changes
  const handleCityChange = (newCity) => {
    setCity(newCity);
    const locList = getLocalityList(newCity);
    if (locList.length > 0) setLocality(locList[0]);
  };

  const handleCompareCityChange = (newCity) => {
    setCompareCity(newCity);
    const locList = getLocalityList(newCity);
    if (locList.length > 0) setCompareLocality(locList[0]);
  };

  // Adjust size if type changes
  const handleTypeChange = (newType) => {
    setType(newType);
    const sizeList = SIZES[newType];
    if (sizeList && sizeList.length > 0) setSize(sizeList[0]);
  };

  const handleCompareTypeChange = (newType) => {
    setCompareType(newType);
    const sizeList = SIZES[newType];
    if (sizeList && sizeList.length > 0) setCompareSize(sizeList[0]);
  };

  // Fetch metrics
  const activeMetrics = useMemo(() => {
    return getPropertyIndexDetails(city, locality, type, size);
  }, [city, locality, type, size]);

  const compareMetrics = useMemo(() => {
    if (!compareMode) return null;
    return getPropertyIndexDetails(compareCity, compareLocality, compareType, compareSize);
  }, [compareMode, compareCity, compareLocality, compareType, compareSize]);

  // Filter timeline based on Timeframe selection
  const timelineData = useMemo(() => {
    let sliceLength = 23; // default 5Y
    if (timeframe === "3M") sliceLength = 2;
    else if (timeframe === "6M") sliceLength = 3;
    else if (timeframe === "1Y") sliceLength = 5;
    else if (timeframe === "3Y") sliceLength = 13;

    const labels = TIMELINE_LABELS.slice(-sliceLength);
    const primaryHistory = activeMetrics.history.slice(-sliceLength);
    const primaryPrices = activeMetrics.prices.slice(-sliceLength);
    
    let compareHistory = null;
    let comparePrices = null;
    if (compareMode && compareMetrics) {
      compareHistory = compareMetrics.history.slice(-sliceLength);
      comparePrices = compareMetrics.prices.slice(-sliceLength);
    }

    return {
      labels,
      primaryHistory,
      primaryPrices,
      compareHistory,
      comparePrices
    };
  }, [timeframe, activeMetrics, compareMetrics, compareMode]);

  // AI Analyst Insight Text Generation (Deterministic based on parameters)
  const aiInsight = useMemo(() => {
    const trend = activeMetrics.yoyGrowth > 12 ? "strongly bullish" : activeMetrics.yoyGrowth > 8 ? "moderately positive" : "stable/correcting";
    const recommendation = activeMetrics.yoyGrowth > 12 
      ? "excellent short-to-medium term capital gains opportunity with minor supply overhang" 
      : activeMetrics.yoyGrowth > 8 
        ? "solid long-term wealth preservation option with attractive rental yield prospects" 
        : "hold phase; ideal for buyers looking for immediate occupancy rather than pure appreciation";

    let segmentDescription = "";
    if (type === "HOUSE") {
      segmentDescription = `The residential housing market in ${locality} has seen consistent demand due to rapid colonization, utility availability, and high-quality build-outs.`;
    } else if (type === "PLOT") {
      segmentDescription = `Plots in ${locality} remain a highly liquid speculative asset. The appreciation here is closely tied to infrastructural milestones, bypass developments, and society handovers.`;
    } else {
      segmentDescription = `Vertical apartments in ${locality} represent a modern lifestyle shift, delivering strong rental yield margins (${activeMetrics.rentalYield}%) that outpace residential houses.`;
    }

    return {
      summary: `${locality} (${city}) ${type.toLowerCase()}s (Size: ${size}) are showing a ${trend} trend with a market health score of ${activeMetrics.healthScore}/100.`,
      analysis: `${segmentDescription} Over the last year, average prices rose by ${activeMetrics.yoyGrowth}%, taking the current average valuation to approximately PKR ${(activeMetrics.avgPrice / 10000000).toFixed(2)} Crore. The supply absorption rate is healthy at ${100 - activeMetrics.supplyScore}%, while investor interest remains high.`,
      recommendation: `PropSight AI recommends a: **${activeMetrics.yoyGrowth > 10 ? "BUY / ACCUMULATE" : "HOLD / WATCH"}** stance. This asset represents an ${recommendation}.`
    };
  }, [city, locality, type, size, activeMetrics]);

  // SVG Chart Dimensions & Helpers
  const width = 800;
  const height = 320;
  const paddingLeft = 50;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 40;

  // Calculate coordinates for SVG paths
  const getCoordinates = (dataPoints) => {
    if (!dataPoints || dataPoints.length === 0) return [];
    
    // Find min/max values for scaling
    const minVal = Math.min(...dataPoints);
    const maxVal = Math.max(...dataPoints);
    const valueRange = maxVal - minVal === 0 ? 1 : maxVal - minVal;

    const chartWidth = width - paddingLeft - paddingRight;
    const chartHeight = height - paddingTop - paddingBottom;
    const stepX = dataPoints.length > 1 ? chartWidth / (dataPoints.length - 1) : chartWidth;

    return dataPoints.map((val, i) => {
      const x = paddingLeft + i * stepX;
      // Invert Y because SVG coordinates start from top-left (0,0)
      const y = paddingTop + chartHeight - ((val - minVal) / valueRange) * chartHeight;
      return { x, y, value: val };
    });
  };

  const primaryCoords = useMemo(() => getCoordinates(timelineData.primaryHistory), [timelineData.primaryHistory]);
  
  const compareCoords = useMemo(() => {
    if (!compareMode || !timelineData.compareHistory) return [];
    return getCoordinates(timelineData.compareHistory);
  }, [compareMode, timelineData.compareHistory]);

  // Create SVG path string
  const getPathString = (coords) => {
    if (coords.length === 0) return "";
    return coords.reduce((acc, coord, idx) => {
      return idx === 0 ? `M ${coord.x} ${coord.y}` : `${acc} L ${coord.x} ${coord.y}`;
    }, "");
  };

  const getAreaPathString = (coords) => {
    if (coords.length === 0) return "";
    const linePath = getPathString(coords);
    const firstX = coords[0].x;
    const lastX = coords[coords.length - 1].x;
    const baseY = height - paddingBottom;
    return `${linePath} L ${lastX} ${baseY} L ${firstX} ${baseY} Z`;
  };

  const primaryPath = getPathString(primaryCoords);
  const primaryAreaPath = getAreaPathString(primaryCoords);
  
  const comparePath = getPathString(compareCoords);
  const compareAreaPath = getAreaPathString(compareCoords);

  // List of all localities in the city for comparison/ranking leaderboard
  const leaderBoard = useMemo(() => {
    const cityData = propertyIndexData[city] || {};
    return Object.keys(cityData).map(locName => {
      const details = getPropertyIndexDetails(city, locName, type, size);
      return {
        name: locName,
        avgPrice: details.avgPrice,
        yoyGrowth: details.yoyGrowth,
        rentalYield: details.rentalYield,
        healthScore: details.healthScore,
        marketHealth: details.marketHealth
      };
    }).sort((a, b) => b.yoyGrowth - a.yoyGrowth); // Sort by growth descending
  }, [city, type, size]);

  return (
    <div className="bg-slate-50 min-h-screen pt-28 pb-16 font-sans">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-20 space-y-6">
        
        {/* BACK BUTTON */}
        <button 
          onClick={() => navigate(-1)} 
          className="group inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-100 text-slate-650 hover:text-blue-600 transition font-extrabold text-xs rounded-xl border border-slate-200/80 shadow-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform text-slate-500 group-hover:text-blue-600" />
          Go Back
        </button>

        {/* ── HEADER BANNER ── */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-gradient-to-r from-blue-950 via-blue-900 to-blue-800 text-white p-8 md:p-10 rounded-3xl shadow-xl shadow-blue-900/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-indigo-650/15 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="space-y-3 z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/25 border border-blue-400/30 text-blue-200 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> PropSight AI Analyst
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Real Estate Index & Price Trends
            </h1>
            <p className="text-blue-150/90 text-sm md:text-base max-w-2xl font-medium leading-relaxed">
              Track historical growth curves, market indices, and valuation models for prime locations in Pakistan. Engineered for smart investors.
            </p>
          </div>

          <button
            onClick={() => setCompareMode(!compareMode)}
            className={`flex items-center gap-2.5 px-6 py-3.5 rounded-2xl font-bold transition-all duration-300 shadow-md transform hover:-translate-y-0.5 active:translate-y-0 shrink-0 text-sm z-10 ${
              compareMode
                ? "bg-amber-500 text-slate-950 hover:bg-amber-400 hover:shadow-amber-500/10"
                : "bg-white text-blue-900 hover:bg-slate-50 hover:shadow-white/10"
            }`}
          >
            <ArrowRightLeft className="w-4 h-4" />
            {compareMode ? "Exit Compare Mode" : "Compare Localities"}
          </button>
        </div>

        {/* ── FILTER PANELS ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* PRIMARY FILTER PANEL */}
          <div className={`${compareMode ? 'lg:col-span-6' : 'lg:col-span-12'} bg-white border border-slate-200/70 p-6 rounded-3xl shadow-sm space-y-6 transition-all duration-300`}>
            <div className="flex items-center gap-2 text-slate-800 font-extrabold text-lg pb-3 border-b border-slate-100">
              <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
              <span>{compareMode ? "Local Valuation Filter 1" : "Configure Market Filter"}</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              
              {/* City Selection */}
              <div className="space-y-1.5">
                <label className="text-slate-500 font-bold text-xs uppercase tracking-wider block">City</label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <select
                    value={city}
                    onChange={(e) => handleCityChange(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200/80 hover:border-blue-300 rounded-xl font-semibold text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition cursor-pointer appearance-none"
                  >
                    {CITIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Locality Selection */}
              <div className="space-y-1.5">
                <label className="text-slate-500 font-bold text-xs uppercase tracking-wider block">Locality / Sector</label>
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <select
                    value={locality}
                    onChange={(e) => setLocality(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200/80 hover:border-blue-300 rounded-xl font-semibold text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition cursor-pointer appearance-none"
                  >
                    {localities.map((loc) => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Property Type Selection */}
              <div className="space-y-1.5">
                <label className="text-slate-500 font-bold text-xs uppercase tracking-wider block">Property Type</label>
                <div className="relative">
                  <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <select
                    value={type}
                    onChange={(e) => handleTypeChange(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200/80 hover:border-blue-300 rounded-xl font-semibold text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition cursor-pointer appearance-none"
                  >
                    {PROPERTY_TYPES.map((pt) => (
                      <option key={pt.value} value={pt.value}>{pt.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Size Selection */}
              <div className="space-y-1.5">
                <label className="text-slate-500 font-bold text-xs uppercase tracking-wider block">Unit Size</label>
                <div className="relative">
                  <Layers className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <select
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200/80 hover:border-blue-300 rounded-xl font-semibold text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition cursor-pointer appearance-none"
                  >
                    {(SIZES[type] || []).map((sz) => (
                      <option key={sz} value={sz}>{sz}</option>
                    ))}
                  </select>
                </div>
              </div>

            </div>
          </div>

          {/* SECONDARY COMPARISON FILTER PANEL */}
          {compareMode && (
            <div className="lg:col-span-6 bg-white border border-amber-200/60 p-6 rounded-3xl shadow-sm space-y-6 transition-all duration-300 animate-in fade-in slide-in-from-right-3">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2 text-slate-850 font-extrabold text-lg">
                  <div className="w-1.5 h-6 bg-amber-500 rounded-full"></div>
                  <span>Compare Valuation Filter 2</span>
                </div>
                <button 
                  onClick={() => setCompareMode(false)}
                  className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                
                {/* Compare City */}
                <div className="space-y-1.5">
                  <label className="text-slate-500 font-bold text-xs uppercase tracking-wider block">City</label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <select
                      value={compareCity}
                      onChange={(e) => handleCompareCityChange(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200/80 hover:border-amber-300 rounded-xl font-semibold text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition cursor-pointer appearance-none"
                    >
                      {CITIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Compare Locality */}
                <div className="space-y-1.5">
                  <label className="text-slate-500 font-bold text-xs uppercase tracking-wider block">Locality / Sector</label>
                  <div className="relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <select
                      value={compareLocality}
                      onChange={(e) => setCompareLocality(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200/80 hover:border-amber-300 rounded-xl font-semibold text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition cursor-pointer appearance-none"
                    >
                      {compareLocalities.map((loc) => (
                        <option key={loc} value={loc}>{loc}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Compare Property Type */}
                <div className="space-y-1.5">
                  <label className="text-slate-500 font-bold text-xs uppercase tracking-wider block">Property Type</label>
                  <div className="relative">
                    <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <select
                      value={compareType}
                      onChange={(e) => handleCompareTypeChange(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200/80 hover:border-amber-300 rounded-xl font-semibold text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition cursor-pointer appearance-none"
                    >
                      {PROPERTY_TYPES.map((pt) => (
                        <option key={pt.value} value={pt.value}>{pt.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Compare Size */}
                <div className="space-y-1.5">
                  <label className="text-slate-500 font-bold text-xs uppercase tracking-wider block">Unit Size</label>
                  <div className="relative">
                    <Layers className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <select
                      value={compareSize}
                      onChange={(e) => setCompareSize(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200/80 hover:border-amber-300 rounded-xl font-semibold text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition cursor-pointer appearance-none"
                    >
                      {(SIZES[compareType] || []).map((sz) => (
                        <option key={sz} value={sz}>{sz}</option>
                      ))}
                    </select>
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>

        {/* ── METRICS DASHBOARD CARDS ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          
          {/* Card 1: Avg Valuation */}
          <div className="bg-white border border-slate-200/70 p-6 rounded-2xl shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-bold text-xs uppercase tracking-wider">Avg Valuation</span>
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><DollarSign className="w-5 h-5" /></div>
            </div>
            <div>
              <div className="text-2xl font-extrabold text-slate-900 leading-tight">
                PKR {(activeMetrics.avgPrice / 10000000).toFixed(2)} Cr
              </div>
              <div className="text-slate-500 text-xs mt-1 font-bold">
                {compareMode && compareMetrics && (
                  <span className="text-amber-600">vs {(compareMetrics.avgPrice / 10000000).toFixed(2)} Cr</span>
                )}
                {!compareMode && `${size} Average Price`}
              </div>
            </div>
          </div>

          {/* Card 2: Annual Growth */}
          <div className="bg-white border border-slate-200/70 p-6 rounded-2xl shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-bold text-xs uppercase tracking-wider">YoY Appreciation</span>
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><TrendingUp className="w-5 h-5" /></div>
            </div>
            <div>
              <div className="text-2xl font-extrabold text-emerald-600 leading-tight flex items-center gap-1">
                +{activeMetrics.yoyGrowth}% 
                <span className="text-xs bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded-full font-extrabold flex items-center">
                  <ArrowUpRight className="w-3 h-3" />
                </span>
              </div>
              <div className="text-slate-500 text-xs mt-1 font-bold">
                {compareMode && compareMetrics && (
                  <span className="text-amber-600">vs +{compareMetrics.yoyGrowth}%</span>
                )}
                {!compareMode && "Annualized ROI growth"}
              </div>
            </div>
          </div>

          {/* Card 3: Rental Yield */}
          <div className="bg-white border border-slate-200/70 p-6 rounded-2xl shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-bold text-xs uppercase tracking-wider">Rental Yield</span>
              <div className="p-2 bg-indigo-50 text-indigo-650 rounded-lg"><Percent className="w-5 h-5" /></div>
            </div>
            <div>
              <div className="text-2xl font-extrabold text-indigo-650 leading-tight">
                {activeMetrics.rentalYield > 0 ? `${activeMetrics.rentalYield}%` : "N/A"}
              </div>
              <div className="text-slate-500 text-xs mt-1 font-bold">
                {compareMode && compareMetrics && (
                  <span className="text-amber-600">
                    vs {compareMetrics.rentalYield > 0 ? `${compareMetrics.rentalYield}%` : "N/A"}
                  </span>
                )}
                {!compareMode && (type === "PLOT" ? "Plots do not yield rent" : "Avg rent vs market value")}
              </div>
            </div>
          </div>

          {/* Card 4: Demand Index */}
          <div className="bg-white border border-slate-200/70 p-6 rounded-2xl shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-bold text-xs uppercase tracking-wider">Demand Profile</span>
              <div className="p-2 bg-purple-50 text-purple-650 rounded-lg"><Activity className="w-5 h-5" /></div>
            </div>
            <div>
              <div className="text-2xl font-extrabold text-purple-650 leading-tight">
                {activeMetrics.demandScore} / 100
              </div>
              <div className="text-slate-500 text-xs mt-1 font-bold">
                {compareMode && compareMetrics && (
                  <span className="text-amber-600">vs {compareMetrics.demandScore} / 100</span>
                )}
                {!compareMode && `Active buyer search volume`}
              </div>
            </div>
          </div>

          {/* Card 5: Market Health */}
          <div className="bg-white border border-slate-200/70 p-6 rounded-2xl shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-bold text-xs uppercase tracking-wider">Market Health</span>
              <div className={`p-1.5 rounded-lg text-xs font-black uppercase ${
                activeMetrics.healthScore >= 85 ? "bg-emerald-50 text-emerald-700" : "bg-blue-50 text-blue-700"
              }`}>
                {activeMetrics.marketHealth}
              </div>
            </div>
            <div>
              <div className="text-2xl font-extrabold text-slate-900 leading-tight">
                {activeMetrics.healthScore} / 100
              </div>
              <div className="text-slate-500 text-xs mt-1 font-bold">
                {compareMode && compareMetrics && (
                  <span className="text-amber-600">vs {compareMetrics.healthScore} / 100</span>
                )}
                {!compareMode && "PropSight Health Index"}
              </div>
            </div>
          </div>

        </div>

        {/* ── MAIN CHART & TIME LINE CONTROL ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* Chart Card */}
          <div className="lg:col-span-2 bg-white border border-slate-200/70 p-6 rounded-3xl shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-slate-900 font-extrabold text-xl tracking-tight">
                  Price Performance Index
                </h3>
                <p className="text-slate-500 text-xs font-semibold mt-1">
                  Historical relative value growth curve (Jan 2021 = 100)
                </p>
              </div>

              {/* Timeframe Selector (Glass Pills) */}
              <div className="flex items-center gap-1.5 bg-slate-100/75 p-1 rounded-xl">
                {TIMEFRAMES.map((tf) => (
                  <button
                    key={tf.value}
                    onClick={() => setTimeframe(tf.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
                      timeframe === tf.value
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    {tf.value}
                  </button>
                ))}
              </div>
            </div>

            {/* CHART CONTAINER */}
            <div className="relative pt-6">
              
              {/* Dual Legend for Compare Mode */}
              {compareMode && (
                <div className="flex items-center gap-6 justify-end text-xs font-bold pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-1.5 rounded bg-blue-600 block"></span>
                    <span className="text-slate-700">{locality} ({city})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-1.5 rounded bg-amber-500 block"></span>
                    <span className="text-slate-700">{compareLocality} ({compareCity})</span>
                  </div>
                </div>
              )}

              {/* RESPONSIVE SVG CONTAINER */}
              <div className="w-full overflow-x-auto">
                <svg
                  viewBox={`0 0 ${width} ${height}`}
                  className="w-full min-w-[700px] h-[320px] select-none overflow-visible"
                >
                  {/* Grid Lines */}
                  {[0, 1, 2, 3, 4].map((gridIndex) => {
                    const y = paddingTop + (gridIndex * (height - paddingTop - paddingBottom)) / 4;
                    return (
                      <line
                        key={gridIndex}
                        x1={paddingLeft}
                        y1={y}
                        x2={width - paddingRight}
                        y2={y}
                        stroke="#f1f5f9"
                        strokeWidth="1.5"
                      />
                    );
                  })}

                  {/* Gradient definition for filled areas */}
                  <defs>
                    <linearGradient id="gradientPrimary" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2563eb" stopOpacity="0.18" />
                      <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
                    </linearGradient>
                    <linearGradient id="gradientCompare" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.18" />
                      <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Area Fills */}
                  {primaryAreaPath && (
                    <path d={primaryAreaPath} fill="url(#gradientPrimary)" />
                  )}
                  {compareMode && compareAreaPath && (
                    <path d={compareAreaPath} fill="url(#gradientCompare)" />
                  )}

                  {/* Line Paths */}
                  {primaryPath && (
                    <path
                      d={primaryPath}
                      fill="none"
                      stroke="#2563eb"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  )}
                  {compareMode && comparePath && (
                    <path
                      d={comparePath}
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  )}

                  {/* Hover Interaction Vertical Line Tracker */}
                  {hoveredIndex !== null && primaryCoords[hoveredIndex] && (
                    <line
                      x1={primaryCoords[hoveredIndex].x}
                      y1={paddingTop}
                      x2={primaryCoords[hoveredIndex].x}
                      y2={height - paddingBottom}
                      stroke="#94a3b8"
                      strokeWidth="1.5"
                      strokeDasharray="4 4"
                    />
                  )}

                  {/* Data Point Circles & Interactivity Layers */}
                  {primaryCoords.map((coord, idx) => {
                    const isHovered = hoveredIndex === idx;
                    return (
                      <g key={`primary-point-${idx}`}>
                        <circle
                          cx={coord.x}
                          cy={coord.y}
                          r={isHovered ? 6 : 4}
                          fill={isHovered ? "#2563eb" : "#ffffff"}
                          stroke="#2563eb"
                          strokeWidth={isHovered ? 3 : 2}
                          className="transition-all duration-150 cursor-pointer"
                          onMouseEnter={() => setHoveredIndex(idx)}
                          onMouseLeave={() => setHoveredIndex(null)}
                        />
                        {/* Invisible large overlay circle to make hover target larger */}
                        <circle
                          cx={coord.x}
                          cy={coord.y}
                          r="15"
                          fill="transparent"
                          className="cursor-pointer"
                          onMouseEnter={() => setHoveredIndex(idx)}
                          onMouseLeave={() => setHoveredIndex(null)}
                        />
                      </g>
                    );
                  })}

                  {compareMode && compareCoords.map((coord, idx) => {
                    const isHovered = hoveredCompareIndex === idx;
                    return (
                      <g key={`compare-point-${idx}`}>
                        <circle
                          cx={coord.x}
                          cy={coord.y}
                          r={isHovered ? 6 : 4}
                          fill={isHovered ? "#f59e0b" : "#ffffff"}
                          stroke="#f59e0b"
                          strokeWidth={isHovered ? 3 : 2}
                          className="transition-all duration-150 cursor-pointer"
                          onMouseEnter={() => setHoveredCompareIndex(idx)}
                          onMouseLeave={() => setHoveredCompareIndex(null)}
                        />
                        <circle
                          cx={coord.x}
                          cy={coord.y}
                          r="15"
                          fill="transparent"
                          className="cursor-pointer"
                          onMouseEnter={() => setHoveredCompareIndex(idx)}
                          onMouseLeave={() => setHoveredCompareIndex(null)}
                        />
                      </g>
                    );
                  })}

                  {/* Timeline labels on X-axis */}
                  {timelineData.labels.map((lbl, idx) => {
                    // Reduce label clutter by skipping intermediate points on longer timelines
                    const displayModulo = 
                      timeframe === "5Y" ? 4 : 
                      timeframe === "3Y" ? 2 : 1;
                    
                    if (idx % displayModulo !== 0 && idx !== timelineData.labels.length - 1) return null;

                    const coord = primaryCoords[idx];
                    if (!coord) return null;

                    return (
                      <text
                        key={`x-label-${idx}`}
                        x={coord.x}
                        y={height - paddingBottom + 20}
                        textAnchor="middle"
                        fill="#94a3b8"
                        className="text-[10px] font-bold"
                      >
                        {lbl}
                      </text>
                    );
                  })}

                  {/* Pricing Values on Y-axis (Index benchmarks) */}
                  {[0, 1, 2, 3, 4].map((gridIdx) => {
                    const y = paddingTop + (gridIdx * (height - paddingTop - paddingBottom)) / 4;
                    // Dynamically map values
                    const minVal = Math.min(...timelineData.primaryHistory);
                    const maxVal = Math.max(...timelineData.primaryHistory);
                    const labelVal = Math.round(maxVal - (gridIdx * (maxVal - minVal)) / 4);

                    return (
                      <text
                        key={`y-label-${gridIdx}`}
                        x={paddingLeft - 10}
                        y={y + 4}
                        textAnchor="end"
                        fill="#94a3b8"
                        className="text-[10px] font-bold"
                      >
                        {labelVal}
                      </text>
                    );
                  })}
                </svg>
              </div>

              {/* Tooltip Overlay */}
              {hoveredIndex !== null && primaryCoords[hoveredIndex] && (
                <div 
                  className="absolute bg-slate-900 text-white text-xs px-3.5 py-2.5 rounded-xl shadow-xl space-y-1 z-30 pointer-events-none"
                  style={{
                    left: `${(primaryCoords[hoveredIndex].x / width) * 100}%`,
                    top: `${(primaryCoords[hoveredIndex].y / height) * 100 - 30}%`,
                    transform: "translate(-50%, -100%)",
                  }}
                >
                  <div className="font-extrabold text-slate-300">{timelineData.labels[hoveredIndex]}</div>
                  <div className="font-bold">Index Value: <span className="text-blue-400">{timelineData.primaryHistory[hoveredIndex]}</span></div>
                  <div className="font-bold">Avg Price: <span className="text-emerald-400">PKR {(timelineData.primaryPrices[hoveredIndex]).toFixed(2)} M</span></div>
                </div>
              )}

              {compareMode && hoveredCompareIndex !== null && compareCoords[hoveredCompareIndex] && (
                <div 
                  className="absolute bg-slate-900 text-white text-xs px-3.5 py-2.5 rounded-xl shadow-xl space-y-1 z-30 pointer-events-none"
                  style={{
                    left: `${(compareCoords[hoveredCompareIndex].x / width) * 100}%`,
                    top: `${(compareCoords[hoveredCompareIndex].y / height) * 100 - 30}%`,
                    transform: "translate(-50%, -100%)",
                  }}
                >
                  <div className="font-extrabold text-slate-300">{timelineData.labels[hoveredCompareIndex]}</div>
                  <div className="font-bold">Compare Index: <span className="text-amber-400">{timelineData.compareHistory[hoveredCompareIndex]}</span></div>
                  <div className="font-bold">Avg Price: <span className="text-amber-300">PKR {(timelineData.comparePrices[hoveredCompareIndex]).toFixed(2)} M</span></div>
                </div>
              )}

            </div>
          </div>

          {/* AI Insights & Info Box */}
          <div className="bg-white border border-slate-200/70 p-6 rounded-3xl shadow-sm space-y-6 flex flex-col justify-between self-stretch">
            <div className="space-y-4">
              <div className="flex items-center gap-2.5 text-blue-900 font-extrabold text-lg">
                <Sparkles className="w-5 h-5 text-blue-600 animate-pulse" />
                <h4>PropSight AI Market Verdict</h4>
              </div>
              
              <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-2xl text-slate-700 text-sm leading-relaxed space-y-3 font-medium">
                <div className="font-extrabold text-blue-950 text-sm">
                  {aiInsight.summary}
                </div>
                <div className="text-xs text-slate-600">
                  {aiInsight.analysis}
                </div>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200/60 rounded-2xl text-xs space-y-2">
                <div className="flex items-center gap-1.5 font-extrabold text-slate-800">
                  <Info className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Recommendation Model</span>
                </div>
                <div className="text-slate-600 leading-relaxed font-semibold" dangerouslySetInnerHTML={{ __html: aiInsight.recommendation }}></div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-400 font-bold flex items-center gap-1">
              <Activity className="w-3.5 h-3.5" /> Updated as of June 2026. Based on 15,000+ local registry transactions & user portal listings.
            </div>
          </div>

        </div>

        {/* ── LOWER SECTION: COMPARATIVE TABLES & LEADERBOARD ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Table of sizes for current location */}
          <div className="lg:col-span-6 bg-white border border-slate-200/70 p-6 rounded-3xl shadow-sm space-y-4">
            <div>
              <h3 className="text-slate-900 font-extrabold text-lg tracking-tight">
                Pricing Matrix by Size ({locality})
              </h3>
              <p className="text-slate-400 text-xs font-semibold">
                Average rate analysis for {type.toLowerCase()} structures in the area.
              </p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-150 text-slate-450 text-xs font-bold uppercase tracking-wider">
                    <th className="py-3 px-2">Size Code</th>
                    <th className="py-3 px-2">Avg Price (PKR)</th>
                    <th className="py-3 px-2">Appreciation</th>
                    <th className="py-3 px-2">Rental Yield</th>
                    <th className="py-3 px-2">Action</th>
                  </tr>
                </thead>
                <tbody className="text-slate-700 text-sm font-semibold divide-y divide-slate-100">
                  {Object.keys(propertyIndexData[city]?.[locality]?.[type] || {}).map((sizeKey) => {
                    const rowData = propertyIndexData[city][locality][type][sizeKey];
                    const isSelected = sizeKey === size;

                    return (
                      <tr 
                        key={sizeKey} 
                        className={`hover:bg-slate-50 transition cursor-pointer ${
                          isSelected ? "bg-blue-50/50" : ""
                        }`}
                        onClick={() => setSize(sizeKey)}
                      >
                        <td className="py-3.5 px-2 font-extrabold text-slate-900">
                          {sizeKey}
                        </td>
                        <td className="py-3.5 px-2 text-slate-800">
                          {(rowData.avgPrice / 10000000).toFixed(2)} Crore
                        </td>
                        <td className="py-3.5 px-2 text-emerald-600">
                          +{rowData.yoyGrowth}%
                        </td>
                        <td className="py-3.5 px-2 text-indigo-650">
                          {rowData.rentalYield > 0 ? `${rowData.rentalYield}%` : "N/A"}
                        </td>
                        <td className="py-3.5 px-2">
                          <button 
                            className={`px-3 py-1 rounded-lg text-xs font-bold ${
                              isSelected ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                            }`}
                          >
                            {isSelected ? "Selected" : "Select"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* High performing localities in city */}
          <div className="lg:col-span-6 bg-white border border-slate-200/70 p-6 rounded-3xl shadow-sm space-y-4">
            <div>
              <h3 className="text-slate-900 font-extrabold text-lg tracking-tight">
                Top Performing Locations in {city}
              </h3>
              <p className="text-slate-400 text-xs font-semibold">
                Ranked by 1-Year appreciation yield index for {type.toLowerCase()} ({size}).
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-150 text-slate-450 text-xs font-bold uppercase tracking-wider">
                    <th className="py-3 px-2">Rank</th>
                    <th className="py-3 px-2">Locality</th>
                    <th className="py-3 px-2">Avg Valuation</th>
                    <th className="py-3 px-2">Growth (YoY)</th>
                    <th className="py-3 px-2">Market Status</th>
                  </tr>
                </thead>
                <tbody className="text-slate-700 text-sm font-semibold divide-y divide-slate-100">
                  {leaderBoard.map((item, idx) => {
                    const isSelected = item.name === locality;
                    return (
                      <tr 
                        key={item.name} 
                        className={`hover:bg-slate-50 transition cursor-pointer ${
                          isSelected ? "bg-blue-50/50" : ""
                        }`}
                        onClick={() => setLocality(item.name)}
                      >
                        <td className="py-3.5 px-2">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                            idx === 0 ? "bg-amber-100 text-amber-800" :
                            idx === 1 ? "bg-slate-200 text-slate-800" :
                            idx === 2 ? "bg-orange-100 text-orange-800" : "bg-slate-100 text-slate-600"
                          }`}>
                            #{idx + 1}
                          </div>
                        </td>
                        <td className="py-3.5 px-2 font-extrabold text-slate-950 flex items-center gap-1.5">
                          {item.name}
                          {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-blue-600 inline-block"></span>}
                        </td>
                        <td className="py-3.5 px-2 text-slate-650">
                          PKR {(item.avgPrice / 10000000).toFixed(2)} Crore
                        </td>
                        <td className="py-3.5 px-2 text-emerald-600 font-extrabold">
                          +{item.yoyGrowth}%
                        </td>
                        <td className="py-3.5 px-2">
                          <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                            item.yoyGrowth > 13 ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : 
                            "bg-blue-50 text-blue-700 border border-blue-100"
                          }`}>
                            {item.marketHealth}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
