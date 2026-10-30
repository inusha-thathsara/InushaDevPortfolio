"use client";

import React, { useState } from "react";
import { SKILL_CATEGORIES } from "@/app/data/skills";
import SkillsRadarCanvas from "./SkillsRadarCanvas";
import Card3D from "../3d/Card3D";
import CyberGlitchText from "../ui/CyberGlitchText";
import { Cpu, Terminal, Zap, ShieldCheck, Sparkles, Crosshair } from "lucide-react";
import { sound } from "@/app/lib/audio";
import { motion, AnimatePresence } from "framer-motion";

export default function SkillsRadar() {
  const [selectedCategory, setSelectedCategory] = useState<number>(0);
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);

  const activeCategory = SKILL_CATEGORIES[selectedCategory];

  return (
    <div className="space-y-6">
      {/* Category Tabs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
        {SKILL_CATEGORIES.map((cat, idx) => {
          const isSelected = selectedCategory === idx;
          return (
            <button
              key={cat.title}
              onClick={() => {
                sound.playBlip(1000 + idx * 100);
                setSelectedCategory(idx);
                setSelectedSkill(null);
              }}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer font-mono ${
                isSelected
                  ? "bg-[#0b1220] border-[#00f5d4] shadow-[0_0_15px_rgba(0,245,212,0.15)]"
                  : "bg-white/[0.03] border-white/10 hover:border-white/20 text-gray-400"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span
                  className="text-xs font-bold"
                  style={{ color: isSelected ? cat.color : "#9ca3af" }}
                >
                  <CyberGlitchText text={cat.title} speed={30} />
                </span>
                {isSelected && <Zap size={12} style={{ color: cat.color }} />}
              </div>
              <p className="text-[10px] text-gray-500 truncate">{cat.tagline}</p>
            </button>
          );
        })}
      </div>

      {/* Interactive 3D Constellation Sonar Radar */}
      <SkillsRadarCanvas
        skills={activeCategory.skills}
        accentColor={activeCategory.color}
        selectedSkill={selectedSkill}
        onSelectSkill={(name) => setSelectedSkill(name)}
      />

      {/* Selected Category Skill Telemetry & Capability Cards */}
      {activeCategory && (
        <div className="bg-[#0b0f19]/60 border border-white/10 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div>
              <h3
                className="text-sm font-bold font-mono tracking-wider flex items-center gap-2"
                style={{ color: activeCategory.color }}
              >
                <Crosshair size={14} />
                <span>{activeCategory.title} MATRIX</span>
              </h3>
              <p className="text-xs text-gray-400 font-mono">
                {activeCategory.tagline}
              </p>
            </div>
            <span className="text-xs font-mono text-gray-500">
              {activeCategory.skills.length} Capabilities Calibrated
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeCategory.skills.map((skill) => {
              const isHighlighted = selectedSkill === skill.name;
              return (
                <div
                  key={skill.name}
                  onClick={() => {
                    sound.playClick(1300);
                    setSelectedSkill(isHighlighted ? null : skill.name);
                  }}
                  className={`bg-black/40 border rounded-xl p-3.5 transition-all cursor-pointer group ${
                    isHighlighted
                      ? "border-[#00f5d4] shadow-[0_0_15px_rgba(0,245,212,0.2)] bg-[#0c1626]"
                      : "border-white/5 hover:border-white/20"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5 font-mono text-xs">
                    <span className="text-white font-medium group-hover:text-[#00f5d4] transition-colors">
                      {skill.name}
                    </span>
                    <span className="text-gray-400 font-bold">{skill.level}%</span>
                  </div>

                  {/* Animated Progress bar */}
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden mb-2">
                    <div
                      className="h-full rounded-full transition-all duration-700 ease-out"
                      style={{
                        width: `${skill.level}%`,
                        backgroundColor: activeCategory.color,
                        boxShadow: `0 0 10px ${activeCategory.color}80`,
                      }}
                    />
                  </div>

                  {skill.highlight && (
                    <div className="text-[10px] text-gray-400 font-mono flex items-center gap-1.5">
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: activeCategory.color }}
                      />
                      <span>{skill.highlight}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Summary Footer Matrix */}
      <div className="p-4 bg-gradient-to-r from-[#00f5d4]/10 via-[#8b5cf6]/10 to-transparent border border-white/10 rounded-xl flex items-center justify-between font-mono text-xs">
        <div className="flex items-center gap-2 text-gray-300">
          <ShieldCheck size={16} className="text-[#00f5d4]" />
          <span>Core focus: High-Reliability Agentic Workflows & Multi-Modal Foundation Models.</span>
        </div>
        <span className="text-[#00f5d4] hidden sm:inline font-bold">100% PRODUCTION READY</span>
      </div>
    </div>
  );
}
