import React, { useState, } from 'react';
import { 
  IconBuildingSkyscraper, 
  IconCalculator, 
  IconMapPin, 
  IconArrowLeft, 
  IconAlertCircle,
  IconCategory,
  IconChartBar,
  IconMathSymbols,
  IconInfoCircle
} from '@tabler/icons-react';

const SmartCalculator = () => {
  // --- 1. State Variables ---
  // Replaced boolean showResult with a 3-step view manager
  const [activeView, setActiveView] = useState('input'); // 'input' | 'summary' | 'details'
  const [city, setCity] = useState('Lahore');
  const [areaSize, setAreaSize] = useState('');
  const [unit, setUnit] = useState('Marla');
  const [result, setResult] = useState(null);

  // --- 2. Pakistani Market Rates (2025-26 Estimates) ---
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

  // --- 3. Calculation Logic ---
  const calculateCost = () => {
    let sqft = 0;
    const size = parseFloat(areaSize);

    if (!size) {
      alert("Please enter a valid area size");
      return;
    }

    let marlaSizeInSqft = 225; // Default (Lahore)
    if (city === 'Islamabad' || city === 'Faisalabad') {
      marlaSizeInSqft = 272;
    }

    if (unit === 'Marla') sqft = size * marlaSizeInSqft;
    else if (unit === 'Kanal') sqft = size * 20 * marlaSizeInSqft;
    else if (unit === 'Sq. Yds.') sqft = size * 9;
    else sqft = size; 

    const bricksQty = sqft * 8.5;
    const cementQty = sqft * 0.6;
    const sandQty = sqft * 3.5;
    const crushQty = sqft * 1.8;
    const steelQty = sqft * 4.5;

    const costBricks = bricksQty * RATES.brickPrice;
    const costCement = cementQty * RATES.cementPrice;
    const costSand = sandQty * RATES.sandPrice;
    const costCrush = crushQty * RATES.crushPrice;
    const costSteel = steelQty * RATES.steelPrice;
    const costLabor = sqft * RATES.laborRate;
    
    const costTiles = sqft * RATES.tileRate; 
    const costPaint = sqft * RATES.paintRate;
    const greyCost = costBricks + costCement + costSand + costCrush + costSteel + costLabor;
    const costPlumbingElectric = greyCost * 0.15; 

    const totalCost = greyCost + costTiles + costPaint + costPlumbingElectric;

    setResult({
      sqft: Math.round(sqft),
      bricks: { qty: Math.round(bricksQty), cost: Math.round(costBricks) },
      cement: { qty: Math.round(cementQty), cost: Math.round(costCement) },
      sand: { qty: Math.round(sandQty), cost: Math.round(costSand) },
      crush: { qty: Math.round(crushQty), cost: Math.round(costCrush) },
      steel: { qty: Math.round(steelQty), cost: Math.round(costSteel) },
      labor: { cost: Math.round(costLabor) },
      finishing: { 
        tiles: Math.round(costTiles),
        paint: Math.round(costPaint),
        plumbing: Math.round(costPlumbingElectric),
        cost: Math.round(costTiles + costPaint + costPlumbingElectric) 
      },
      greyTotal: Math.round(greyCost),
      total: Math.round(totalCost)
    });

    setActiveView('summary');
  };

  const formatMoney = (amount) => "Rs. " + amount.toLocaleString();

  // --- 4. VIEW: DETAILED CALCULATION & GRAPHS ───
  if (activeView === 'details' && result) {
    // Calculate percentages for the animated graphs
    const getPercent = (value) => Math.max(1, Math.round((value / result.total) * 100));

    const chartData = [
      { label: 'Bricks', cost: result.bricks.cost, percent: getPercent(result.bricks.cost), color: 'bg-orange-500' },
      { label: 'Steel', cost: result.steel.cost, percent: getPercent(result.steel.cost), color: 'bg-slate-600' },
      { label: 'Cement', cost: result.cement.cost, percent: getPercent(result.cement.cost), color: 'bg-stone-400' },
      { label: 'Labor', cost: result.labor.cost, percent: getPercent(result.labor.cost), color: 'bg-blue-500' },
      { label: 'Finishing & Services', cost: result.finishing.cost, percent: getPercent(result.finishing.cost), color: 'bg-emerald-500' },
      { label: 'Sand & Crush', cost: result.sand.cost + result.crush.cost, percent: getPercent(result.sand.cost + result.crush.cost), color: 'bg-yellow-600' },
    ].sort((a, b) => b.cost - a.cost); // Sort largest to smallest

    return (
      <div className="bg-white rounded-3xl shadow-xl shadow-slate-100/80 border border-slate-100 overflow-hidden mb-20 max-w-4xl mx-auto transition-all duration-300 text-left">
        {/* Injecting pure CSS for the bar graph animation */}
        <style>{`
          @keyframes growBar { from { width: 0%; opacity: 0; } to { width: var(--target-width); opacity: 1; } }
          .animate-bar { animation: growBar 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        `}</style>

        {/* Header */}
        <div className="bg-slate-900 p-8 text-white relative overflow-hidden">
          <button 
            onClick={() => setActiveView('summary')}
            className="relative z-10 text-slate-400 hover:text-white text-xs font-bold uppercase tracking-wider mb-5 flex items-center gap-1.5 transition-all duration-200 hover:-translate-x-1 cursor-pointer"
          >
            <IconArrowLeft size={14} /> Back to Summary
          </button>
          <div className="flex items-center gap-3 relative z-10">
            <IconChartBar size={28} className="text-blue-400" />
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">Detailed Analytics</h2>
          </div>
        </div>

        <div className="p-8 md:p-10 space-y-10">
          {/* Section 1: Visual Cost Distribution */}
          <section>
            <h3 className="text-lg font-extrabold text-slate-900 border-b border-slate-100 pb-3 mb-6 flex items-center gap-2">
              <IconChartBar size={20} className="text-slate-400" /> Cost Distribution Graph
            </h3>
            <div className="space-y-5">
              {chartData.map((item, index) => (
                <div key={index} className="w-full">
                  <div className="flex justify-between text-sm font-bold mb-1.5">
                    <span className="text-slate-700">{item.label}</span>
                    <span className="text-slate-900">{formatMoney(item.cost)} <span className="text-slate-400 text-xs ml-1">({item.percent}%)</span></span>
                  </div>
                  <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full animate-bar ${item.color}`} 
                      style={{ '--target-width': `${item.percent}%`, animationDelay: `${index * 0.1}s` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section 2: Mathematical Formulas Used */}
          <section>
            <h3 className="text-lg font-extrabold text-slate-900 border-b border-slate-100 pb-3 mb-6 flex items-center gap-2">
              <IconMathSymbols size={20} className="text-slate-400" /> Calculation Formulas Used
            </h3>
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              <FormulaRow material="Bricks" formula={`${result.sqft} sqft × 8.5 bricks`} />
              <FormulaRow material="Cement" formula={`${result.sqft} sqft × 0.6 bags`} />
              <FormulaRow material="Sand" formula={`${result.sqft} sqft × 3.5 cft`} />
              <FormulaRow material="Crush" formula={`${result.sqft} sqft × 1.8 cft`} />
              <FormulaRow material="Steel" formula={`${result.sqft} sqft × 4.5 kg`} />
              <FormulaRow material="Services" formula="15% of total Grey Structure cost" />
            </div>
            <div className="mt-4 flex items-start gap-2 text-slate-500 text-xs">
              <IconInfoCircle size={14} className="shrink-0 mt-0.5" />
              <p>These formulas are standard industry estimates for residential construction in Pakistan. Actual quantities may vary slightly based on architectural design and structural drawing specifications.</p>
            </div>
          </section>
        </div>
      </div>
    );
  }

  // --- 5. VIEW: SUMMARY STATE (Holographic Blue Theme) ───
  if (activeView === 'summary' && result) {
    const greyPercent = Math.round((result.greyTotal / result.total) * 100);
    const finishPercent = 100 - greyPercent;

    return (
      <div className="bg-white rounded-3xl shadow-xl shadow-slate-100/80 border border-slate-100 overflow-hidden mb-20 max-w-4xl mx-auto transition-all duration-300">
        
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-600 p-8 md:p-10 text-white text-left relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "16px 14px" }}></div>
          
          <button 
            onClick={() => setActiveView('input')}
            className="relative z-10 text-blue-100 hover:text-white text-xs font-bold uppercase tracking-wider mb-5 flex items-center gap-1.5 transition-all duration-200 hover:-translate-x-1 cursor-pointer"
          >
            <IconArrowLeft size={14} /> Back to Calculator
          </button>
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight">Cost Estimate Summary</h2>
              <p className="text-blue-100/90 text-sm font-medium mt-1 flex items-center gap-1.5">
                <IconMapPin size={15} className="text-cyan-400" />
                Project: {areaSize} {unit} in {city} <span className="text-blue-200 bg-white/10 px-2.5 py-0.5 rounded-full text-xs font-bold ml-2">({result.sqft.toLocaleString()} sq. ft.)</span>
              </p>
            </div>
            <IconCalculator size={44} className="opacity-20 hidden md:block" />
          </div>
        </div>

        {/* Floating Total Cost Card */}
        <div className="px-8 md:px-10 -mt-8 relative z-20">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <p className="text-slate-400 text-xs font-extrabold uppercase tracking-widest">Total Estimated Budget</p>
              <h3 className="text-3xl md:text-4xl font-extrabold text-blue-600 tracking-tight mt-1">
                {formatMoney(result.total)}
              </h3>
            </div>
            
            <div className="w-full sm:w-48 space-y-1.5 text-left">
              <div className="flex justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <span>Grey: {greyPercent}%</span>
                <span>Finish: {finishPercent}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden flex">
                <div style={{ width: `${greyPercent}%` }} className="bg-blue-600 h-full rounded-l-full"></div>
                <div style={{ width: `${finishPercent}%` }} className="bg-emerald-500 h-full rounded-r-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Cards Grid */}
        <div className="p-8 md:p-10 space-y-8">
          <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4 border-b border-slate-100 pb-3">
            <h3 className="text-lg font-extrabold text-slate-900 text-left">Material Breakdown</h3>
            <button 
              onClick={() => setActiveView('details')}
              className="text-sm font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
              <IconChartBar size={16} />
              View Detailed Analytics
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            {/* Material Card 1: Structure */}
            <div className="bg-blue-50/20 rounded-2xl p-6 border border-blue-50/50 flex flex-col justify-between">
              <div>
                <h4 className="font-extrabold text-blue-900 text-base mb-4 flex items-center gap-2 border-b border-blue-100/50 pb-2">
                  <IconBuildingSkyscraper size={18} className="text-blue-500" />
                  <span>Grey Structure Materials</span>
                </h4>
                <div className="space-y-4">
                  <ResultRow label="Bricks (Awwal)" qty={result.bricks.qty} unit="Nos" cost={result.bricks.cost} />
                  <ResultRow label="Cement (OPC)" qty={result.cement.qty} unit="Bags" cost={result.cement.cost} />
                  <ResultRow label="Sand (Ravi)" qty={result.sand.qty} unit="cft" cost={result.sand.cost} />
                  <ResultRow label="Crush (Bajri)" qty={result.crush.qty} unit="cft" cost={result.crush.cost} />
                  <ResultRow label="Steel (60 Grade)" qty={result.steel.qty} unit="kg" cost={result.steel.cost} />
                </div>
              </div>
            </div>

            {/* Material Card 2: Services & Finishing */}
            <div className="bg-slate-50/30 rounded-2xl p-6 border border-slate-100 flex flex-col justify-between">
              <div>
                <h4 className="font-extrabold text-slate-800 text-base mb-4 flex items-center gap-2 border-b border-slate-100 pb-2">
                  <IconCategory size={18} className="text-slate-500" />
                  <span>Labor & Finishing</span>
                </h4>
                <div className="space-y-4">
                  <ResultRowSimple label="Labor Cost" cost={result.labor.cost} />
                  <ResultRowSimple label="Tiles, Paint, Wood & Plumbing" cost={result.finishing.cost} />
                </div>
              </div>
              
              <div className="mt-8 bg-blue-50/50 rounded-xl p-3.5 flex items-center gap-2 border border-blue-100/30">
                 <IconAlertCircle size={16} className="text-blue-600 shrink-0" />
                 <p className="text-blue-900 text-[11px] font-semibold leading-relaxed text-left">
                   Prices are estimated based on active 2026 local market rates in Pakistan.
                 </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- 6. VIEW: INPUT STATE (Sleek Light Theme) ───
  return (
    <div className="bg-white rounded-3xl shadow-xl shadow-slate-100/80 p-8 sm:p-10 border border-slate-100 mb-20 max-w-4xl mx-auto text-left">
      <div className="mb-8 space-y-1">
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Construction Cost Estimator</h2>
        <p className="text-slate-500 text-xs md:text-sm font-semibold">Calculate real-time grey structure and finishing costs based on 2026 market rates in Pakistan.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-end">
        {/* City Selection */}
        <div className="md:col-span-3">
          <label className="block text-[11px] font-extrabold text-slate-500 uppercase tracking-widest mb-2 pl-1">City</label>
          <div className="relative">
            <select 
              className="block w-full text-slate-800 font-bold bg-slate-50 hover:bg-slate-100/60 border border-slate-100 hover:border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none py-3 pl-4 pr-10 appearance-none transition-all cursor-pointer font-medium text-sm"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            >
              <option value="Faisalabad">Faisalabad</option>
              <option value="Lahore">Lahore</option>
              <option value="Karachi">Karachi</option>
              <option value="Islamabad">Islamabad</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
              <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
            </div>
          </div>
        </div>

        {/* Area Size Input */}
        <div className="md:col-span-4">
          <label className="block text-[11px] font-extrabold text-slate-500 uppercase tracking-widest mb-2 pl-1">Area Size</label>
          <input 
            type="number" 
            placeholder="e.g. 5 or 10" 
            className="block w-full bg-slate-50 hover:bg-slate-100/30 border border-slate-100 hover:border-slate-200 rounded-xl py-3 px-4 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder-slate-400 font-bold text-slate-800 text-sm"
            value={areaSize}
            onChange={(e) => setAreaSize(e.target.value)}
          />
        </div>

        {/* Unit Selection */}
        <div className="md:col-span-2">
          <label className="block text-[11px] font-extrabold text-slate-500 uppercase tracking-widest mb-2 pl-1">Unit</label>
          <div className="relative">
            <select 
              className="block w-full text-slate-800 font-bold bg-slate-50 hover:bg-slate-100/60 border border-slate-100 hover:border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none py-3 pl-4 pr-10 appearance-none transition-all cursor-pointer text-sm"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
            >
              <option value="Marla">Marla</option>
              <option value="Kanal">Kanal</option>
              <option value="Sq. Ft.">Sq. Ft.</option>
              <option value="Sq. Yds.">Sq. Yds.</option>
            </select>
             <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
              <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
            </div>
          </div>
        </div>

        {/* Calculate Button */}
        <div className="md:col-span-3">
          <button 
            onClick={calculateCost}
            className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 text-white font-extrabold py-3 px-6 rounded-xl shadow-lg shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer text-sm h-11.5 flex items-center justify-center"
          >
            Calculate Cost
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Helper Components for Clean Code ──
const ResultRow = ({ label, qty, unit, cost }) => (
  <div className="flex justify-between items-center text-sm py-2 border-b border-slate-100/80 last:border-0 last:pb-0">
    <span className="text-slate-500 font-semibold">{label}</span>
    <div className="text-right">
      <span className="block font-extrabold text-slate-900">Rs. {cost.toLocaleString()}</span>
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{qty.toLocaleString()} {unit}</span>
    </div>
  </div>
);

const ResultRowSimple = ({ label, cost }) => (
  <div className="flex justify-between items-center text-sm py-3 border-b border-slate-100/80 last:border-0 last:pb-0">
    <span className="text-slate-500 font-semibold">{label}</span>
    <span className="font-extrabold text-slate-900">Rs. {cost.toLocaleString()}</span>
  </div>
);

const FormulaRow = ({ material, formula }) => (
  <div className="flex justify-between items-center text-sm py-2 border-b border-slate-200/60 last:border-0 md:border-b-0 md:[&:nth-last-child(-n+2)]:border-b-0 md:[&:not(:nth-last-child(-n+2))]:border-b">
    <span className="text-slate-600 font-bold">{material}</span>
    <span className="font-mono text-xs text-slate-500 bg-slate-200/50 px-2 py-1 rounded">{formula}</span>
  </div>
);

export { SmartCalculator };
export default SmartCalculator;