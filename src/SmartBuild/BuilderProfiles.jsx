import React, { useState } from 'react';
import PremiumGate from '../components/subscription/PremiumGate';
import { 
  IconArrowLeft, 
  IconMapPin, 
  IconBuildingSkyscraper, 
  IconRosetteDiscountCheckFilled, 
  IconStarFilled, 
  IconPhone, 
  IconBrandWhatsapp,
  IconBriefcase,
  IconPhoto,
  IconHelmet
} from '@tabler/icons-react';

// --- Mock Data ---
const builders = [
  {
    id: 1,
    name: "Ahmed Hassan",
    city: "Lahore",
    experience: "12 Years",
    projectsCompleted: 45,
    specialty: "Residential Complexes",
    rating: 4.9,
    phone: "+923001234567",
    whatsapp: "+923001234567",
    about: "Ahmed is a veteran in Lahore's construction sector, known for delivering high-end residential complexes on time. His team specializes in modern grey structures and premium finishing.",
    portfolio: [
      "https://images.unsplash.com/photo-1600596542815-6008990f4948?auto=format&fit=crop&w=400&q=60",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=60",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=400&q=60"
    ]
  },
  {
    id: 2,
    name: "Sarah Khan",
    city: "Karachi",
    experience: "8 Years",
    projectsCompleted: 32,
    specialty: "Commercial High-rises",
    rating: 4.8,
    phone: "+923007654321",
    whatsapp: "+923007654321",
    about: "Sarah brings a modern architectural perspective to Karachi's skyline. Specializing in steel structures and commercial plazas, she ensures durability and aesthetic appeal.",
    portfolio: [
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=400&q=60",
      "https://images.unsplash.com/photo-1479839672679-a46483c0e7c8?auto=format&fit=crop&w=400&q=60",
      "https://images.unsplash.com/photo-1554469384-e58fac16e23a?auto=format&fit=crop&w=400&q=60"
    ]
  },
  {
    id: 3,
    name: "Usman Tariq",
    city: "Islamabad",
    experience: "15 Years",
    projectsCompleted: 60,
    specialty: "Smart Homes & Villas",
    rating: 5.0,
    phone: "+923331122334",
    whatsapp: "+923331122334",
    about: "Usman is the go-to builder for smart homes in DHA and Bahria Town. He integrates home automation directly into the construction phase for seamless living.",
    portfolio: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=60",
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=400&q=60",
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=400&q=60"
    ]
  },
  {
    id: 4,
    name: "Zainab Malik",
    city: "Faisalabad",
    experience: "6 Years",
    projectsCompleted: 24,
    specialty: "Eco-friendly Structures",
    rating: 4.7,
    phone: "+923218899776",
    whatsapp: "+923218899776",
    about: "Zainab champions sustainable construction in Faisalabad. She uses locally sourced materials and energy-efficient designs to lower long-term maintenance costs.",
    portfolio: [
      "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=400&q=60",
      "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=400&q=60",
      "https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&w=400&q=60"
    ]
  },
  {
    id: 5,
    name: "Bilal Ahmed",
    city: "Multan",
    experience: "10 Years",
    projectsCompleted: 38,
    specialty: "Industrial Warehouses",
    rating: 4.9,
    phone: "+923456677889",
    whatsapp: "+923456677889",
    about: "Bilal specializes in heavy-duty industrial construction in the Multan industrial estate. His warehouses are built for high load-bearing and thermal efficiency.",
    portfolio: [
      "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=400&q=60",
      "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=400&q=60",
      "https://images.unsplash.com/photo-1565514020176-db7936a70445?auto=format&fit=crop&w=400&q=60"
    ]
  }
];

const BuilderProfiles = () => {
  const [selectedBuilder, setSelectedBuilder] = useState(null);

  // --- VIEW 1: Detail View (Holographic Blue Theme) ---
  if (selectedBuilder) {
    return (
      <div className="w-full max-w-4xl mx-auto mb-20 transition-all duration-300 text-left">
        
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-100/80 border border-slate-100 overflow-hidden">
          
          {/* Holographic Header Section */}
          <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-600 p-8 md:p-10 text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "16px 14px" }}></div>
            
            <button 
              onClick={() => setSelectedBuilder(null)}
              className="relative z-10 text-blue-100 hover:text-white text-xs font-bold uppercase tracking-wider mb-5 flex items-center gap-1.5 transition-all duration-200 hover:-translate-x-1 cursor-pointer"
            >
              <IconArrowLeft size={14} /> Back to Builders
            </button>
            
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">{selectedBuilder.name}</h2>
                  <IconRosetteDiscountCheckFilled size={28} className="text-emerald-400" />
                </div>
                <p className="text-blue-100/90 text-sm font-medium flex items-center gap-2 mt-2">
                  <IconMapPin size={16} className="text-cyan-400" />
                  {selectedBuilder.city} Region
                  <span className="opacity-50">|</span>
                  <IconBuildingSkyscraper size={16} className="text-cyan-400" />
                  {selectedBuilder.specialty}
                </p>
              </div>
            </div>
          </div>

          {/* Floating Stats Card */}
          <div className="px-8 md:px-10 -mt-8 relative z-20">
            <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 flex flex-wrap justify-between items-center gap-4 divide-x divide-slate-100">
              
              <div className="flex-1 text-center sm:text-left px-2">
                <p className="text-slate-400 text-[11px] font-extrabold uppercase tracking-widest mb-1 flex items-center justify-center sm:justify-start gap-1">
                  <IconStarFilled size={12} className="text-yellow-400" /> Client Rating
                </p>
                <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900">{selectedBuilder.rating}<span className="text-sm text-slate-400 font-bold">/5.0</span></h3>
              </div>

              <div className="flex-1 text-center sm:text-left px-2 sm:px-6">
                <p className="text-slate-400 text-[11px] font-extrabold uppercase tracking-widest mb-1">Projects Done</p>
                <h3 className="text-2xl md:text-3xl font-extrabold text-blue-600">{selectedBuilder.projectsCompleted}</h3>
              </div>

              <div className="flex-1 text-center sm:text-right px-2">
                <p className="text-slate-400 text-[11px] font-extrabold uppercase tracking-widest mb-1">Experience</p>
                <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900">{selectedBuilder.experience}</h3>
              </div>

            </div>
          </div>

          {/* About Section */}
          <div className="p-8 md:p-10">
            <h3 className="text-lg font-extrabold text-slate-900 border-b border-slate-100 pb-3 mb-4 flex items-center gap-2">
              <IconBriefcase size={20} className="text-slate-400" /> About the Builder
            </h3>
            <p className="text-slate-600 leading-relaxed font-medium">
              {selectedBuilder.about}
            </p>
          </div>

          {/* Portfolio Grid */}
          <div className="px-8 md:px-10 pb-8">
            <h3 className="text-lg font-extrabold text-slate-900 border-b border-slate-100 pb-3 mb-6 flex items-center gap-2">
              <IconPhoto size={20} className="text-slate-400" /> Recent Projects
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {selectedBuilder.portfolio.map((img, index) => (
                <div key={index} className="group relative aspect-video rounded-xl overflow-hidden shadow-sm border border-slate-100 cursor-pointer">
                  <img src={img} alt="Project work" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <span className="text-white font-bold text-sm tracking-wide">View Image</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-slate-50 p-6 md:p-8 border-t border-slate-100 flex flex-col sm:flex-row gap-4">
            <button className="flex-1 flex justify-center items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white py-3.5 px-6 rounded-xl font-extrabold shadow-lg shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200">
              <IconPhone size={20} />
              Call Directly
            </button>
            <PremiumGate feature="whatsappLeadIntegration" fallbackMessage="Direct WhatsApp Lead integration is a Pro feature. Upgrade to get instant chat redirection to builder agents.">
              <button 
                onClick={() => window.open(`https://wa.me/${selectedBuilder.whatsapp}`, "_blank")}
                className="flex-1 flex justify-center items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white py-3.5 px-6 rounded-xl font-extrabold shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer w-full"
              >
                <IconBrandWhatsapp size={20} />
                WhatsApp Message
              </button>
            </PremiumGate>
          </div>

        </div>
      </div>
    );
  }

  // --- VIEW 2: Main Grid View (Sleek Card Theme) ---
  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-10 mb-10 text-left">
      
      {/* Header Section */}
      <div className="flex items-center gap-3 mb-8 px-2">
        <div className="bg-blue-100 text-blue-600 p-2.5 rounded-xl">
          <IconHelmet size={28} />
        </div>
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">Verified Builders</h2>
          <p className="text-slate-500 text-sm font-semibold">Top-rated professionals vetted by PropSight AI.</p>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {builders.map((builder) => (
          <div 
            key={builder.id} 
            className="bg-white rounded-3xl p-6 md:p-8 shadow-xl shadow-slate-100/80 border border-slate-100 hover:border-blue-200 hover:shadow-blue-500/10 flex flex-col justify-between group hover:-translate-y-1 transition-all duration-300"
          >
            {/* Top Row: Name + Badge + Rating */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">{builder.name}</h3>
                <div className="flex items-center gap-1 mt-1.5">
                  <IconRosetteDiscountCheckFilled size={16} className="text-emerald-500" />
                  <span className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded-md">Verified</span>
                </div>
              </div>
              
              {/* Rating Pill */}
              <div className="bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100 flex items-center gap-1">
                <IconStarFilled size={14} className="text-yellow-400" />
                <span className="text-slate-700 text-sm font-extrabold">{builder.rating}</span>
              </div>
            </div>

            {/* Specialty & Location */}
            <div className="mb-6 space-y-2.5 border-b border-slate-100 pb-6">
              <div className="flex items-center text-sm font-semibold text-slate-500 gap-2">
                <IconBuildingSkyscraper size={18} className="text-slate-400" />
                {builder.specialty}
              </div>
              <div className="flex items-center text-sm font-semibold text-slate-500 gap-2">
                <IconMapPin size={18} className="text-slate-400" />
                {builder.city}
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
                <span className="block text-xl font-extrabold text-slate-900">{builder.projectsCompleted}</span>
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Projects</span>
              </div>
              <div className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
                <span className="block text-xl font-extrabold text-slate-900">{builder.experience}</span>
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Experience</span>
              </div>
            </div>

            {/* View Portfolio Button */}
            <button 
              onClick={() => setSelectedBuilder(builder)}
              className="w-full bg-slate-50 group-hover:bg-blue-600 text-slate-600 group-hover:text-white py-3 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2"
            >
              View Full Profile
            </button>
            
          </div>
        ))}
      </div>
    </div>
  );
};

export default BuilderProfiles;