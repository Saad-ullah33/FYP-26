import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconCalculator } from '@tabler/icons-react';

const SmartCalculator = () => {
  const navigate = useNavigate();

  const [city, setCity] = useState('Lahore');
  const [areaSize, setAreaSize] = useState('');
  const [unit, setUnit] = useState('Marla');

  // Pakistani Market Rates (2025-26 Estimates)
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
    else if (unit === 'Sq. Ft.') sqft = size;
    else if (unit === 'Sq. Yds.') sqft = size * 9;

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

    const payload = {
      sqft: Math.round(sqft),
      bricks: { qty: Math.round(bricksQty), cost: Math.round(costBricks) },
      cement: { qty: Math.round(cementQty), cost: Math.round(costCement) },
      sand: { qty: Math.round(sandQty), cost: Math.round(costSand) },
      crush: { qty: Math.round(crushQty), cost: Math.round(costCrush) },
      steel: { qty: Math.round(steelQty), cost: Math.round(costSteel) },
      labor: { cost: Math.round(costLabor) },
      finishing: { cost: Math.round(costTiles + costPaint + costPlumbingElectric) },
      total: Math.round(totalCost),
      inputs: { city, areaSize, unit }
    };

    // Navigate to the dedicated results page, passing the results payload
    navigate('/smart-build/calculator-result', { state: payload });
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl shadow-slate-100/80 p-8 sm:p-10 border border-slate-100 mb-20 max-w-4xl mx-auto text-left">
      
      {/* Intro Header */}
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
              className="block w-full text-slate-800 font-bold bg-slate-50 hover:bg-slate-100/60 border border-slate-100 hover:border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none py-3 pl-4 pr-10 appearance-none transition-all cursor-pointer text-sm"
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
            <IconCalculator size={18} className="mr-1.5" />
            Calculate Cost
          </button>
        </div>

      </div>
    </div>
  );
};

export { SmartCalculator };
export default SmartCalculator;