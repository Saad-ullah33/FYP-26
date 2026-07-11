import React, { useState, useEffect } from 'react';
import { predictionService } from '../../utils/predictionService';

export default function AiValuationCard({ propertyId }) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);
    const [showExplanation, setShowExplanation] = useState(false);

    useEffect(() => {
        async function fetchMetrics() {
            try {
                setLoading(true);
                // Fetch live algorithmic calculation data directly from backend
                const explanationData = await predictionService.getExplanation(propertyId);
                setData(explanationData);
                setError(null);
            } catch (err) {
                setError("Unable to estimate price at the moment. Please try again later.");
            } finally {
                setLoading(false);
            }
        }
        if (propertyId) fetchMetrics();
    }, [propertyId]);

    if (loading) return <div className="animate-pulse bg-slate-900 text-slate-400 p-6 rounded-2xl h-48 flex items-center justify-center border border-slate-800 font-medium text-sm">PropSight AI is calculating market price...</div>;
    if (error) return <div className="bg-red-950/30 border border-red-900 text-red-400 p-4 rounded-xl text-xs">{error}</div>;

    // Helper to format large PKR numbers dynamically into Crore, Lakh, or thousands based on the actual price
    const formatToPakistaniTerms = (price) => {
        if (!price) return "N/A";
        const num = parseFloat(price);
        if (isNaN(num)) return price;
        
        if (num >= 10000000) { // 1 Crore or more
            return `${(num / 10000000).toFixed(2)} Crore`;
        } else if (num >= 100000) { // 1 Lakh to 99 Lakh
            return `${(num / 100000).toFixed(2)} Lakh`;
        }
        return num.toLocaleString(); // Standard formatting for less than 1 Lakh
    };

    // Human-friendly translation of technical database keys for a simple person
    const translateFactorKey = (key) => {
        switch (key.toLowerCase()) {
            case 'size_score': return 'Plot Size & Construction Base';
            case 'location_factor': return 'Area Premium (Faisalabad Sector Weight)';
            case 'type_factor': return 'Property Type Multiplier';
            case 'purpose_factor': return 'Usage Value (Commercial vs Living)';
            case 'auction_factor': return 'Live Bidding / Market Demand';
            default: return key.replace('_', ' ').toUpperCase();
        }
    };

    return (
        <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-2xl relative overflow-hidden">
            {/* Soft background glow */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-600/10 rounded-full blur-2xl pointer-events-none"></div>
            
            <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="bg-blue-500/10 text-blue-400 text-[10px] font-bold px-2.5 py-1 rounded-md border border-blue-500/20 uppercase tracking-wider">
                      PropSight AI Estimated Value
                  </span>
                  <h3 className="text-slate-400 text-xs mt-2">Fair Market Estimate</h3>
                </div>
                <div className="text-right">
                    <span className="text-emerald-400 font-mono text-xs bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded font-bold">
                        {data?.confidence}% Match Certainty
                    </span>
                </div>
            </div>

            <div className="mb-5">
                <span className="text-2xl sm:text-3xl font-black tracking-tight text-blue-400">
                    PKR {formatToPakistaniTerms(data?.predictedPrice)}
                </span>
                <div className="text-slate-400 text-xs mt-1 font-mono">
                    (PKR {data?.predictedPrice?.toLocaleString()})
                </div>
                <div className="text-[11px] text-slate-500 mt-2 border-t border-slate-800/60 pt-2">
                    Expected Negotiation Range: <br />
                    <span className="text-slate-300 font-medium">
                        {formatToPakistaniTerms(data?.priceRangeMin || data?.priceRange?.min)} to {formatToPakistaniTerms(data?.priceRangeMax || data?.priceRange?.max)}
                    </span>
                </div>
            </div>

            <button 
                onClick={() => setShowExplanation(!showExplanation)}
                className="w-full bg-slate-800 hover:bg-slate-750 border border-slate-700 transition text-xs font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 text-slate-200"
            >
                {showExplanation ? 'Hide Price Calculation' : 'See How AI Calculated This'}
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-3 w-3 transform transition-transform ${showExplanation ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>

            {showExplanation && (
                <div className="mt-4 pt-4 border-t border-slate-800 space-y-3 animate-fadeIn">
                    <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Faisalabad Market Price Drivers</h4>
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                        {data?.pricingFactors && Object.entries(data.pricingFactors).map(([key, value]) => (
                            <div key={key} className="bg-slate-950 p-2.5 rounded-lg border border-slate-900 text-xs flex justify-between items-center gap-4">
                                <div className="text-slate-400 text-[11px] leading-relaxed">
                                    <span className="text-blue-400 font-bold block text-[11px] mb-0.5">
                                        {translateFactorKey(key)}
                                    </span>
                                    Impact weight applied by system
                                </div>
                                <div className="text-right shrink-0 font-mono text-xs font-semibold text-slate-200">
                                    +{formatToPakistaniTerms(value)}
                                </div>
                            </div>
                        ))}
                    </div>
                    {data?.notes && (
                        <p className="text-[11px] text-slate-500 italic bg-slate-950 p-2.5 rounded border border-slate-900 leading-normal">
                            {data.notes}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}