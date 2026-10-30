"use client";

import React from "react";
import {
  Cpu,
  GraduationCap,
  Sparkles,
  Github,
  Linkedin,
  Mail,
  ExternalLink,
  MessageSquare,
  MapPin,
  AtSign,
} from "lucide-react";

export default function AboutWindow() {
  const specs = [
    { label: "Legal Name", value: "Malawige Inusha Thathsara Gunasekara" },
    { label: "Location", value: "Colombo, Sri Lanka 🇱🇰" },
    { label: "Primary Email", value: "inusha.thathsara@gmail.com" },
    { label: "GitHub Handle", value: "github.com/inusha-thathsara (55+ Repos)" },
    { label: "LinkedIn Signal", value: "linkedin.com/in/inusha-gunasekara-9996632a5" },
    { label: "DEV.to Publications", value: "dev.to/inushathathsara (20+ Tech Articles)" },
    { label: "Institution", value: "University of Moratuwa, Sri Lanka" },
    { label: "Degree & Faculty", value: "B.Sc. (Hons) Information Technology" },
    { label: "Core Specialization", value: "Agentic AI Systems, LLMs & Full-Stack Cloud" },
    { label: "Status", value: "Final Year Undergrad · Open for AI / Full-Stack Roles" },
  ];

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto py-2 font-mono">
      {/* Top Banner / Avatar */}
      <div className="flex flex-col sm:flex-row items-center gap-5 sm:gap-6 pb-6 border-b border-white/10">
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-tr from-[#00f5d4]/20 via-[#8b5cf6]/20 to-[#06b6d4]/20 border border-white/20 p-1 flex items-center justify-center shadow-xl shrink-0">
          <div className="w-full h-full rounded-xl bg-[#06080f] flex flex-col items-center justify-center overflow-hidden relative">
            <Cpu size={40} className="text-[#00f5d4] animate-pulse" />
            <span className="text-[10px] font-bold text-[#8b5cf6] mt-1">IT-UOM</span>
          </div>
          {/* Status Indicator */}
          <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#00f5d4] ring-4 ring-[#0b0f19] shadow-[0_0_12px_#00f5d4]" />
        </div>

        <div className="text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#00f5d4]/10 border border-[#00f5d4]/30 text-[#00f5d4] text-[10px] font-bold uppercase tracking-wider mb-1.5">
            <Sparkles size={11} />
            <span>Digital Twin // Verified Identity</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-wide">
            Inusha Thathsara Gunasekara
          </h1>
          <p className="text-xs text-gray-300 mt-0.5">
            AI Systems Engineer & Full-Stack Developer
          </p>
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-2 text-xs text-gray-400">
            <span className="flex items-center gap-1 text-[#06b6d4]">
              <GraduationCap size={14} />
              <span>University of Moratuwa</span>
            </span>
            <span className="flex items-center gap-1 text-gray-400">
              <MapPin size={13} className="text-[#f59e0b]" />
              <span>Colombo, Sri Lanka</span>
            </span>
          </div>
        </div>
      </div>

      {/* Real Contact Details & Direct Transmission Links */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-bold text-[#00f5d4] uppercase tracking-wider">
          Direct Transmission Channels
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {/* Email */}
          <a
            href="mailto:inusha.thathsara@gmail.com"
            className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#00f5d4]/40 transition-all group"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-[#00f5d4]/15 border border-[#00f5d4]/30 flex items-center justify-center text-[#00f5d4] shrink-0">
                <Mail size={15} />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] text-gray-400 block uppercase">Email</span>
                <span className="text-xs text-white font-bold truncate block group-hover:text-[#00f5d4] transition-colors">
                  inusha.thathsara@gmail.com
                </span>
              </div>
            </div>
            <ExternalLink size={12} className="text-gray-500 group-hover:text-white shrink-0 ml-2" />
          </a>

          {/* LinkedIn */}
          <a
            href="https://linkedin.com/in/inusha-gunasekara-9996632a5"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#06b6d4]/40 transition-all group"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-[#06b6d4]/15 border border-[#06b6d4]/30 flex items-center justify-center text-[#06b6d4] shrink-0">
                <Linkedin size={15} />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] text-gray-400 block uppercase">LinkedIn</span>
                <span className="text-xs text-white font-bold truncate block group-hover:text-[#06b6d4] transition-colors">
                  in/inusha-gunasekara-9996632a5
                </span>
              </div>
            </div>
            <ExternalLink size={12} className="text-gray-500 group-hover:text-white shrink-0 ml-2" />
          </a>

          {/* GitHub */}
          <a
            href="https://github.com/inusha-thathsara"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/30 transition-all group"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center text-white shrink-0">
                <Github size={15} />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] text-gray-400 block uppercase">GitHub</span>
                <span className="text-xs text-white font-bold truncate block group-hover:text-[#00f5d4] transition-colors">
                  github.com/inusha-thathsara
                </span>
              </div>
            </div>
            <ExternalLink size={12} className="text-gray-500 group-hover:text-white shrink-0 ml-2" />
          </a>

          {/* DEV.to */}
          <a
            href="https://dev.to/inushathathsara"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#8b5cf6]/40 transition-all group"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-[#8b5cf6]/15 border border-[#8b5cf6]/30 flex items-center justify-center text-[#8b5cf6] shrink-0">
                <MessageSquare size={15} />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] text-gray-400 block uppercase">DEV.to</span>
                <span className="text-xs text-white font-bold truncate block group-hover:text-[#8b5cf6] transition-colors">
                  dev.to/inushathathsara
                </span>
              </div>
            </div>
            <ExternalLink size={12} className="text-gray-500 group-hover:text-white shrink-0 ml-2" />
          </a>
        </div>
      </div>

      {/* System Specifications Table */}
      <div className="bg-black/30 rounded-xl border border-white/10 p-3 sm:p-4 divide-y divide-white/5">
        <span className="text-xs font-bold text-gray-300 uppercase tracking-wider block pb-2">
          Hardware & Telemetry Specifications
        </span>
        {specs.map((item) => (
          <div
            key={item.label}
            className="flex flex-col sm:flex-row sm:items-center justify-between py-2 text-xs gap-1"
          >
            <span className="text-gray-400 font-medium">{item.label}</span>
            <span className="text-white font-mono text-left sm:text-right">{item.value}</span>
          </div>
        ))}
      </div>

      {/* Footer serial */}
      <div className="flex items-center justify-between text-[11px] text-gray-500 font-mono px-1">
        <span>Serial: LK-UOM-2026-IT</span>
        <span>Colombo, Sri Lanka (UTC+05:30)</span>
      </div>
    </div>
  );
}
