"use client";

import React, { useState, useEffect } from "react";
import EthGasTracker from "../EthGasTracker";
import HoloCore3D from "../3d/HoloCore3D";
import { sound } from "@/app/lib/audio";
import {
  Server,
  Activity,
  Shield,
  Cloud,
  Wifi,
  Cpu,
  Github,
  ExternalLink,
  Volume2,
  Zap,
  Gauge,
  Radio,
  Sparkles,
} from "lucide-react";

export default function TelemetryDeck() {
  const [latency, setLatency] = useState(14);
  const [cpuUsage, setCpuUsage] = useState(24);
  const [ramUsage, setRamUsage] = useState(412);
  const [uptimeSeconds, setUptimeSeconds] = useState(245892);

  useEffect(() => {
    const interval = setInterval(() => {
      setLatency(Math.floor(12 + Math.random() * 8));
      setCpuUsage(Math.floor(18 + Math.random() * 22));
      setRamUsage(Math.floor(390 + Math.random() * 45));
      setUptimeSeconds((prev) => prev + 1);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const formatUptime = (totalSeconds: number) => {
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  return (
    <div className="space-y-6">
      {/* 3D Holo Core & Core Neural Hardware Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: 3D Holographic Singularity Core (7 cols) */}
        <div className="lg:col-span-7 h-[340px]">
          <HoloCore3D className="h-full" />
        </div>

        {/* Right: Real-Time Core Hardware & Synth Diagnostics (5 cols) */}
        <div className="lg:col-span-5 bg-[#070b14]/80 border border-white/10 rounded-2xl p-4 flex flex-col justify-between shadow-2xl relative">
          <div className="corner-bracket-tl" />
          <div className="corner-bracket-br" />

          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
            <div className="flex items-center gap-2">
              <Cpu size={14} className="text-[#00f5d4] animate-pulse" />
              <span className="text-xs font-bold font-mono text-white tracking-wider">
                CORE SYSTEM VITALS
              </span>
            </div>
            <span className="text-[10px] font-mono text-[#00f5d4] bg-[#00f5d4]/10 border border-[#00f5d4]/30 px-2 py-0.5 rounded">
              OPTIMAL
            </span>
          </div>

          {/* Gauges */}
          <div className="space-y-3 font-mono text-xs">
            {/* CPU Metric */}
            <div className="bg-black/40 border border-white/5 rounded-xl p-2.5">
              <div className="flex justify-between text-gray-400 mb-1 text-[11px]">
                <span className="flex items-center gap-1.5">
                  <Gauge size={12} className="text-[#00f5d4]" />
                  <span>VIRTUAL CPU LOAD</span>
                </span>
                <span className="text-white font-bold">{cpuUsage}%</span>
              </div>
              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#00f5d4] to-[#06b6d4] transition-all duration-500 rounded-full"
                  style={{ width: `${cpuUsage}%` }}
                />
              </div>
            </div>

            {/* RAM Metric */}
            <div className="bg-black/40 border border-white/5 rounded-xl p-2.5">
              <div className="flex justify-between text-gray-400 mb-1 text-[11px]">
                <span className="flex items-center gap-1.5">
                  <Activity size={12} className="text-[#8b5cf6]" />
                  <span>CONTAINER MEMORY</span>
                </span>
                <span className="text-white font-bold">{ramUsage} MB / 1024 MB</span>
              </div>
              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#8b5cf6] to-[#ec4899] transition-all duration-500 rounded-full"
                  style={{ width: `${(ramUsage / 1024) * 100}%` }}
                />
              </div>
            </div>

            {/* Network Latency */}
            <div className="bg-black/40 border border-white/5 rounded-xl p-2.5">
              <div className="flex justify-between text-gray-400 mb-1 text-[11px]">
                <span className="flex items-center gap-1.5">
                  <Wifi size={12} className="text-[#f59e0b]" />
                  <span>EDGE RESPONSE TIME</span>
                </span>
                <span className="text-[#00f5d4] font-bold">{latency} ms</span>
              </div>
              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#00f5d4] to-[#f59e0b] transition-all duration-500 rounded-full"
                  style={{ width: `${Math.min(100, (latency / 50) * 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Interactive Audio Diagnostic Pings */}
          <div className="pt-3 border-t border-white/10 mt-3">
            <span className="text-[10px] text-gray-500 font-mono uppercase block mb-1.5">
              SYNTH DIAGNOSTIC PINGS:
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                onClick={() => sound.playClick(900)}
                className="py-1 px-2 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] font-mono text-gray-300 hover:text-white transition-colors cursor-pointer text-center"
              >
                PULSE 900Hz
              </button>
              <button
                onClick={() => sound.playBlip(1400)}
                className="py-1 px-2 rounded bg-[#00f5d4]/10 hover:bg-[#00f5d4]/20 border border-[#00f5d4]/30 text-[10px] font-mono text-[#00f5d4] transition-colors cursor-pointer text-center"
              >
                BLIP 1.4kHz
              </button>
              <button
                onClick={() => sound.playReboot()}
                className="py-1 px-2 rounded bg-[#8b5cf6]/10 hover:bg-[#8b5cf6]/20 border border-[#8b5cf6]/30 text-[10px] font-mono text-[#8b5cf6] transition-colors cursor-pointer text-center"
              >
                WARP CHIME
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Top Telemetry Grid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-[#0b0f19]/70 border border-white/10 rounded-xl p-4">
          <div className="flex items-center justify-between text-gray-400 text-xs font-mono mb-1">
            <span>NETWORK LATENCY</span>
            <Wifi size={13} className="text-[#00f5d4]" />
          </div>
          <div className="text-xl font-bold font-mono text-white flex items-baseline gap-1">
            <span>{latency}</span>
            <span className="text-xs font-normal text-gray-500">ms</span>
          </div>
          <div className="text-[10px] text-[#00f5d4] font-mono mt-1">● Nominal / Fast Fiber</div>
        </div>

        <div className="bg-[#0b0f19]/70 border border-white/10 rounded-xl p-4">
          <div className="flex items-center justify-between text-gray-400 text-xs font-mono mb-1">
            <span>UPTIME CONTINUITY</span>
            <Activity size={13} className="text-[#8b5cf6]" />
          </div>
          <div className="text-lg font-bold font-mono text-white truncate">
            {formatUptime(uptimeSeconds)}
          </div>
          <div className="text-[10px] text-[#8b5cf6] font-mono mt-1">99.99% Availability</div>
        </div>

        <div className="bg-[#0b0f19]/70 border border-white/10 rounded-xl p-4">
          <div className="flex items-center justify-between text-gray-400 text-xs font-mono mb-1">
            <span>CLOUD RUN INSTANCE</span>
            <Cloud size={13} className="text-[#06b6d4]" />
          </div>
          <div className="text-xl font-bold font-mono text-white">SCALE-TO-ZERO</div>
          <div className="text-[10px] text-[#06b6d4] font-mono mt-1">GCP us-central1 (Serverless)</div>
        </div>

        <div className="bg-[#0b0f19]/70 border border-white/10 rounded-xl p-4">
          <div className="flex items-center justify-between text-gray-400 text-xs font-mono mb-1">
            <span>BUILD RUNTIME</span>
            <Server size={13} className="text-[#f59e0b]" />
          </div>
          <div className="text-xl font-bold font-mono text-white">NEXT.js 16</div>
          <div className="text-[10px] text-[#f59e0b] font-mono mt-1">Turbopack Standalone Container</div>
        </div>
      </div>

      {/* Real-time Ethereum Gas Tracker Integration */}
      <div className="bg-[#0b0f19]/60 border border-white/10 rounded-2xl p-5">
        <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
          <div>
            <h3 className="text-sm font-bold font-mono text-white tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00f5d4] animate-pulse" />
              LIVE ETHEREUM GAS TELEMETRY
            </h3>
            <p className="text-xs text-gray-400 font-mono">
              Server-side secure proxy stream via Etherscan API
            </p>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-[#00f5d4]/10 text-[#00f5d4] border border-[#00f5d4]/30">
            AUTO-SYNC 10S
          </span>
        </div>

        <EthGasTracker />
      </div>

      {/* GitHub Commit Radar & Repository Telemetry */}
      <div className="bg-[#0b0f19]/60 border border-white/10 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Github size={16} className="text-white" />
            <h3 className="text-sm font-bold font-mono text-white tracking-wider">
              GITHUB COMBAT TELEMETRY
            </h3>
          </div>
          <a
            href="https://github.com/inusha-thathsara"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-mono text-[#00f5d4] hover:underline flex items-center gap-1"
          >
            <span>@inusha-thathsara</span>
            <ExternalLink size={12} />
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
          <div className="p-3 bg-black/40 border border-white/5 rounded-xl">
            <span className="text-gray-500 text-[10px]">TOTAL PUBLIC REPOS</span>
            <p className="text-lg font-bold text-white mt-0.5">55+ Repositories</p>
          </div>
          <div className="p-3 bg-black/40 border border-white/5 rounded-xl">
            <span className="text-gray-500 text-[10px]">PRIMARY STACK</span>
            <p className="text-lg font-bold text-[#00f5d4] mt-0.5">TypeScript & Python</p>
          </div>
          <div className="p-3 bg-black/40 border border-white/5 rounded-xl">
            <span className="text-gray-500 text-[10px]">COMMUNITY CHALLENGES</span>
            <p className="text-lg font-bold text-[#8b5cf6] mt-0.5">20+ Hackathons & Ed.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
