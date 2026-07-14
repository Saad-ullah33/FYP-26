import React, { useState, useEffect } from 'react';
import { Carousel } from '@mantine/carousel';
import '@mantine/carousel/styles.css';
import { geminiService } from '../services/geminiService';
import { 
  IconArrowLeft, 
  IconMapPin, 
  IconChartBar, 
  IconBuildingSkyscraper,
  IconFlame,
  IconArrowRight,
  IconSparkles
} from '@tabler/icons-react';

// --- Mock Data ---
const Cals = [
  {
    id: 1,
    name: "5 Marla Grey Structure",
    area: "5 Marla",
    city: "Faisalabad",
    price: 3850000,
    breakdown: { Material: 2500000, Labor: 900000, Electric: 150000, Plumbing: 300000 }
  },
  {
    id: 2,
    name: "10 Marla Finishing",
    area: "10 Marla",
    city: "Lahore",
    price: 4200000,
    breakdown: { Tiles: 1500000, Paint: 500000, Wood: 1200000, Kitchen: 1000000 }
  },
  {
    id: 3,
    name: "1 Kanal Full House",
    area: "1 Kanal",
    city: "Islamabad",
    price: 25000000,
    breakdown: { Structure: 12000000, Finishing: 10000000, Solar: 1500000, Misc: 1500005 }
  },
  {
    id: 4,
    name: "3 Marla Economy",
    area: "3 Marla",
    city: "Lahore",
    price: 1800000,
    breakdown: { Bricks: 800000, Cement: 400000, Labor: 400000, Steel: 200000 }
  }
];

// Reusable color palette for the dynamic graphs
const GRAPH_COLORS = ['bg-orange-500', 'bg-blue-500', 'bg-emerald-500', 'bg-purple-500', 'bg-yellow-500'];

// Baseline rates to estimate popular card costs instantly on load
const BASELINE_RATES = {
  brickPrice: 21,
  cementPrice: 1540,
  sandPrice: 95,
  crushPrice: 190,
  steelPrice: 280,
  laborRate: 600,
  tileRate: 260,
  paintRate: 130
};

const calculateCardPrice = (item) => {
  let sizeNum = parseFloat(item.area); // e.g. 5 or 10 or 1
  let isKanal = item.area.toLowerCase().includes("kanal");
  let marlaSize = (item.city === "Islamabad" || item.city === "Faisalabad") ? 272 : 225;
  let sqft = sizeNum * (isKanal ? 20 : 1) * marlaSize;

  if (item.name.toLowerCase().includes("grey")) {
    const bQty = sqft * 8.5;
    const cQty = sqft * 0.6;
    const sQty = sqft * 3.5;
    const crQty = sqft * 1.8;
    const stQty = sqft * 4.5;

    const cBricks = bQty * BASELINE_RATES.brickPrice;
    const cCement = cQty * BASELINE_RATES.cementPrice;
    const cSand = sQty * BASELINE_RATES.sandPrice;
    const cCrush = crQty * BASELINE_RATES.crushPrice;
    const cSteel = stQty * BASELINE_RATES.steelPrice;
    const cLabor = sqft * BASELINE_RATES.laborRate;

    const greyBase = cBricks + cCement + cSand + cCrush + cSteel + cLabor;
    const cElectric = greyBase * 0.07;
    const cPlumbing = greyBase * 0.08;

    return greyBase + cElectric + cPlumbing;

  } else if (item.name.toLowerCase().includes("finishing")) {
    const cTiles = sqft * BASELINE_RATES.tileRate;
    const cPaint = sqft * BASELINE_RATES.paintRate;
    const cWood = sqft * 350;
    const cKitchen = sqft * 250;

    return cTiles + cPaint + cWood + cKitchen;

  } else {
    // Full House (Grey + Finishing)
    const bQty = sqft * 8.5;
    const cQty = sqft * 0.6;
    const sQty = sqft * 3.5;
    const crQty = sqft * 1.8;
    const stQty = sqft * 4.5;

    const cBricks = bQty * BASELINE_RATES.brickPrice;
    const cCement = cQty * BASELINE_RATES.cementPrice;
    const cSand = sQty * BASELINE_RATES.sandPrice;
    const cCrush = crQty * BASELINE_RATES.crushPrice;
    const cSteel = stQty * BASELINE_RATES.steelPrice;
    const cLabor = sqft * BASELINE_RATES.laborRate;

    const cTiles = sqft * BASELINE_RATES.tileRate;
    const cPaint = sqft * BASELINE_RATES.paintRate;
    const cWoodKitchen = sqft * 600;

    const greyBase = cBricks + cCement + cSand + cCrush + cSteel + cLabor;
    const cPlumbingElectric = greyBase * 0.15;

    return greyBase + cTiles + cPaint + cWoodKitchen + cPlumbingElectric;
  }
};

const PopularCal = () => {
  const [selected, setSelected] = useState(null);
  const [loadingRates, setLoadingRates] = useState(false);
  const [rates, setRates] = useState(null);
  const [groundingSources, setGroundingSources] = useState(null);

  const formatMoney = (amount) => "Rs. " + amount.toLocaleString();

  useEffect(() => {
    if (!selected) {
      setRates(null);
      setGroundingSources(null);
      return;
    }

    let active = true;
    const fetchRates = async () => {
      try {
        setLoadingRates(true);
        const data = await geminiService.fetchLiveConstructionRates(selected.city);
        if (active && data) {
          if (data.rates) setRates(data.rates);
          if (data.groundingSources) setGroundingSources(data.groundingSources);
        }
      } catch (err) {
        console.error("Error loading popular rates:", err);
      } finally {
        if (active) setLoadingRates(false);
      }
    };

    fetchRates();
    return () => { active = false; };
  }, [selected]);

  // --- VIEW 1: Detail Page (Holographic Blue Theme + Animated Graphs) ---
  if (selected) {
    // Calculate dynamic pricing based on rates
    let displayPrice = selected.price;
    let displayBreakdown = { ...selected.breakdown };

    if (rates) {
      let sizeNum = parseFloat(selected.area); // e.g. 5 or 10 or 1
      let isKanal = selected.area.toLowerCase().includes("kanal");
      let marlaSize = (selected.city === "Islamabad" || selected.city === "Faisalabad") ? 272 : 225;
      let sqft = sizeNum * (isKanal ? 20 : 1) * marlaSize;

      if (selected.name.toLowerCase().includes("grey")) {
        const bQty = sqft * 8.5;
        const cQty = sqft * 0.6;
        const sQty = sqft * 3.5;
        const crQty = sqft * 1.8;
        const stQty = sqft * 4.5;

        const cBricks = Math.round(bQty * rates.brickPrice);
        const cCement = Math.round(cQty * rates.cementPrice);
        const cSand = Math.round(sQty * rates.sandPrice);
        const cCrush = Math.round(crQty * rates.crushPrice);
        const cSteel = Math.round(stQty * rates.steelPrice);
        const cLabor = Math.round(sqft * rates.laborRate);

        const greyBase = cBricks + cCement + cSand + cCrush + cSteel + cLabor;
        const cElectric = Math.round(greyBase * 0.07);
        const cPlumbing = Math.round(greyBase * 0.08);

        displayBreakdown = {
          "Bricks & Cement": cBricks + cCement,
          "Aggregates (Sand & Crush)": cSand + cCrush,
          "Steel (60 Grade)": cSteel,
          "Structure Labor": cLabor,
          "Electrical & Plumbing": cElectric + cPlumbing
        };
        displayPrice = Object.values(displayBreakdown).reduce((a, b) => a + b, 0);

      } else if (selected.name.toLowerCase().includes("finishing")) {
        const cTiles = Math.round(sqft * rates.tileRate);
        const cPaint = Math.round(sqft * rates.paintRate);
        const cWood = Math.round(sqft * 350);
        const cKitchen = Math.round(sqft * 250);

        displayBreakdown = {
          "Flooring & Tiles": cTiles,
          "Painting & Finish": cPaint,
          "Wood & Metal work": cWood,
          "Kitchen & Bath Fixtures": cKitchen
        };
        displayPrice = Object.values(displayBreakdown).reduce((a, b) => a + b, 0);

      } else {
        // Full House (Grey + Finishing)
        const bQty = sqft * 8.5;
        const cQty = sqft * 0.6;
        const sQty = sqft * 3.5;
        const crQty = sqft * 1.8;
        const stQty = sqft * 4.5;

        const cBricks = Math.round(bQty * rates.brickPrice);
        const cCement = Math.round(cQty * rates.cementPrice);
        const cSand = Math.round(sQty * rates.sandPrice);
        const cCrush = Math.round(crQty * rates.crushPrice);
        const cSteel = Math.round(stQty * rates.steelPrice);
        const cLabor = Math.round(sqft * rates.laborRate);

        const cTiles = Math.round(sqft * rates.tileRate);
        const cPaint = Math.round(sqft * rates.paintRate);
        const cWoodKitchen = Math.round(sqft * 600);

        const greyBase = cBricks + cCement + cSand + cCrush + cSteel + cLabor;
        const cPlumbingElectric = Math.round(greyBase * 0.15);

        displayBreakdown = {
          "Grey Structure (Concrete/Steel)": greyBase,
          "Flooring & Tiling": cTiles,
          "Painting & Finishings": cPaint,
          "Wood & Kitchen Works": cWoodKitchen,
          "Plumbing & Electrical": cPlumbingElectric
        };
        displayPrice = Object.values(displayBreakdown).reduce((a, b) => a + b, 0);
      }
    }

    // Dynamically calculate percentages and assign colors
    const chartData = Object.entries(displayBreakdown).map(([label, cost], index) => {
      const percent = Math.max(1, Math.round((cost / displayPrice) * 100));
      return { 
        label, 
        cost, 
        percent, 
        color: GRAPH_COLORS[index % GRAPH_COLORS.length] 
      };
    }).sort((a, b) => b.cost - a.cost);

    return (
      <div className="w-full max-w-4xl mx-auto mb-20 transition-all duration-300">
        <style>{`
          @keyframes growBar { from { width: 0%; opacity: 0; } to { width: var(--target-width); opacity: 1; } }
          .animate-bar { animation: growBar 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        `}</style>

        <div className="bg-white rounded-3xl shadow-xl shadow-slate-100/80 border border-slate-100 overflow-hidden text-left">
          
          {/* Holographic Header Section */}
          <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-600 p-8 md:p-10 text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "16px 14px" }}></div>
            
            <button 
              onClick={() => setSelected(null)}
              className="relative z-10 text-blue-100 hover:text-white text-xs font-bold uppercase tracking-wider mb-5 flex items-center gap-1.5 transition-all duration-200 hover:-translate-x-1 cursor-pointer"
            >
              <IconArrowLeft size={14} /> Back to Estimates
            </button>
            
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-3xl font-extrabold tracking-tight">{selected.name}</h2>
                <p className="text-blue-100/90 text-sm font-medium mt-1 flex items-center gap-1.5">
                  <IconMapPin size={15} className="text-cyan-400" />
                  {selected.area} Configuration in <span className="text-white font-bold">{selected.city}</span>
                </p>
              </div>
              <IconBuildingSkyscraper size={44} className="opacity-20 hidden md:block" />
            </div>
          </div>

          {loadingRates ? (
            <div className="p-12 text-center flex flex-col items-center justify-center min-h-[300px]">
              <div className="w-12 h-12 rounded-full border-4 border-slate-100 border-t-blue-650 animate-spin mb-4" />
              <p className="text-sm font-bold text-slate-800">Calibrating Real-Time City Indexes...</p>
              <p className="text-[11px] font-bold text-slate-400 mt-1 uppercase tracking-wider">Querying Google Search Grounding for {selected.city}...</p>
            </div>
          ) : (
            <>
              {/* Grounded Sources */}
              {groundingSources && groundingSources.groundingChunks && groundingSources.groundingChunks.length > 0 && (
                <div className="bg-slate-50 border-b border-slate-100 p-6">
                  <div className="flex items-center gap-1.5 mb-2">
                    <IconSparkles size={14} className="text-amber-500 animate-pulse" />
                    <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">Grounded Web Sources</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {groundingSources.groundingChunks.map((chunk, idx) => (
                      <a
                        key={idx}
                        href={chunk.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[10px] font-extrabold text-blue-600 hover:text-blue-700 bg-blue-50/50 px-2 py-1 rounded-md border border-blue-100"
                      >
                        {chunk.title}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Floating Total Cost Card */}
              <div className="px-8 md:px-10 -mt-8 relative z-20">
                <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div>
                    <p className="text-slate-400 text-xs font-extrabold uppercase tracking-widest">Total Estimated Budget</p>
                    <h3 className="text-3xl md:text-4xl font-extrabold text-blue-600 tracking-tight mt-1">
                      {formatMoney(displayPrice)}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Animated Breakdown Section */}
              <div className="p-8 md:p-10 space-y-8 animate-in fade-in duration-300">
                <h3 className="text-lg font-extrabold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                  <IconChartBar size={20} className="text-slate-400" /> Detailed Breakdown
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                  {/* Left Col: The Animated Graph */}
                  <div className="space-y-5">
                    {chartData.map((item, index) => (
                      <div key={index} className="w-full">
                        <div className="flex justify-between text-sm font-bold mb-1.5">
                          <span className="text-slate-700">{item.label}</span>
                          <span className="text-slate-900">
                            {formatMoney(item.cost)} <span className="text-slate-400 text-xs ml-1">({item.percent}%)</span>
                          </span>
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

                  {/* Right Col: Standard Receipt-style breakdown */}
                  <div className="bg-slate-50/50 rounded-2xl p-6 border border-slate-100 h-fit">
                    <div className="space-y-4">
                      {chartData.map((item, index) => (
                        <div key={index} className="flex justify-between items-center text-sm py-2 border-b border-slate-200/60 last:border-0 last:pb-0">
                          <div className="flex items-center gap-2">
                             <div className={`w-2.5 h-2.5 rounded-full ${item.color}`}></div>
                             <span className="text-slate-600 font-bold">{item.label}</span>
                          </div>
                          <span className="font-extrabold text-slate-900">{formatMoney(item.cost)}</span>
                        </div>
                      ))}
                      <div className="pt-4 mt-2 border-t border-slate-200 flex justify-between items-center">
                         <span className="text-slate-550 font-bold uppercase text-xs tracking-wider">Total</span>
                         <span className="font-extrabold text-blue-600 text-lg">{formatMoney(displayPrice)}</span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </>
          )}

        </div>
      </div>
    );
  }

  // --- VIEW 2: Carousel List (Sleek Card Theme) ---
  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-10 mb-10 text-left">
      <div className="flex items-center gap-2 mb-8 px-2">
        <IconFlame size={28} className="text-orange-500" />
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Popular Estimates</h2>
      </div>
      
      <Carousel
        slideSize={{ base: '100%', sm: '50%', md: '33.333333%' }}
        slideGap="md"
        loop
        align="start"
        withControls={false} // Clean look, relying on touch/drag (add back if you want arrows)
      >
        {Cals.map((item, index) => {
          const cardEstPrice = calculateCardPrice(item);
          return (
            <Carousel.Slide key={index}>
              <div className="p-2 h-full">
                <div 
                  onClick={() => setSelected(item)}
                  className="bg-white rounded-3xl shadow-lg shadow-slate-100/80 border border-slate-100 hover:border-blue-200 hover:shadow-blue-500/10 transition-all duration-300 cursor-pointer h-full p-6 md:p-8 flex flex-col justify-between group hover:-translate-y-1"
                >
                  
                  <div>
                    <div className="flex justify-between items-start mb-6">
                       <div className="bg-blue-50 text-blue-600 p-3 rounded-2xl font-extrabold text-lg flex items-center justify-center">
                          <IconBuildingSkyscraper size={24} />
                       </div>
                       <span className="bg-emerald-50 text-emerald-600 text-[10px] font-extrabold px-3 py-1.5 rounded-full uppercase tracking-wider border border-emerald-100">
                          Popular
                       </span>
                    </div>

                    <h3 className="text-xl font-extrabold text-slate-900 mb-2 leading-tight group-hover:text-blue-600 transition-colors">{item.name}</h3>
                    <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 mb-6">
                      <IconMapPin size={16} />
                      {item.area} • {item.city}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-100">
                     <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">Estimated Cost</p>
                     <div className="text-2xl font-extrabold text-slate-900 mb-5">
                       {(cardEstPrice / 100000).toFixed(1)} <span className="text-base text-slate-500 font-bold">Lakh</span>
                     </div>
                     <button className="w-full bg-slate-50 group-hover:bg-blue-600 text-slate-600 group-hover:text-white py-3 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2">
                       View Breakdown <IconArrowRight size={16} />
                     </button>
                  </div>

                </div>
              </div>
            </Carousel.Slide>
          );
        })}
      </Carousel>
    </div>
  );
}

export default PopularCal;