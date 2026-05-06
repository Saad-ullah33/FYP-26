import React from 'react';

// Images (Using your original paths)
const boulevardImg = 'FlatPhotos/boulevard.jpg';
const callImg = 'FlatPhotos/call.svg';
const messageImg = 'FlatPhotos/message.svg';
const whatsappImg = 'FlatPhotos/whats.svg'; 

const Flats = () => {
  return (
    <div className='w-full max-w-5xl mx-auto p-4 font-sans'>
      
      {/* Header */}
      <div className='text-2xl font-extrabold text-slate-800 mb-6'>
        484 Projects with Flats in Pakistan
      </div>
      
      {/* Card Container - Fixed height on desktop (h-72) to prevent it from being huge */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-100 flex flex-col md:flex-row overflow-hidden h-auto md:h-72 hover:shadow-xl transition-shadow duration-300">
        
        {/* Left Side: Image (Takes 35% width) */}
        <div className='w-full md:w-[35%] h-48 md:h-full relative'>
          <img 
            className='w-full h-full object-cover' 
            src={boulevardImg} 
            alt="Boulevard Heights" 
          />
        </div>

        {/* Right Side: Content */}
        <div className='flex-1 p-6 flex flex-col justify-between'>
          
          {/* Top Section: Title, Location & Price */}
          <div className='flex justify-between items-start'>
             <div>
               <h3 className='text-xl font-bold text-slate-900'>BOULEVARD HEIGHTS</h3>
               <p className='text-slate-500 text-sm mt-1 flex items-center gap-1'>
                  <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                  DHA Defense, Multan
               </p>
             </div>
             <div className='text-right'>
                <span className='block text-xl font-extrabold text-blue-900'>PKR 53.13 - 91.16 Lakh</span>
             </div>
          </div>

          {/* Middle Section: Description & Details Box */}
          <div className='mt-3'>
             <p className='text-slate-600 text-xs leading-relaxed line-clamp-2 mb-3'>
                Boulevard heights - where DHA Multan's Tranquillity Meets Urban Vibrance. The Skyline of DHA Multan is rapidly changing, shaping modern cultural aspects...
             </p>

             <div className='bg-blue-50/60 border border-blue-100 rounded-lg p-3 inline-block pr-8'>
                <p className='text-xs font-bold text-slate-800 mb-1'>Flats Details</p>
                <div className='flex flex-col sm:flex-row gap-y-1 gap-x-6'>
                  <p className='text-xs text-slate-600 flex items-center gap-1.5'>
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span> 1.63 - 2.79 Marla
                  </p>
                  <p className='text-xs text-slate-600 flex items-center gap-1.5'>
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span> Start: PKR 53.13 Lakh
                  </p>
                </div>
            </div>
          </div>

          {/* Bottom Section: Buttons */}
          <div className='flex gap-3 mt-4'>
              <button className='flex-1 bg-slate-900 hover:bg-slate-800 text-white py-2.5 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-sm'> 
                 <img className="w-4 h-4 invert brightness-0" src={messageImg} alt="" /> Email
              </button>
              
              <button className='flex-1 border border-slate-300 hover:bg-slate-50 text-slate-700 py-2.5 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-colors'>
                  <img className="w-4 h-4" src={callImg} alt="" /> Call
              </button>
              
              <button className='w-12 bg-green-500 hover:bg-green-600 text-white rounded-lg flex items-center justify-center transition-colors shadow-sm'>
                 <img className="w-5 h-5 invert brightness-0" src={whatsappImg} alt="" />
              </button>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Flats;