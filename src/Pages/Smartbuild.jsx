import React from 'react'
import SmartCalculator from '../SmartBuild/SmartCalculator'
import PopularCal from '../SmartBuild/PopularCal'
import BuilderProfiles from '../SmartBuild/BuilderProfiles'

const Smartbuild = () => {
  return (
    <div className='p-10 px-20'>
        <div className=' justify-center'>
      <div className='flex justify-center text-2xl font-bold mb-3'>Smart Build Calculator</div>
      <span className='flex justify-center mb-[170px]'>Use our Smart Build Calculator to get a quick estimate of required building materials along with their costs.</span>
      </div>
      <SmartCalculator/>
      <PopularCal/>
      <BuilderProfiles/>
    </div>
  )
}

export default Smartbuild
