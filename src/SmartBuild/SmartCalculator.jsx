import React from 'react'

const SmartCalculator = () => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 sm:p-10 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
            
            {/* City Selection */}
            <div className="md:col-span-3">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                City
              </label>
              <select className="block w-full text-green-700 font-medium bg-transparent border-b-2 border-gray-200 focus:border-green-600 focus:outline-none py-2 transition-colors">
                <option>Faisalabad</option>
                <option>Lahore</option>
                <option>Karachi</option>
                <option>Islamabad</option>
              </select>
            </div>

            {/* Area Size Input */}
            <div className="md:col-span-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Area Size
              </label>
              <input 
                type="number" 
                placeholder="Enter Area Size" 
                className="block w-full bg-gray-50 border border-gray-300 rounded-md py-2.5 px-4 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            {/* Unit Selection */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Unit
              </label>
              <select className="block w-full bg-gray-50 border border-gray-300 rounded-md py-2.5 px-3 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none">
                <option>Marla</option>
                <option>Kanal</option>
                <option>Sq. Ft.</option>
                <option>Sq. Yds.</option>
              </select>
            </div>

            {/* Calculate Button */}
            <div className="md:col-span-3 flex flex-col items-center md:items-end">
              <button className="w-full bg-green-800 hover:bg-green-900 text-white font-semibold py-3 px-6 rounded-md shadow transition-colors duration-200">
                Calculate Cost
              </button>
              <button className="text-xs text-gray-500 mt-2 hover:text-green-700 flex items-center gap-1">
                More Options 
                <span className="text-[10px]">▼</span>
              </button>
            </div>

          </div>
        </div>
  )
}

export default SmartCalculator
