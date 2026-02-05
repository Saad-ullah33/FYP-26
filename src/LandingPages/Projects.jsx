import React from 'react'
import projects from '../Data/Data'
import { Carousel } from '@mantine/carousel'
import { IconMapPin, IconArrowRight, IconHeart } from '@tabler/icons-react'
import '@mantine/carousel/styles.css';

export const Projects = () => {
  return (
    // 1. Container: Clean white/slate gradient background
    <div className='w-full max-w-[1600px] mx-auto px-4 py-10 bg-gradient-to-b from-slate-50 to-white'>
      
      {/* 2. Heading Section */}
      <div className='flex justify-between items-end mb-6 px-2'>
        <div>
           <span className="text-blue-600 font-bold uppercase text-xs tracking-wider">Exclusive</span>
           <h2 className='text-3xl font-extrabold text-gray-800'>Trending Projects</h2>
        </div>
        <button className="hidden md:flex items-center gap-2 text-blue-600 font-bold text-sm hover:gap-3 transition-all">
           See All <IconArrowRight size={16} />
        </button>
      </div>

      {/* 3. Carousel with Simple Responsive Logic */}
      <Carousel
        slideSize={{ base: '100%', sm: '50%', md: '33.33%', lg: '25%' }}
        slideGap="md"
        align="start"
        loop
        withControls={true}
        classNames={{
          control: "bg-white shadow-md text-blue-600 hover:bg-blue-600 hover:text-white transition-all",
        }}
      >
        {projects.map((project, index) => (
          <Carousel.Slide key={index}>
            
            {/* CARD: The 'group' class controls the hover effect for the whole card */}
            <div className="group relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer h-full">
              
              {/* IMAGE AREA */}
              <div className="relative h-60 overflow-hidden">
                {/* Image zooms in on hover using group-hover:scale-110 */}
                <img
                  src={`/trending/${project.name}.jpg`}
                  alt={project.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                
                {/* Badge & Heart Icon */}
                <div className="absolute top-3 left-3 bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                  Trending
                </div>
                <div className="absolute top-3 right-3 p-2 bg-white/90 rounded-full text-gray-400 hover:text-red-500 transition-colors">
                  <IconHeart size={16} />
                </div>
              </div>

              {/* CONTENT AREA */}
              <div className="p-5">
                
                {/* Price: Gradient Text */}
                <div className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-blue-500">
                  {project.price.min} - {project.price.max} {project.currency}
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-gray-800 mt-1 truncate group-hover:text-blue-600 transition-colors">
                  {project.name}
                </h3>

                {/* Location */}
                <div className="flex items-center gap-1 mt-2 text-gray-500 text-sm">
                  <IconMapPin size={16} className="text-blue-400" />
                  <span className="truncate">{project.city}, {project.area}</span>
                </div>

                {/* Bottom Arrow */}
                <div className="mt-4 flex justify-end">
                   <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <IconArrowRight size={16} />
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