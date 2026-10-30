"use client";

import React from "react";
import {
  Volume2,
  VolumeX,
  Sliders,
  Tv,
  Check,
  RefreshCw,
  Palette,
} from "lucide-react";
import { sound } from "@/app/lib/audio";
import {
  useSystem,
  FLUID_PALETTES,
  FluidPaletteId,
} from "@/app/context/SystemContext";

export default function SettingsWindow() {
  const {
    fluidEnabled,
    setFluidEnabled,
    activePalette,
    setActivePalette,
    fluidIntensity,
    setFluidIntensity,
    isAudio,
    toggleAudio,
    scanlines,
    setScanlines,
    resetDefaults,
  } = useSystem();

  const palettes = Object.values(FLUID_PALETTES);

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto py-2">
      {/* 1. Fluid Smoke & Wallpaper Section */}
      <div className="bg-black/30 rounded-xl border border-white/10 p-4 flex flex-col gap-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/5">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <Palette size={16} className="text-[#00f5d4]" />
            <span>WebGL Fluid Smoke Background</span>
          </div>
          <button
            onClick={() => {
              sound.playClick(1000);
              setFluidEnabled(!fluidEnabled);
            }}
            className={`px-3 py-1 rounded-full text-xs font-mono font-bold transition-all cursor-pointer ${
              fluidEnabled
                ? "bg-[#00f5d4]/20 border border-[#00f5d4]/40 text-[#00f5d4]"
                : "bg-white/5 text-gray-500 border border-white/10"
            }`}
          >
            {fluidEnabled ? "ENABLED" : "DISABLED"}
          </button>
        </div>

        <div>
          <span className="text-xs text-gray-400 mb-2 block font-medium">
            Fluid Smoke Color Presets
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {palettes.map((p) => {
              const isSelected = activePalette === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => {
                    sound.playClick(1100);
                    setActivePalette(p.id as FluidPaletteId);
                  }}
                  className={`flex items-center justify-between p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? "bg-white/10 border-[#00f5d4]/50 shadow-[0_0_15px_rgba(0,245,212,0.15)]"
                      : "bg-white/5 border-white/10 hover:bg-white/[0.08]"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="flex items-center -space-x-1">
                      {p.preview.map((c, i) => (
                        <span
                          key={i}
                          className="w-3.5 h-3.5 rounded-full ring-1 ring-black shadow-sm"
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                    <span className="text-xs font-mono text-gray-200">
                      {p.name}
                    </span>
                  </div>
                  {isSelected && <Check size={14} className="text-[#00f5d4]" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Smoke Flow Intensity Slider */}
        <div className="pt-2 border-t border-white/5 flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs text-gray-400 font-mono">
            <span className="flex items-center gap-1.5">
              <Sliders size={13} className="text-[#00f5d4]" />
              <span>Smoke Flow Intensity</span>
            </span>
            <span className="text-[#00f5d4] font-bold">
              {Math.round((fluidIntensity / 1.3) * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="30"
            max="180"
            value={Math.round((fluidIntensity / 1.3) * 100)}
            onChange={(e) => {
              const pct = Number(e.target.value);
              setFluidIntensity((pct / 100) * 1.3);
            }}
            className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#00f5d4]"
          />
        </div>
      </div>

      {/* 2. Sound Effects System */}
      <div className="bg-black/30 rounded-xl border border-white/10 p-4 flex flex-col gap-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/5">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            {isAudio ? (
              <Volume2 size={16} className="text-[#8b5cf6]" />
            ) : (
              <VolumeX size={16} className="text-gray-500" />
            )}
            <span>Synthesizer Audio Feedback</span>
          </div>
          <button
            onClick={toggleAudio}
            className={`px-3 py-1 rounded-full text-xs font-mono font-bold transition-all cursor-pointer ${
              isAudio
                ? "bg-[#8b5cf6]/20 border border-[#8b5cf6]/40 text-[#8b5cf6]"
                : "bg-white/5 text-gray-500 border border-white/10"
            }`}
          >
            {isAudio ? "ACTIVE" : "MUTED"}
          </button>
        </div>
        <p className="text-xs text-gray-400">
          Synthesizes Web Audio oscillators for window clicks, terminal
          keystrokes, and reboot chime without external media assets.
        </p>
      </div>

      {/* 3. Display & CRT Scanline Aesthetics */}
      <div className="bg-black/30 rounded-xl border border-white/10 p-4 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <Tv size={16} className="text-[#06b6d4]" />
            <span>CRT Scanline Overlay & Vignette</span>
          </div>
          <button
            onClick={() => {
              sound.playClick(900);
              setScanlines(!scanlines);
            }}
            className={`px-3 py-1 rounded-full text-xs font-mono font-bold transition-all cursor-pointer ${
              scanlines
                ? "bg-[#06b6d4]/20 border border-[#06b6d4]/40 text-[#06b6d4]"
                : "bg-white/5 text-gray-500 border border-white/10"
            }`}
          >
            {scanlines ? "ON" : "OFF"}
          </button>
        </div>
      </div>

      {/* Footer Info & Factory Reset */}
      <div className="flex items-center justify-between text-[11px] text-gray-500 font-mono px-1">
        <span>Cyberpunk OS v2.5.0-preview</span>
        <button
          onClick={resetDefaults}
          title="Restore factory defaults"
          className="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors cursor-pointer bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-lg border border-white/10 text-xs"
        >
          <RefreshCw size={11} />
          <span>Reset Defaults</span>
        </button>
      </div>
    </div>
  );
}
