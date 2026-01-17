import React from 'react'
import { PartnersInFaisalabad } from '../Data/Data'
import Marquee from 'react-fast-marquee'

export const Partners = () => {
  return (
   
    <div className='mt-20 pb-5'>
        <div className='text-4xl font-semibold text-center mb-8 text-mine-shaft-100'> Our <span className='text-bright-sun-400'>Trusted</span> Patners</div>
        <Marquee pauseOnHover={true}>
            {PartnersInFaisalabad.map((company, index) => (
  <div
    key={index}
    className="mx-8 px-2 py-1 hover:bg-mine-shaft-900 rounded-xl cursor-pointer"
  >
    <img
      className="h-[15vh]"
      src={`/partner/${company}.jpg`}             // try .jpg first
      alt={company}
      onError={(e) => {                           // fallback to .png if .jpg fails
        e.currentTarget.onerror = null;          // prevent infinite loop
        e.currentTarget.src = `/partner/${company}.png`;
      }}
    />
  </div>
))}


        </Marquee>
      
    </div>

  )
}
