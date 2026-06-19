import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
  useEffect(() => {
    const t = setTimeout(() => setAnimate(true), 100);
    return () => clearTimeout(t);
  }, [activeTab]); // Triggers re-animation on tab change

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

  // Pakistani Market Rates (2025-26 Estimates) - Declared locally for self-containment
  const RATES = {
    brickPrice: 22,       // Rs. per brick
    cementPrice: 1450,    // Rs. per bag
    sandPrice: 85,        // Rs. per cft
    crushPrice: 160,      // Rs. per cft
    steelPrice: 265,      // Rs. per kg
    laborRate: 550,       // Rs. per sqft
    tileRate: 250,        // Rs. per sqft
    paintRate: 120,       // Rs. per sqft
  };

  const { sqft, bricks, cement, sand, crush, steel, labor, finishing, total, inputs } = payload;

  const formatMoney = (amount) => "Rs. " + amount.toLocaleString();
  const formatLakh = (amount) => (amount / 100000).toFixed(2) + " Lakh";

  // ── MATHEMATICAL SPLIT FOR GRAPHICAL CATEGORIES ──
  // Estimated allocations based on structural ratios
  const plumbingCost = Math.round((bricks.cost + cement.cost) * 0.14);
  const electricalCost = Math.round((steel.cost + labor.cost) * 0.12);
  const foundationStructureCost = Math.round(total - (plumbingCost + electricalCost + finishing.cost));

  // Resolved reference issues by removing nested 'result' prefixes
  const greyTotal = bricks.cost + cement.cost + sand.cost + crush.cost + steel.cost + labor.cost;
  const finishTotal = finishing.cost;

  // Determine active dataset based on option ticker selection
  let chartData = [];
  if (activeTab === 'Complete') {
    chartData = [
      { label: "Plumbing Works", value: plumbingCost, color: "#f59e0b" },         // Orange
      { label: "Electrical Works", value: electricalCost, color: "#a78bfa" },       // Purple
      { label: "Wood, Metal and Tile Works", value: finishing.cost * 0.75, color: "#0ea5e9" }, // Blue
      { label: "Fittings & Fixtures", value: finishing.cost * 0.25, color: "#ef4444" }, // Red
      { label: "Foundation & Structure", value: foundationStructureCost, color: "#22d3ee" }, // Cyan
    ];
  } else if (activeTab === 'Grey Structure') {
    chartData = [
      { label: "Steel (60 Grade)", value: steel.cost, color: "#3b82f6" },
      { label: "Cement (OPC)", value: cement.cost, color: "#6366f1" },
      { label: "Bricks (Awwal)", value: bricks.cost, color: "#f59e0b" },
      { label: "Aggregates (Sand & Crush)", value: sand.cost + crush.cost, color: "#14b8a6" },
      { label: "Labor Allocation", value: labor.cost, color: "#22d3ee" },
    ];
  } else {
    // Finishing Active Tab
    chartData = [
      { label: "Plumbing Fixtures", value: plumbingCost, color: "#f59e0b" },
      { label: "Electrical Wiring", value: electricalCost, color: "#a78bfa" },
      { label: "Tiling & Wood Works", value: finishing.cost * 0.75, color: "#0ea5e9" },
      { label: "Paint & Decoration", value: finishing.cost * 0.25, color: "#ef4444" },
    ];
  }

  // ── DONUT CHART CALCULATION MODEL ──
  const r = 70;
  const circumference = 2 * Math.PI * r; // ~439.82
  const chartTotal = chartData.reduce((acc, curr) => acc + curr.value, 0);
  
  let accumulatedPercent = 0;
  const segments = chartData.map((item) => {
    const percent = item.value / chartTotal;
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

  // Localized AI cost optimization tips
  const getAiAdvice = (city) => {
    switch (city) {
      case "Karachi":
        return {
          soil: "Coastal high-salinity subsoil requires damp-proof insulation (DPC) to guard foundations.",
          saving: "Use salt-free Chenab sand for interior plastering to protect finishing tiles and paint layers.",
          steel: "Epoxy-coated Grade 60 steel is recommended to counter coastal humidity corrosion."
        };
      case "Islamabad":
        return {
          soil: "Margins and hilly terrains sit in active seismic zones, requiring mandatory earthquake tie-beams.",
          saving: "Procuring aggregates directly from Taxila stone quarries cuts transport costs by 15%.",
          steel: "Always use certified Grade 60 deformed steel with tight column stirrup spacing."
        };
      case "Lahore":
        return {
          soil: "Rich clay plain soil supports standard columns but benefits from cement concrete block masonry.",
          saving: "Utilize Ravi sand for foundation back-filling, reserving Chenab sand for plaster finishings.",
          steel: "Damp-proof course sealing is vital due to seasonally high alluvial ground-moisture levels."
        };
      default:
        return {
          soil: "Ensure complete sub-grade compaction before structural concrete pours.",
          saving: "Bulk-buying cement directly from distributors avoids retail shipping overheads.",
          steel: "Grade 60 structural steel handles standard residential layouts securely."
        };
    }
  };

  const advice = getAiAdvice(inputs.city);

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
            <p className="text-slate-500 text-sm font-semibold">Detailed estimation metrics and materials report for {inputs.areaSize} {inputs.unit} in {inputs.city}.</p>
          </div>

          <div className="bg-white border border-slate-200/80 px-6 py-4 rounded-2xl shadow-sm text-right shrink-0">
            <p className="text-slate-400 text-[10px] font-extrabold uppercase tracking-widest">Calculated Area</p>
            <span className="text-2xl font-black text-slate-800">{sqft.toLocaleString()}</span>
            <span className="text-xs font-bold text-slate-400 ml-1.5">sq. ft.</span>
          </div>
        </div>

        {/* ── TOTAL COST HERO BLOCK ── */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-600 rounded-3xl p-8 md:p-10 text-white relative overflow-hidden shadow-xl shadow-blue-500/5">
          <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "20px 20px" }}></div>
          
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <p className="text-slate-400 text-xs font-extrabold uppercase tracking-widest">Total Estimated Cost</p>
              <h3 className="text-4xl font-extrabold text-white mt-1">{formatMoney(total)}</h3>
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
                <ResultItemRow label="Bricks (Awwal)" qty={bricks.qty} unit="Nos" rate={RATES.brickPrice} cost={bricks.cost} />
                <ResultItemRow label="Cement (OPC)" qty={cement.qty} unit="Bags" rate={RATES.cementPrice} cost={cement.cost} />
                <ResultItemRow label="Sand (Ravi)" qty={sand.qty} unit="cft" rate={RATES.sandPrice} cost={sand.cost} />
                <ResultItemRow label="Crush (Bajri)" qty={crush.qty} unit="cft" rate={RATES.crushPrice} cost={crush.cost} />
                <ResultItemRow label="Steel (60 Grade)" qty={steel.qty} unit="kg" rate={RATES.steelPrice} cost={steel.cost} />
                <ResultItemRowSimple label="Labor Structure Charges" rate={`${formatMoney(RATES.laborRate)} / sq.ft.`} cost={labor.cost} />
              </div>
            </div>

            {/* Finishing & Secondary Services */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm space-y-5">
              <h4 className="font-extrabold text-slate-800 text-base flex items-center gap-2 border-b border-slate-100 pb-3">
                <IconCoin size={18} className="text-slate-500" />
                <span>Finishing & Secondary Services</span>
              </h4>
              <div className="divide-y divide-slate-100">
                <ResultItemRowSimple label="Flooring & Tiling" rate={`${formatMoney(RATES.tileRate)} / sq.ft.`} cost={sqft * RATES.tileRate} />
                <ResultItemRowSimple label="Wall Painting & Finishing" rate={`${formatMoney(RATES.paintRate)} / sq.ft.`} cost={sqft * RATES.paintRate} />
                <ResultItemRowSimple label="Plumbing & Electrical Infrastructure (15% Grey)" rate="Proportional" cost={greyTotal * 0.15} />
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
              <span>PropSightAi Assistant</span>
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