"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, Terminal, FolderKanban, Cpu, Activity, Radio, X, CornerDownLeft, Sparkles, Globe } from "lucide-react";
import { OSModule } from "./CyberDock";
import { sound } from "@/app/lib/audio";
import { PROJECTS } from "@/app/data/projects";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectModule: (mod: OSModule) => void;
  onTriggerCrash: () => void;
}

export default function CommandPalette({
  isOpen,
  onClose,
  onSelectModule,
  onTriggerCrash,
}: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  // Global hotkey listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        sound.playBlip(1200);
        if (isOpen) onClose();
        else onClose(); // parent handles toggle
      } else if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const baseCommands = [
    {
      id: "term",
      title: "Launch AI Terminal Console",
      category: "Navigation",
      icon: <Terminal size={14} className="text-[#00f5d4]" />,
      action: () => onSelectModule("terminal"),
    },
    {
      id: "browser",
      title: "Launch CyberNet Web Browser (DuckDuckGo, Wikipedia, Speed Dial)",
      category: "Navigation",
      icon: <Globe size={14} className="text-[#38bdf8]" />,
      action: () => onSelectModule("browser"),
    },
    {
      id: "vault",
      title: "Open Holographic Project Vault",
      category: "Navigation",
      icon: <FolderKanban size={14} className="text-[#8b5cf6]" />,
      action: () => onSelectModule("projects"),
    },
    {
      id: "skills",
      title: "Inspect Neural Skills Matrix",
      category: "Navigation",
      icon: <Cpu size={14} className="text-[#06b6d4]" />,
      action: () => onSelectModule("skills"),
    },
    {
      id: "telemetry",
      title: "View Live Telemetry & ETH Gas",
      category: "Navigation",
      icon: <Activity size={14} className="text-[#f59e0b]" />,
      action: () => onSelectModule("telemetry"),
    },
    {
      id: "comms",
      title: "Open Encrypted Comms Transceiver",
      category: "Navigation",
      icon: <Radio size={14} className="text-pink-400" />,
      action: () => onSelectModule("comms"),
    },
    {
      id: "halt",
      title: "SYSTEM HALT: Emergency Core Breakdown (sudo delete)",
      category: "Restricted",
      icon: <span className="text-red-400 font-bold font-mono">⚠️</span>,
      action: () => {
        onClose();
        onTriggerCrash();
      },
    },
  ];

  // Project quick jumps
  const projectCommands = PROJECTS.map((p) => ({
    id: p.id,
    title: `Project: ${p.title} (${p.badge})`,
    category: "Projects",
    icon: <Sparkles size={14} className="text-[#00f5d4]" />,
    action: () => {
      onSelectModule("projects");
      if (p.githubUrl) window.open(p.githubUrl, "_blank");
    },
  }));

  const allItems = [...baseCommands, ...projectCommands];
  const filtered = query.trim()
    ? allItems.filter(
        (it) =>
          it.title.toLowerCase().includes(query.toLowerCase()) ||
          it.category.toLowerCase().includes(query.toLowerCase())
      )
    : allItems;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-start justify-center pt-20 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-[#0b0f19] border border-[#00f5d4]/40 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.9)] overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="corner-bracket-tl" />
        <div className="corner-bracket-br" />

        {/* Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/10 bg-white/[0.02]">
          <Search size={16} className="text-[#00f5d4]" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search commands, projects, skills..."
            className="flex-1 bg-transparent text-white outline-none font-mono text-xs sm:text-sm placeholder:text-gray-500"
          />
          <kbd className="text-[10px] bg-white/10 border border-white/15 px-2 py-0.5 rounded font-mono text-gray-400">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-72 overflow-y-auto p-2 space-y-1 font-mono text-xs">
          {filtered.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No matching cyberpunk protocols found.
            </div>
          ) : (
            filtered.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  sound.playClick(1000);
                  item.action();
                  onClose();
                }}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left hover:bg-white/10 text-gray-300 hover:text-white transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  {item.icon}
                  <span className="font-medium">{item.title}</span>
                </div>
                <span className="text-[10px] text-gray-500 group-hover:text-[#00f5d4]">
                  {item.category}
                </span>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
