import React from 'react'

const BuildSmart = () => {
  return (
    <div>
            
      {/* --- HERO SECTION --- */}
      <header className="h-screen flex flex-col items-center justify-center from-slate-900 to-slate-800  px-6 text-center mt-10 ">
        <div className="max-w-3xl space-y-6">
          <h1 className="text-5xl text-blue-500 font-bold ">
            Build Smarter, <br />
            <span className="text-blue-500">Invest Better.</span>
          </h1>
          <p className="text-lg  ">
            Your all-in-one AI suite for Real Estate & Construction. 
            Design maps, estimate costs, and verify documents instantly.
          </p>
          <div className="flex gap-4 justify-center pt-4">
            <button className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-full text-lg font-semibold transition transform hover:-translate-y-1">
              Start Building
            </button>
            <button className="border-2 border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white px-8 py-3 rounded-full text-lg font-semibold transition">
              View Demo
            </button>
          </div>
        </div>
      </header>

     

     
    </div>
  )
}

export default BuildSmart
