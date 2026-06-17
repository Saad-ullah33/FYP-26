import React, { useState } from 'react';
import { Carousel } from '@mantine/carousel';
import '@mantine/carousel/styles.css';
import { 
  IconArrowLeft, 
  IconMapPin, 
  IconChartBar, 
  IconBuildingSkyscraper,
  IconFlame,
  IconArrowRight
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
    breakdown: { Structure: 12000000, Finishing: 10000000, Solar: 1500000, Misc: 1500000 }
  },
  {
    id: 4,
    name: "3 Marla Economy",
    area: "3 Marla",
    city: "Multan",
    price: 1800000,
    breakdown: { Bricks: 800000, Cement: 400000, Labor: 400000, Steel: 200000 }
  }
];

// Reusable color palette for the dynamic graphs
const GRAPH_COLORS = ['bg-orange-500', 'bg-blue-500', 'bg-emerald-500', 'bg-purple-500', 'bg-yellow-500'];

const PopularCal = () => {
  const [selected, setSelected] = useState(null);

  const formatMoney = (amount) => "Rs. " + amount.toLocaleString();

  // --- VIEW 1: Detail Page (Holographic Blue Theme + Animated Graphs) ---
  if (selected) {
    // Dynamically calculate percentages and assign colors
    const chartData = Object.entries(selected.breakdown).map(([label, cost], index) => {
      const percent = Math.max(1, Math.round((cost / selected.price) * 100));
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

          {/* Floating Total Cost Card */}
          <div className="px-8 md:px-10 -mt-8 relative z-20">
            <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div>
                <p className="text-slate-400 text-xs font-extrabold uppercase tracking-widest">Total Estimated Budget</p>
                <h3 className="text-3xl md:text-4xl font-extrabold text-blue-600 tracking-tight mt-1">
                  {formatMoney(selected.price)}
                </h3>
              </div>
            </div>
          </div>

          {/* Animated Breakdown Section */}
          <div className="p-8 md:p-10 space-y-8">
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
                     <span className="text-slate-500 font-bold uppercase text-xs tracking-wider">Total</span>
                     <span className="font-extrabold text-blue-600 text-lg">{formatMoney(selected.price)}</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
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
        {Cals.map((item, index) => (
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
                     {(item.price / 100000).toFixed(1)} <span className="text-base text-slate-500 font-bold">Lakh</span>
                   </div>
                   <button className="w-full bg-slate-50 group-hover:bg-blue-600 text-slate-600 group-hover:text-white py-3 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2">
                     View Breakdown <IconArrowRight size={16} />
                   </button>
                </div>

              </div>
            </div>
          </Carousel.Slide>
        ))}
      </Carousel>
    </div>
  );
}

export default PopularCal;