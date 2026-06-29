import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import NodesAnimation from '../animations/NodesAnimation';
import { motion } from 'framer-motion';

// ── Native styled select (no Mantine dependency) ──────────────────────────────
const NativeSelect = ({ label, value, onChange, options }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="flex-1 relative" ref={ref}>
      <div
        onClick={() => setOpen(!open)}
        className="flex flex-col justify-center h-16 px-4 rounded-xl bg-[#0c1628] border border-slate-700/70 hover:border-blue-500/60 cursor-pointer transition-all duration-200 group"
      >
        <span className="text-[10px] font-extrabold text-blue-400 uppercase tracking-widest mb-1">{label}</span>
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-slate-100">{value}</span>
          <ChevronDown
            size={14}
            className={`text-slate-400 group-hover:text-blue-400 transition-all duration-200 ${open ? 'rotate-180' : ''}`}
          />
        </div>
      </div>
      {open && (
        <div className="absolute top-[calc(100%+6px)] left-0 right-0 z-50 bg-[#080f1e] border border-slate-700/80 rounded-xl shadow-2xl shadow-black/60 overflow-hidden">
          {options.map((opt) => (
            <div
              key={opt}
              onClick={() => { onChange(opt); setOpen(false); }}
              className={`px-4 py-2.5 text-sm cursor-pointer transition-colors ${
                value === opt
                  ? 'bg-blue-600 text-white font-bold'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ── Main hero component ────────────────────────────────────────────────────────
const DreamProp = () => {
  const navigate = useNavigate();
  const [city, setCity] = useState('Islamabad');
  const [location, setLocation] = useState('');
  const [propertyType, setPropertyType] = useState('Homes');
  const [active, setActive] = useState('Buy');
  const tabs = ['Buy', 'Rent', 'Projects'];
  const cities = ['Islamabad', 'Lahore', 'Karachi', 'Faisalabad', 'Rawalpindi', 'Multan'];
  const types = ['Homes', 'Plots', 'Commercial'];

  const handleSearch = () => {
    if (active === 'Projects') {
      navigate('/property-index');
      return;
    }
    navigate(`/search-results?purpose=${active}&city=${city}&location=${encodeURIComponent(location)}&type=${propertyType}`);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden flex items-center justify-center bg-slate-950">

      {/* ── LAYER 0: WORLD MAP INTERACTIVE BACKGROUND ── */}
      <NodesAnimation />

      {/* ── LAYER 1: AMBIENT GRADIENTS ── */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 10 }}>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-slate-950/30" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-blue-600/8 rounded-full blur-[160px]" />
      </div>

      {/* ── LAYER 2: MAIN HERO CONTAINER ── */}
      <div className="relative flex flex-col items-center justify-center w-full max-w-5xl px-6 text-center" style={{ zIndex: 20 }}>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-3 mb-8"
        >
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Find Your Dream Property, <br />
            <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400 text-transparent bg-clip-text">
              Powered by PropSightAi
            </span>
          </h1>
          <p className="text-slate-400 text-xs md:text-sm max-w-lg mx-auto font-medium">
            Analyze spatial nodes, live project listings, and smart real estate metrics.
          </p>
        </motion.div>

        {/* ── TAB SELECTOR ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="flex gap-1 p-1.5 bg-black/40 backdrop-blur-md border border-white/10 rounded-full mb-6 shadow-xl"
        >
          {tabs.map((label) => (
            <button
              key={label}
              onClick={() => setActive(label)}
              className={`min-w-[110px] h-10 px-5 rounded-full text-[13px] font-bold tracking-wide transition-all duration-200 ${
                active === label
                  ? 'bg-white text-slate-900 shadow-[0_4px_14px_rgba(255,255,255,0.18)]'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              {label}
            </button>
          ))}
        </motion.div>

        {/* ── SEARCH CONSOLE ── */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="w-full bg-slate-900/50 p-5 md:p-6 rounded-2xl border border-slate-700/60 backdrop-blur-xl shadow-2xl shadow-black/60"
        >
          <div className="flex flex-col md:flex-row gap-3.5 w-full">

            {/* City Dropdown */}
            <NativeSelect label="City" value={city} onChange={setCity} options={cities} />

            {/* Location Text Input */}
            <div className="flex-[2] flex flex-col justify-center h-16 px-4 rounded-xl bg-[#0c1628] border border-slate-700/70 hover:border-blue-500/60 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500/20 transition-all duration-200">
              <span className="text-[10px] font-extrabold text-blue-400 uppercase tracking-widest mb-1">Location</span>
              <input
                type="text"
                placeholder="DHA, Bahria Town, etc."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="bg-transparent border-none outline-none text-sm font-bold text-slate-100 placeholder:text-slate-500 w-full"
              />
            </div>

            {/* Property Type Dropdown (hidden for Projects tab) */}
            {active !== 'Projects' ? (
              <NativeSelect label="Property Type" value={propertyType} onChange={setPropertyType} options={types} />
            ) : (
              <div className="flex-1 flex items-center justify-center h-16 rounded-xl border border-dashed border-blue-500/30 bg-blue-500/5">
                <span className="text-xs text-blue-400 font-semibold tracking-wide">Browse All Projects →</span>
              </div>
            )}

          </div>

          {/* CTA Button */}
          <div className="flex justify-center mt-5">
            <button
              onClick={handleSearch}
              className="h-12 px-14 rounded-xl text-[13px] font-extrabold tracking-widest text-white transition-all duration-200 hover:scale-[1.025] hover:shadow-[0_12px_32px_rgba(37,99,235,0.5)] active:scale-[0.98]"
              style={{ background: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 60%, #2563eb 100%)' }}
            >
              {active === 'Projects' ? 'BROWSE PROJECTS' : 'FIND PROPERTY'}
            </button>
          </div>

        </motion.div>
      </div>
    </div>
  );
};

export default DreamProp;