import React from 'react';
// Added the missing / after the dots
import Cals from '../Data/Calinfo'; 
import { Carousel } from '@mantine/carousel';
import '@mantine/carousel/styles.css'; // Add this to prevent styling bugs
// ... rest of your code
const PopularCal = () => {
    return (
        <div className='w-full max-w-5xl px-4 py-6 bg-blue-400 rounded-xl shadow-lg ml-14 my-10 overflow-x-hidden'>

            <div className='text-2xl font-bold mb-4'>Popular Calculations in Faisalabad</div>
            <Carousel slideSize="33%" slideGap="10px" breakpoints={[
                { maxWidth: 'md', slideSize: '90%' },
                { maxWidth: 'lg', slideSize: '45%' },
                { maxWidth: 'xl', slideSize: '22%' },
            ]}
                emblaOptions={{ loop: true }}
            >
                {Cals.map((item, index) => (
                    <Carousel.Slide key={index}>

                        <div className="flex justify-center">
                            <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 w-50 md:w-86 h-auto overflow-hidden flex flex-col cursor-pointer">


                                {/* Project info */}
                                <div className="p-4 flex-1 flex flex-col justify-between">
                                    <h3 className="text-xl font-bold text-gray-800 truncate">{item.name}</h3>
                                    <div className='flex items-center'>
                                        <p className="text-sm text-gray-500">{item.floor}, {item.area}</p>
                                    </div>
                                    <div className='flex items-center'>
                                        <a className="text-sm text-gray-500">Details</a>
                                    </div>
                                </div>
                            </div>
                        </div>


                    </Carousel.Slide>
                ))}
            </Carousel>


        </div>
    )

}

export default PopularCal
