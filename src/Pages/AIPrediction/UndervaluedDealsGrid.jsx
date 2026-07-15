import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ArrowDownRight, MapPin, Building2, TrendingUp, AlertCircle } from 'lucide-react';

export default function UndervaluedDealsGrid() {
    const [deals, setDeals] = useState([]);
    const [selectedSector, setSelectedSector] = useState('');
    const [sectors, setSectors] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch dynamic operational sectors directly from your backend
    useEffect(() => {
        const fetchSectors = async () => {
            try {
                const res = await axios.get('http://localhost:8080/api/predictions/faisalabad-sectors');
                setSectors(res.data || []);
            } catch (err) {
                console.error("Failed to map dynamic location registries.", err);
            }
        };
        fetchSectors();
    }, []);

    // Fetch live arbitrage data filtered by the selected Faisalabad sector location
    const fetchDeals = async () => {
        setLoading(true);
        try {
            // Passes filter down to your @GetMapping("/top-undervalued") backend method
            const url = selectedSector 
                ? `http://localhost:8080/api/predictions/top-undervalued?city=${encodeURIComponent(selectedSector)}` 
                : 'http://localhost:8080/api/predictions/top-undervalued';
            
            const res = await axios.get(url);
            setDeals(res.data.deals || []);
        } catch (err) {
            console.error("Critical System Warning: Failed to parse arbitrage tracking pipeline arrays.", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { 
        fetchDeals(); 
    }, [selectedSector]);

    // Helper to format large PKR numbers dynamically into Crore or Lakh
    const formatToPakistaniTerms = (price) => {
        if (!price) return "N/A";
        const num = parseFloat(price);
        if (isNaN(num)) return price;
        
        if (num >= 10000000) { // 1 Crore or more
            return `${(num / 10000000).toFixed(2)} Crore`;
        } else if (num >= 100000) { // 1 Lakh to 99 Lakh
            return `${(num / 100000).toFixed(2)} Lakh`;
        }
        return num.toLocaleString(); 
    };

    return (
        <div className="text-white space-y-6">
            
            {/* Header Control Panel Layout */}
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-800/80 pb-5">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
                        <h2 className="text-lg font-black tracking-tight text-slate-100">AI Investment Arbitrage Radar</h2>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">Properties selling below fair market value estimated by PropSight localized machine nodes.</p>
                </div>
                
                {/* Dynamically populated location controller menu matching Faisalabad markets */}
                <div className="flex items-center gap-2">
                    <label className="text-[10px] uppercase font-mono tracking-wider text-slate-500 font-bold hidden sm:inline">Location Filter:</label>
                    <select 
                        value={selectedSector} 
                        onChange={(e) => setSelectedSector(e.target.value)}
                        className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-slate-300 focus:outline-none focus:border-indigo-500 min-w-[160px]"
                    >
                        <option value="">All Faisalabad Sectors</option>
                        {sectors.map((sec, i) => (
                            <option key={i} value={sec}>{sec}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Content Display Window */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-pulse">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-48 bg-slate-900/60 border border-slate-800/80 rounded-2xl"></div>
                    ))}
                </div>
            ) : deals.length === 0 ? (
                <div className="border border-dashed border-slate-800 rounded-2xl p-12 text-center text-slate-500 text-sm flex flex-col items-center justify-center gap-3">
                    <Building2 size={36} className="text-slate-600" />
                    <span>No undervalued assets mapped to this specific region signature right now.</span>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {deals.map((deal) => (
                        <div 
                            key={deal.id} 
                            className="bg-slate-950 border border-slate-800/80 hover:border-indigo-500/40 transition-all duration-300 rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between shadow-lg group hover:-translate-y-0.5"
                        >
                            {/* Ambient Glow */}
                            <div className="absolute -top-12 -right-12 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl pointer-events-none group-hover:bg-indigo-500/5 transition-all duration-300"></div>
                            
                            {/* System Spread Indicator */}
                            <div className="flex justify-between items-start mb-4">
                                <div className="space-y-1 max-w-[70%]">
                                    <h4 className="font-bold text-sm text-slate-200 truncate tracking-tight">{deal.title || `Asset Reference #${deal.id}`}</h4>
                                    <p className="text-slate-500 text-[11px] font-mono flex items-center gap-1">
                                        <MapPin size={12} className="text-slate-600 shrink-0" />
                                        <span className="truncate">{deal.location || 'Premium Sub-Sector'}</span>
                                    </p>
                                </div>
                                
                                <span className="bg-emerald-500/10 text-emerald-400 font-mono text-[9px] font-bold px-2 py-1 rounded border border-emerald-500/20 flex items-center gap-0.5 shrink-0 shadow-sm">
                                    <ArrowDownRight size={10} /> Save {formatToPakistaniTerms(deal.discountSpread)}
                                </span>
                            </div>

                            {/* Analytics Data Mappings Row */}
                            <div className="mt-4 pt-3.5 border-t border-slate-900 grid grid-cols-2 gap-3 text-xs">
                                <div className="space-y-0.5">
                                    <span className="text-slate-500 block text-[9px] uppercase font-bold tracking-wider font-mono">Asking Price</span>
                                    <span className="font-mono text-slate-300 font-bold block text-[13px]">
                                        PKR {formatToPakistaniTerms(deal.askingPrice)}
                                    </span>
                                    <span className="text-[9px] text-slate-600 font-mono block">
                                        ({deal.askingPrice?.toLocaleString()})
                                    </span>
                                </div>
                                <div className="space-y-0.5 border-l border-slate-900 pl-3">
                                    <span className="text-indigo-400 block text-[9px] uppercase font-bold tracking-wider font-mono">AI Fair Value</span>
                                    <span className="font-mono text-indigo-300 font-black block text-[13px]">
                                        PKR {formatToPakistaniTerms(deal.predictedPrice)}
                                    </span>
                                    <span className="text-[9px] text-indigo-600/70 font-mono block">
                                        ({deal.predictedPrice?.toLocaleString()})
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}