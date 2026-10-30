"use client";

import React, { useEffect, useRef, useState } from "react";
import SplashCursor from "../effects/SplashCursor";
import { useSystem } from "@/app/context/SystemContext";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  pulseSpeed: number;
}

export default function CyberBackground() {
  const { fluidEnabled, currentPaletteColors, fluidIntensity, scanlines } =
    useSystem();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const spotlightRef = useRef<HTMLDivElement | null>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  // Handle smooth cursor light tracking without triggering React component re-renders
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      if (spotlightRef.current) {
        spotlightRef.current.style.background = `radial-gradient(750px circle at ${e.clientX}px ${e.clientY}px, rgba(0, 245, 212, 0.07), rgba(139, 92, 246, 0.04) 40%, transparent 80%)`;
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Neural Particle Constellation + Matrix Rain Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // 1. Initialize Particles (Cyber Dust / Neural Constellation)
    const particleCount = Math.min(Math.floor((width * height) / 30000), 45);
    const particles: Particle[] = [];
    const colors = ["#00f5d4", "#8b5cf6", "#06b6d4", "#f59e0b"];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -0.2 - Math.random() * 0.4, // Gentle upward drift
        size: Math.random() * 2 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.5 + 0.2,
        pulseSpeed: 0.01 + Math.random() * 0.02,
      });
    }

    // 2. Initialize Matrix Rain Drops
    const fontSize = 14;
    const columns = Math.floor(width / fontSize);
    const matrixDrops: number[] = Array.from({ length: columns }, () =>
      Math.floor(Math.random() * -80)
    );
    const chars = "0101011001アイウエオカキクケコサシスセソタチツテトABCDEF";

    const onResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);

    let frame = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      frame++;

      // --- LAYER A: Gentle Matrix Rain (runs every 2 frames for subtle feel) ---
      ctx.fillStyle = "#00f5d4";
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < matrixDrops.length; i += 2) {
        if (frame % 2 === 0) {
          const char = chars[Math.floor(Math.random() * chars.length)];
          const x = i * fontSize;
          const y = matrixDrops[i] * fontSize;

          // Subtle opacity
          ctx.fillStyle = "rgba(0, 245, 212, 0.045)";
          ctx.fillText(char, x, y);

          if (y > height && Math.random() > 0.985) {
            matrixDrops[i] = 0;
          }
          matrixDrops[i]++;
        }
      }

      // --- LAYER B: Neural Particle Constellation with Links ---
      const mouse = mouseRef.current;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Update position
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around screen
        if (p.y < 0) p.y = height;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        // Gentle interactive mouse repulsion
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120 && dist > 0) {
          const force = (120 - dist) / 120;
          p.x += (dx / dist) * force * 1.5;
          p.y += (dy / dist) * force * 1.5;
        }

        // Pulse alpha
        p.alpha += Math.sin(frame * p.pulseSpeed) * 0.005;
        const clampedAlpha = Math.max(0.15, Math.min(0.7, p.alpha));

        // Draw particle node
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = clampedAlpha;
        ctx.fill();

        // Draw connecting filaments to nearby nodes
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const distBetween = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (distBetween < 110) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = p.color;
            ctx.globalAlpha = (1 - distBetween / 110) * 0.12;
            ctx.lineWidth = 0.75;
            ctx.stroke();
          }
        }
      }

      ctx.globalAlpha = 1.0;
      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* 1. Interactive Cursor Ambient Spotlight */}
      <div
        ref={spotlightRef}
        className="absolute inset-0 transition-opacity duration-500 ease-out"
        style={{
          background: `radial-gradient(750px circle at -1000px -1000px, rgba(0, 245, 212, 0.07), rgba(139, 92, 246, 0.04) 40%, transparent 80%)`,
        }}
      />

      {/* 2. Floating Deep Atmospheric Nebula Orbs */}
      <div className="absolute -top-32 -left-32 w-[34rem] h-[34rem] rounded-full bg-[#00f5d4]/10 blur-[130px] animate-orb-float-1" />
      <div className="absolute -bottom-40 -right-40 w-[38rem] h-[38rem] rounded-full bg-[#8b5cf6]/12 blur-[140px] animate-orb-float-2" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[28rem] h-[28rem] rounded-full bg-[#06b6d4]/05 blur-[120px] animate-pulse" />

      {/* 3. Cyber Grid with Shimmer Pulse */}
      <div className="absolute inset-0 cyber-grid animate-grid-pulse" />

      {/* Dynamic Fluid Smoke Cursor Trail Animation */}
      {fluidEnabled && (
        <SplashCursor
          colors={currentPaletteColors}
          intensity={fluidIntensity}
        />
      )}

      {/* 4. Canvas for Neural Constellation & Subtle Digital Rain */}
      <canvas ref={canvasRef} className="absolute inset-0" />

      {/* 5. Periodic Radar Laser Scanner Sweep */}
      <div className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00f5d4]/60 to-transparent shadow-[0_0_15px_#00f5d4] animate-radar-sweep pointer-events-none" />

      {/* 6. Subtle CRT Scanlines & Optical Vignette */}
      {scanlines && (
        <>
          <div className="absolute inset-0 cyber-scanlines opacity-30" />
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at center, transparent 40%, rgba(6, 8, 15, 0.8) 100%)",
            }}
          />
        </>
      )}
    </div>
  );
}
