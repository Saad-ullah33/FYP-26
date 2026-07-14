import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { geminiService } from '../services/geminiService';
import { 
  IconArrowLeft, 
  IconAlertCircle, 
  IconSmartHome, 
  IconSparkles, 
  IconCheck,
  IconChartBar,
  IconCoin,
  IconMapPin
} from '@tabler/icons-react';

const CalculatorResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const payload = location.state;

  // Option Tickers State (Complete, Grey Structure, Finishing)
  const [activeTab, setActiveTab] = useState('Complete');

  // Trigger animation mount transition
  const [animate, setAnimate] = useState(false);

  // States for live rates loading
  const [loadingRates, setLoadingRates] = useState(true);
  const [rates, setRates] = useState({
    brickPrice: 21,
    cementPrice: 1540,
    sandPrice: 95,
    crushPrice: 190,
    steelPrice: 280,
    laborRate: 600,
    tileRate: 260,
    paintRate: 130
  });
  const [advice, setAdvice] = useState({
    soil: "Ensure complete sub-grade compaction before structural concrete pours.",
    saving: "Bulk-buying cement directly from distributors avoids retail shipping overheads.",
    steel: "Grade 60 structural steel handles standard residential layouts securely."
  });
  const [groundingSources, setGroundingSources] = useState(null);

  useEffect(() => {
    const t = setTimeout(() => setAnimate(true), 100);
    return () => clearTimeout(t);
  }, [activeTab, loadingRates]); // Triggers re-animation on tab or load change

  useEffect(() => {
    if (!payload || !payload.inputs) return;
    
    let active = true;
    const loadRates = async () => {
      try {
        setLoadingRates(true);
        const data = await geminiService.fetchLiveConstructionRates(payload.inputs.city);
        if (active && data) {
          if (data.rates) setRates(data.rates);
          if (data.advice) setAdvice(data.advice);
          if (data.groundingSources) setGroundingSources(data.groundingSources);
        }
      } catch (err) {
        console.error("Error loading live construction rates:", err);
      } finally {
        if (active) setLoadingRates(false);
      }
    };
    
    loadRates();
    return () => { active = false; };
  }, [payload]);

  if (!payload) {
    return (
      <div className="py-20 bg-slate-50 text-center flex flex-col items-center justify-center min-h-[60vh]">
        <IconAlertCircle size={48} className="text-slate-300 mb-4 animate-bounce" />
        <h3 className="text-xl font-bold text-slate-800">No calculation data found</h3>
        <p className="text-slate-500 text-sm mt-1 max-w-xs">Please perform a calculation in the cost generator first.</p>
        <button 
          onClick={() => navigate('/smart-build')} 
          className="mt-6 bg-blue-600 text-white font-bold px-6 py-2.5 rounded-xl text-sm shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          Go to Calculator
        </button>
      </div>
    );
  }

  const { sqft, bricks, cement, sand, crush, steel, inputs } = payload;

  const formatMoney = (amount) => "Rs. " + amount.toLocaleString();
  const formatLakh = (amount) => (amount / 100000).toFixed(2) + " Lakh";

  // ── MATHEMATICAL SPLIT FOR GRAPHICAL CATEGORIES DYNAMIC TO LIVE RATES ──
  const costBricks = Math.round(bricks.qty * rates.brickPrice);
  const costCement = Math.round(cement.qty * rates.cementPrice);
  const costSand = Math.round(sand.qty * rates.sandPrice);
  const costCrush = Math.round(crush.qty * rates.crushPrice);
  const costSteel = Math.round(steel.qty * rates.steelPrice);
  const costLabor = Math.round(sqft * rates.laborRate);

  const costTiles = Math.round(sqft * rates.tileRate); 
  const costPaint = Math.round(sqft * rates.paintRate);
  
  const greyTotal = costBricks + costCement + costSand + costCrush + costSteel + costLabor;
  const costPlumbingElectric = Math.round(greyTotal * 0.15); 
  const finishTotal = costTiles + costPaint + costPlumbingElectric;
  const totalCostCombined = greyTotal + costTiles + costPaint + costPlumbingElectric;

  const plumbingCost = Math.round((costBricks + costCement) * 0.14);
  const electricalCost = Math.round((costSteel + costLabor) * 0.12);
  const foundationStructureCost = Math.round(totalCostCombined - (plumbingCost + electricalCost + finishTotal));

  // Determine active dataset based on option ticker selection
  let chartData = [];
  if (activeTab === 'Complete') {
    chartData = [
      { label: "Plumbing Works", value: plumbingCost, color: "#f59e0b" },         // Orange
      { label: "Electrical Works", value: electricalCost, color: "#a78bfa" },       // Purple
      { label: "Wood, Metal and Tile Works", value: Math.round(finishTotal * 0.75), color: "#0ea5e9" }, // Blue
      { label: "Fittings & Fixtures", value: Math.round(finishTotal * 0.25), color: "#ef4444" }, // Red
      { label: "Foundation & Structure", value: foundationStructureCost, color: "#22d3ee" }, // Cyan
    ];
  } else if (activeTab === 'Grey Structure') {
    chartData = [
      { label: "Steel (60 Grade)", value: costSteel, color: "#3b82f6" },
      { label: "Cement (OPC)", value: costCement, color: "#6366f1" },
      { label: "Bricks (Awwal)", value: costBricks, color: "#f59e0b" },
      { label: "Aggregates (Sand & Crush)", value: costSand + costCrush, color: "#14b8a6" },
      { label: "Labor Allocation", value: costLabor, color: "#22d3ee" },
    ];
  } else {
    // Finishing Active Tab
    chartData = [
      { label: "Plumbing Fixtures", value: plumbingCost, color: "#f59e0b" },
      { label: "Electrical Wiring", value: electricalCost, color: "#a78bfa" },
      { label: "Tiling & Wood Works", value: Math.round(finishTotal * 0.75), color: "#0ea5e9" },
      { label: "Paint & Decoration", value: Math.round(finishTotal * 0.25), color: "#ef4444" },
    ];
  }

  // ── DONUT CHART CALCULATION MODEL ──
  const r = 70;
  const circumference = 2 * Math.PI * r; // ~439.82
  const chartTotal = chartData.reduce((acc, curr) => acc + curr.value, 0);
  
  let accumulatedPercent = 0;
  const segments = chartData.map((item) => {
    const percent = item.value / (chartTotal || 1);
    const strokeDashoffset = circumference - (percent * circumference);
    const rotateOffset = accumulatedPercent * 360;
    accumulatedPercent += percent;

    return {
      ...item,
      percent: Math.round(percent * 100),
      strokeDasharray: circumference,
      strokeDashoffset,
      rotateOffset,
    };
  });

  return (
    <div className="py-12 px-6 md:px-12 lg:px-20 bg-slate-50 min-h-screen text-left">
      <div className="max-w-[1300px] mx-auto space-y-8">

        {/* ── HEADER ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <button 
              onClick={() => navigate(-1)}
              className="text-slate-500 hover:text-blue-600 text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5 transition-all duration-200 hover:-translate-x-1 cursor-pointer"
            >
              <IconArrowLeft size={14} /> Back to Input
            </button>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Full Project Breakdown</h2>
            <p className="text-slate-500 text-sm font-semibold">
              Detailed estimation metrics and materials report for {inputs.areaSize} {inputs.unit} in {inputs.city}.
            </p>
          </div>

          <div className="bg-white border border-slate-200/80 px-6 py-4 rounded-2xl shadow-sm text-right shrink-0">
            <p className="text-slate-400 text-[10px] font-extrabold uppercase tracking-widest">Calculated Area</p>
            <span className="text-2xl font-black text-slate-800">{sqft.toLocaleString()}</span>
            <span className="text-xs font-bold text-slate-400 ml-1.5">sq. ft.</span>
          </div>
        </div>

        {/* LOADING SKELETON LAYER */}
        {loadingRates ? (
          <div className="bg-white border border-slate-100 rounded-3xl p-12 shadow-sm text-center flex flex-col items-center justify-center min-h-[450px]">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 mb-4 border border-blue-100 animate-pulse">
              <IconSparkles size={28} className="animate-spin" style={{ animationDuration: '3s' }} />
            </div>
            <h3 className="text-xl font-bold text-slate-800">Calibrating Local Market Indexes</h3>
            <p className="text-slate-450 text-xs font-semibold max-w-sm mt-2 leading-relaxed">
              Fetching real-time construction and labor rates for {inputs.city} via Google Search Grounding to verify actual market prices...
            </p>
            <div className="mt-8 flex gap-3 items-center">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        ) : (
          <>
            {/* ── GOOGLE SEARCH GROUNDING SOURCES ── */}
            {groundingSources && groundingSources.groundingChunks && groundingSources.groundingChunks.length > 0 && (
              <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm animate-in fade-in duration-300">
                <div className="flex items-center gap-2 mb-2">
                  <IconSparkles size={16} className="text-amber-500 animate-pulse" />
                  <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">Google Search Grounding Sources</h4>
                </div>
                <p className="text-[11px] text-slate-500 font-semibold mb-3">
                  This build estimation is verified using live web rates in {inputs.city}:
                </p>
                <div className="flex flex-wrap gap-2.5">
                  {groundingSources.groundingChunks.map((chunk, idx) => (
                    <a
                      key={idx}
                      href={chunk.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-blue-650 hover:text-blue-700 bg-blue-50 hover:bg-blue-100/80 px-3 py-2 rounded-xl border border-blue-150 transition"
                    >
                      <span>{chunk.title}</span>
                      <IconMapPin size={10} />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* ── TOTAL COST HERO BLOCK ── */}
            <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-600 rounded-3xl p-8 md:p-10 text-white relative overflow-hidden shadow-xl shadow-blue-500/5">
              <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "20px 20px" }}></div>
              
              <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <p className="text-slate-400 text-xs font-extrabold uppercase tracking-widest">Total Estimated Cost</p>
                  <h3 className="text-4xl font-extrabold text-white mt-1">{formatMoney(totalCostCombined)}</h3>
                </div>

                <div className="grid grid-cols-2 gap-x-8 gap-y-4 border-t border-white/10 md:border-t-0 md:border-l md:pl-8 pt-6 md:pt-0 w-full md:w-auto text-left">
                  <div>
                    <p className="text-blue-200 text-xs font-bold uppercase tracking-wider">Grey Structure</p>
                    <p className="text-lg font-black mt-0.5">{formatMoney(greyTotal)}</p>
                  </div>
                  <div>
                    <p className="text-blue-200 text-xs font-bold uppercase tracking-wider">Finishing Budget</p>
                    <p className="text-lg font-black mt-0.5">{formatMoney(finishTotal)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* ── GRAPHICAL BREAKDOWN SECTION (Doughnut Chart) ── */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-10 shadow-sm space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-extrabold text-slate-800 tracking-tight">
                  Breakdown of Overall Construction Cost By Percentage (PKR)
                </h3>
                
                {/* OPTION TICKERS CAPSULES */}
                <div className="flex flex-wrap items-center gap-2">
                  {['Complete', 'Grey Structure', 'Finishing'].map((tab) => {
                    const isActive = activeTab === tab;
                    return (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`text-xs font-bold px-4 py-2 rounded-full border transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                          isActive 
                            ? "bg-blue-100 text-blue-700 border-blue-500 shadow-sm" 
                            : "bg-slate-100/80 hover:bg-slate-200/60 text-slate-600 border-transparent"
                        }`}
                      >
                        {isActive && <IconCheck size={14} className="stroke-[3]" />}
                        {tab}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center pt-4">
                
                {/* Left Column: Donut Chart Projection */}
                <div className="md:col-span-5 flex justify-center py-4">
                  <div className="relative w-56 h-56">
                    <svg width="220" height="220" viewBox="0 0 200 200" className="transform -rotate-90">
                      {segments.map((seg, idx) => (
                        <g key={idx} transform={`rotate(${seg.rotateOffset} 100 100)`}>
                          <circle
                            cx="100"
                            cy="100"
                            r={r}
                            fill="transparent"
                            stroke={seg.color}
                            strokeWidth="28" // Thick donut ring
                            strokeDasharray={seg.strokeDasharray}
                            strokeDashoffset={animate ? seg.strokeDashoffset : circumference}
                            className="transition-all duration-700 ease-out"
                            strokeLinecap="butt"
                          />
                        </g>
                      ))}
                      {/* Central cutout circle */}
                      <circle cx="100" cy="100" r="56" fill="#ffffff" />
                    </svg>
                    
                    {/* Center total text widget */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <p className="text-slate-400 text-[10px] font-extrabold uppercase tracking-widest">Active Total</p>
                      <p className="text-base font-extrabold text-slate-800 mt-0.5">
                        {formatLakh(chartTotal)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Column: Dynamic Color Legend List */}
                <div className="md:col-span-7 space-y-4">
                  {segments.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between border-b border-slate-50 pb-3 last:border-0">
                      <div className="flex items-center gap-3">
                        <span className="w-4 h-4 rounded-md shrink-0 shadow-sm" style={{ backgroundColor: item.color }}></span>
                        <span className="text-sm font-bold text-slate-700">{item.label}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-extrabold text-slate-900">{formatLakh(item.value)}</span>
                        <span className="text-xs font-bold text-slate-400 ml-2">({item.percent}%)</span>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </div>

            {/* ── DETAILED ESTIMATE TABLE BREAKDOWN ── */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-12 space-y-6">
                
                {/* Structural Breakdown Card */}
                <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm space-y-5">
                  <h4 className="font-extrabold text-blue-900 text-base flex items-center gap-2 border-b border-slate-100 pb-3">
                    <IconSmartHome size={18} className="text-blue-500" />
                    <span>Structural Grey Materials Breakdown</span>
                  </h4>
                  <div className="divide-y divide-slate-100">
                    <ResultItemRow label="Bricks (Awwal)" qty={bricks.qty} unit="Nos" rate={rates.brickPrice} cost={costBricks} />
                    <ResultItemRow label="Cement (OPC)" qty={cement.qty} unit="Bags" rate={rates.cementPrice} cost={costCement} />
                    <ResultItemRow label="Sand (Chenab/Ravi)" qty={sand.qty} unit="cft" rate={rates.sandPrice} cost={costSand} />
                    <ResultItemRow label="Crush (Bajri)" qty={crush.qty} unit="cft" rate={rates.crushPrice} cost={costCrush} />
                    <ResultItemRow label="Steel (60 Grade)" qty={steel.qty} unit="kg" rate={rates.steelPrice} cost={costSteel} />
                    <ResultItemRowSimple label="Labor Structure Charges" rate={`${formatMoney(rates.laborRate)} / sq.ft.`} cost={costLabor} />
                  </div>
                </div>

                {/* Finishing & Secondary Services */}
                <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm space-y-5">
                  <h4 className="font-extrabold text-slate-800 text-base flex items-center gap-2 border-b border-slate-100 pb-3">
                    <IconCoin size={18} className="text-slate-500" />
                    <span>Finishing & Secondary Services</span>
                  </h4>
                  <div className="divide-y divide-slate-100">
                    <ResultItemRowSimple label="Flooring & Tiling" rate={`${formatMoney(rates.tileRate)} / sq.ft.`} cost={costTiles} />
                    <ResultItemRowSimple label="Wall Painting & Finishing" rate={`${formatMoney(rates.paintRate)} / sq.ft.`} cost={costPaint} />
                    <ResultItemRowSimple label="Plumbing & Electrical Infrastructure (15% Grey)" rate="Proportional" cost={Math.round(greyTotal * 0.15)} />
                  </div>
                </div>

              </div>
            </div>

            {/* ── AI ADVISOR CARD ── */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-slate-900/10 border border-slate-800 bg-slate-950 p-8 md:p-10">
              
              {/* Ambient Overlay Layer */}
              <div className="absolute inset-0 z-10 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-slate-950/20"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/60 via-transparent to-slate-950/40"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px]"></div>
              </div>

              <div className="relative z-20">
                {/* Badge */}
                <div className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-extrabold uppercase tracking-widest rounded-full w-max mb-5">
                  <IconSparkles size={14} className="shrink-0 animate-pulse" />
                  <span>NextPropertyAi Assistant</span>
                </div>
                
                {/* Heading */}
                <h3 className="text-2xl md:text-3xl font-extrabold text-white leading-tight mb-8">
                  Smart Build <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400 text-transparent bg-clip-text">Advisor</span>
                </h3>

                {/* Advice Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                  <div className="space-y-2">
                    <p className="text-[11px] font-extrabold text-blue-400 uppercase tracking-widest">Foundation & Soil</p>
                    <p className="text-slate-300 text-sm leading-relaxed font-medium">{advice.soil}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[11px] font-extrabold text-cyan-400 uppercase tracking-widest">Cost Optimization</p>
                    <p className="text-slate-300 text-sm leading-relaxed font-medium">{advice.saving}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[11px] font-extrabold text-indigo-400 uppercase tracking-widest">Structural Reinforcement</p>
                    <p className="text-slate-300 text-sm leading-relaxed font-medium">{advice.steel}</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
};

// ── ROW RENDERING HELPERS ──
const ResultItemRow = ({ label, qty, unit, rate, cost }) => (
  <div className="flex justify-between items-center py-3">
    <div className="space-y-0.5">
      <span className="block font-bold text-slate-800 text-sm">{label}</span>
      <span className="block text-slate-400 text-xs font-semibold uppercase tracking-wider">
        {qty.toLocaleString()} {unit} • Rs. {rate} / unit
      </span>
    </div>
    <span className="font-extrabold text-slate-900 text-base">Rs. {cost.toLocaleString()}</span>
  </div>
);

const ResultItemRowSimple = ({ label, rate, cost }) => (
  <div className="flex justify-between items-center py-3.5">
    <div className="space-y-0.5">
      <span className="block font-bold text-slate-800 text-sm">{label}</span>
      <span className="block text-slate-400 text-xs font-semibold uppercase tracking-wider">
        Rate: {rate}
      </span>
    </div>
    <span className="font-extrabold text-slate-900 text-base">Rs. {cost.toLocaleString()}</span>
  </div>
);

export { CalculatorResult };
export default CalculatorResult;