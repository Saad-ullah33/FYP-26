import React, { useEffect, useRef, useState } from 'react';
import { IconBrain, IconArrowRight, IconPlus } from '@tabler/icons-react';

const CtaBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId;
    let time = 0;

    const handleResize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
    };
    window.addEventListener("resize", handleResize);
    handleResize();

    const nodeCount = 35; // Lightweight count for performance
    const connectionDistance = 140;
    const nodes = [];

    const mouse = { x: null, y: null, radius: 150 };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    const parent = canvas.parentElement;
    if (parent) {
      parent.addEventListener("mousemove", handleMouseMove);
      parent.addEventListener("mouseleave", handleMouseLeave);
    }

    // Volumetric Glows
    const glows = [
      { x: canvas.width * 0.1, y: canvas.height * 0.3, vx: 0.08, vy: 0.05, radius: 280, color: "rgba(14, 165, 233, 0.04)" },
      { x: canvas.width * 0.8, y: canvas.height * 0.7, vx: -0.06, vy: 0.04, radius: 320, color: "rgba(99, 102, 241, 0.04)" },
    ];

    const width = canvas.width || 800;
    const height = canvas.height || 400;

    for (let i = 0; i < nodeCount; i++) {
      const vx = (Math.random() - 0.5) * 0.18;
      const vy = (Math.random() - 0.5) * 0.18;
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx,
        vy,
        baseVx: vx,
        baseVy: vy,
        radius: Math.random() * 1.3 + 0.8,
        color: Math.random() > 0.8 ? "#38bdf8" : "rgba(14, 165, 233, 0.75)",
        pulse: Math.random() * Math.PI,
        pulseSpeed: 0.01 + Math.random() * 0.01,
      });
    }

    const render = () => {
      if (canvas.width === 0 || canvas.height === 0) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      time += 0.015;

      // Deep Space background
      ctx.fillStyle = "#020714";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Render Volumetric Nebulas
      glows.forEach((glow) => {
        glow.x += glow.vx;
        glow.y += glow.vy;

        if (glow.x < 0 || glow.x > canvas.width) glow.vx *= -1;
        if (glow.y < 0 || glow.y > canvas.height) glow.vy *= -1;

        const gradient = ctx.createRadialGradient(glow.x, glow.y, 5, glow.x, glow.y, glow.radius);
        gradient.addColorStop(0, glow.color);
        gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(glow.x, glow.y, glow.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // ── DRAW CONSTELLATION LINES ──
      for (let i = 0; i < nodeCount; i++) {
        const nA = nodes[i];

        if (mouse.x !== null && mouse.y !== null) {
          const mdx = nA.x - mouse.x;
          const mdy = nA.y - mouse.y;
          const mdist = Math.sqrt(mdx * mdx + mdy * mdy);

          if (mdist < mouse.radius) {
            const mAlpha = (1 - mdist / mouse.radius) * 0.35;
            ctx.beginPath();
            ctx.moveTo(nA.x, nA.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(56, 189, 248, ${mAlpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }

        for (let j = i + 1; j < nodeCount; j++) {
          const nB = nodes[j];
          const dx = nA.x - nB.x;
          const dy = nA.y - nB.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDistance) {
            const alpha = (1 - dist / connectionDistance) * 0.35;
            ctx.beginPath();
            ctx.moveTo(nA.x, nA.y);
            ctx.lineTo(nB.x, nB.y);
            ctx.strokeStyle = `rgba(14, 165, 233, ${alpha})`;
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
        }
      }

      // ── UPDATE & DRAW CORE PARTICLES ──
      nodes.forEach((node) => {
        if (mouse.x !== null && mouse.y !== null) {
          const mdx = mouse.x - node.x;
          const mdy = mouse.y - node.y;
          const mdist = Math.sqrt(mdx * mdx + mdy * mdy);

          // Mathematical shield to prevent division-by-zero or NaN propagation
          if (mdist < mouse.radius && mdist > 1.0) {
            const pull = (1.0 - mdist / mouse.radius) * 0.008;
            node.vx += (mdx / mdist) * pull;
            node.vy += (mdy / mdist) * pull;
          }
        }

        node.vx *= 0.985;
        node.vy *= 0.985;

        const speed = Math.sqrt(node.vx * node.vx + node.vy * node.vy);
        const maxSpeed = 0.9;
        if (speed > maxSpeed) {
          node.vx = (node.vx / speed) * maxSpeed;
          node.vy = (node.vy / speed) * maxSpeed;
        }

        node.vx = node.vx * 0.98 + node.baseVx * 0.02;
        node.vy = node.vy * 0.98 + node.baseVy * 0.02;

        node.x += node.vx;
        node.y += node.vy;

        if (node.x < 0) {
          node.x = 0;
          node.vx *= -1;
          node.baseVx *= -1;
        } else if (node.x > canvas.width) {
          node.x = canvas.width;
          node.vx *= -1;
          node.baseVx *= -1;
        }

        if (node.y < 0) {
          node.y = 0;
          node.vy *= -1;
          node.baseVy *= -1;
        } else if (node.y > canvas.height) {
          node.y = canvas.height;
          node.vy *= -1;
          node.baseVy *= -1;
        }

        node.pulse += node.pulseSpeed;
        const radiusGlow = node.radius + Math.sin(node.pulse) * 0.3;

        ctx.beginPath();
        ctx.arc(node.x, node.y, radiusGlow, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      if (parent) {
        parent.removeEventListener("mousemove", handleMouseMove);
        parent.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full block pointer-events-none" 
      style={{ zIndex: 0 }}
    />
  );
};

export const HomeCta = () => {
  return (
    <div className="w-full bg-white py-16 px-6 md:px-12 lg:px-20">
      
      {/* ── CARD CAPSULED CONTAINER ── */}
      <div className="relative w-full max-w-[1400px] mx-auto rounded-3xl overflow-hidden shadow-2xl shadow-slate-900/10 border border-slate-800 bg-slate-950 flex flex-col md:flex-row items-center justify-between gap-10 p-8 md:p-16">
        
        {/* Integrated interactive canvas neural background */}
        <CtaBackground />

        {/* Ambient Overlay Layer */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-slate-950/20"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/60 via-transparent to-slate-950/40"></div>
        </div>

        {/* ── LEFT COLUMN: TYPOGRAPHY (z-20 to sit on top of background) ── */}
        <div className="relative z-20 flex flex-col items-start text-left max-w-xl space-y-4">
          
          {/* Badge */}
          <div className="flex items-center gap-1.5 px-3.5 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-extrabold uppercase tracking-widest rounded-full">
            <IconBrain size={12} className="shrink-0 animate-pulse" />
            <span>AI Real Estate Analytics</span>
          </div>

          {/* Heading */}
          <h2 className="text-3xl md:text-5xl font-extrabold text-white leading-tight">
            Unlock Smarter Property Decisions with <br />
            <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400 text-transparent bg-clip-text">
              Artificial Intelligence
            </span>
          </h2>

          {/* Description */}
          <p className="text-slate-300 text-sm md:text-base leading-relaxed font-medium">
            Step into the future of real estate. PropSightAi connects real-time market data, predictive valuation engines, and secure digital bidding to deliver unmatched transparency.
          </p>
        </div>

        {/* ── RIGHT COLUMN: CTAS (z-20 to sit on top of background) ── */}
        <div className="relative z-20 flex flex-col sm:flex-row md:flex-col gap-4 w-full sm:w-auto shrink-0 min-w-[240px]">
          
          {/* Primary Button */}
          <button className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 px-8 py-4 h-13 text-sm tracking-wide flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer w-full">
            <span>Get AI Valuation</span>
            <IconArrowRight size={15} />
          </button>

          {/* Secondary Button */}
          <button className="bg-slate-900/60 backdrop-blur-md border border-slate-800 hover:border-slate-700 text-slate-100 font-bold rounded-xl px-8 py-4 h-13 text-sm flex items-center justify-center gap-2 hover:bg-slate-900/90 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer w-full">
            <IconPlus size={15} />
            <span>List Your Property</span>
          </button>
        </div>

      </div>
    </div>
  );
};