import React, { useEffect, useRef } from "react";

/**
 * NodesAnimation component
 * Renders the custom generated dotted world map background (world-map-bg.png)
 * with enhanced visibility and a clean, lightweight interactive cursor HUD overlay.
 */
const NodesAnimation = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId;
    
    const X_MIN = 0;
    const Y_MIN = 0;
    const W_SRC = 1024;
    const H_SRC = 558;

    const ripples = [];

    const mouse = { x: null, y: null, radius: 150 };
    const smoothMouse = { x: null, y: null };

    // Set pixel ratio sharp canvas size
    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    const handleMouseDown = (e) => {
      const rect = canvas.getBoundingClientRect();
      ripples.push({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        radius: 0,
        maxRadius: 220,
        speed: 4.5
      });
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);
    canvas.addEventListener("mousedown", handleMouseDown);

    // Render loop
    const render = () => {
      const dpr = window.devicePixelRatio || 1;
      const wDest = canvas.width / dpr;
      const hDest = canvas.height / dpr;

      ctx.clearRect(0, 0, wDest, hDest);

      // Mouse inertia smoothing
      if (mouse.x !== null && mouse.y !== null) {
        if (smoothMouse.x === null || smoothMouse.y === null) {
          smoothMouse.x = mouse.x;
          smoothMouse.y = mouse.y;
        } else {
          smoothMouse.x += (mouse.x - smoothMouse.x) * 0.08;
          smoothMouse.y += (mouse.y - smoothMouse.y) * 0.08;
        }
      } else {
        smoothMouse.x = null;
        smoothMouse.y = null;
      }

      // ── MATHEMATICAL GEOGRAPHIC PROJECTION MATRIX ──
      const scale = Math.max(wDest / W_SRC, hDest / H_SRC);
      const wScaled = W_SRC * scale;
      const hScaled = H_SRC * scale;
      const xOffset = (wDest - wScaled) / 2;
      const yOffset = (hDest - hScaled) / 2;

      const unprojectX = (canvasX) => (canvasX - xOffset) / scale + X_MIN;
      const unprojectY = (canvasY) => (canvasY - yOffset) / scale + Y_MIN;

      const baseScaleMultiplier = Math.min(1.5, Math.max(0.65, scale));

      // Translate mouse coordinates to SVG space for coordinate display
      const mouseSvgX = smoothMouse.x !== null ? unprojectX(smoothMouse.x) : null;
      const mouseSvgY = smoothMouse.y !== null ? unprojectY(smoothMouse.y) : null;

      // ── 1. RENDER MOUSE INTERACTIVE COORDINATE GRID (Spotlight) ──
      if (smoothMouse.x !== null && smoothMouse.y !== null) {
        const spotlightRadius = 160 * baseScaleMultiplier;
        const gradient = ctx.createRadialGradient(
          smoothMouse.x, smoothMouse.y, 5,
          smoothMouse.x, smoothMouse.y, spotlightRadius
        );
        gradient.addColorStop(0, "rgba(56, 189, 248, 0.05)");
        gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(smoothMouse.x, smoothMouse.y, spotlightRadius, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = "rgba(56, 189, 248, 0.12)";
        ctx.lineWidth = 0.5 * baseScaleMultiplier;
        ctx.beginPath();
        ctx.moveTo(smoothMouse.x - 30 * baseScaleMultiplier, smoothMouse.y);
        ctx.lineTo(smoothMouse.x + 30 * baseScaleMultiplier, smoothMouse.y);
        ctx.moveTo(smoothMouse.x, smoothMouse.y - 30 * baseScaleMultiplier);
        ctx.lineTo(smoothMouse.x, smoothMouse.y + 30 * baseScaleMultiplier);
        ctx.stroke();

        ctx.fillStyle = "rgba(56, 189, 248, 0.4)";
        ctx.font = `${Math.floor(8 * baseScaleMultiplier)}px monospace`;
        ctx.textAlign = "left";
        ctx.fillText(`SYS_NODE: [${Math.floor(mouseSvgX)}, ${Math.floor(mouseSvgY)}]`, smoothMouse.x + 12 * baseScaleMultiplier, smoothMouse.y - 12 * baseScaleMultiplier);
      }

      // ── 2. DRAW AND UPDATE CLICK RIPPLES ──
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.radius += r.speed;

        if (r.radius > r.maxRadius) {
          ripples.splice(i, 1);
          continue;
        }

        const alpha = (1 - r.radius / r.maxRadius) * 0.15;
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
        ctx.lineWidth = 1 * baseScaleMultiplier;
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      canvas.removeEventListener("mousedown", handleMouseDown);
    };
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden bg-[#020714]">
      {/* Custom Dotted World Map Graphic with Increased Visibility */}
      <img 
        src="/world-map-bg.png" 
        alt="World Map Grid"
        className="absolute inset-0 w-full h-full object-cover opacity-[0.55] mix-blend-screen pointer-events-none select-none"
      />
      {/* Soft edge vertical vignette gradient to blend with landing pages */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#020714] via-transparent to-[#020714] opacity-55 pointer-events-none" />

      {/* Animation Canvas */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full block pointer-events-auto" 
        style={{ zIndex: 5 }}
      />
    </div>
  );
};

export default NodesAnimation;