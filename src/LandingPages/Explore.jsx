import React from 'react'
import craneIcon from '../assets/images/crane.svg';

const Explore = () => {
    return (
        <div className='grid relative left-[6rem] '>
            <div className='text-2xl font-bold mb-5'>Explore more on PropIsghtAi</div>

            <div className='grid grid-cols-4 gap-5'>
                <li className='text-xl font-semibold list-none'>
                    <div className="flex items-center gap-2">
                        <img className="w-10 h-10 object-contain" src={craneIcon} alt="Crane" />
                        <span className="text-xl font-semibold">New Projects</span>
                        <div className='font-normal text-sm text-gray-500'>
                            The best investment opportunities
                        </div>
                    </div>
                </li>
                
                <li className='text-xl font-semibold list-none'>
                    <div className="flex items-center gap-2">
                        <img className="w-10 h-10 object-contain" src={craneIcon} alt="Crane" />
                        <span className="text-xl font-semibold">New Projects</span>
                        <div className='font-normal text-sm text-gray-500'>
                            The best investment opportunities
                        </div>
                    </div>
                </li>

                <li className='text-xl font-semibold list-none'>
                    <div className="flex items-center gap-2">
                        <img className="w-10 h-10 object-contain" src={craneIcon} alt="Crane" />
                        <span className="text-xl font-semibold">New Projects</span>
                        <div className='font-normal text-sm text-gray-500'>
                            The best investment opportunities
                        </div>
                    </div>
                </li>
                
                <li className='text-xl font-semibold list-none'>
                    <div className="flex items-center gap-2">
                        <img className="w-10 h-10 object-contain" src={craneIcon} alt="Crane" />
                        <span className="text-xl font-semibold">New Projects</span>
                        <div className='font-normal text-sm text-gray-500'>
                            The best investment opportunities
                        </div>
                    </div>
                </li>

                <li className='text-xl font-semibold list-none'>
                    <div className="flex items-center gap-">
                        <img className="w-10 h-10 object-contain" src={craneIcon} alt="Crane" />
                        <span className="text-xl font-semibold">New Projects</span>
                        <div className='font-normal text-sm text-gray-500'>
                            The best investment opportunities
                        </div>
                    </div>
                </li>
            </div>
        </div>
    )
}

export default Explore
