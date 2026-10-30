"use client";

import React, { useEffect, useRef, useState } from "react";
import { sound } from "@/app/lib/audio";
import { Activity, Sparkles, Box, Compass, Orbit, RefreshCw } from "lucide-react";

interface Point3D {
  x: number;
  y: number;
  z: number;
}

type GeometryType = "icosahedron" | "tesseract" | "quantumRing";

export default function HoloCore3D({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [geometry, setGeometry] = useState<GeometryType>("icosahedron");
  const [isDragging, setIsDragging] = useState(false);
  const [fluxSpeed, setFluxSpeed] = useState(1);
  const dragStart = useRef({ x: 0, y: 0, rotX: 0.3, rotY: 0.5 });
  const rotRef = useRef({ rotX: 0.3, rotY: 0.5, speed: 0.009 });
  const geomRef = useRef<GeometryType>("icosahedron");

  // Keep ref updated
  useEffect(() => {
    geomRef.current = geometry;
  }, [geometry]);

  const scale = 80;

  // 1. Icosahedron
  const phi = (1 + Math.sqrt(5)) / 2;
  const icosahedronVertices: Point3D[] = [
    { x: -1, y: phi, z: 0 },
    { x: 1, y: phi, z: 0 },
    { x: -1, y: -phi, z: 0 },
    { x: 1, y: -phi, z: 0 },
    { x: 0, y: -1, z: phi },
    { x: 0, y: 1, z: phi },
    { x: 0, y: -1, z: -phi },
    { x: 0, y: 1, z: -phi },
    { x: phi, y: 0, z: -1 },
    { x: phi, y: 0, z: 1 },
    { x: -phi, y: 0, z: -1 },
    { x: -phi, y: 0, z: 1 },
  ].map((v) => ({
    x: (v.x / Math.sqrt(1 + phi * phi)) * scale,
    y: (v.y / Math.sqrt(1 + phi * phi)) * scale,
    z: (v.z / Math.sqrt(1 + phi * phi)) * scale,
  }));

  const icosahedronEdges = [
    [0, 11], [0, 5], [0, 1], [0, 7], [0, 10],
    [1, 5], [1, 7], [1, 8], [1, 9],
    [2, 11], [2, 4], [2, 3], [2, 6], [2, 10],
    [3, 4], [3, 6], [3, 8], [3, 9],
    [4, 5], [4, 9], [4, 11],
    [5, 9], [5, 11],
    [6, 7], [6, 8], [6, 10],
    [7, 8], [7, 10],
    [8, 9],
    [10, 11],
  ];

  // 2. 4D Tesseract (Hypercube projection)
  const tesseractVertices: Point3D[] = [];
  const sOuter = scale * 0.95;
  const sInner = scale * 0.48;
  // Outer 8 vertices
  for (let x = -1; x <= 1; x += 2) {
    for (let y = -1; y <= 1; y += 2) {
      for (let z = -1; z <= 1; z += 2) {
        tesseractVertices.push({ x: x * sOuter * 0.7, y: y * sOuter * 0.7, z: z * sOuter * 0.7 });
      }
    }
  }
  // Inner 8 vertices
  for (let x = -1; x <= 1; x += 2) {
    for (let y = -1; y <= 1; y += 2) {
      for (let z = -1; z <= 1; z += 2) {
        tesseractVertices.push({ x: x * sInner * 0.7, y: y * sInner * 0.7, z: z * sInner * 0.7 });
      }
    }
  }

  const cubeEdges = [
    [0, 1], [1, 3], [3, 2], [2, 0],
    [4, 5], [5, 7], [7, 6], [6, 4],
    [0, 4], [1, 5], [2, 6], [3, 7]
  ];
  const tesseractEdges = [
    ...cubeEdges,
    ...cubeEdges.map(([a, b]) => [a + 8, b + 8]),
    ...Array.from({ length: 8 }, (_, i) => [i, i + 8])
  ];

  // 3. Quantum Ring Lattice (3 orthogonal rings)
  const ringVertices: Point3D[] = [];
  const ringRadius = scale * 0.9;
  const ringPointsPerCircle = 8;
  for (let i = 0; i < ringPointsPerCircle; i++) {
    const angle = (i / ringPointsPerCircle) * Math.PI * 2;
    ringVertices.push({ x: Math.cos(angle) * ringRadius, y: Math.sin(angle) * ringRadius, z: 0 });
    ringVertices.push({ x: Math.cos(angle) * ringRadius, y: 0, z: Math.sin(angle) * ringRadius });
    ringVertices.push({ x: 0, y: Math.cos(angle) * ringRadius, z: Math.sin(angle) * ringRadius });
  }

  const ringEdges: number[][] = [];
  for (let i = 0; i < ringPointsPerCircle; i++) {
    const next = (i + 1) % ringPointsPerCircle;
    ringEdges.push([i * 3, next * 3]);
    ringEdges.push([i * 3 + 1, next * 3 + 1]);
    ringEdges.push([i * 3 + 2, next * 3 + 2]);
    // cross braces
    ringEdges.push([i * 3, i * 3 + 1]);
    ringEdges.push([i * 3 + 1, i * 3 + 2]);
  }

  const geometriesData = {
    icosahedron: { vertices: icosahedronVertices, edges: icosahedronEdges, color: "#00f5d4" },
    tesseract: { vertices: tesseractVertices, edges: tesseractEdges, color: "#8b5cf6" },
    quantumRing: { vertices: ringVertices, edges: ringEdges, color: "#06b6d4" },
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    sound.playClick(1200);
    dragStart.current = {
      x: e.clientX,
      y: e.clientY,
      rotX: rotRef.current.rotX,
      rotY: rotRef.current.rotY,
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    rotRef.current.rotY = dragStart.current.rotY + dx * 0.01;
    rotRef.current.rotX = dragStart.current.rotX - dy * 0.01;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const boostSpeed = () => {
    sound.playBlip(1600);
    rotRef.current.speed = 0.045;
    setFluxSpeed(3);
    setTimeout(() => {
      rotRef.current.speed = 0.009;
      setFluxSpeed(1);
    }, 1500);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 340);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 280);

    const onResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener("resize", onResize);

    const project = (p: Point3D, cx: number, cy: number, fov = 360) => {
      const zoom = fov / (fov + p.z);
      return {
        x: cx + p.x * zoom,
        y: cy + p.y * zoom,
        z: p.z,
        scale: zoom,
      };
    };

    const rotatePoint = (p: Point3D, rx: number, ry: number): Point3D => {
      // Rotate around Y axis
      const cosY = Math.cos(ry);
      const sinY = Math.sin(ry);
      const x1 = p.x * cosY + p.z * sinY;
      const z1 = -p.x * sinY + p.z * cosY;

      // Rotate around X axis
      const cosX = Math.cos(rx);
      const sinX = Math.sin(rx);
      const y2 = p.y * cosX - z1 * sinX;
      const z2 = p.y * sinX + z1 * cosX;

      return { x: x1, y: y2, z: z2 };
    };

    let ringAngle = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;

      // Auto-rotation when not dragging
      if (!isDragging) {
        rotRef.current.rotY += rotRef.current.speed;
        rotRef.current.rotX += rotRef.current.speed * 0.45;
      }
      ringAngle += 0.015 * fluxSpeed;

      const rx = rotRef.current.rotX;
      const ry = rotRef.current.rotY;

      const currentGeom = geometriesData[geomRef.current];

      // 1. Draw Outer Gyroscopic Gimbal Rings
      ctx.save();
      ctx.translate(cx, cy);
      ctx.strokeStyle = "rgba(0, 245, 212, 0.2)";
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.ellipse(0, 0, scale * 1.35, scale * 0.45, ringAngle, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = "rgba(139, 92, 246, 0.2)";
      ctx.beginPath();
      ctx.ellipse(0, 0, scale * 1.45, scale * 0.5, -ringAngle * 0.8, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // 2. Rotate & Project 3D Vertices
      const projected = currentGeom.vertices.map((v) => {
        const rotated = rotatePoint(v, rx, ry);
        return project(rotated, cx, cy);
      });

      // 3. Draw 3D Edges
      currentGeom.edges.forEach(([i1, i2]) => {
        const p1 = projected[i1];
        const p2 = projected[i2];
        if (!p1 || !p2) return;

        const avgZ = (p1.z + p2.z) / 2;
        const alpha = Math.max(0.12, Math.min(0.85, 0.5 - avgZ / (scale * 2.5)));

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle =
          avgZ < 0
            ? currentGeom.color
            : `rgba(139, 92, 246, ${alpha * 0.85})`;
        ctx.lineWidth = avgZ < 0 ? 1.5 : 1;
        ctx.globalAlpha = alpha;
        ctx.stroke();
      });

      // 4. Draw Glowing 3D Vertices
      projected.forEach((p) => {
        const alpha = Math.max(0.25, Math.min(1, 0.65 - p.z / (scale * 2)));
        const radius = Math.max(2, 3.5 * p.scale);

        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = p.z < 0 ? currentGeom.color : "#8b5cf6";
        ctx.globalAlpha = alpha;
        ctx.fill();

        if (p.z < 0) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, radius * 2.2, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(0, 245, 212, 0.18)";
          ctx.fill();
        }
      });

      // 5. Central Pulsing Singularity Node
      ctx.beginPath();
      ctx.arc(cx, cy, 5 + Math.sin(ringAngle * 3) * 2, 0, Math.PI * 2);
      ctx.fillStyle = currentGeom.color;
      ctx.globalAlpha = 0.85;
      ctx.shadowColor = currentGeom.color;
      ctx.shadowBlur = 18;
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1.0;

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(animId);
    };
  }, [isDragging, fluxSpeed]);

  return (
    <div
      className={`relative w-full h-full min-h-[300px] bg-[#070b14]/80 border border-white/10 rounded-2xl overflow-hidden flex flex-col justify-between p-4 group select-none shadow-2xl ${className}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div className="corner-bracket-tl" />
      <div className="corner-bracket-br" />

      {/* Top Telemetry Overlay & Geometry Switchers */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono relative z-10">
        <div className="flex items-center gap-2">
          <Activity size={14} className="text-[#00f5d4] animate-pulse" />
          <span className="text-white font-bold tracking-wider">HOLO_CORE 3D</span>
          <span className="text-[10px] text-gray-500 hidden sm:inline">[DRAG TO ROTATE]</span>
        </div>

        {/* Geometry Mode Switcher Buttons */}
        <div className="flex items-center gap-1 bg-black/50 p-1 rounded-lg border border-white/5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              sound.playClick(900);
              setGeometry("icosahedron");
            }}
            className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors cursor-pointer flex items-center gap-1 ${
              geometry === "icosahedron"
                ? "bg-[#00f5d4]/20 text-[#00f5d4] border border-[#00f5d4]/50"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <Box size={10} />
            <span>POLY</span>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              sound.playClick(1050);
              setGeometry("tesseract");
            }}
            className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors cursor-pointer flex items-center gap-1 ${
              geometry === "tesseract"
                ? "bg-[#8b5cf6]/20 text-[#8b5cf6] border border-[#8b5cf6]/50"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <RefreshCw size={10} />
            <span>4D TESS</span>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              sound.playClick(1200);
              setGeometry("quantumRing");
            }}
            className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors cursor-pointer flex items-center gap-1 ${
              geometry === "quantumRing"
                ? "bg-[#06b6d4]/20 text-[#06b6d4] border border-[#06b6d4]/50"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <Orbit size={10} />
            <span>RING</span>
          </button>
        </div>
      </div>

      {/* 3D Canvas */}
      <div className="relative flex-1 w-full min-h-[190px] flex items-center justify-center cursor-grab active:cursor-grabbing">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      </div>

      {/* Bottom Telemetry Controls */}
      <div className="flex items-center justify-between text-[11px] font-mono text-gray-400 relative z-10 pt-2 border-t border-white/5">
        <div className="flex items-center gap-3">
          <span className="text-gray-500">
            PITCH: <span className="text-white">{rotRef.current.rotX.toFixed(2)}</span>
          </span>
          <span className="text-gray-500">
            YAW: <span className="text-[#00f5d4]">{rotRef.current.rotY.toFixed(2)}</span>
          </span>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            boostSpeed();
          }}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#00f5d4]/10 hover:bg-[#00f5d4]/20 border border-[#00f5d4]/30 text-[#00f5d4] text-[10px] transition-colors cursor-pointer shadow-[0_0_8px_rgba(0,245,212,0.15)]"
        >
          <Sparkles size={11} />
          <span>FLUX PULSE</span>
        </button>
      </div>
    </div>
  );
}
