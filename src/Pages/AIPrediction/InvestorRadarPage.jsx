import React from 'react';
import UndervaluedDealsGrid from './UndervaluedDealsGrid';

export default function InvestorRadarPage() {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
      {/* Renders the analytics table and handling logic seamlessly */}
      <UndervaluedDealsGrid />
    </div>
  );
}