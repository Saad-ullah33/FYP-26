import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from "../../utils/api";
import { TrendingUp, BarChart3, Info } from 'lucide-react';

export default function PropertyTrendChart({ propertyId }) {
    const [trendData, setTrendData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [analyticsSummary, setAnalyticsSummary] = useState(null);

    useEffect(() => {
        async function fetchTrends() {
            try {
                setLoading(true);
                const res = await api.get(`/predictions/historical-trends/${propertyId}`);
                
                // Expects backend signature return structure mapping: List<Map<String, Object>>
                const timeline = res.data.timeline || [];
                setTrendData(timeline);
                
                // Generate deep quantitative metrics for professional investment audit
                if (timeline.length > 1) {
                    const baselinePrice = timeline[0].price;
                    const peakPrice = timeline[timeline.length - 1].price;
                    const compoundGrowth = ((peakPrice - baselinePrice) / baselinePrice) * 100;
                    
                    setAnalyticsSummary({
                        cagrSpread: compoundGrowth.toFixed(2),
                        netAppreciation: peakPrice - baselinePrice,
                        marketVolatility: "Low-Risk Asset Profile"
                    });
                }
            } catch (err) {
                console.error("Critical System Warning: Failed to parse historical valuation array mapping logs.", err);
            } finally {
                setLoading(false);
            }
        }
        if (propertyId) fetchTrends();
    }, [propertyId]);

    // Professional currency parser supporting both Lakhs and Crores based on property pricing brackets
    const formatToPakistaniTerms = (price) => {
        if (!price) return "N/A";
        const num = parseFloat(price);
        if (isNaN(num)) return price;
        
        if (num >= 10000000) {
            return `${(num / 10000000).toFixed(2)} Crore`;
        } else if (num >= 100000) {
            return `${(num / 100000).toFixed(2)} Lakh`;
        }
        return num.toLocaleString();
    };

    if (loading) return (
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 h-80 flex items-center justify-center">
            <div className="text-center space-y-2">
                <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-xs font-mono text-slate-500 uppercase tracking-widest">Compiling historical asset registry arrays...</p>
            </div>
        </div>
    );

    return (
        <div className="bg-slate-950 p-6 border border-slate-800 rounded-3xl shadow-xl space-y-6">
            
            {/* Professional Analytics Header Section */}
            <div className="flex flex-wrap justify-between items-start gap-4">
                <div>
                    <span className="bg-indigo-500/10 text-indigo-400 text-[10px] font-bold px-2.5 py-1 rounded-md border border-indigo-500/20 uppercase tracking-wider font-mono">
                        Valuation Audit Engine
                    </span>
                    <h3 className="text-base font-extrabold text-slate-200 mt-2 tracking-tight">Long-Term Capital Appreciation Trajectory</h3>
                </div>
                
                {analyticsSummary && (
                    <div className="flex gap-4 border-l border-slate-800 pl-4 font-mono">
                        <div>
                            <span className="text-slate-500 text-[9px] block uppercase font-bold tracking-wide">Historical Spread Gain</span>
                            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 mt-0.5">
                                <TrendingUp size={12} /> +{analyticsSummary.cagrSpread}%
                            </span>
                        </div>
                        <div>
                            <span className="text-slate-500 text-[9px] block uppercase font-bold tracking-wide">Net Equity Growth</span>
                            <span className="text-xs font-bold text-slate-300 block mt-0.5">
                                PKR {formatToPakistaniTerms(analyticsSummary.netAppreciation)}
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {/* Recharts Area Data Display Window */}
            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="professionalAppreciationGlow" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25}/>
                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.6} />
                        <XAxis 
                            dataKey="year" // Changed parameter reference from 'month' to 'year' metrics targeting corporate fiscal spans
                            stroke="#64748b" 
                            style={{ fontSize: '10px', fontFamily: 'monospace', fontWeight: 'bold' }} 
                            tickLine={false}
                        />
                        <YAxis 
                            stroke="#64748b" 
                            style={{ fontSize: '10px', fontFamily: 'monospace' }} 
                            tickFormatter={(v) => v >= 10000000 ? `${(v / 10000000).toFixed(1)}C` : `${(v / 100000).toFixed(0)}L`}
                            tickLine={false}
                        />
                        <Tooltip 
                            cursor={{ stroke: '#475569', strokeWidth: 1 }}
                            contentStyle={{ 
                                backgroundColor: '#020617', 
                                borderColor: '#334155', 
                                borderRadius: '12px', 
                                color: '#fff', 
                                fontFamily: 'monospace', 
                                fontSize: '12px' 
                            }} 
                            formatter={(value) => [`PKR ${formatToPakistaniTerms(value)} (${value.toLocaleString()})`, 'Evaluated Equity']}
                        />
                        <Area 
                            type="monotone" 
                            dataKey="price" 
                            stroke="#6366f1" 
                            strokeWidth={2.5} 
                            fillOpacity={1} 
                            fill="url(#professionalAppreciationGlow)"
                            dot={{ fill: '#020617', stroke: '#6366f1', strokeWidth: 2, r: 4 }} 
                            activeDot={{ fill: '#6366f1', r: 6 }} 
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* Professional Legal & Technical Footer Metadata */}
            <div className="bg-slate-900/40 border border-slate-800/80 p-3.5 rounded-2xl flex items-start gap-2.5 text-[11px] text-slate-400 font-sans leading-relaxed">
                <Info size={16} className="shrink-0 text-indigo-400 mt-0.5" />
                <div>
                    <span className="font-bold text-slate-300 block mb-0.5 font-mono text-[10px] uppercase tracking-wider">System Auditing Note</span>
                    Historical calculations represent aggregate trade indices tracked over consecutive **Fiscal Horizons**. Real estate valuations fluctuate based on localized municipal updates, structural infrastructure adjustments, and State Bank policy rates.
                </div>
            </div>

        </div>
    );
}