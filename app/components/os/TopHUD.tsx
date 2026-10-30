"use client";

import React, { useState, useEffect } from "react";
import CyberGlitchText from "../ui/CyberGlitchText";
import { Terminal, Volume2, VolumeX, ShieldAlert, Cpu, Sparkles, Command, Radio } from "lucide-react";
import { sound } from "@/app/lib/audio";

interface TopHUDProps {
  isCritical: boolean;
  onEmergencyHalt: () => void;
  onOpenCommandPalette: () => void;
}

export default function TopHUD({ isCritical, onEmergencyHalt, onOpenCommandPalette }: TopHUDProps) {
  const [colomboTime, setColomboTime] = useState("");
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);

  useEffect(() => {
    setIsAudioEnabled(sound.isEnabled());

    const onSoundEnabled = () => setIsAudioEnabled(true);
    window.addEventListener("cyberpunk_sound_enabled", onSoundEnabled);

    const updateTime = () => {
      try {
        const now = new Date();
        const formatted = new Intl.DateTimeFormat("en-US", {
          timeZone: "Asia/Colombo",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }).format(now);
        setColomboTime(formatted);
      } catch {
        setColomboTime(new Date().toTimeString().slice(0, 8));
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => {
      clearInterval(interval);
      window.removeEventListener("cyberpunk_sound_enabled", onSoundEnabled);
    };
  }, []);

  const toggleSound = () => {
    const newState = sound.toggle();
    setIsAudioEnabled(newState);
  };

  return (
    <header className="w-full bg-[#0b0f19]/80 backdrop-blur-xl border border-white/10 px-4 py-2.5 rounded-xl flex flex-wrap items-center justify-between gap-3 shadow-lg relative z-30">
      {/* Corner accents */}
      <div className="corner-bracket-tl" />
      <div className="corner-bracket-br" />

      {/* Brand & Identity */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00f5d4]/20 via-[#06b6d4]/10 to-transparent border border-[#00f5d4]/40 flex items-center justify-center text-[#00f5d4] shadow-[0_0_12px_rgba(0,245,212,0.25)]">
            <Terminal size={16} />
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold tracking-wider">
              <CyberGlitchText
                text="INUSHA_GUNASEKARA"
                className="text-white font-mono hover:text-[#00f5d4] transition-colors"
              />
              <span className="text-gray-500">//</span>
              <span className="text-[#00f5d4] font-mono glow-cyan">SYSTEM 2.0</span>
            </div>
            <p className="text-[10px] text-gray-400 font-mono hidden sm:block">
              IT Undergrad @ University of Moratuwa 🇱🇰
            </p>
          </div>
        </div>

        {/* Pulse Status */}
        <div
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold border transition-all ${
            isCritical
              ? "bg-red-500/10 border-red-500/30 text-red-400 animate-pulse"
              : "bg-[#00f5d4]/10 border-[#00f5d4]/30 text-[#00f5d4]"
          }`}
        >
          <span className="relative flex h-2 w-2">
            <span
              className={`absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping ${
                isCritical ? "bg-red-500" : "bg-[#00f5d4]"
              }`}
            />
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${
                isCritical ? "bg-red-500" : "bg-[#00f5d4]"
              }`}
            />
          </span>
          <span>{isCritical ? "ALERT: OVERRIDE" : "ONLINE"}</span>
        </div>
      </div>

      {/* Middle Telemetry Ticker */}
      <div className="hidden lg:flex items-center gap-4 text-[11px] font-mono bg-black/40 border border-white/5 px-3 py-1.5 rounded-lg text-gray-300">
        <div className="flex items-center gap-1.5">
          <span className="text-gray-500">ZONE:</span>
          <span className="text-[#00f5d4]">Colombo LK</span>
        </div>
        <span className="text-gray-600">::</span>
        <div className="flex items-center gap-1.5">
          <span className="text-gray-500">TIME:</span>
          <span className="text-white font-semibold">{colomboTime || "00:00:00"}</span>
        </div>
        <span className="text-gray-600">::</span>
        <div className="flex items-center gap-1.5">
          <Cpu size={12} className="text-[#8b5cf6]" />
          <span className="text-gray-400">AGENTS ACTIVE:</span>
          <span className="text-[#8b5cf6] font-bold">5 PROD</span>
        </div>
      </div>

      {/* Right Action Tools */}
      <div className="flex items-center gap-2">
        {/* Quick Command Palette Launcher */}
        <button
          onClick={() => {
            sound.playClick(900);
            onOpenCommandPalette();
          }}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-gray-300 hover:text-white transition-all cursor-pointer"
          title="Open Command Palette (Cmd+K)"
        >
          <Command size={13} className="text-[#00f5d4]" />
          <span className="hidden md:inline">Commands</span>
          <kbd className="hidden sm:inline-block text-[9px] bg-black/50 border border-white/20 px-1.5 py-0.5 rounded text-gray-400">
            ⌘K
          </kbd>
        </button>

        {/* Audio Mute/Unmute with Live Spectrum Bars */}
        <button
          onClick={toggleSound}
          className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border transition-all cursor-pointer ${
            isAudioEnabled
              ? "bg-[#00f5d4]/10 border-[#00f5d4]/30 text-[#00f5d4] hover:bg-[#00f5d4]/20 shadow-[0_0_10px_rgba(0,245,212,0.15)]"
              : "bg-white/5 border-white/10 text-gray-500 hover:text-gray-300"
          }`}
          title={isAudioEnabled ? "Mute Cyber Audio FX" : "Unmute Cyber Audio FX"}
        >
          {isAudioEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
          {/* Audio Visualizer Spectrum Bars */}
          <div className="flex items-end gap-0.5 h-3.5 w-4 overflow-hidden">
            {[
              { delay: "0s", duration: "0.8s" },
              { delay: "0.2s", duration: "0.6s" },
              { delay: "0.4s", duration: "0.9s" },
              { delay: "0.1s", duration: "0.7s" },
            ].map((bar, i) => (
              <span
                key={i}
                className={`w-0.5 rounded-full transition-all ${
                  isAudioEnabled ? "bg-[#00f5d4] animate-pulse" : "bg-gray-600 h-1"
                }`}
                style={
                  isAudioEnabled
                    ? {
                        animationDuration: bar.duration,
                        animationDelay: bar.delay,
                        height: `${30 + ((i * 23) % 70)}%`,
                      }
                    : { height: "2px" }
                }
              />
            ))}
          </div>
        </button>

        {/* Emergency Halt */}
        <button
          onClick={() => {
            sound.setEnabled(true);
            setIsAudioEnabled(true);
            sound.startCrashAdrenalineTrack();
            onEmergencyHalt();
          }}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-mono transition-all cursor-pointer hover:border-red-500/60"
          title="Trigger Emergency Halt sequence"
        >
          <ShieldAlert size={14} />
          <span className="hidden sm:inline">HALT</span>
        </button>
      </div>
    </header>
  );
}
