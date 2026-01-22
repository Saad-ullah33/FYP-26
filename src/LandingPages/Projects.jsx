import React from 'react'
import projects from '../Data/Data'
import { Carousel } from '@mantine/carousel'
import { IconArrowLeft, IconArrowRight, IconBuildingCommunity } from '@tabler/icons-react'

 export const Projects = () => {
  return (
    <div className='w-full max-w-7xl px-4 py-6 bg-blue-400 rounded-xl shadow-lg ml-14 my-10 overflow-x-hidden'>

        <div className='text-3xl font-bold mb-3'>Trending</div>
<Carousel
    slideSize="33%"
    slideGap="md"
    breakpoints={[
      { maxWidth: 'xl', slideSize: '25%' },
      { maxWidth: 'lg', slideSize: '30%' },
      { maxWidth: 'md', slideSize: '50%' },
      { maxWidth: 'sm', slideSize: '90%' },
    ]}
    emblaOptions={{ loop: true }}
  >
    {projects.map((project, index) => (
      <Carousel.Slide key={index}>
        <div className="flex justify-center px-2 py-4">
          <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 w-72 md:w-80 lg:w-96 h-[380px] flex flex-col cursor-pointer overflow-hidden">
            
            {/* Large cover image */}
            <img
              src={`/trending/${project.name}.jpg`}
              alt={project.name}
              className="w-full h-44 md:h-48 object-cover rounded-t-xl"
            />

            {/* Project info */}
            <div className="p-4 flex-1 flex flex-col justify-between">
              <h3 className="text-lg md:text-xl font-bold text-gray-800 truncate">
                {project.name}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <IconBuildingCommunity className="text-gray-500" size={18} />
                <p className="text-sm text-gray-500">
                  {project.city}, {project.area}
                </p>
              </div>
              <p className="text-yellow-600 font-semibold mt-2">
                {project.price.min} - {project.price.max} {project.currency}
              </p>
            </div>
          </div>
        </div>
      </Carousel.Slide>
    ))}
  </Carousel>


    </div>
  )
}
