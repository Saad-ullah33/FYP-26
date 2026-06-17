import React, { useState, useEffect } from 'react';
import projects from '../Data/Data';
import { Carousel } from '@mantine/carousel';
import { 
  IconMapPin, 
  IconArrowRight, 
  IconHeart, 
  IconChevronLeft, 
  IconChevronRight 
} from '@tabler/icons-react';
import '@mantine/carousel/styles.css';

export const Projects = () => {
  // Capture the Embla API instance for custom external arrow controls
  const [embla, setEmbla] = useState(null);

  // 4-Second Automatic Sliding Logic (Moves exactly 4 slides on desktop)
  useEffect(() => {
    if (!embla) return;

    const interval = setInterval(() => {
      if (embla.canScrollNext()) {
        embla.scrollNext();
      } else {
        embla.scrollTo(0); // Smoothly loops back to the first 4 cards
      }
    }, 6000); // 4000ms = 4 seconds

    return () => clearInterval(interval);
  }, [embla]);

  return (
    // Container: Clean, light background transition
    <div className='w-full max-w-[1600px] mx-auto px-6 md:px-12 lg:px-20 py-16 bg-white'>
      
      {/* ── HEADER SECTION WITH CUSTOM CONTROLS ── */}
      <div className='flex justify-between items-end mb-8 px-2'>
        <div>
           <span className="text-blue-600 font-extrabold uppercase text-xs tracking-wider">Exclusive</span>
           <h2 className='text-3xl font-extrabold text-slate-900 tracking-tight mt-1'>Trending Projects</h2>
        </div>
        
        {/* Custom Nav Controls: Aligned next to heading, always visible */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => embla?.scrollPrev()}
            className="w-10 h-10 rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 flex items-center justify-center transition-all duration-200 shadow-sm cursor-pointer"
            aria-label="Previous slides"
          >
            <IconChevronLeft size={18} />
          </button>
          <button 
            onClick={() => embla?.scrollNext()}
            className="w-10 h-10 rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 flex items-center justify-center transition-all duration-200 shadow-sm cursor-pointer"
            aria-label="Next slides"
          >
            <IconChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* ── CAROUSEL ── */}
      <Carousel
        getEmblaApi={setEmbla}
        // MATHEMATICAL PREVENTIONS against cutoff slivers: width is adjusted precisely for gaps
        slideSize={{ 
          base: '100%', 
          sm: 'calc((100% - 24px) / 2)',  // 2 slides, 1 gap of 24px
          md: 'calc((100% - 48px) / 3)',  // 3 slides, 2 gaps of 24px
          lg: 'calc((100% - 72px) / 4)'   // Exactly 4 slides, 3 gaps of 24px
        }}
        // Slides exactly 4 cards at a time on desktop (lg)
        slidesToScroll={{ base: 1, sm: 2, md: 3, lg: 4 }}
        slideGap="24px" // Precise gap size matching the mathematical formulas above
        align="start"
        loop={false} // Manual looping is handled cleanly inside useEffect
        withControls={false} // Disable default buggy relative overlay arrow controls
      >
        {projects.map((project, index) => (
          <Carousel.Slide key={index}>
            <div className="p-1"> {/* Soft outer padding for shadows */}
              <div className="bg-white hover:bg-slate-50/50 border border-slate-100 hover:border-slate-200 rounded-2xl p-4 flex flex-col transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-slate-100/60 hover:-translate-y-1.5 group">
                
                {/* Image Section */}
                <div className="relative rounded-xl overflow-hidden aspect-[4/3] mb-4">
                  <img
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    src={`/trending/${project.name}.jpg`}
                    alt={project.name}
                    onError={(e) => {
                      // Fallback asset if local JPG is missing or named incorrectly
                      e.currentTarget.src = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80";
                    }}
                  />
                  
                  {/* Badge & Heart */}
                  <div className="absolute top-3 left-3 bg-blue-600/90 backdrop-blur-md text-white text-[9px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-md">
                    Trending
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-slate-400 hover:text-red-500 hover:scale-105 transition-all shadow-sm border border-slate-100/40 cursor-pointer"
                  >
                    <IconHeart size={14} />
                  </button>
                </div>

                {/* Content Section */}
                <div className="flex flex-col justify-between flex-grow">
                  <div>
                    {/* Price Range (Fixed child object rendering crash) */}
                    <div className="text-lg font-extrabold text-blue-600 tracking-tight">
                      {project.price ? `${project.price.min} - ${project.price.max} ${project.currency}` : "1.5 - 12.0 Crore PKR"}
                    </div>

                    {/* Project Name */}
                    <h3 className="text-base font-bold text-slate-900 mt-1 truncate group-hover:text-blue-600 transition-colors duration-150">
                      {project.name}
                    </h3>

                    {/* Location */}
                    <div className="flex items-center gap-1 mt-2 text-slate-500 text-xs font-semibold">
                      <IconMapPin size={15} className="text-slate-400 shrink-0" />
                      <span className="truncate">{project.city || "Islamabad"}, {project.area || "Blue Area"}</span>
                    </div>
                  </div>

                  {/* Card Action Indicator */}
                  <div className="mt-4 flex justify-end">
                     <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-250 shadow-sm">
                        <IconArrowRight size={15} />
                     </div>
                  </div>
                </div>

              </div>
            </div>
          </Carousel.Slide>
        ))}
      </Carousel>

    </div>
  );
};