"use client";

import React from "react";
import {
  Terminal,
  FolderKanban,
  Cpu,
  Activity,
  Radio,
  Info,
  Settings,
  Sparkles,
  Trash2,
  Globe,
} from "lucide-react";
import { sound } from "@/app/lib/audio";

export type OSModule =
  | "terminal"
  | "projects"
  | "skills"
  | "telemetry"
  | "comms"
  | "about"
  | "settings"
  | "browser";

interface CyberDockProps {
  activeModule: string | null;
  openModules: Set<string>;
  onSelectModule: (module: OSModule) => void;
  onOpenLaunchpad: () => void;
  projectCount: number;
}

export default function CyberDock({
  activeModule,
  openModules,
  onSelectModule,
  onOpenLaunchpad,
  projectCount,
}: CyberDockProps) {
  const dockItems: {
    id: OSModule | "launchpad" | "trash";
    label: string;
    icon: React.ReactNode;
    badge?: string;
    accentColor: string;
  }[] = [
    {
      id: "launchpad",
      label: "Launchpad",
      icon: <Sparkles size={18} />,
      accentColor: "#ffffff",
    },
    {
      id: "terminal",
      label: "AI Terminal",
      icon: <Terminal size={18} />,
      accentColor: "#00f5d4",
    },
    {
      id: "browser",
      label: "CyberNet Browser",
      icon: <Globe size={18} />,
      accentColor: "#38bdf8",
    },
    {
      id: "projects",
      label: "Project Vault",
      icon: <FolderKanban size={18} />,
      badge: String(projectCount),
      accentColor: "#8b5cf6",
    },
    {
      id: "skills",
      label: "Neural Radar",
      icon: <Cpu size={18} />,
      accentColor: "#06b6d4",
    },
    {
      id: "telemetry",
      label: "Live Telemetry",
      icon: <Activity size={18} />,
      badge: "LIVE",
      accentColor: "#f59e0b",
    },
    {
      id: "comms",
      label: "Transceiver",
      icon: <Radio size={18} />,
      accentColor: "#ec4899",
    },
    {
      id: "about",
      label: "About Twin",
      icon: <Info size={18} />,
      accentColor: "#3b82f6",
    },
    {
      id: "settings",
      label: "Preferences",
      icon: <Settings size={18} />,
      accentColor: "#a855f7",
    },
    {
      id: "trash",
      label: "Recycle Bin",
      icon: <Trash2 size={18} />,
      accentColor: "#6b7280",
    },
  ];

  return (
    <nav className="fixed bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-[100] max-w-full px-2 select-none">
      <div className="bg-[#0b0f19]/90 backdrop-blur-2xl border border-white/20 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-2xl flex items-center gap-1 sm:gap-2 shadow-[0_15px_40px_rgba(0,0,0,0.85)] relative">
        {/* Ambient Top Glow Line */}
        <div className="absolute -top-[1px] left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-[#00f5d4]/60 to-transparent" />

        {dockItems.map((item) => {
          if (item.id === "launchpad") {
            return (
              <button
                key="launchpad"
                onClick={() => {
                  sound.playClick(1200);
                  onOpenLaunchpad();
                }}
                className="group relative flex flex-col items-center p-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-150 cursor-pointer hover:scale-115 active:scale-95"
                title="Open Launchpad"
              >
                <span className="text-[#00f5d4] group-hover:rotate-12 transition-transform">
                  {item.icon}
                </span>
                {/* Tooltip */}
                <span className="absolute -top-8 px-2 py-0.5 rounded bg-black/90 border border-white/15 text-[10px] text-white font-mono opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-md">
                  {item.label}
                </span>
              </button>
            );
          }

          if (item.id === "trash") {
            return (
              <div key="trash" className="flex items-center">
                <div className="w-[1px] h-5 bg-white/15 mx-1" />
                <button
                  onClick={() => {
                    sound.playClick(800);
                  }}
                  className="group relative flex flex-col items-center p-2 rounded-xl text-gray-400 hover:text-gray-200 hover:bg-white/10 transition-all duration-150 cursor-pointer hover:scale-115 active:scale-95"
                  title="Recycle Bin (Empty)"
                >
                  {item.icon}
                  <span className="absolute -top-8 px-2 py-0.5 rounded bg-black/90 border border-white/15 text-[10px] text-white font-mono opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-md">
                    {item.label}
                  </span>
                </button>
              </div>
            );
          }

          const isOpen = openModules.has(item.id);
          const isFocused = activeModule === item.id;

          return (
            <button
              key={item.id}
              onClick={() => {
                sound.playBlip(isFocused ? 900 : 1300);
                onSelectModule(item.id as OSModule);
              }}
              className={`group relative flex flex-col items-center p-2 rounded-xl transition-all duration-150 cursor-pointer hover:scale-115 active:scale-95 ${
                isFocused
                  ? "bg-white/15 shadow-[0_0_15px_rgba(255,255,255,0.15)]"
                  : "hover:bg-white/10 text-gray-400 hover:text-gray-100"
              }`}
              style={{
                color: isFocused ? item.accentColor : undefined,
              }}
            >
              <span className="transition-transform duration-150">
                {item.icon}
              </span>

              {item.badge && (
                <span
                  className="absolute -top-1 -right-1 text-[8px] px-1 rounded-full font-mono font-bold leading-tight border border-black shadow-sm"
                  style={{
                    backgroundColor: item.accentColor,
                    color: "#000",
                  }}
                >
                  {item.badge}
                </span>
              )}

              {/* Tooltip */}
              <span className="absolute -top-8 px-2 py-0.5 rounded bg-black/90 border border-white/15 text-[10px] text-white font-mono opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-md">
                {item.label}
              </span>

              {/* Open Window Glowing Indicator Dot */}
              {isOpen && (
                <span
                  className="absolute -bottom-1 w-1.5 h-1.5 rounded-full shadow-[0_0_6px_currentColor]"
                  style={{ backgroundColor: item.accentColor, color: item.accentColor }}
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
