"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  X,
  Terminal,
  FolderKanban,
  Cpu,
  Activity,
  Radio,
  Info,
  Settings,
  Sparkles,
  Globe,
} from "lucide-react";
import { sound } from "@/app/lib/audio";

interface LaunchpadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenApp: (appId: string) => void;
}

export default function LaunchpadModal({
  isOpen,
  onClose,
  onOpenApp,
}: LaunchpadModalProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const apps = [
    {
      id: "terminal",
      title: "Neural Terminal",
      category: "AI & Shell",
      description: "Interactive AI twin command interface with real-time prompt reasoning.",
      icon: <Terminal size={28} />,
      accentColor: "#00f5d4",
    },
    {
      id: "browser",
      title: "CyberNet Browser",
      category: "Web & Portals",
      description: "Tabbed web browser with DuckDuckGo search, live proxy shield, and speed dial.",
      icon: <Globe size={28} />,
      accentColor: "#38bdf8",
    },
    {
      id: "projects",
      title: "Artifact Vault",
      category: "Portfolio",
      description: "Production web applications, hackathon prototypes, and smart contract repos.",
      icon: <FolderKanban size={28} />,
      accentColor: "#8b5cf6",
    },
    {
      id: "skills",
      title: "Skills Radar",
      category: "System Specs",
      description: "Dynamic radar charts for agentic AI, full-stack tech, and cloud architecture.",
      icon: <Cpu size={28} />,
      accentColor: "#06b6d4",
    },
    {
      id: "telemetry",
      title: "Live Telemetry",
      category: "Monitoring",
      description: "Real-time Ethereum gas tracker and Google Cloud infrastructure health.",
      icon: <Activity size={28} />,
      accentColor: "#f59e0b",
    },
    {
      id: "comms",
      title: "Encrypted Transceiver",
      category: "Communication",
      description: "Secure messaging portal and dispatch channels to reach Inusha directly.",
      icon: <Radio size={28} />,
      accentColor: "#ec4899",
    },
    {
      id: "about",
      title: "Digital Twin Identity",
      category: "About",
      description: "University of Moratuwa education, engineering stack, and bio overview.",
      icon: <Info size={28} />,
      accentColor: "#3b82f6",
    },
    {
      id: "settings",
      title: "System Preferences",
      category: "Settings",
      description: "Fluid smoke background presets, audio feedback, and CRT scanlines.",
      icon: <Settings size={28} />,
      accentColor: "#a855f7",
    },
  ];

  const filtered = apps.filter(
    (a) =>
      a.title.toLowerCase().includes(query.toLowerCase()) ||
      a.description.toLowerCase().includes(query.toLowerCase()) ||
      a.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[140] bg-black/70 backdrop-blur-2xl flex flex-col items-center pt-14 sm:pt-20 pb-20 px-4 sm:px-8 select-none animate-in fade-in duration-150"
    >
      {/* Top Search Bar */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl bg-white/10 border border-white/20 rounded-full flex items-center px-5 py-3 mb-10 shadow-[0_15px_35px_rgba(0,0,0,0.7)] backdrop-blur-xl"
      >
        <Search size={18} className="text-white/60 mr-3 shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Type to search apps, modules, or commands..."
          className="bg-transparent border-none outline-none text-white text-base w-full placeholder:text-white/40 font-mono"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="text-white/50 hover:text-white p-1"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Grid of Apps */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-4xl grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6"
      >
        {filtered.map((app) => (
          <button
            key={app.id}
            onClick={() => {
              sound.playOpen();
              onOpenApp(app.id);
              onClose();
            }}
            className="group flex flex-col items-center p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/25 transition-all duration-200 cursor-pointer shadow-lg hover:shadow-[0_10px_25px_rgba(0,0,0,0.6)] hover:-translate-y-1 active:scale-95"
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-3 shadow-xl border border-white/15 transition-transform duration-200 group-hover:scale-110"
              style={{
                background: `linear-gradient(135deg, ${app.accentColor}30 0%, rgba(11,15,25,0.9) 100%)`,
                color: app.accentColor,
              }}
            >
              {app.icon}
            </div>
            <span className="text-sm font-mono font-bold text-white text-center group-hover:text-[#00f5d4] transition-colors">
              {app.title}
            </span>
            <span className="text-[10px] font-mono text-gray-400 mt-1 uppercase tracking-wider">
              {app.category}
            </span>
          </button>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-400 font-mono text-sm">
            No applications match &quot;{query}&quot;
          </div>
        )}
      </div>

      {/* Bottom Hint */}
      <div className="mt-auto text-[11px] text-gray-400 font-mono flex items-center gap-2">
        <kbd className="px-2 py-0.5 rounded bg-white/10 border border-white/15 text-[10px] text-gray-300">
          ESC
        </kbd>
        <span>to exit Launchpad</span>
      </div>
    </div>
  );
}
