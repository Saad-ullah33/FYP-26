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
    const nodes = [];
    const ripples = [];
    const pulses = [];

    // ── NEURAL NETWORK CONFIGURATION ──
    const isMobile = window.innerWidth < 768;
    const nodeCount = isMobile ? 35 : 100;
    const connectionDistance = 145; // Constellation link distance

    const mouse = { x: null, y: null, radius: 170 };
    const smoothMouse = { x: null, y: null };

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

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    const handleMouseDown = (e) => {
      // Create expanding shockwave ripple on click
      ripples.push({
        x: e.clientX,
        y: e.clientY,
        radius: 0,
        maxRadius: isMobile ? 200 : 280,
        speed: 5.0,
        force: 6.5
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("mousedown", handleMouseDown);

    // Drifting ambient nebula glows
    const glows = [
      { x: window.innerWidth * 0.2, y: window.innerHeight * 0.3, vx: 0.05, vy: 0.03, radius: 450, baseRadius: 450, color: "rgba(14, 165, 233, 0.06)", phase: 0 },
      { x: window.innerWidth * 0.8, y: window.innerHeight * 0.7, vx: -0.04, vy: 0.03, radius: 550, baseRadius: 550, color: "rgba(99, 102, 241, 0.05)", phase: Math.PI / 2 },
      { x: window.innerWidth * 0.5, y: window.innerHeight * 0.4, vx: 0.03, vy: -0.03, radius: 350, baseRadius: 350, color: "rgba(6, 182, 212, 0.05)", phase: Math.PI },
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

      // Smooth mouse coordinates interpolation (lag/inertia)
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

      // Draw drifting Volumetric Nebulas with breathing radius
      glows.forEach((glow) => {
        glow.x += glow.vx;
        glow.y += glow.vy;

        if (glow.x < 0 || glow.x > canvas.width) glow.vx *= -1;
        if (glow.y < 0 || glow.y > canvas.height) glow.vy *= -1;

        glow.phase += 0.002;
        glow.radius = glow.baseRadius + Math.sin(glow.phase) * 60;

        const gradient = ctx.createRadialGradient(glow.x, glow.y, 5, glow.x, glow.y, glow.radius);
        gradient.addColorStop(0, glow.color);
        gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(glow.x, glow.y, glow.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // ── DRAW SPOTLIGHT GEOMETRIC CO-ORDINATE GRID (AI Spatial Architecture) ──
      if (smoothMouse.x !== null && smoothMouse.y !== null) {
        const gridSize = isMobile ? 80 : 100;
        const cols = Math.ceil(canvas.width / gridSize);
        const rows = Math.ceil(canvas.height / gridSize);
        const spotlightRadius = 240;

        ctx.lineWidth = 0.5;

        // Verticals spotlight rendering
        for (let c = 0; c <= cols; c++) {
          const x = c * gridSize;
          const distToMouse = Math.abs(x - smoothMouse.x);
          if (distToMouse < spotlightRadius) {
            const gridAlpha = (1 - distToMouse / spotlightRadius) * 0.045;
            ctx.strokeStyle = `rgba(56, 189, 248, ${gridAlpha})`;
            ctx.beginPath();
            ctx.moveTo(x, Math.max(0, smoothMouse.y - spotlightRadius));
            ctx.lineTo(x, Math.min(canvas.height, smoothMouse.y + spotlightRadius));
            ctx.stroke();
          }
        }

        // Horizontals spotlight rendering
        for (let r = 0; r <= rows; r++) {
          const y = r * gridSize;
          const distToMouse = Math.abs(y - smoothMouse.y);
          if (distToMouse < spotlightRadius) {
            const gridAlpha = (1 - distToMouse / spotlightRadius) * 0.045;
            ctx.strokeStyle = `rgba(56, 189, 248, ${gridAlpha})`;
            ctx.beginPath();
            ctx.moveTo(Math.max(0, smoothMouse.x - spotlightRadius), y);
            ctx.lineTo(Math.min(canvas.width, smoothMouse.x + spotlightRadius), y);
            ctx.stroke();
          }
        }
      }

      // Update and Draw Click Ripples Shockwaves
      for (let r = ripples.length - 1; r >= 0; r--) {
        const rip = ripples[r];
        rip.radius += rip.speed;

        if (rip.radius > rip.maxRadius) {
          ripples.splice(r, 1);
          continue;
        }

        const ripAlpha = (1 - rip.radius / rip.maxRadius) * 0.12;
        ctx.beginPath();
        ctx.arc(rip.x, rip.y, rip.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(56, 189, 248, ${ripAlpha})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // ── 1. DRAW CONSTELLATION LINES ──
      for (let i = 0; i < nodeCount; i++) {
        const nA = nodes[i];

        // Soft cursor attraction connection (utilizing smooth coordinates)
        if (smoothMouse.x !== null && smoothMouse.y !== null) {
          const mdx = nA.x - smoothMouse.x;
          const mdy = nA.y - smoothMouse.y;
          const mdist = Math.sqrt(mdx * mdx + mdy * mdy);

          if (mdist < mouse.radius) {
            const mAlpha = (1 - mdist / mouse.radius) * 0.32;
            ctx.beginPath();
            ctx.moveTo(nA.x, nA.y);
            ctx.lineTo(smoothMouse.x, smoothMouse.y);
            ctx.strokeStyle = `rgba(56, 189, 248, ${mAlpha})`;
            ctx.lineWidth = 0.7;
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
            const alpha = (1 - dist / connectionDistance) * 0.35;
            ctx.beginPath();
            ctx.moveTo(nA.x, nA.y);
            ctx.lineTo(nB.x, nB.y);
            
            ctx.strokeStyle = `rgba(14, 165, 233, ${alpha})`; 
            ctx.lineWidth = 0.6; 
            ctx.stroke();
          }
        }
      }

      // ── 2. SPAWN DATA SIGNAL PULSES (AI Signal Transmission Flow) ──
      if (Math.random() < 0.02 && pulses.length < (isMobile ? 4 : 10)) {
        const startIdx = Math.floor(Math.random() * nodeCount);
        const startNode = nodes[startIdx];
        
        // Locate valid close neighbor nodes
        const neighbors = [];
        for (let j = 0; j < nodeCount; j++) {
          if (startIdx === j) continue;
          const neighbor = nodes[j];
          const dx = startNode.x - neighbor.x;
          const dy = startNode.y - neighbor.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < connectionDistance) {
            neighbors.push(j);
          }
        }

        if (neighbors.length > 0) {
          const targetIdx = neighbors[Math.floor(Math.random() * neighbors.length)];
          pulses.push({
            start: startIdx,
            target: targetIdx,
            progress: 0,
            speed: 0.015 + Math.random() * 0.015
          });
        }
      }

      // Render and update active signal pulses
      for (let p = pulses.length - 1; p >= 0; p--) {
        const pulse = pulses[p];
        pulse.progress += pulse.speed;

        if (pulse.progress >= 1) {
          pulses.splice(p, 1);
          continue;
        }

        const nodeStart = nodes[pulse.start];
        const nodeTarget = nodes[pulse.target];

        if (nodeStart && nodeTarget) {
          const px = nodeStart.x + (nodeTarget.x - nodeStart.x) * pulse.progress;
          const py = nodeStart.y + (nodeTarget.y - nodeStart.y) * pulse.progress;

          ctx.beginPath();
          ctx.arc(px, py, 1.8, 0, Math.PI * 2);
          ctx.fillStyle = "#e0f2fe";
          ctx.fill();
        }
      }

      // ── 3. UPDATE & DRAW CORE PARTICLES ──
      nodes.forEach((node) => {
        // Slow mouse drift interaction (attracts to smooth interpolated cursor coordinates)
        if (smoothMouse.x !== null && smoothMouse.y !== null) {
          const mdx = smoothMouse.x - node.x;
          const mdy = smoothMouse.y - node.y;
          const mdist = Math.sqrt(mdx * mdx + mdy * mdy);

          // Divide-by-zero protection
          if (mdist < mouse.radius && mdist > 1.0) {
            const pull = (1.0 - mdist / mouse.radius) * 0.01;
            node.vx += (mdx / mdist) * pull;
            node.vy += (mdy / mdist) * pull;
          }
        }

        // Apply ripples shockwave force
        ripples.forEach((rip) => {
          const rdx = node.x - rip.x;
          const rdy = node.y - rip.y;
          const rdist = Math.sqrt(rdx * rdx + rdy * rdy);
          const diff = Math.abs(rdist - rip.radius);

          if (diff < 35 && rdist > 0) {
            const push = (1 - diff / 35) * rip.force * 0.35;
            node.vx += (rdx / rdist) * push;
            node.vy += (rdy / rdist) * push;
          }
        });

        node.vx *= 0.98;
        node.vy *= 0.98;

        // Cap speed
        const speed = Math.sqrt(node.vx * node.vx + node.vy * node.vy);
        const maxSpeed = 1.1;
        if (speed > maxSpeed) {
          node.vx = (node.vx / speed) * maxSpeed;
          node.vy = (node.vy / speed) * maxSpeed;
        }

        // Return to base drift velocity smoothly
        node.vx = node.vx * 0.985 + node.baseVx * 0.015;
        node.vy = node.vy * 0.985 + node.baseVy * 0.015; 
        
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
      window.removeEventListener("mousedown", handleMouseDown);
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