import React, { useState } from 'react';
import { predictionService } from '../../utils/predictionService';

export default function BatchPredictionTable() {
    const [propertyIdsInput, setPropertyIdsInput] = useState('1, 2, 3');
    const [batchResults, setBatchResults] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleRunBatch = async () => {
        setLoading(true);
        try {
            const ids = propertyIdsInput.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
            const data = await predictionService.getBatchPredictions(ids);
            setBatchResults(data.results);
        } catch (error) {
            alert("Error computing parameters for bulk portfolio indices.");
        } finally {
            setLoading(false);
        }
    };

    // Helper to format large PKR numbers dynamically into Crore, Lakh, or standard thousands
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
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 text-white shadow-xl">
            <h2 className="text-xl font-bold tracking-tight mb-2">Bulk Portfolio AI Evaluator</h2>
            <p className="text-slate-400 text-xs mb-4">Input comma-separated Property Registry IDs to run multi-threaded valuation matrix pipelines (Max 50 items).</p>
            
            <div className="flex gap-3 mb-6">
                <input 
                    type="text" 
                    value={propertyIdsInput} 
                    onChange={(e) => setPropertyIdsInput(e.target.value)}
                    className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-sm font-mono text-indigo-400 focus:outline-none focus:border-indigo-500 flex-1"
                    placeholder="e.g. 101, 102, 105"
                />
                <button 
                    onClick={handleRunBatch}
                    disabled={loading}
                    className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 font-semibold text-xs px-5 py-2.5 rounded-xl transition shadow-md shadow-indigo-600/10"
                >
                    {loading ? 'Evaluating...' : 'Run Pipeline'}
                </button>
            </div>

            {batchResults && (
                <div className="overflow-x-auto border border-slate-800 rounded-xl">
                    <table className="w-full text-left text-xs text-slate-350">
                        <thead className="bg-slate-900 uppercase text-[10px] tracking-wider border-b border-slate-800 text-slate-400 font-bold">
                            <tr>
                                <th className="px-4 py-3.5">Asset Ref ID</th>
                                <th className="px-4 py-3.5">AI Estimated Price</th>
                                <th className="px-4 py-3.5">System Certainty</th>
                                <th className="px-4 py-3.5">Faisalabad Market Profile Analysis</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60 font-medium">
                            {Object.entries(batchResults).map(([id, result]) => (
                                <tr key={id} className="hover:bg-slate-900/40 transition-colors">
                                    <td className="px-4 py-4 text-slate-400 font-mono font-bold">#{id}</td>
                                    <td className="px-4 py-4 text-slate-100">
                                        {result.error ? (
                                            <span className="text-red-400 font-semibold bg-red-500/10 px-2 py-0.5 rounded border border-red-500/10">Failed</span>
                                        ) : (
                                            <div className="flex flex-col">
                                                <span className="text-blue-400 font-bold font-mono text-sm">
                                                    PKR {formatToPakistaniTerms(result.predictedPrice)}
                                                </span>
                                                <span className="text-[10px] text-slate-500 font-mono mt-0.5">
                                                    ({result.predictedPrice?.toLocaleString()})
                                                </span>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-4 py-4 font-mono font-bold">
                                        {result.error ? (
                                            <span className="text-slate-600">-</span>
                                        ) : (
                                            <span className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/10">
                                                {result.confidence}%
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-4 text-slate-400 leading-normal max-w-sm font-sans text-xs">
                                        {result.error ? (
                                            <span className="text-red-400/80 italic">{result.error}</span>
                                        ) : (
                                            result.predictionNotes || "Valuation arrays cross-analyzed successfully."
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}