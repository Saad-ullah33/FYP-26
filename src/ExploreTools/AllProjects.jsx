import React from "react";
import { Link } from "react-router-dom";
import {
  IconMapPin,
  IconArrowRight,
  IconBuildingSkyscraper,
} from "@tabler/icons-react";

const dummyProjects = [
  {
    id: 1,
    title: "Canal Heights",
    city: "Faisalabad",
    area: "Canal Road",
    price: "PKR 1.2 Crore",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
  },
  {
    id: 2,
    title: "Royal Palm Residency",
    city: "Faisalabad",
    area: "Satiana Road",
    price: "PKR 95 Lac",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c",
  },
  {
    id: 3,
    title: "City Walk Mall",
    city: "Faisalabad",
    area: "D Ground",
    price: "PKR 2.5 Crore",
    image:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750",
  },
];

export const AllProjects = () => {
  return (
    <div className="min-h-screen bg-[#f4f8fb] px-6 py-10">

      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-gray-800">
          All Faisalabad Projects
        </h1>

        <p className="text-gray-500 mt-2">
          Browse all available property projects
        </p>
      </div>

      {/* GRID */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

        {dummyProjects.map((project) => (
          <div
            key={project.id}
            className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
          >
            {/* IMAGE */}
            <img
              src={project.image}
              className="h-56 w-full object-cover"
            />

            {/* CONTENT */}
            <div className="p-5">

              <h2 className="text-xl font-bold text-gray-800">
                {project.title}
              </h2>

              <div className="flex items-center gap-2 text-gray-500 mt-2">
                <IconMapPin size={16} />
                <p className="text-sm">
                  {project.area}, {project.city}
                </p>
              </div>

              <p className="mt-4 text-cyan-700 font-bold text-lg">
                {project.price}
              </p>

              <Link
                to={`/project/${project.id}`}
                className="mt-5 flex items-center justify-center gap-2 bg-cyan-600 text-white py-3 rounded-xl hover:bg-cyan-700 transition-all"
              >
                View Details
                <IconArrowRight size={18} />
              </Link>

            </div>
          </div>
        ))}

      </div>
    </div>
  );
};