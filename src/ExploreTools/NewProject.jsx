<<<<<<< HEAD
import { Carousel } from '@mantine/carousel';
import React from 'react';
import { propertyCategories } from '../Data/propertyCategories';
import { Link } from 'react-router-dom';
import { IconChevronLeft, IconChevronRight, IconBuildingCommunity } from '@tabler/icons-react';
import projects from '../Data/Data';

export const NewProject = () => {
  return (
    <>
      {/* Category Carousel */}
      <div className="w-full px-6 py-8 bg-blue-50 rounded-2xl shadow-lg my-10">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
          Browse New Projects by Category
        </h2>

        <Carousel
          slideSize="22%"
          slideGap="md"
          align="start"
          loop={false}
          breakpoints={[
            { maxWidth: 'xl', slideSize: '22%' },
            { maxWidth: 'lg', slideSize: '30%' },
            { maxWidth: 'md', slideSize: '45%' },
            { maxWidth: 'sm', slideSize: '70%' },
          ]}
          className="w-full"
          styles={{
            control: {
              width: 38,
              height: 38,
              borderRadius: '50%',
              backgroundColor: '#7AD0C9',
              '&[data-inactive]': { display: 'none' },
            },
          }}
          nextControlIcon={<IconChevronRight size={24} />}
          previousControlIcon={<IconChevronLeft size={24} />}
        >
          {propertyCategories.map((cat) => (
            <Carousel.Slide key={cat.id}>
              <Link
                to={`/projects/${cat.slug}`}
                className="flex flex-col items-center justify-center gap-2 p-4 border rounded-xl bg-white hover:shadow-xl transition-all duration-300"
              >
                <img src={cat.icon} className="w-10 h-10" alt={cat.name} />
                <span className="text-sm font-medium text-gray-700 text-center">{cat.name}</span>
              </Link>
            </Carousel.Slide>
          ))}
        </Carousel>
      </div>

      {/* Trending/New Projects Carousel */}
<div className="my-10 bg-blue-50 px-4 py-6 rounded-2xl">
  <h2 className="text-2xl font-bold mb-6 text-gray-800 text-start">
    Discover New Projects
  </h2>

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
    </>
  );
}