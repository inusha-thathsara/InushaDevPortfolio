"use client";

import React, { useEffect, useRef } from "react";
import {
  Wifi,
  Volume2,
  VolumeX,
  Sliders,
  Cpu,
  Activity,
  AlertOctagon,
  Sparkles,
  Zap,
  Moon,
  Sun,
  Shield,
  RotateCcw,
} from "lucide-react";
import { sound } from "@/app/lib/audio";
import { useSystem } from "@/app/context/SystemContext";

interface ControlCenterProps {
  isOpen: boolean;
  onClose: () => void;
  onEmergencyHalt: () => void;
  isCritical: boolean;
}

export default function ControlCenter({
  isOpen,
  onClose,
  onEmergencyHalt,
  isCritical,
}: ControlCenterProps) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const {
    isAudio,
    toggleAudio,
    wifiActive,
    setWifiActive,
    fluidEnabled,
    setFluidEnabled,
    fluidIntensity,
    setFluidIntensity,
  } = useSystem();

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("mousedown", handleOutside);
    }
    return () => window.removeEventListener("mousedown", handleOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={panelRef}
      className="fixed top-12 right-3 sm:right-6 z-[130] w-[320px] sm:w-[350px] bg-[#0b0f19]/95 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.9)] p-4 font-mono text-xs select-none animate-in fade-in slide-in-from-top-3 duration-150"
    >
      {/* Top 2x2 Network/Sound Modules */}
      <div className="grid grid-cols-2 gap-2.5 mb-3">
        {/* Module A: Neural Link (Wi-Fi) */}
        <div
          onClick={() => {
            sound.playClick(1100);
            setWifiActive(!wifiActive);
          }}
          className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
            wifiActive
              ? "bg-[#00f5d4]/10 border-[#00f5d4]/40 text-[#00f5d4]"
              : "bg-white/5 border-white/10 text-gray-500"
          }`}
        >
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              wifiActive ? "bg-[#00f5d4] text-black shadow-md" : "bg-white/10"
            }`}
          >
            <Wifi size={16} />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-white text-[11px]">Neural Link</span>
            <span className="text-[10px] opacity-80">
              {wifiActive ? "UoM-Fiber 1Gbps" : "Offline"}
            </span>
          </div>
        </div>

        {/* Module B: Sound Synthesizer */}
        <div
          onClick={() => {
            toggleAudio();
          }}
          className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
            isAudio
              ? "bg-[#8b5cf6]/10 border-[#8b5cf6]/40 text-[#8b5cf6]"
              : "bg-white/5 border-white/10 text-gray-500"
          }`}
        >
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              isAudio ? "bg-[#8b5cf6] text-white shadow-md" : "bg-white/10"
            }`}
          >
            {isAudio ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-white text-[11px]">Audio SFX</span>
            <span className="text-[10px] opacity-80">
              {isAudio ? "Oscillators ON" : "Muted"}
            </span>
          </div>
        </div>
      </div>

      {/* Fluid Smoke Simulation Slider */}
      <div className="bg-white/5 rounded-xl p-3 border border-white/10 mb-3 flex flex-col gap-2">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-gray-300 flex items-center gap-1.5 font-bold">
            <Sparkles size={12} className="text-[#00f5d4]" />
            <span>Fluid Smoke Atmosphere</span>
          </span>
          <button
            onClick={() => {
              sound.playClick(1000);
              setFluidEnabled(!fluidEnabled);
            }}
            className={`text-[10px] font-bold px-2 py-0.5 rounded cursor-pointer transition-colors ${
              fluidEnabled
                ? "bg-[#00f5d4]/20 text-[#00f5d4]"
                : "bg-white/10 text-gray-500"
            }`}
          >
            {fluidEnabled ? "ACTIVE" : "OFF"}
          </button>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min="30"
            max="180"
            value={Math.round((fluidIntensity / 1.3) * 100)}
            onChange={(e) => {
              const pct = Number(e.target.value);
              setFluidIntensity((pct / 100) * 1.3);
            }}
            className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#00f5d4]"
          />
          <span className="text-[10px] text-gray-400 w-8 text-right font-mono">
            {Math.round((fluidIntensity / 1.3) * 100)}%
          </span>
        </div>
      </div>

      {/* Telemetry Quick Status Strip */}
      <div className="grid grid-cols-3 gap-2 mb-3 text-center">
        <div className="bg-white/5 rounded-xl p-2 border border-white/10">
          <span className="text-[9px] text-gray-400 block">CPU LOAD</span>
          <span className="text-xs font-bold text-[#00f5d4]">14%</span>
        </div>
        <div className="bg-white/5 rounded-xl p-2 border border-white/10">
          <span className="text-[9px] text-gray-400 block">GAS GWEI</span>
          <span className="text-xs font-bold text-[#f59e0b]">12.4</span>
        </div>
        <div className="bg-white/5 rounded-xl p-2 border border-white/10">
          <span className="text-[9px] text-gray-400 block">UPTIME</span>
          <span className="text-xs font-bold text-[#06b6d4]">99.98%</span>
        </div>
      </div>

      {/* Emergency Meltdown Button */}
      <button
        onClick={() => {
          onClose();
          onEmergencyHalt();
        }}
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 font-bold text-xs transition-colors cursor-pointer active:scale-98"
      >
        <AlertOctagon size={14} />
        <span>INITIATE EMERGENCY MELTDOWN</span>
      </button>
    </div>
  );
}
