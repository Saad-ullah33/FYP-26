import React, { useState } from 'react';
import { Carousel } from '@mantine/carousel';
import '@mantine/carousel/styles.css';

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

const PopularCal = () => {
  // Simple State: Just holds the selected item
  const [selected, setSelected] = useState(null);

  // --- VIEW 1: Detail Page (Shows when you click a card) ---
  if (selected) {
    return (
      <div className='w-full max-w-5xl mx-auto px-4 py-6'>
        <button 
          onClick={() => setSelected(null)}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg mb-4"
        >
          ← Back to List
        </button>

        <div className="bg-white rounded-xl shadow-lg border-t-4 border-blue-600 p-8">
          <h2 className="text-3xl font-bold text-slate-800">{selected.name}</h2>
          <p className="text-gray-500 mb-6">{selected.area} in {selected.city}</p>

          <div className="bg-blue-50 p-6 rounded-lg mb-6 text-center">
            <p className="text-sm font-bold text-blue-500 uppercase">Total Estimated Cost</p>
            <p className="text-4xl font-extrabold text-blue-900">Rs. {selected.price.toLocaleString()}</p>
          </div>

          <h3 className="font-bold text-lg mb-3 border-b pb-2">Cost Breakdown</h3>
          <div className="grid grid-cols-2 gap-4">
             {Object.keys(selected.breakdown).map((key) => (
                <div key={key} className="flex justify-between p-3 bg-gray-50 rounded">
                   <span className="font-medium text-gray-600">{key}</span>
                   <span className="font-bold text-gray-800">Rs. {selected.breakdown[key].toLocaleString()}</span>
                </div>
             ))}
          </div>
        </div>
      </div>
    );
  }

  // --- VIEW 2: Carousel List (Default View) ---
  return (
    <div className='w-full max-w-6xl mx-auto px-4 py-10'>
      <div className='text-3xl font-bold text-slate-800 mb-6 px-2'>Popular Estimates</div>
      
      <Carousel
        slideSize={{ base: '100%', sm: '50%', md: '33.333333%' }}
        slideGap="md"
        loop
        align="start"
      >
        {Cals.map((item, index) => (
          <Carousel.Slide key={index}>
            <div 
              className="p-1 h-full"
              onClick={() => setSelected(item)} // Simple click handler
            >
              <div className="bg-white rounded-2xl shadow-md hover:shadow-xl hover:border-blue-300 border border-transparent transition-all cursor-pointer h-full p-6 flex flex-col justify-between">
                
                <div>
                  <div className="flex justify-between items-start mb-4">
                     <div className="bg-blue-100 text-blue-600 p-3 rounded-xl font-bold text-lg">
                        Rs
                     </div>
                     <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full uppercase">
                       Popular
                     </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-800 mb-1">{item.name}</h3>
                  <p className="text-sm text-slate-500 mb-4">{item.area} • {item.city}</p>
                </div>

                <div>
                   <div className="text-2xl font-bold text-blue-900 mb-3">
                     Rs. {(item.price / 100000).toFixed(1)} Lakh
                   </div>
                   <button className="w-full bg-slate-900 text-white py-2 rounded-lg font-semibold text-sm">
                     View Breakdown
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