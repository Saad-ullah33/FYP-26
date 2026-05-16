import React, { useEffect } from "react";
import { Carousel } from "@mantine/carousel";
import { Link } from "react-router-dom";

import {
  IconChevronLeft,
  IconChevronRight,
  IconMapPin,
  IconArrowRight,
  IconStarFilled,
  IconBuildingSkyscraper,
  IconClock,
} from "@tabler/icons-react";

// DATA IMPORT
import {
  trendingProjects,
  featuredProjects,
  comingProjects,
} from "../Data/projects";

export const NewProject = () => {

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  // COMMON CARD
  const renderProjectCard = (project, badge, badgeColor) => (
    <div className="bg-white rounded-[28px] overflow-hidden border border-gray-200 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group">

      <div className="relative overflow-hidden">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-64 object-cover group-hover:scale-110 transition-all duration-700"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"></div>

        <div className={`absolute top-4 left-4 ${badgeColor} text-white text-xs font-semibold px-4 py-2 rounded-full backdrop-blur-md shadow-lg`}>
          {badge}
        </div>

        <div className="absolute bottom-4 left-4">
          <p className="text-white text-2xl font-bold">
            {project.price}
          </p>
        </div>
      </div>

      <div className="p-6">

        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800 line-clamp-1">
              {project.title}
            </h2>

            <div className="flex items-center gap-2 text-gray-500 mt-2">
              <IconMapPin size={17} />
              <p className="text-sm">
                {project.area}, {project.city}
              </p>
            </div>
          </div>

          <div className="bg-cyan-50 p-2 rounded-xl">
            <IconBuildingSkyscraper size={22} className="text-cyan-700" />
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between">

          <div>
            <p className="text-xs text-gray-400">Developer</p>
            <p className="text-sm font-semibold text-gray-700">
              {project.developer}
            </p>
          </div>

          <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1 rounded-full">
            <IconStarFilled size={14} className="text-yellow-500" />
            <span className="text-xs font-semibold text-gray-700">
              Premium
            </span>
          </div>
        </div>

        <Link
          to={`/project/${project.id}`}
          className="mt-6 flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white py-3 rounded-2xl font-semibold transition-all duration-300"
        >
          View Details
          <IconArrowRight size={18} />
        </Link>

      </div>
    </div>
  );

  return (
    <div className="bg-[#f4f8fb] min-h-screen px-4 md:px-8 py-8">

      {/* HERO SECTION */}
      <div className="relative overflow-hidden bg-gradient-to-r from-cyan-700 via-blue-700 to-indigo-700 rounded-[35px] p-10 md:p-16 text-white shadow-2xl mb-14">

        <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>

        <div className="relative z-10">

          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-sm font-medium mb-6">
            <IconClock size={16} />
            Faisalabad Premium Projects
          </div>

          <h1 className="text-4xl md:text-6xl font-black leading-tight max-w-4xl">
            Explore Faisalabad’s
            <span className="block text-cyan-200">
              Largest Property Projects
            </span>
          </h1>

          <p className="mt-6 text-gray-100 max-w-2xl text-base md:text-lg leading-relaxed">
            Discover trending, featured, and upcoming residential and commercial projects designed for modern living and high-return investments.
          </p>

          <Link
            to="/projects"
            className="mt-8 inline-flex bg-white text-blue-700 px-7 py-4 rounded-2xl font-bold items-center gap-3 hover:scale-105 transition-all duration-300 shadow-xl"
          >
            Explore Projects
            <IconArrowRight size={20} />
          </Link>

        </div>
      </div>

      {/* SECTIONS */}
      {[
        {
          title: "Trending Projects",
          desc: "Most popular projects in Faisalabad",
          data: trendingProjects,
          badge: "Trending",
          color: "bg-cyan-600",
        },
        {
          title: "Featured Projects",
          desc: "Premium investment opportunities",
          data: featuredProjects,
          badge: "Featured",
          color: "bg-purple-600",
        },
        {
          title: "Coming Soon",
          desc: "Upcoming mega projects",
          data: comingProjects,
          badge: "Coming Soon",
          color: "bg-orange-500",
        },
      ].map((section, index) => (
        <div
          key={index}
          className="bg-white rounded-[30px] shadow-lg p-6 md:p-8 mb-12 border border-gray-100"
        >

          <div className="flex items-center justify-between mb-8">

            <div>
              <h2 className="text-3xl font-bold text-gray-800">
                {section.title}
              </h2>

              <p className="text-gray-500 mt-2 text-sm">
                {section.desc}
              </p>
            </div>

            <Link
              to="/projects"
              className="hidden md:flex items-center gap-2 text-cyan-700 font-semibold hover:gap-3 transition-all"
            >
              View All
              <IconArrowRight size={18} />
            </Link>

          </div>

          <Carousel
            slideSize="33.333333%"
            slideGap="lg"
            align="start"
            emblaOptions={{ loop: true }}
            breakpoints={[
              { maxWidth: "lg", slideSize: "50%" },
              { maxWidth: "md", slideSize: "70%" },
              { maxWidth: "sm", slideSize: "100%" },
            ]}
            styles={{
              control: {
                width: 44,
                height: 44,
                borderRadius: "50%",
                backgroundColor: "#0891b2",
                color: "white",
                border: "none",
                boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
              },
            }}
            nextControlIcon={<IconChevronRight size={24} />}
            previousControlIcon={<IconChevronLeft size={24} />}
          >
            {section.data.map((project) => (
              <Carousel.Slide key={project.id}>
                {renderProjectCard(project, section.badge, section.color)}
              </Carousel.Slide>
            ))}
          </Carousel>

        </div>
      ))}
    </div>
  );
};