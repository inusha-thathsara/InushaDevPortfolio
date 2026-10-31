"use client";

import React, { useEffect, useRef, useState } from "react";
import { sound } from "@/app/lib/audio";
import { RefreshCw, Terminal, XCircle } from "lucide-react";

export type CrashStage = "meltdown" | "collapse" | "reboot";

interface CrashOverlayProps {
  stage: CrashStage;
  onRecover: () => void;
}

// ---------------------------------------------------------------------------
// Fake "malicious code" terminals (purely cosmetic text, nothing is executed)
// ---------------------------------------------------------------------------

const rand = (n: number) => Math.floor(Math.random() * n);
const hex = (len: number) =>
  Array.from({ length: len }, () => rand(16).toString(16)).join("");
const fill = (tpl: string) =>
  tpl
    .replace(/\{HEX(\d*)\}/g, (_, n) => hex(Number(n) || 8))
    .replace(/\{IP\}/g, () => `${10 + rand(180)}.${rand(255)}.${rand(255)}.${1 + rand(254)}`)
    .replace(/\{PID\}/g, () => String(1000 + rand(60000)))
    .replace(/\{PORT\}/g, () => String(1024 + rand(60000)))
    .replace(/\{PCT\}/g, () => String(1 + rand(99)))
    .replace(/\{MB\}/g, () => String(10 + rand(900)));

interface FakeTerminal {
  title: string;
  prompt: string;
  fg: string; // text color
  accent: string; // title/prompt color
  bar: string; // title-bar background
  lines: string[];
  speed: number; // ms per line
  pos: { l: number; t: number; w: number; h: number }; // vw / vh percentages
}

const TERMINALS: FakeTerminal[] = [
  {
    title: "kernel_core — panic dump",
    prompt: "kernel@core:~#",
    fg: "#33ff66",
    accent: "#00ff9c",
    bar: "#0a1f12",
    speed: 70,
    pos: { l: 4, t: 8, w: 36, h: 34 },
    lines: [
      "panic: quantum synapse registry overflow at 0x7FFF{HEX4}",
      "[!] core dump in progress: flushing 512GB vector registers",
      "thermal alert: CPU cluster T-junction exceeding 105.4°C",
      "subsystem [NEURAL_MESH] severed from supervisor",
      "warning: stack frame corruption detected in thread #{PID}",
      "dumping trace: 0x{HEX8} -> 0x{HEX8} (relocated)",
      "unmounting /dev/nvme0n1p3 (virtual neural store)",
      "emergency cold halt scheduled in 2500ms",
      "[+] memory barrier sync complete",
      "cpu_idle: core #{PCT} parked",
    ],
  },
  {
    title: "neural_bus — telemetry trace",
    prompt: "bus@matrix:~$",
    fg: "#5dffe1",
    accent: "#00f5d4",
    bar: "#06231f",
    speed: 85,
    pos: { l: 30, t: 14, w: 34, h: 32 },
    lines: [
      "neural_bus: link loss on optic fiber port {PORT}",
      "desync: syn_clock jitter exceeds 48.2ms threshold",
      "purging L3 synaptic cache buffers... {PCT}%",
      "vector engine: ALU execution pipeline stalled",
      "recalibrating tachyon phase alignment... FAILED",
      "halting background inference worker thread #{PID}",
      "bus watchdog: no heartbeat received within 300ms",
      "initiating emergency memory barrier flush",
    ],
  },
  {
    title: "sys_diagnostics — memory integrity check",
    prompt: "diag@node:/#",
    fg: "#ffb000",
    accent: "#ffcc33",
    bar: "#241a00",
    speed: 95,
    pos: { l: 58, t: 6, w: 38, h: 36 },
    lines: [
      "mem_diag: scanning physical address space 0x0000 -> 0x{HEX8}",
      "ecc_alert: uncorrectable parity bit in bank #{PCT}",
      "deallocating tensor weight blocks... {PCT}%",
      "vmm: page fault in non-paged kernel pool",
      "emergency safeguard: isolating compromised memory sector {HEX4}",
      "system status: CRITICAL_FAULT_CONTAINMENT",
      "transitioning to hardware recovery mode",
    ],
  },
  {
    title: "matrix_compiler — runtime panic",
    prompt: "compiler>",
    fg: "#ff4d4d",
    accent: "#ff6b6b",
    bar: "#260808",
    speed: 80,
    pos: { l: 10, t: 42, w: 34, h: 36 },
    lines: [
      "build_daemon: JIT compiler crashed at optimization pass {PCT}",
      "signal SIGBUS: bus error in shared memory segment {HEX6}",
      "corrupted AST node at memory offset 0x{HEX8}",
      "aborting intermediate code generation",
      "releasing locks on /var/run/neural_engine.pid",
      "clean exit impossible: forcing hard termination on pid #{PID}",
      "coredump: saved to /var/crash/core_dump_{HEX4}.bin",
    ],
  },
  {
    title: "firmware_bios — recovery monitor",
    prompt: "UEFI>",
    fg: "#e6f1ff",
    accent: "#7cb7ff",
    bar: "#0b2a5b",
    speed: 90,
    pos: { l: 42, t: 38, w: 32, h: 34 },
    lines: [
      "uefi_watchdog: unexpected power rail voltage drop",
      "nvram: state flag set to SYSTEM_REBOOT_REQUIRED",
      "firmware signature verification: VALIDATED [SYSTEM_2.0]",
      "cooling fans: 100% duty cycle engaged",
      "saving crash telemetry to NVMe diagnostic sector",
      "standby for automated quantum reboot sequence...",
    ],
  },
  {
    title: "net_supervisor — socket teardown",
    prompt: "supervisor#",
    fg: "#b388ff",
    accent: "#d1b3ff",
    bar: "#1a1033",
    speed: 75,
    pos: { l: 64, t: 44, w: 32, h: 38 },
    lines: [
      "net_sup: closing TLS 1.3 socket on port {PORT}",
      "disconnecting CyberNet WebSocket interface",
      "routing tables: flushing routing cache",
      "interface eth0: link state changed to DOWN",
      "graceful socket drain timeout expired",
      "all remote connections terminated safely",
      "loopback interface: offline",
    ],
  },
  {
    title: "tail -f /var/log/sys_panic.log",
    prompt: "",
    fg: "#ff8a3d",
    accent: "#ffa566",
    bar: "#2a1405",
    speed: 45,
    pos: { l: 50, t: 22, w: 30, h: 30 },
    lines: [
      "syslog: [{PID}.{PCT}] CRITICAL: core heartbeat lost",
      "syslog: [{PID}.{PCT}] memory controller: refresh cycle timed out",
      "syslog: [{PID}.{PCT}] watchdog timer expired, resetting APIC",
      "syslog: [{PID}.{PCT}] emergency sync complete: 0 uncommitted pages",
      "syslog: [{PID}.{PCT}] quantum OS preparing cold restart",
    ],
  },
];

// Accelerating schedule: each error sound + terminal spawn comes sooner than the last
const FIRST_GAP_MS = 900;
const MIN_GAP_MS = 170;
const GAP_DECAY = 0.8;
const MAX_TERMINALS = 30;

interface SpawnedTerminal {
  id: number;
  term: FakeTerminal;
  pos: { l: number; t: number; w: number; h: number };
}

function FakeTerminalWindow({ term, pos, index }: { term: FakeTerminal; pos: SpawnedTerminal["pos"]; index: number }) {
  const [lines, setLines] = useState<{ text: string; isCmd: boolean }[]>([]);
  const cursor = useRef(rand(term.lines.length));

  useEffect(() => {
    const tick = () => {
      const tpl = term.lines[cursor.current % term.lines.length];
      cursor.current += 1;
      const isCmd = !/^(\[|warning|error|syslog|panic|mem_|build_|uefi_|net_|neural_|0x|\d)/i.test(tpl);
      setLines((prev) => [...prev, { text: fill(tpl), isCmd }].slice(-16));
    };
    tick();
    const id = setInterval(tick, Math.max(term.speed, 110));
    return () => clearInterval(id);
  }, [term]);

  return (
    <div
      className="absolute flex flex-col rounded-lg overflow-hidden border shadow-[0_20px_60px_rgba(0,0,0,0.85)] animate-in fade-in zoom-in-95 duration-150"
      style={{
        left: `${pos.l}vw`,
        top: `${pos.t}vh`,
        width: `max(${pos.w}vw, 280px)`,
        height: `max(${pos.h}vh, 200px)`,
        zIndex: 10 + index,
        background: "rgba(2,4,3,0.94)",
        borderColor: `${term.accent}55`,
      }}
    >
      <div
        className="flex items-center gap-2 px-2.5 py-1.5 shrink-0 border-b"
        style={{ background: term.bar, borderColor: `${term.accent}33` }}
      >
        <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
        <span
          className="ml-2 text-[10px] font-mono truncate"
          style={{ color: term.accent }}
        >
          {fill(term.title)}
        </span>
      </div>
      <div
        className="flex-1 p-2 font-mono text-[10px] sm:text-[11px] leading-[1.35] overflow-hidden flex flex-col justify-end whitespace-nowrap"
        style={{ color: term.fg }}
      >
        {lines.map((l, i) => (
          <div key={i} className="truncate">
            {l.isCmd && term.prompt && (
              <span style={{ color: term.accent }}>{term.prompt} </span>
            )}
            {l.text}
          </div>
        ))}
        <span
          className="inline-block w-1.5 h-3 animate-pulse mt-0.5"
          style={{ background: term.fg }}
        />
      </div>
    </div>
  );
}

export default function CrashOverlay({ stage, onRecover }: CrashOverlayProps) {
  const [rebootStep, setRebootStep] = useState(0);
  const [rebootProgress, setRebootProgress] = useState(0);

  // Meltdown: every error sound (overlapping, accelerating) opens a new terminal
  const [spawned, setSpawned] = useState<SpawnedTerminal[]>([]);

  useEffect(() => {
    if (stage !== "meltdown") return;
    setSpawned([]);

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;
    let n = 0;

    const fire = () => {
      if (cancelled) return;
      const id = n;
      const base = TERMINALS[id % TERMINALS.length];
      const pos = {
        l: 1 + rand(62),
        t: 5 + rand(52),
        w: base.pos.w,
        h: base.pos.h,
      };
      setSpawned((prev) => [...prev, { id, term: base, pos }].slice(-MAX_TERMINALS));

      // Sound speeds up as the gaps shrink; hits are allowed to overlap
      const gap = Math.max(MIN_GAP_MS, FIRST_GAP_MS * Math.pow(GAP_DECAY, n));
      sound.playCrashHit(1 + (1 - gap / FIRST_GAP_MS) * 0.8);

      n += 1;
      const nextGap = Math.max(MIN_GAP_MS, FIRST_GAP_MS * Math.pow(GAP_DECAY, n));
      timer = setTimeout(fire, nextGap);
    };

    timer = setTimeout(fire, 150);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [stage]);

  // Reboot sequence typewriter steps
  const bootLogs = [
    ">> INUSHA_OS KERNEL RECOVERY v4.19.0-CYBER",
    ">> [OK] HARDWARE WATCHDOG INTERRUPT DISPATCHED",
    ">> [OK] KILLING ROGUE PROCESSES... 8 TERMINATED",
    ">> [OK] RESTORING FILESYSTEM FROM CLEAN SNAPSHOT... [PASS]",
    ">> [OK] COLD RESTARTING AGENTIC PRODUCTION PIPELINE...",
    ">> [READY] ALL SUBSYSTEMS ONLINE. RESTORING WORKSPACE...",
  ];

  useEffect(() => {
    if (stage !== "reboot") return;

    setRebootStep(0);
    setRebootProgress(0);

    const stepInterval = setInterval(() => {
      setRebootStep((prev) => {
        if (prev < bootLogs.length - 1) {
          sound.playClick(900 + prev * 120);
          return prev + 1;
        }
        clearInterval(stepInterval);
        return prev;
      });
    }, 450);

    const progressInterval = setInterval(() => {
      setRebootProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 5;
      });
    }, 120);

    // Auto-recover after 3.5s of reboot
    const autoTimer = setTimeout(() => {
      onRecover();
    }, 3500);

    return () => {
      clearInterval(stepInterval);
      clearInterval(progressInterval);
      clearTimeout(autoTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage, onRecover]);

  // -------------------------------------------------------------
  // PHASE 2: Screen goes dark (CRT power-off collapse)
  // -------------------------------------------------------------
  if (stage === "collapse") {
    return (
      <div className="fixed inset-0 z-[200] bg-black flex items-center justify-center overflow-hidden">
        <div className="w-full h-full bg-[#d8ffe8] animate-crt-collapse flex items-center justify-center">
          <div className="w-full h-[4px] bg-white shadow-[0_0_25px_#ffffff,0_0_50px_#00f5d4]" />
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // PHASE 3: Reboot console
  // -------------------------------------------------------------
  if (stage === "reboot") {
    return (
      <div className="fixed inset-0 z-[200] bg-[#04060a] flex flex-col items-center justify-center p-6 text-gray-200 font-mono select-none overflow-hidden animate-crt-reboot">
        <div className="absolute inset-0 cyber-scanlines opacity-40 pointer-events-none" />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at center, transparent 50%, rgba(0,0,0,0.85) 100%)",
          }}
        />

        <div className="max-w-xl w-full bg-[#080d1a]/95 border border-[#00f5d4]/40 rounded-2xl p-6 shadow-[0_0_60px_rgba(0,245,212,0.2)] relative z-10 space-y-5">
          <div className="corner-bracket-tl" />
          <div className="corner-bracket-br" />

          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Terminal size={16} className="text-[#00f5d4]" />
              <span className="text-xs font-bold tracking-widest text-[#00f5d4]">
                SYSTEM_REBOOT
              </span>
            </div>
            <span className="text-[10px] text-gray-500 font-mono">STAGE: RECOVERY</span>
          </div>

          <div className="space-y-1.5 min-h-[160px] text-xs font-mono">
            {bootLogs.slice(0, rebootStep + 1).map((log, index) => (
              <div
                key={index}
                className={`transition-opacity duration-200 ${
                  index === rebootStep ? "text-[#00f5d4] font-bold" : "text-gray-300"
                }`}
              >
                {log}
              </div>
            ))}
            {rebootStep < bootLogs.length - 1 && (
              <span className="inline-block w-2 h-4 bg-[#00f5d4] animate-pulse align-middle ml-1" />
            )}
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px] text-gray-400">
              <span>SYSTEM RESTORATION</span>
              <span className="text-[#00f5d4] font-bold">{rebootProgress}%</span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#00f5d4] to-[#06b6d4] transition-all duration-150 rounded-full shadow-[0_0_12px_#00f5d4]"
                style={{ width: `${rebootProgress}%` }}
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => {
                sound.playClick(1400);
                onRecover();
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-[#00f5d4]/10 hover:bg-[#00f5d4]/20 border border-[#00f5d4]/40 hover:border-[#00f5d4] text-[#00f5d4] font-bold text-xs tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(0,245,212,0.2)]"
            >
              <RefreshCw size={14} className="animate-spin" />
              <span>SKIP // REBOOT NOW</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // PHASE 1: Multiple terminals spawn, running "malicious" commands
  // -------------------------------------------------------------
  return (
    <div
      className="fixed inset-0 z-[150] select-none overflow-hidden bg-black/80"
    >
      <div className="absolute inset-0 cyber-scanlines opacity-30 pointer-events-none" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at center, transparent 45%, rgba(0,0,0,0.8) 100%)",
        }}
      />

      {spawned.map((s, i) => (
        <FakeTerminalWindow key={s.id} term={s.term} pos={s.pos} index={i} />
      ))}

      <button
        onClick={(e) => {
          e.stopPropagation();
          sound.playClick(1000);
          onRecover();
        }}
        className="absolute bottom-4 right-4 z-[100] flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/70 hover:bg-black border border-white/20 text-gray-300 hover:text-white font-mono text-[11px] transition-colors cursor-pointer"
      >
        <XCircle size={13} />
        <span>ABORT</span>
      </button>
    </div>
  );
}
