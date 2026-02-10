import React, { useState } from 'react';

const SmartCalculator = () => {
  // --- 1. State Variables ---
  const [showResult, setShowResult] = useState(false);
  
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

    // Handle Marla conversion
    let marlaSizeInSqft = 225; // Default (Lahore)
    if (city === 'Islamabad' || city === 'Faisalabad') {
      marlaSizeInSqft = 272;
    }

    if (unit === 'Marla') sqft = size * marlaSizeInSqft;
    else if (unit === 'Kanal') sqft = size * 20 * marlaSizeInSqft;
    else if (unit === 'Sq. Yds.') sqft = size * 9;
    else sqft = size; 

    // Calculate Quantities
    const bricksQty = sqft * 8.5;
    const cementQty = sqft * 0.6;
    const sandQty = sqft * 3.5;
    const crushQty = sqft * 1.8;
    const steelQty = sqft * 4.5;

    // Calculate Costs
    const costBricks = bricksQty * RATES.brickPrice;
    const costCement = cementQty * RATES.cementPrice;
    const costSand = sandQty * RATES.sandPrice;
    const costCrush = crushQty * RATES.crushPrice;
    const costSteel = steelQty * RATES.steelPrice;
    const costLabor = sqft * RATES.laborRate;
    
    // Finishing (Estimated)
    const costTiles = sqft * RATES.tileRate; 
    const costPaint = sqft * RATES.paintRate;
    const greyCost = costBricks + costCement + costSand + costCrush + costSteel + costLabor;
    const costPlumbingElectric = greyCost * 0.15; // 15% of grey structure

    const totalCost = greyCost + costTiles + costPaint + costPlumbingElectric;

    setResult({
      sqft: Math.round(sqft),
      bricks: { qty: Math.round(bricksQty), cost: Math.round(costBricks) },
      cement: { qty: Math.round(cementQty), cost: Math.round(costCement) },
      sand: { qty: Math.round(sandQty), cost: Math.round(costSand) },
      crush: { qty: Math.round(crushQty), cost: Math.round(costCrush) },
      steel: { qty: Math.round(steelQty), cost: Math.round(costSteel) },
      labor: { cost: Math.round(costLabor) },
      finishing: { cost: Math.round(costTiles + costPaint + costPlumbingElectric) },
      total: Math.round(totalCost)
    });

    setShowResult(true);
  };

  const formatMoney = (amount) => "Rs. " + amount.toLocaleString();

  // --- 4. VIEW: Result Page (Blue Theme) ---
  if (showResult) {
    return (
      <div className="bg-white rounded-2xl shadow-xl border border-blue-100 overflow-hidden mb-20">
        
        {/* Header Section */}
        <div className="bg-blue-600 p-8 text-white">
          <button 
            onClick={() => setShowResult(false)}
            className="text-blue-100 hover:text-white text-sm font-medium mb-4 flex items-center gap-1 transition-colors"
          >
            ← Back to Calculator
          </button>
          <h2 className="text-3xl font-bold">Cost Estimate</h2>
          <p className="text-blue-100 opacity-90 mt-1">
            Project: {areaSize} {unit} in {city} <span className="text-blue-200 text-sm ml-2">({result.sqft} sq. ft.)</span>
          </p>
        </div>

        {/* Total Cost Card */}
        <div className="p-8 -mt-6">
          <div className="bg-white rounded-xl shadow-lg border border-blue-50 p-6 flex justify-between items-center relative z-10">
            <div>
              <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider">Total Estimated Cost</p>
              <h3 className="text-4xl font-extrabold text-blue-900 mt-1">{formatMoney(result.total)}</h3>
            </div>
            {/* <div className="hidden sm:block h-12 w-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-xl">
              
            </div> */}
          </div>
        </div>

        {/* Detailed Cards Grid */}
        <div className="px-8 pb-8">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Material Breakdown</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Material Card 1: Structure */}
            <div className="bg-blue-50/50 rounded-xl p-5 border border-blue-100">
              <h4 className="font-bold text-blue-800 mb-3 border-b border-blue-200 pb-2">Grey Structure Materials</h4>
              <div className="space-y-3">
                <ResultRow label="Bricks (Awwal)" qty={result.bricks.qty} unit="Nos" cost={result.bricks.cost} />
                <ResultRow label="Cement (OPC)" qty={result.cement.qty} unit="Bags" cost={result.cement.cost} />
                <ResultRow label="Sand (Ravi)" qty={result.sand.qty} unit="cft" cost={result.sand.cost} />
                <ResultRow label="Crush (Bajri)" qty={result.crush.qty} unit="cft" cost={result.crush.cost} />
                <ResultRow label="Steel (60 Grade)" qty={result.steel.qty} unit="kg" cost={result.steel.cost} />
              </div>
            </div>

            {/* Material Card 2: Services & Finishing */}
            <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
              <h4 className="font-bold text-gray-700 mb-3 border-b border-gray-200 pb-2">Labor & Finishing</h4>
              <div className="space-y-3">
                <ResultRowSimple label="Labor Cost" cost={result.labor.cost} />
                <ResultRowSimple label="Tiles, Paint, Wood" cost={result.finishing.cost} />
              </div>
              
              <div className="mt-6 bg-blue-100 rounded-lg p-3 text-center">
                 <p className="text-blue-800 text-xs font-medium">
                   *Prices based on 2025 Market Rates. 
                 </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- 5. VIEW: Input Page (Blue Theme) ---
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-10 border border-blue-50 mb-20">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
        
        {/* City Selection */}
        <div className="md:col-span-3">
          <label className="block text-sm font-bold text-gray-700 mb-2">City</label>
          <div className="relative">
            <select 
              className="block w-full text-blue-900 font-semibold bg-blue-50/50 border border-blue-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none py-3 px-4 appearance-none transition-all cursor-pointer hover:bg-blue-50"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            >
              <option value="Faisalabad">Faisalabad</option>
              <option value="Lahore">Lahore</option>
              <option value="Karachi">Karachi</option>
              <option value="Islamabad">Islamabad</option>
            </select>
            {/* Custom Arrow */}
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-blue-600">
              <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
            </div>
          </div>
        </div>

        {/* Area Size Input */}
        <div className="md:col-span-4">
          <label className="block text-sm font-bold text-gray-700 mb-2">Area Size</label>
          <input 
            type="number" 
            placeholder="e.g. 5 or 10" 
            className="block w-full bg-white border border-gray-300 rounded-lg py-3 px-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder-gray-400 font-medium"
            value={areaSize}
            onChange={(e) => setAreaSize(e.target.value)}
          />
        </div>

        {/* Unit Selection */}
        <div className="md:col-span-2">
          <label className="block text-sm font-bold text-gray-700 mb-2">Unit</label>
          <div className="relative">
            <select 
              className="block w-full bg-white border border-gray-300 rounded-lg py-3 px-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none cursor-pointer"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
            >
              <option value="Marla">Marla</option>
              <option value="Kanal">Kanal</option>
              <option value="Sq. Ft.">Sq. Ft.</option>
              <option value="Sq. Yds.">Sq. Yds.</option>
            </select>
             <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
              <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
            </div>
          </div>
        </div>

        {/* Calculate Button */}
        <div className="md:col-span-3">
          <button 
            onClick={calculateCost}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transform active:scale-95 transition-all duration-200"
          >
            Calculate Cost
          </button>
        </div>

      </div>
    </div>
  );
}

// --- Helper Components for Clean Table Rows ---
const ResultRow = ({ label, qty, unit, cost }) => (
  <div className="flex justify-between items-center text-sm">
    <span className="text-gray-600 font-medium">{label}</span>
    <div className="text-right">
      <span className="block font-bold text-gray-800">Rs. {cost.toLocaleString()}</span>
      <span className="text-xs text-gray-400">{qty} {unit}</span>
    </div>
  </div>
);

const ResultRowSimple = ({ label, cost }) => (
  <div className="flex justify-between items-center text-sm py-1">
    <span className="text-gray-600 font-medium">{label}</span>
    <span className="font-bold text-gray-800">Rs. {cost.toLocaleString()}</span>
  </div>
);

export default SmartCalculator;