import React from 'react';
import { Link } from "react-router-dom";
import ScrollReveal from '../components/ScrollReveal';
import BorderBeam from '../components/BorderBeam';
import {
  Building2, Calculator, Map, LineChart, MapPin, Sparkles, ArrowUpRight
} from 'lucide-react';

export const Explore = () => {
  const tools = [
    {
      title: "New Projects",
      subtitle: "Discover top investment opportunities & new developments",
      link: "/new-project",
      badge: "Invest",
      icon: Building2,
      accentColor: "blue",
      bgColor: "bg-blue-50/80",
      textColor: "text-blue-600",
      hoverBorder: "hover:border-blue-300",
      badgeColor: "bg-blue-100/80 text-blue-700"
    },
    {
      title: "Cost Calculator",
      subtitle: "Estimate building costs with live material market rates",
      link: "/smart-build",
      badge: "Estimator",
      icon: Calculator,
      accentColor: "indigo",
      bgColor: "bg-indigo-50/80",
      textColor: "text-indigo-600",
      hoverBorder: "hover:border-indigo-300",
      badgeColor: "bg-indigo-100/80 text-indigo-700"
    },
    {
      title: "3D Floor Plan AI",
      subtitle: "Transform 2D blueprints into photorealistic 3D renders",
      link: "/tools/floorplan-visualizer",
      badge: "AI Studio",
      icon: Sparkles,
      accentColor: "emerald",
      bgColor: "bg-emerald-50/80",
      textColor: "text-emerald-600",
      hoverBorder: "hover:border-emerald-300",
      badgeColor: "bg-emerald-100/80 text-emerald-700"
    },
    {
      title: "Area Guides",
      subtitle: "Explore society amenities, maps, and local insights",
      link: "/area-guides",
      badge: "Guides",
      icon: Map,
      accentColor: "amber",
      bgColor: "bg-amber-50/80",
      textColor: "text-amber-600",
      hoverBorder: "hover:border-amber-300",
      badgeColor: "bg-amber-100/80 text-amber-700"
    },
    {
      title: "Property Index",
      subtitle: "Track historical price trends per Marla across societies",
      link: "/property-index",
      badge: "Analytics",
      icon: LineChart,
      accentColor: "purple",
      bgColor: "bg-purple-50/80",
      textColor: "text-purple-600",
      hoverBorder: "hover:border-purple-300",
      badgeColor: "bg-purple-100/80 text-purple-700"
    },
    {
      title: "Plot Finder & GIS",
      subtitle: "Locate specific plots with interactive map overlays",
      link: "/plot-finder",
      badge: "GIS Map",
      icon: MapPin,
      accentColor: "teal",
      bgColor: "bg-teal-50/80",
      textColor: "text-teal-600",
      hoverBorder: "hover:border-teal-300",
      badgeColor: "bg-teal-100/80 text-teal-700"
    }
  ];

  return (
    <div className='py-20 bg-slate-50/60 border-t border-slate-200/60'>
      <div className='px-6 md:px-12 lg:px-20 max-w-[1600px] mx-auto space-y-12'>

        {/* SECTION HEADER */}
        <ScrollReveal direction="up" duration={0.8}>
          <div className='flex flex-col md:flex-row md:items-end justify-between gap-4'>
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                Specialized Real Estate Tools
              </span>
              <h2 className='text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight'>
                Explore PropSight Ecosystem
              </h2>
              <p className='text-slate-600 text-sm sm:text-base max-w-xl'>
                Empower your real estate decisions with specialized AI spatial visualizers, construction estimators, and market intelligence engines.
              </p>
            </div>
          </div>
        </ScrollReveal>

        {/* 6-CARD RESPONSIVE GRID (3 COLS X 2 ROWS ON DESKTOP) */}
        <ScrollReveal
          cascade={true}
          direction="up"
          staggerAmount={0.08}
          duration={0.7}
          className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8'
        >
          {tools.map((tool, idx) => {
            const IconComponent = tool.icon;
            return (
              <Link
                key={idx}
                to={tool.link}
                className={`relative overflow-hidden flex flex-col justify-between p-6 sm:p-7 bg-white border border-slate-200/80 ${tool.hoverBorder} rounded-3xl shadow-sm hover:shadow-xl hover:shadow-slate-200/60 hover:-translate-y-1.5 transition-all duration-300 group`}
              >
                <BorderBeam size={120} duration={8} borderWidth={1.5} delay={idx * 2} />

                <div className="space-y-5">
                  {/* Top Bar: Icon + Badge */}
                  <div className="flex items-center justify-between">
                    <div className={`p-4 ${tool.bgColor} ${tool.textColor} rounded-2xl group-hover:scale-110 transition-transform duration-300 shadow-inner`}>
                      <IconComponent className="w-7 h-7" />
                    </div>
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${tool.badgeColor}`}>
                      {tool.badge}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-1.5">
                    <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors duration-200 flex items-center justify-between">
                      <span>{tool.title}</span>
                      <ArrowUpRight className="w-5 h-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300 text-blue-600" />
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                      {tool.subtitle}
                    </p>
                  </div>
                </div>

                {/* Bottom Border Accent Indicator */}
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-400 group-hover:text-slate-700 transition-colors">
                  <span>Launch Tool</span>
                  <span className="text-blue-600 font-bold group-hover:underline">Explore →</span>
                </div>
              </Link>
            );
          })}
        </ScrollReveal>
      </div>
    </div>
  );
};