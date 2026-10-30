"use client";

import React, { useEffect, useRef } from "react";
import { sound } from "@/app/lib/audio";

interface SkillItem {
  name: string;
  level: number;
  highlight?: string;
}

interface SkillsRadarCanvasProps {
  skills: SkillItem[];
  accentColor?: string;
  selectedSkill: string | null;
  onSelectSkill: (name: string) => void;
  className?: string;
}

export default function SkillsRadarCanvas({
  skills,
  accentColor = "#00f5d4",
  selectedSkill,
  onSelectSkill,
  className = "",
}: SkillsRadarCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const hoverRef = useRef<string | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 400);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 240);

    const onResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener("resize", onResize);

    let sweepAngle = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const maxRadius = Math.min(cx, cy) * 0.82;

      // 1. Concentric Range Rings
      [0.35, 0.65, 1.0].forEach((ratio, idx) => {
        const r = maxRadius * ratio;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
        ctx.lineWidth = 1;
        ctx.setLineDash(idx === 1 ? [4, 4] : []);
        ctx.stroke();

        // Distance label
        ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
        ctx.font = "9px monospace";
        ctx.fillText(`${Math.round(ratio * 100)}%`, cx + 4, cy - r + 10);
      });
      ctx.setLineDash([]);

      // 2. Crosshair Grid Lines
      ctx.beginPath();
      ctx.moveTo(cx - maxRadius, cy);
      ctx.lineTo(cx + maxRadius, cy);
      ctx.moveTo(cx, cy - maxRadius);
      ctx.lineTo(cx, cy + maxRadius);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.06)";
      ctx.stroke();

      // 3. Sweeping Radar Sonar Hand
      sweepAngle += 0.025;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(sweepAngle);

      // Trailing wedge gradient
      const grad = ctx.createLinearGradient(0, 0, maxRadius, 0);
      grad.addColorStop(0, "rgba(0, 245, 212, 0)");
      grad.addColorStop(1, `${accentColor}33`);

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, maxRadius, -0.4, 0);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();

      // Leading laser beam line
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(maxRadius, 0);
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();

      // 4. Calculate node positions & draw constellation lines
      const nodePositions = skills.map((skill, index) => {
        const angle = (index / skills.length) * Math.PI * 2 - Math.PI / 2;
        // radius mapped from skill level (50% to 100% maps to 0.4 to 1.0 of maxRadius)
        const normalized = 0.45 + (skill.level / 100) * 0.55;
        const r = maxRadius * normalized;
        const x = cx + Math.cos(angle) * r;
        const y = cy + Math.sin(angle) * r;
        return { ...skill, x, y, angle };
      });

      // Connecting polygon web
      if (nodePositions.length > 2) {
        ctx.beginPath();
        nodePositions.forEach((node, i) => {
          if (i === 0) ctx.moveTo(node.x, node.y);
          else ctx.lineTo(node.x, node.y);
        });
        ctx.closePath();
        ctx.fillStyle = `${accentColor}12`;
        ctx.fill();
        ctx.strokeStyle = `${accentColor}44`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Draw each Skill Node
      nodePositions.forEach((node) => {
        const isHovered = hoverRef.current === node.name;
        const isSelected = selectedSkill === node.name;

        // Radius from center line
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(node.x, node.y);
        ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
        ctx.lineWidth = 1;
        ctx.stroke();

        // Node Glow Halo
        if (isHovered || isSelected) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, 10, 0, Math.PI * 2);
          ctx.fillStyle = `${accentColor}40`;
          ctx.fill();
        }

        // Node Core Dot
        ctx.beginPath();
        ctx.arc(node.x, node.y, isHovered || isSelected ? 5 : 3.5, 0, Math.PI * 2);
        ctx.fillStyle = isSelected ? "#ffffff" : accentColor;
        ctx.shadowColor = accentColor;
        ctx.shadowBlur = isHovered || isSelected ? 12 : 6;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Skill Label Text
        ctx.fillStyle = isSelected ? "#ffffff" : isHovered ? accentColor : "rgba(255, 255, 255, 0.75)";
        ctx.font = isHovered || isSelected ? "bold 10px monospace" : "9px monospace";
        const textOffset = node.x > cx ? 8 : -8;
        ctx.textAlign = node.x > cx ? "left" : "right";
        ctx.fillText(node.name, node.x + textOffset, node.y + 3);
      });

      // 5. Center Radar Hub
      ctx.beginPath();
      ctx.arc(cx, cy, 4, 0, Math.PI * 2);
      ctx.fillStyle = accentColor;
      ctx.fill();

      animId = requestAnimationFrame(render);
    };

    render();

    // Mouse Interaction for Node Hover/Click
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      const cx = width / 2;
      const cy = height / 2;
      const maxRadius = Math.min(cx, cy) * 0.82;

      let found: string | null = null;
      skills.forEach((skill, index) => {
        const angle = (index / skills.length) * Math.PI * 2 - Math.PI / 2;
        const normalized = 0.45 + (skill.level / 100) * 0.55;
        const r = maxRadius * normalized;
        const x = cx + Math.cos(angle) * r;
        const y = cy + Math.sin(angle) * r;

        const dist = Math.hypot(mx - x, my - y);
        if (dist < 18) {
          found = skill.name;
        }
      });

      if (found !== hoverRef.current) {
        if (found) sound.playClick(1400);
        hoverRef.current = found;
        canvas.style.cursor = found ? "pointer" : "crosshair";
      }
    };

    const handleClick = () => {
      if (hoverRef.current) {
        sound.playBlip(1100);
        onSelectSkill(hoverRef.current);
      }
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("resize", onResize);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("click", handleClick);
      cancelAnimationFrame(animId);
    };
  }, [skills, accentColor, selectedSkill, onSelectSkill]);

  return (
    <div className={`relative w-full h-[230px] bg-[#070b14]/70 border border-white/10 rounded-2xl overflow-hidden flex items-center justify-center ${className}`}>
      <div className="corner-bracket-tl" />
      <div className="corner-bracket-br" />

      {/* Top Banner Tag */}
      <div className="absolute top-2.5 left-3.5 text-[10px] font-mono text-gray-500 flex items-center gap-1.5 z-10 pointer-events-none">
        <span className="w-1.5 h-1.5 rounded-full bg-[#00f5d4] animate-ping" />
        <span>CONSTELLATION RADAR // 360° SWEEP</span>
      </div>

      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}
