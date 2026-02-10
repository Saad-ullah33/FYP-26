import React from 'react'
import SmartCalculator from '../SmartBuild/SmartCalculator'
import PopularCal from '../SmartBuild/PopularCal'
import BuilderProfiles from '../SmartBuild/BuilderProfiles'

const Smartbuild = () => {
  return (
    <div className='min-h-screen bg-white '>
      
      {/* Main Container */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-25'>
        
        {/* Header Section */}
        <div className='text-center max-w-3xl mx-auto mt-10'>
          <h1 className='text-4xl font-extrabold text-slate-900 sm:text-5xl tracking-tight mb-4'>
            Smart Build <span className='text-blue-600'>Calculator</span>
          </h1>
          <p className='text-lg text-slate-600 leading-relaxed'>
            Use our Smart Build Calculator to get a quick estimate of required building materials along with their costs.
          </p>
        </div>

        {/* Components Section */}
        <div className='space-y-24'>
          <SmartCalculator/>
          <PopularCal/>
          <BuilderProfiles/>
        </div>

      </div>
    </div>
  )
}

export default Smartbuild