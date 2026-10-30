"use client";

import React, { useState } from "react";
import { PROJECTS, ProjectItem } from "@/app/data/projects";
import Card3D from "../3d/Card3D";
import CyberGlitchText from "../ui/CyberGlitchText";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Github, BookOpen, Layers, Award, Sparkles, Filter, Search, CheckCircle2 } from "lucide-react";
import { sound } from "@/app/lib/audio";

export default function ProjectsVault() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  const categories = [
    { id: "all", label: "All Artifacts", count: PROJECTS.length },
    { id: "agentic-ai", label: "Agentic AI", count: PROJECTS.filter(p => p.category === "agentic-ai").length },
    { id: "mobile", label: "Mobile (Flutter)", count: PROJECTS.filter(p => p.category === "mobile").length },
    { id: "data-systems", label: "Data Systems", count: PROJECTS.filter(p => p.category === "data-systems").length },
    { id: "fullstack", label: "Full-Stack", count: PROJECTS.filter(p => p.category === "fullstack").length },
  ];

  const filtered = PROJECTS.filter((proj) => {
    const matchesCat = activeCategory === "all" || proj.category === activeCategory;
    const matchesSearch =
      searchQuery.trim() === "" ||
      proj.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proj.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proj.techStack.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-5">
      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-gray-400 mr-1 font-mono">
            <Filter size={13} className="text-[#00f5d4]" />
            <span>FILTER:</span>
          </div>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                sound.playClick(900);
                setActiveCategory(cat.id);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer flex items-center gap-1.5 ${
                activeCategory === cat.id
                  ? "bg-[#00f5d4]/20 border border-[#00f5d4]/60 text-[#00f5d4] shadow-[0_0_12px_rgba(0,245,212,0.2)]"
                  : "bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10"
              }`}
            >
              <span>{cat.label}</span>
              <span className="text-[10px] opacity-60">({cat.count})</span>
            </button>
          ))}
        </div>

        {/* Live Search Input */}
        <div className="relative min-w-[200px]">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search artifacts or stack..."
            className="w-full bg-black/40 border border-white/10 focus:border-[#00f5d4]/60 rounded-lg pl-8 pr-3 py-1.5 text-xs font-mono text-white placeholder-gray-500 outline-none transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white text-xs"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Projects Grid with 3D Tilt Cards */}
      {filtered.length === 0 ? (
        <div className="py-12 text-center text-gray-500 font-mono text-xs">
          [NO_ARTIFACTS_FOUND]: No matches for &quot;{searchQuery}&quot; in active category.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((proj, idx) => {
            const isAgentic = proj.category === "agentic-ai";
            const isFinalist = proj.status === "FINALIST";
            const glareColor = isFinalist
              ? "rgba(245, 158, 11, 0.22)"
              : isAgentic
              ? "rgba(139, 92, 246, 0.22)"
              : "rgba(0, 245, 212, 0.22)";

            return (
              <motion.div
                key={proj.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: idx * 0.05 }}
              >
                <Card3D
                  glareColor={glareColor}
                  maxTilt={8}
                  onClick={() => {
                    sound.playBlip(1100);
                    setSelectedProject(proj);
                  }}
                  className="h-full"
                >
                  <div className="group relative bg-[#0d121f]/75 hover:bg-[#111728]/95 border border-white/10 hover:border-[#00f5d4]/60 rounded-xl p-4 sm:p-5 flex flex-col justify-between h-full transition-all duration-300 hover:shadow-[0_12px_32px_rgba(0,245,212,0.12)] cursor-pointer">
                    {/* Top Accent Line on hover */}
                    <div className="absolute top-0 left-4 right-4 h-[1px] bg-gradient-to-r from-transparent via-[#00f5d4]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div>
                      {/* Header Info */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-mono text-[#00f5d4] tracking-wider uppercase flex items-center gap-1">
                            {isFinalist && <Award size={11} className="text-[#f59e0b]" />}
                            {proj.badge}
                          </span>
                          <h3 className="text-base font-bold text-white group-hover:text-[#00f5d4] transition-colors font-mono">
                            <CyberGlitchText text={proj.title} speed={25} />
                          </h3>
                        </div>

                        {/* Status Badge */}
                        <span
                          className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                            isFinalist
                              ? "bg-[#f59e0b]/20 border border-[#f59e0b]/50 text-[#f59e0b]"
                              : isAgentic
                              ? "bg-[#8b5cf6]/20 border border-[#8b5cf6]/50 text-[#8b5cf6]"
                              : "bg-[#00f5d4]/20 border border-[#00f5d4]/50 text-[#00f5d4]"
                          }`}
                        >
                          {proj.status}
                        </span>
                      </div>

                      {/* Short Desc */}
                      <p className="text-xs text-gray-300 font-mono leading-relaxed mb-4">
                        {proj.shortDesc}
                      </p>

                      {/* Metric stats if any */}
                      {proj.stats && (
                        <div className="grid grid-cols-3 gap-1.5 py-2 px-2.5 mb-3 bg-black/40 border border-white/5 rounded-lg text-center">
                          {proj.stats.map((s, i) => (
                            <div key={i} className="flex flex-col">
                              <span className="text-[9px] text-gray-500 font-mono uppercase">{s.label}</span>
                              <span className="text-xs font-bold text-white font-mono">{s.value}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Tech Stack Pills */}
                      <div className="flex flex-wrap gap-1 mb-4">
                        {proj.techStack.map((tech) => (
                          <span
                            key={tech}
                            className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-gray-300 border border-white/10"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div
                      className="flex items-center gap-2 pt-3 border-t border-white/10"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {proj.githubUrl && (
                        <a
                          href={proj.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => sound.playClick(1000)}
                          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-mono text-gray-300 hover:text-white transition-colors"
                        >
                          <Github size={12} />
                          <span>Source</span>
                        </a>
                      )}

                      {proj.liveUrl && (
                        <a
                          href={proj.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => sound.playClick(1100)}
                          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#00f5d4]/10 hover:bg-[#00f5d4]/20 border border-[#00f5d4]/30 text-xs font-mono text-[#00f5d4] hover:text-[#00f5d4] transition-colors shadow-[0_0_8px_rgba(0,245,212,0.15)]"
                        >
                          <ExternalLink size={12} />
                          <span>Live Demo</span>
                        </a>
                      )}

                      {proj.articleUrl && (
                        <a
                          href={proj.articleUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => sound.playClick(900)}
                          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-mono text-gray-400 hover:text-white transition-colors ml-auto"
                        >
                          <BookOpen size={12} />
                          <span>Write-up</span>
                        </a>
                      )}
                    </div>
                  </div>
                </Card3D>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Modal Detail View */}
      {selectedProject && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setSelectedProject(null)}
        >
          <div
            className="bg-[#0b0f19] border border-[#00f5d4]/40 rounded-2xl max-w-xl w-full p-6 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="corner-bracket-tl" />
            <div className="corner-bracket-br" />

            <div className="flex justify-between items-start mb-3">
              <div>
                <span className="text-[10px] text-[#00f5d4] font-mono tracking-widest uppercase">
                  {selectedProject.badge}
                </span>
                <h3 className="text-xl font-bold text-white font-mono">{selectedProject.title}</h3>
              </div>
              <button
                onClick={() => setSelectedProject(null)}
                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
              >
                ✕
              </button>
            </div>

            <p className="text-sm text-gray-300 font-mono leading-relaxed mb-4">
              {selectedProject.fullDesc}
            </p>

            <div className="p-3 bg-white/5 border border-white/10 rounded-xl mb-4 text-xs font-mono text-[#00f5d4] flex items-center gap-2">
              <Sparkles size={14} className="shrink-0" />
              <span>{selectedProject.highlight}</span>
            </div>

            <div className="flex flex-wrap gap-1.5 mb-6">
              {selectedProject.techStack.map((t) => (
                <span key={t} className="text-xs px-2.5 py-1 rounded bg-white/10 text-gray-200 font-mono">
                  {t}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-3">
              {selectedProject.githubUrl && (
                <a
                  href={selectedProject.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center py-2 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs transition-colors flex items-center justify-center gap-2"
                >
                  <Github size={14} /> View GitHub Repo
                </a>
              )}
              {selectedProject.liveUrl && (
                <a
                  href={selectedProject.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center py-2 px-4 rounded-xl bg-[#00f5d4] hover:bg-[#00f5d4]/90 text-black font-mono font-bold text-xs transition-colors flex items-center justify-center gap-2"
                >
                  <ExternalLink size={14} /> Launch Application
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
