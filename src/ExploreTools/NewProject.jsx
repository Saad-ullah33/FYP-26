import { Carousel } from '@mantine/carousel'
import React from 'react'
import Flats from './ExCatogires/Flats'

export const NewProject = () => {
  return (
      <>
    <div >NewProject
    </div>
            <div className='text-3xl font-bold mb-3'>Browse Projects by Category</div>
        <div className='w-full max-w-7xl px-4 py-6 bg-white rounded-xl shadow-lg ml-14 my-10 overflow-x-hidden'>
    
    <Carousel  slideSize="33%"  slideGap="md"  breakpoints={[
        { maxWidth: 'md', slideSize: '90%' },
        { maxWidth: 'lg', slideSize: '45%' },
        { maxWidth: 'xl', slideSize: '22%' },
      ]}
      emblaOptions={{ loop: true }}
    ></Carousel>
    </div>
    </>
  )
}
