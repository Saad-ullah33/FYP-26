import { Button, Select, TextInput } from '@mantine/core';
import React, { useState } from 'react';
import { IconChevronDown } from '@tabler/icons-react';
import NodesAnimation from '../animations/NodesAnimation'; // Ensure correct folder path

const DreamProp = () => {
  const [city, setCity] = useState('Islamabad');
  const [propertyType, setPropertyType] = useState('Homes');
  const [active, setActive] = useState('Buy');
  const buttons = ['Buy', 'Rent', 'Projects'];

  return (
    <div className="relative w-full h-screen overflow-hidden flex items-center justify-center bg-slate-950">
      
      {/* ── LAYER 0: SPINNING INTERACTIVE NEURAL NETWORK ── */}
      <NodesAnimation />

      {/* ── LAYER 1: AMBIENT VECTORS & GRADIENTS ── */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 10 }}>
        {/* Soft edge gradients to smoothly blend the canvas coordinates with the dark viewport */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-slate-950/20"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/20 via-transparent to-slate-950/25"></div>
        
        {/* Faint blue ambient glows radiating behind the search widget console */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[140px]"></div>
      </div>

      {/* ── LAYER 2: MAIN HERO CONTAINER ── */}
      <div className="relative flex flex-col items-center justify-center w-full max-w-5xl px-6 text-center" style={{ zIndex: 20 }}>
        
        {/* Header Titles */}
        <div className="space-y-3 mb-8">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Find Your Dream Property, <br />
            <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400 text-transparent bg-clip-text">
              Powered by PropSightAi
            </span>
          </h1>
          <p className="text-slate-300 text-xs md:text-sm max-w-lg mx-auto font-medium">
            Analyze spatial nodes, live project listings, and smart real estate metrics.
          </p>
        </div>

        {/* ── SEGMENTED TAB SELECTORS (Unified Glass Capsule) ── */}
        <div className="flex gap-1.5 p-1.5 bg-black/35 backdrop-blur-md border border-white/10 rounded-full mb-6 shadow-xl">
          {buttons.map((label) => (
            <Button
              key={label}
              variant={active === label ? 'filled' : 'subtle'}
              styles={() => ({
                root: {
                  minWidth: 110,
                  height: 40,
                  borderRadius: '9999px',
                  fontWeight: 700,
                  fontSize: '13px',
                  letterSpacing: '0.3px',
                  color: active === label ? '#0f172a' : 'rgba(255, 255, 255, 0.85)',
                  backgroundColor: active === label ? '#ffffff' : 'transparent',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: active === label ? '0 4px 12px rgba(255, 255, 255, 0.15)' : 'none',
                  '&:hover': {
                    backgroundColor: active === label ? '#ffffff' : 'rgba(255, 255, 255, 0.08)',
                    color: active === label ? '#0f172a' : '#ffffff',
                  },
                },
              })}
              onClick={() => setActive(label)}
            >
              {label}
            </Button>
          ))}
        </div>

        {/* ── CONSOLE SEARCH WIDGET (Translucent Glass Board) ── */}
        <div className="w-full bg-slate-900/35 p-5 md:p-6 rounded-2xl border border-slate-800/70 backdrop-blur-lg shadow-2xl shadow-black/50">
          
          {/* ── FLOATING SOLID INPUT CARDS (UX Redesigned) ── */}
          <div className="flex flex-col md:flex-row gap-3.5 w-full">
            
            {/* 1. CITY CARD */}
            <div className="bg-[#0e172a] hover:bg-[#131e35] border border-slate-800/90 hover:border-slate-700/90 focus-within:border-blue-500/80 focus-within:ring-2 focus-within:ring-blue-500/15 flex-1 p-3 rounded-xl flex flex-col justify-center h-16 relative cursor-pointer transition-all duration-200 shadow-lg shadow-black/40 group">
              <span className="text-[10px] font-extrabold text-blue-400 uppercase tracking-widest text-left pl-1">
                City
              </span>
              <Select 
                variant="unstyled"
                value={city}
                onChange={setCity}
                data={['Islamabad', 'Lahore', 'Karachi']}
                rightSection={<IconChevronDown size={14} className="text-slate-400 group-hover:text-blue-400 transition-colors" />}
                styles={{
                  root: {
                    position: 'relative', // Fixes the displaced chevron position
                    width: '100%'
                  },
                  input: { 
                    border: 'none',
                    background: 'transparent',
                    height: 'auto',
                    minHeight: 'unset',
                    padding: '4px 24px 0 4px', // Safe right padding for arrow
                    fontWeight: 800, 
                    color: '#ffffff', // High-contrast pure white
                    fontSize: '14.5px',
                    textAlign: 'left'
                  },
                  rightSection: {
                    right: '8px',
                    pointerEvents: 'none'
                  },
                  dropdown: {
                    backgroundColor: '#090d16',
                    border: '1px solid #1e293b',
                    color: '#f8fafc',
                    borderRadius: '12px'
                  },
                  item: {
                    color: '#cbd5e1',
                    fontSize: '13.5px',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    '&[data-hovered]': {
                      backgroundColor: '#1e293b',
                      color: '#ffffff'
                    },
                    '&[data-selected]': {
                      backgroundColor: '#3b82f6',
                      color: '#ffffff'
                    }
                  }
                }}
              />
            </div>

            {/* 2. LOCATION CARD */}
            <div className="bg-[#0e172a] hover:bg-[#131e35] border border-slate-800/90 hover:border-slate-700/90 focus-within:border-blue-500/80 focus-within:ring-2 focus-within:ring-blue-500/15 flex-[2] p-3 rounded-xl flex flex-col justify-center h-16 relative cursor-pointer transition-all duration-200 shadow-lg shadow-black/40 group">
              <span className="text-[10px] font-extrabold text-blue-400 uppercase tracking-widest text-left pl-1">
                Location
              </span>
              <TextInput
                variant="unstyled"
                placeholder="DHA, Bahria Town, etc."
                styles={{
                  input: { 
                    border: 'none',
                    background: 'transparent',
                    height: 'auto',
                    minHeight: 'unset',
                    padding: '4px 0 0 4px',
                    color: '#ffffff', // Pure white value
                    fontWeight: 700,
                    fontSize: '14.5px',
                    textAlign: 'left',
                    '&::placeholder': {
                      color: '#94a3b8' // High-contrast readable gray placeholder
                    }
                  }
                }}
              />
            </div>

            {/* 3. PROPERTY TYPE CARD */}
            <div className="bg-[#0e172a] hover:bg-[#131e35] border border-slate-800/90 hover:border-slate-700/90 focus-within:border-blue-500/80 focus-within:ring-2 focus-within:ring-blue-500/15 flex-1 p-3 rounded-xl flex flex-col justify-center h-16 relative cursor-pointer transition-all duration-200 shadow-lg shadow-black/40 group">
              <span className="text-[10px] font-extrabold text-blue-400 uppercase tracking-widest text-left pl-1">
                Property Type
              </span>
              <Select 
                variant="unstyled"
                value={propertyType}
                onChange={setPropertyType}
                data={['Homes', 'Plots', 'Commercial']}
                rightSection={<IconChevronDown size={14} className="text-slate-400 group-hover:text-blue-400 transition-colors" />}
                styles={{
                  root: {
                    position: 'relative',
                    width: '100%'
                  },
                  input: { 
                    border: 'none',
                    background: 'transparent',
                    height: 'auto',
                    minHeight: 'unset',
                    padding: '4px 24px 0 4px',
                    fontWeight: 800, 
                    color: '#ffffff',
                    fontSize: '14.5px',
                    textAlign: 'left'
                  },
                  rightSection: {
                    right: '8px',
                    pointerEvents: 'none'
                  },
                  dropdown: {
                    backgroundColor: '#090d16',
                    border: '1px solid #1e293b',
                    color: '#f8fafc',
                    borderRadius: '12px'
                  },
                  item: {
                    color: '#cbd5e1',
                    fontSize: '13.5px',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    '&[data-hovered]': {
                      backgroundColor: '#1e293b',
                      color: '#ffffff'
                    },
                    '&[data-selected]': {
                      backgroundColor: '#3b82f6',
                      color: '#ffffff'
                    }
                  }
                }}
              />
            </div>

          </div>

          {/* Premium Blue gradient CTA Button */}
          <div className="flex justify-center mt-5">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 px-14 h-13 tracking-wide hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            >
              FIND PROPERTY
            </Button>
          </div>
        
        </div>

      </div>
    </div>
  );
};

export default DreamProp;