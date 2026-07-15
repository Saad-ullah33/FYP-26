import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  IconMapPin,
  IconArrowRight,
  IconSearch,
  IconBuildingSkyscraper,
  IconBriefcase,
  IconShoppingBag,
  IconBuildingStore,
  IconSparkles,
  IconPercentage,
  IconHierarchy,
  IconCircleCheck
} from "@tabler/icons-react";

// HIGH-FIDELITY PROJECTS DATABASE
export const DATABASE_PROJECTS = [
  {
    id: 1,
    title: "Canal Heights",
    city: "Faisalabad",
    area: "Canal Road",
    price: "PKR 1.2 Crore",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    category: "APARTMENT",
    progress: 85,
    specs: "1, 2 & 3 Bed Apartments, Dedicated Parking",
    developer: "Al-Haram Developers",
    featured: true
  },
  {
    id: 2,
    title: "Royal Palm Residency",
    city: "Faisalabad",
    area: "Satiana Road",
    price: "PKR 95 Lac",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
    category: "FLAT",
    progress: 90,
    specs: "Modern 2 Bed Flats, Ground Floor Lobby",
    developer: "Royal Builders",
    featured: false
  },
  {
    id: 3,
    title: "Skyline Apartments",
    city: "Faisalabad",
    area: "Jaranwala Road",
    price: "PKR 1.5 Crore",
    image: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=800&q=80",
    category: "APARTMENT",
    progress: 60,
    specs: "Luxury Penthouses, High Speed Elevators",
    developer: "Skyline Group",
    featured: true
  },
  {
    id: 4,
    title: "TechVibe Co-working Space",
    city: "Faisalabad",
    area: "D Ground",
    price: "PKR 45 Lac",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
    category: "WORKSPACE",
    progress: 95,
    specs: "Dedicated Desks, Conference Rooms, High-Speed WiFi",
    developer: "TechVibe Co.",
    featured: true
  },
  {
    id: 5,
    title: "Susan Business Hub",
    city: "Faisalabad",
    area: "Susan Road",
    price: "PKR 80 Lac",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
    category: "WORKSPACE",
    progress: 70,
    specs: "Corporate Suites, Board Room Access, Café",
    developer: "Faisalabad Developers",
    featured: false
  },
  {
    id: 6,
    title: "Kohinoor Square Retail",
    city: "Faisalabad",
    area: "Kohinoor City",
    price: "PKR 1.4 Crore",
    image: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=800&q=80",
    category: "SHOP",
    progress: 100,
    specs: "Double Height Shops, Prime Foot Traffic",
    developer: "Kohinoor Enterprises",
    featured: true
  },
  {
    id: 7,
    title: "Grand Boulevard Arcade",
    city: "Faisalabad",
    area: "Canal Road",
    price: "PKR 1.8 Crore",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80",
    category: "SHOP",
    progress: 35,
    specs: "Main Road Frontage, Security Systems",
    developer: "Boulevard Group",
    featured: false
  },
  {
    id: 8,
    title: "City Walk Mall",
    city: "Faisalabad",
    area: "D Ground",
    price: "PKR 2.5 Crore",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
    category: "MALL",
    progress: 75,
    specs: "Food Court Shops, Play Area, Multiplex Cinema",
    developer: "City Walk Group",
    featured: true
  },
  {
    id: 9,
    title: "Grand Lyallpur Mall",
    city: "Faisalabad",
    area: "Susan Road",
    price: "PKR 3.8 Crore",
    image: "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f93?auto=format&fit=crop&w=800&q=80",
    category: "MALL",
    progress: 50,
    specs: "Centrally Air-Conditioned, Double Basements",
    developer: "Lyallpur Builders",
    featured: false
  },
  {
    id: 10,
    title: "FDA Commercial Mall",
    city: "Faisalabad",
    area: "FDA City",
    price: "PKR 2.0 Crore",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
    category: "MALL",
    progress: 15,
    specs: "Multi-Storey Retail Outlets, Launching Promo",
    developer: "FDA Co.",
    featured: false
  },
  {
    id: 11,
    title: "Executive Chambers",
    city: "Faisalabad",
    area: "Civil Lines",
    price: "PKR 1.1 Crore",
    image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80",
    category: "WORKSPACE",
    progress: 80,
    specs: "Executive Suites, Secretarial Services, Boardroom",
    developer: "Chamber Devs",
    featured: false
  }
];

// FILTER PILLS CONFIG
const CATEGORIES = [
  { slug: "ALL", name: "All Projects" },
  { slug: "FLAT", name: "Flats" },
  { slug: "APARTMENT", name: "Apartments" },
  { slug: "WORKSPACE", name: "Workspaces" },
  { slug: "SHOP", name: "Shop Spaces" },
  { slug: "MALL", name: "Mall Projects" }
];

export const AllProjects = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("ALL");

  // Get project counts for each category badge dynamically
  const categoryCounts = useMemo(() => {
    const counts = { ALL: DATABASE_PROJECTS.length };
    DATABASE_PROJECTS.forEach(project => {
      counts[project.category] = (counts[project.category] || 0) + 1;
    });
    return counts;
  }, []);

  // Filter projects dynamically
  const filteredProjects = useMemo(() => {
    return DATABASE_PROJECTS.filter(project => {
      const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            project.area.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            project.developer.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = activeCategory === "ALL" || project.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, activeCategory]);

  const getProgressColor = (percent) => {
    if (percent === 100) return "bg-emerald-500";
    if (percent > 60) return "bg-blue-500";
    if (percent > 30) return "bg-amber-500";
    return "bg-orange-500";
  };

  const getProgressLabel = (percent) => {
    if (percent === 100) return "Completed";
    if (percent >= 75) return "Finishing Stage";
    if (percent >= 30) return "Under Construction";
    return "Launching Soon";
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case "FLAT":
        return <IconBuildingStore size={15} />;
      case "APARTMENT":
        return <IconBuildingSkyscraper size={15} />;
      case "WORKSPACE":
        return <IconBriefcase size={15} />;
      case "SHOP":
        return <IconShoppingBag size={15} />;
      case "MALL":
        return <IconBuildingSkyscraper size={15} />;
      default:
        return <IconBuildingSkyscraper size={15} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      
      {/* ── HEADER HERO BANNER ── */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950 text-white py-14 px-6 md:px-12 border-b border-slate-900/30 relative overflow-hidden">
        {/* Decorative Grid */}
        <div 
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        />
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-80 h-80 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-10 w-64 h-64 bg-cyan-500/10 rounded-full blur-[90px] pointer-events-none" />

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-xs font-bold tracking-wider uppercase mb-3">
              <IconSparkles size={12} className="text-blue-400" /> Exclusive Portfolios
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
              Faisalabad Property <br />
              <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-teal-300 text-transparent bg-clip-text">
                Mega Projects
              </span>
            </h1>
            <p className="mt-3 text-slate-300 text-sm md:text-base max-w-xl font-medium">
              Explore residential communities, corporate co-working suites, premium commercial retail outlets, and multi-storey mall structures.
            </p>
          </div>

          {/* Quick Info Board */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-2xl w-full md:w-72 shadow-2xl">
            <h3 className="text-xs font-extrabold text-blue-300 uppercase tracking-widest mb-2">Projects Snapshot</h3>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-slate-400">Total Ventures</span>
                <span className="font-bold text-teal-400">{DATABASE_PROJECTS.length} Registered</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-slate-400">Finished</span>
                <span className="font-bold text-blue-400">
                  {DATABASE_PROJECTS.filter(p => p.progress === 100).length} Completed
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Construction Rate</span>
                <span className="font-bold text-emerald-400 flex items-center gap-1">
                  <IconCircleCheck size={12} /> Active Builders
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── SEARCH & FILTER BOX ── */}
      <div className="max-w-7xl mx-auto px-4 -mt-6 relative z-20">
        <div className="bg-white p-4 rounded-2xl shadow-lg border border-slate-100 space-y-4">
          
          {/* SEARCH BAR */}
          <div className="relative w-full">
            <IconSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search projects by title, area, developer name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition"
            />
          </div>

          {/* CATEGORY TABS / PILLS */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-thin select-none">
            {CATEGORIES.map((cat) => {
              const count = categoryCounts[cat.slug] || 0;
              const isActive = activeCategory === cat.slug;

              return (
                <button
                  key={cat.slug}
                  onClick={() => setActiveCategory(cat.slug)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition shrink-0 flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                  }`}
                >
                  {getCategoryIcon(cat.slug)}
                  <span>{cat.name}</span>
                  <span className={`px-1.5 py-0.5 rounded-md text-[9px] ${
                    isActive ? "bg-white/20 text-white" : "bg-slate-200 text-slate-500"
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

        </div>
      </div>

      {/* ── PROJECTS LISTINGS GRID ── */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {filteredProjects.length === 0 ? (
          <div className="bg-white text-center py-20 rounded-3xl border border-slate-200 p-8 max-w-lg mx-auto shadow-sm">
            <IconBuildingSkyscraper className="w-16 h-16 text-slate-300 mx-auto mb-3" />
            <h3 className="text-xl font-bold text-slate-800">No Projects Found</h3>
            <p className="text-sm text-slate-500 mt-1">
              There are no listings matching your search or selected category pill right now.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setActiveCategory("ALL");
              }}
              className="mt-5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition shadow-lg shadow-blue-500/15"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => {
              const progPercent = project.progress;
              const progColor = getProgressColor(progPercent);
              const progLabel = getProgressLabel(progPercent);

              return (
                <div
                  key={project.id}
                  className="group bg-white rounded-3xl border border-slate-150 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-slate-200/40 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
                >
                  {/* Card Media */}
                  <div className="relative h-56 overflow-hidden bg-slate-100">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-500"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

                    {/* Featured Star Overlay */}
                    {project.featured && (
                      <div className="absolute top-4 right-4 z-10 bg-amber-500 text-white px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider flex items-center gap-1 shadow-md">
                        <IconSparkles size={11} /> Featured
                      </div>
                    )}

                    {/* Category Label (Top-Left) */}
                    <div className="absolute top-4 left-4 z-10">
                      <span className="px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest bg-slate-900/80 backdrop-blur-sm text-slate-100 border border-white/10 flex items-center gap-1">
                        {getCategoryIcon(project.category)} {project.category}
                      </span>
                    </div>

                    {/* Pricing Display on Overlay */}
                    <div className="absolute bottom-4 left-4 z-10">
                      <span className="text-white text-xs font-semibold uppercase tracking-wide opacity-80 block">Starting From</span>
                      <span className="text-white text-xl font-black tracking-tight">{project.price}</span>
                    </div>
                  </div>

                  {/* Card Details */}
                  <div className="p-6 flex-grow flex flex-col justify-between">
                    <div className="space-y-2">
                      <h2 className="text-lg font-bold text-slate-950 group-hover:text-blue-600 transition-colors line-clamp-1">
                        {project.title}
                      </h2>

                      {/* Location details */}
                      <div className="flex items-center gap-1 text-slate-500 text-xs font-semibold">
                        <IconMapPin size={15} className="text-slate-400 shrink-0" />
                        <span className="truncate">{project.area}, {project.city}</span>
                      </div>

                      {/* Key features of project */}
                      <p className="text-slate-600 text-xs line-clamp-2 leading-relaxed pt-1">
                        {project.specs}
                      </p>
                    </div>

                    {/* Construction Progress Bar */}
                    <div className="mt-5 pt-4 border-t border-slate-50">
                      <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                        <span className="flex items-center gap-0.5">
                          <IconPercentage size={11} /> {progLabel}
                        </span>
                        <span>{progPercent}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${progColor} transition-all duration-500 rounded-full`}
                          style={{ width: `${progPercent}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Card Action footer */}
                  <div className="px-6 pb-6 pt-1 flex justify-between items-center text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">Developer</span>
                      <span className="font-bold text-slate-700">{project.developer}</span>
                    </div>
                    <Link
                      to={`/project/${project.id}`}
                      className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-800 font-bold transition-all group-hover:translate-x-1 duration-200"
                    >
                      View Venture <IconArrowRight size={14} />
                    </Link>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};

export default AllProjects;