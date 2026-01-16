import React from 'react'

const DreamProp = () => {
  return (
    <div className=''>
        <div>
    <section className="relative w-full h-[80vh]">
      
      {/* Image */}
      <img
        src="/fsd.png"
        alt="Faisalabad"
        className="w-full h-full object-cover"
      />

      {/* Dark overlay to dark the image  */}
      <div className="absolute inset-0 bg-black/30"></div>

      {/* Content on top of image */}
      <div className="absolute inset-0 flex flex-col items-start justify-center text-white px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-center">
          Find Your Dream Property
        </h1>

        <p className="mt-4 text-lg text-center font-semibold max-w-xl">
          Buy, Rent or Sell properties easily
        </p>

        {/* Search field  */}
        <div className="mt-6 flex gap-2 bg-white p-2 rounded-lg">
          <input
            type="text"
            placeholder="Search location..."
            className="px-4 py-2 outline-none text-black"
          />
          <button className="bg-blue-600 px-6 py-2 font-semibold rounded text-black">
            Search
          </button>
        </div>
      </div>

    </section>
       
        </div>
      
    </div>
  )
}

export default DreamProp
