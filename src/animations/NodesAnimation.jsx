import React, { useEffect, useRef } from "react";

const NodesAnimation = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId;
    let time = 0;

    // ── RESIZE SYSTEM (Proportionally scales nodes to keep them on screen) ──
    const handleResize = () => {
      const prevW = canvas.width;
      const prevH = canvas.height;
      
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      // Scale nodes proportionately on window resize to prevent them from getting lost
      if (prevW > 0 && prevH > 0 && nodes.length > 0) {
        nodes.forEach((node) => {
          node.x = (node.x / prevW) * canvas.width;
          node.y = (node.y / prevH) * canvas.height;
        });
      }
    };
    window.addEventListener("resize", handleResize);

    // ── NEURAL NETWORK CONFIGURATION ──
    const isMobile = window.innerWidth < 768;
    const nodeCount = isMobile ? 35 : 100;
    const connectionDistance = 145; // Constellation link distance
    const nodes = [];

    const mouse = { x: null, y: null, radius: 160 };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    // Drifting ambient nebula glows
    const glows = [
      { x: window.innerWidth * 0.2, y: window.innerHeight * 0.3, vx: 0.05, vy: 0.03, radius: 450, color: "rgba(14, 165, 233, 0.05)" },
      { x: window.innerWidth * 0.8, y: window.innerHeight * 0.7, vx: -0.04, vy: 0.03, radius: 550, color: "rgba(99, 102, 241, 0.04)" },
      { x: window.innerWidth * 0.5, y: window.innerHeight * 0.4, vx: 0.03, vy: -0.03, radius: 350, color: "rgba(6, 182, 212, 0.04)" },
    ];

    // Initialize Nodes safely using immediate window measurements
    const width = window.innerWidth || 800;
    const height = window.innerHeight || 600;

    for (let i = 0; i < nodeCount; i++) {
      const vx = (Math.random() - 0.5) * 0.16; // Ultra-slow drift
      const vy = (Math.random() - 0.5) * 0.16;
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx,
        vy,
        baseVx: vx,
        baseVy: vy,
        radius: Math.random() * 1.3 + 0.9,
        color: Math.random() > 0.85 ? "#38bdf8" : "rgba(14, 165, 233, 0.85)", 
        pulse: Math.random() * Math.PI,
        pulseSpeed: 0.01 + Math.random() * 0.01,
      });
    }

    // Force layout update on initial load
    handleResize();

    // ── RENDER LOOP ──
    const render = () => {
      if (canvas.width === 0 || canvas.height === 0) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      time += 0.015;

      // Dark space background base
      ctx.fillStyle = "#020714"; 
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw drifting Volumetric Nebulas
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

      // ── 1. DRAW CONSTELLATION LINES ──
      for (let i = 0; i < nodeCount; i++) {
        const nA = nodes[i];

        // Soft cursor attraction connection
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

        // Inter-node connections
        for (let j = i + 1; j < nodeCount; j++) {
          const nB = nodes[j];
          const dx = nA.x - nB.x;
          const dy = nA.y - nB.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDistance) {
            const alpha = (1 - dist / connectionDistance) * 0.38;
            ctx.beginPath();
            ctx.moveTo(nA.x, nA.y);
            ctx.lineTo(nB.x, nB.y);
            
            ctx.strokeStyle = `rgba(14, 165, 233, ${alpha})`; 
            ctx.lineWidth = 0.8; 
            ctx.stroke();
          }
        }
      }

      // ── 2. UPDATE & DRAW CORE PARTICLES ──
      nodes.forEach((node) => {
        // Slow mouse drift interaction
        if (mouse.x !== null && mouse.y !== null) {
          const mdx = mouse.x - node.x;
          const mdy = mouse.y - node.y;
          const mdist = Math.sqrt(mdx * mdx + mdy * mdy);

          // MATHEMATICAL SHIELD (mdist > 1.0): Prevents division-by-zero and NaN node deletion!
          if (mdist < mouse.radius && mdist > 1.0) {
            const pull = (1.0 - mdist / mouse.radius) * 0.008;
            node.vx += (mdx / mdist) * pull;
            node.vy += (mdy / mdist) * pull;
          }
        }

        node.vx *= 0.985;
        node.vy *= 0.985;

        // Cap speed
        const speed = Math.sqrt(node.vx * node.vx + node.vy * node.vy);
        const maxSpeed = 0.9;
        if (speed > maxSpeed) {
          node.vx = (node.vx / speed) * maxSpeed;
          node.vy = (node.vy / speed) * maxSpeed;
        }

        // Return to base drift velocity smoothly (Inverted Y-decay)
        node.vx = node.vx * 0.98 + node.baseVx * 0.02;
        node.vy = node.vy * 0.98 + node.baseVy * 0.02; 
        
        node.x += node.vx;
        node.y += node.vy;

        // Strict boundary collision bounds (Keeps nodes locked inside viewport)
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
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full block pointer-events-none" 
      style={{ 
        zIndex: 0,
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'block',
        backgroundColor: '#020714'
      }}
    />
  );
};

export default NodesAnimation;