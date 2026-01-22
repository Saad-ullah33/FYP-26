import React from 'react'
import craneIcon from '../assets/images/crane.svg';

export const Explore = () => {
  return (
    // Fixed: Used padding (p-10) instead of relative positioning to prevent overflow
        <div className='p-10 px-20'>
            <div className='text-2xl font-bold mb-7'>Explore more on PropIsghtAi</div>

            {/* Fixed: Added responsive breakpoints so cards don't squash on small screens */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10'>
                
                {/* CARD 1 */}
                <li className='list-none'>
                    <div className="flex items-center gap-4">
                        <img className="w-10 h-10 object-contain" src={craneIcon} alt="Crane" />
                        <div className='flex flex-col items-start'>
                            <span className="text-xl font-semibold"   >New Projects</span>
                            <div className='font-normal text-sm text-gray-500'>
                                The best investment opportunities
                            </div>
                        </div>
                    </div>
                </li>
                
                {/* CARD 2 */}
                <li className='list-none'>
                    <div className="flex items-center gap-4">
                        <img className="w-10 h-10 object-contain" src={craneIcon} alt="Crane" />
                        <div className='flex flex-col items-start'>
                            <span className="text-xl font-semibold">Construction Cost Calculator</span>
                            <div className='font-normal text-sm text-gray-500'>
                                The best investment opportunities
                            </div>
                        </div>
                    </div>
                </li>

                {/* CARD 3 */}
                <li className='list-none'>
                    <div className="flex items-center gap-4">
                        <img className="w-10 h-10 object-contain" src={craneIcon} alt="Crane" />
                        <div className='flex flex-col items-start'>
                            <span className="text-xl font-semibold">Area Guides</span>
                            <div className='font-normal text-sm text-gray-500'>
                                The best investment opportunities
                            </div>
                        </div>
                    </div>
                </li>
                
                {/* CARD 4 */}
                <li className='list-none'>
                    <div className="flex items-center gap-4">
                        <img className="w-10 h-10 object-contain" src={craneIcon} alt="Crane" />
                        <div className='flex flex-col items-start'>
                            <span className="text-xl font-semibold">Property Index</span>
                            <div className='font-normal text-sm text-gray-500'>
                                The best investment opportunities
                            </div>
                        </div>
                    </div>
                </li>

                {/* CARD 5 */}
                <li className='list-none'>
                    {/* Fixed: The typo 'gap-' is now 'gap-2' */}
                    <div className="flex items-center gap-4">
                        <img className="w-10 h-10 object-contain" src={craneIcon} alt="Crane" />
                        <div className='flex flex-col items-start'>
                            <span className="text-xl font-semibold">Plot Finder</span>
                            <div className='font-normal text-sm text-gray-500'>
                                The best investment opportunities
                            </div>
                        </div>
                    </div>
                </li>

            </div>
        </div>
  )
}
