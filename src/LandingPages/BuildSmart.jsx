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

     

      {/* --- BLOGS SECTION --- */}
      <section className=" mx-auto py-20 px-6">
        <h2 className="text-4xl font-bold text-center text-slate-900 mb-12">Latest Insights</h2>     
        <div className="grid grid-cols-3  gap-8">      
            <div  className="bg-blue-500 p-6 rounded-2xl shadow-lg hover:shadow-xl transition hover:-translate-y-2 border border-slate-100">
              <span className="text-sm font-semibold text-white">Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione mollitia rerum, in ullam alias consequuntur? Vitae nesciunt eligendi debitis earum magni dolorum. Sed!</span>           
              <div><button className="text-white font-bold hover:underline">Read Article →</button></div>
            </div>       
        </div>
      </section>
    </div>
  )
}

export default BuildSmart
