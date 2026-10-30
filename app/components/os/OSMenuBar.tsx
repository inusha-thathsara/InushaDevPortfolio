"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Terminal,
  Volume2,
  VolumeX,
  Sliders,
  Wifi,
  Search,
  AlertOctagon,
  Info,
  Settings,
  Sparkles,
  Command,
  RotateCcw,
  Power,
  ChevronDown,
} from "lucide-react";
import CyberGlitchText from "../ui/CyberGlitchText";
import { sound } from "@/app/lib/audio";
import { useSystem } from "@/app/context/SystemContext";

interface OSMenuBarProps {
  activeAppTitle: string;
  isCritical: boolean;
  onEmergencyHalt: () => void;
  onOpenCommandPalette: () => void;
  onOpenLaunchpad: () => void;
  onToggleControlCenter: () => void;
  onOpenApp: (appId: string) => void;
}

export default function OSMenuBar({
  activeAppTitle,
  isCritical,
  onEmergencyHalt,
  onOpenCommandPalette,
  onOpenLaunchpad,
  onToggleControlCenter,
  onOpenApp,
}: OSMenuBarProps) {
  const { isAudio, toggleAudio, wifiActive } = useSystem();
  const [colomboTime, setColomboTime] = useState("");
  const [isSysMenuOpen, setIsSysMenuOpen] = useState(false);
  const sysMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const updateTime = () => {
      try {
        const now = new Date();
        const formatted = new Intl.DateTimeFormat("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
          timeZone: "Asia/Colombo",
        }).format(now);
        setColomboTime(formatted);
      } catch {
        setColomboTime(new Date().toTimeString().slice(0, 8));
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    const handleClickOutside = (e: MouseEvent) => {
      if (sysMenuRef.current && !sysMenuRef.current.contains(e.target as Node)) {
        setIsSysMenuOpen(false);
      }
    };
    window.addEventListener("mousedown", handleClickOutside);

    return () => {
      clearInterval(interval);
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 h-8 sm:h-9 bg-[#0b0f19]/85 backdrop-blur-xl border-b border-white/10 z-[100] px-3 sm:px-4 flex items-center justify-between font-mono text-xs select-none">
      {/* Left: System Menu & Active App Menus */}
      <div className="flex items-center gap-3">
        {/* Apple/Cyberpunk System Glyph Menu */}
        <div className="relative" ref={sysMenuRef}>
          <button
            onClick={() => {
              sound.playClick(1000);
              setIsSysMenuOpen(!isSysMenuOpen);
            }}
            className={`flex items-center gap-1 px-2 py-0.5 rounded transition-colors cursor-pointer ${
              isSysMenuOpen
                ? "bg-white/15 text-[#00f5d4]"
                : "hover:bg-white/10 text-gray-200"
            }`}
          >
            <div className="w-4 h-4 rounded bg-[#00f5d4]/20 border border-[#00f5d4]/50 flex items-center justify-center text-[#00f5d4] text-[10px] font-bold">
              ⚡
            </div>
            <span className="font-bold hidden sm:inline text-white">OS 2.0</span>
          </button>

          {/* System Dropdown Menu */}
          {isSysMenuOpen && (
            <div className="absolute top-full left-0 mt-1 w-52 bg-[#0b0f19]/95 backdrop-blur-2xl border border-white/15 rounded-xl shadow-[0_15px_35px_rgba(0,0,0,0.8)] p-1 text-xs text-gray-200 z-[110] animate-in fade-in duration-100">
              <button
                onClick={() => {
                  onOpenApp("about");
                  setIsSysMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-white/10 hover:text-white text-left cursor-pointer"
              >
                <Info size={13} className="text-[#00f5d4]" />
                <span>About Digital Twin...</span>
              </button>

              <button
                onClick={() => {
                  onOpenApp("settings");
                  setIsSysMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-white/10 hover:text-white text-left cursor-pointer"
              >
                <Settings size={13} className="text-gray-400" />
                <span>System Preferences...</span>
              </button>

              <div className="my-1 h-[1px] bg-white/10 mx-1" />

              <button
                onClick={() => {
                  onOpenLaunchpad();
                  setIsSysMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-white/10 hover:text-white text-left cursor-pointer"
              >
                <Sparkles size={13} className="text-[#8b5cf6]" />
                <span>Open Launchpad</span>
              </button>

              <div className="my-1 h-[1px] bg-white/10 mx-1" />

              <button
                onClick={() => {
                  setIsSysMenuOpen(false);
                  sound.playReboot();
                }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-white/10 hover:text-white text-left cursor-pointer"
              >
                <RotateCcw size={13} className="text-gray-400" />
                <span>Restart Audio Synthesizer</span>
              </button>

              <button
                onClick={() => {
                  setIsSysMenuOpen(false);
                  onEmergencyHalt();
                }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-red-500/15 text-red-400 text-left cursor-pointer font-bold"
              >
                <Power size={13} />
                <span>Emergency Meltdown</span>
              </button>
            </div>
          )}
        </div>

        {/* Active App Title */}
        <div className="flex items-center gap-2">
          <span className="font-bold text-white text-xs sm:text-sm tracking-wide">
            {activeAppTitle}
          </span>

          {/* Traditional OS Menu Items */}
          <div className="hidden md:flex items-center gap-3 text-gray-400 text-xs pl-2">
            <button
              onClick={() => onOpenApp("terminal")}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Terminal
            </button>
            <button
              onClick={() => onOpenApp("browser")}
              className="hover:text-white transition-colors cursor-pointer text-[#38bdf8]"
            >
              Browser
            </button>
            <button
              onClick={() => onOpenApp("projects")}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Vault
            </button>
            <button
              onClick={() => onOpenApp("skills")}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Skills
            </button>
            <button
              onClick={() => onOpenApp("telemetry")}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Telemetry
            </button>
          </div>
        </div>
      </div>

      {/* Center: Real-Time Clock */}
      <div className="absolute left-1/2 -translate-x-1/2 hidden sm:flex items-center gap-1.5 text-xs text-gray-300 font-medium">
        <span>{colomboTime}</span>
        <span className="text-[10px] text-gray-500 font-mono">IST</span>
      </div>

      {/* Right: Status Icons & Control Center */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Search / Command Palette Button */}
        <button
          onClick={onOpenCommandPalette}
          className="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
          title="Search / Command Palette (Ctrl+K)"
        >
          <Search size={13} />
          <kbd className="hidden lg:inline text-[9px] px-1 rounded bg-white/10 text-gray-400">
            ⌘K
          </kbd>
        </button>

        {/* Audio Toggle */}
        <button
          onClick={toggleAudio}
          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
            isAudio
              ? "text-gray-300 hover:text-white hover:bg-white/10"
              : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
          }`}
          title={isAudio ? "Mute Synthesizer" : "Unmute Synthesizer"}
        >
          {isAudio ? <Volume2 size={13} /> : <VolumeX size={13} />}
        </button>

        {/* Wi-Fi Status */}
        <div
          className={`hidden sm:flex items-center p-1.5 transition-colors ${
            wifiActive ? "text-[#00f5d4]" : "text-gray-600"
          }`}
          title={
            wifiActive
              ? "Neural Link: Connected (1 Gbps)"
              : "Neural Link: Offline"
          }
        >
          <Wifi size={13} />
        </div>

        {/* Control Center Toggle */}
        <button
          onClick={() => {
            sound.playClick(1100);
            onToggleControlCenter();
          }}
          className="p-1.5 rounded-lg hover:bg-white/10 text-gray-300 hover:text-white transition-colors cursor-pointer"
          title="Open Control Center"
        >
          <Sliders size={13} />
        </button>

        {/* Status Indicator */}
        <div
          className={`hidden sm:flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border transition-colors ${
            isCritical
              ? "bg-red-500/15 border-red-500/40 text-red-400 animate-pulse"
              : "bg-[#00f5d4]/10 border-[#00f5d4]/30 text-[#00f5d4]"
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              isCritical ? "bg-red-500" : "bg-[#00f5d4]"
            }`}
          />
          <span>{isCritical ? "HALT" : "ONLINE"}</span>
        </div>
      </div>
    </header>
  );
}
