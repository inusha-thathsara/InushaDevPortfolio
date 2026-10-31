"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { CornerDownLeft, Terminal as TerminalIcon, ArrowDown, Sparkles } from "lucide-react";
import TypedMessage from "../TypedMessage";
import { sound } from "@/app/lib/audio";

interface MessageItem {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  isTyped?: boolean;
  timestamp?: string;
}

interface TerminalModuleProps {
  onTriggerCrash: () => void;
  onNavigateToProjects: () => void;
  onNavigateToSkills: () => void;
  onNavigateToComms: () => void;
}

export default function TerminalModule({
  onTriggerCrash,
  onNavigateToProjects,
  onNavigateToSkills,
  onNavigateToComms,
}: TerminalModuleProps) {
  const [messages, setMessages] = useState<MessageItem[]>([
    {
      id: "init-1",
      role: "system",
      content:
        "SYSTEM 2.0 NEURAL CORE INITIALIZED [OK]\nDigital Twin of Malawige Inusha Thathsara Gunasekara online.\nType any question or command. Click quick prompts below to inspect.",
      timestamp: "SYS.INIT",
    },
  ]);

  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [isLoading, setIsLoading] = useState(false);
  const [showScrollBottomBtn, setShowScrollBottomBtn] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll logic
  const scrollToBottom = useCallback((smooth = true) => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: smooth ? "smooth" : "auto",
      });
    }
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({
        behavior: smooth ? "smooth" : "auto",
        block: "end",
      });
    }
    setShowScrollBottomBtn(false);
  }, []);

  // Track if user scrolled up
  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 80;
    setShowScrollBottomBtn(!isNearBottom);
  };

  // Scroll to bottom on new messages
  useEffect(() => {
    scrollToBottom(true);
  }, [messages, scrollToBottom]);

  const quickPrompts = [
    { label: "🚀 Projects", cmd: "projects", action: onNavigateToProjects },
    { label: "🧠 AI Skills", cmd: "skills", action: onNavigateToSkills },
    { label: "🏆 Hackathon Wins", cmd: "hackathons" },
    { label: "📬 Contact", cmd: "contact", action: onNavigateToComms },
    { label: "⚡ System Status", cmd: "status" },
    { label: "⚠️ Sudo Delete", cmd: "sudo delete" },
  ];

  const handleCommand = async (rawCmd: string) => {
    const cmd = rawCmd.trim();
    if (!cmd) return;

    sound.playClick(1000);

    // Save to history
    setHistory((prev) => [cmd, ...prev]);
    setHistoryIndex(-1);

    // Append user message
    const userMsg: MessageItem = {
      id: Date.now().toString(),
      role: "user",
      content: cmd,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    const lower = cmd.toLowerCase().trim();

    // Local Fast-Path Commands
    if (lower === "clear") {
      setMessages([]);
      setIsLoading(false);
      return;
    }

    if (lower === "sudo delete") {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content:
            "⚠️ [CRITICAL ROOT WARNING] Unauthorized core wipe requested.\nRecursive deletion will dismantle the terminal and force a system blackout.\nType 'confirm' to execute the halt sequence.",
        },
      ]);
      setIsLoading(false);
      return;
    }

    if (lower === "confirm") {
      sound.playAlert();
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content:
            "🚨 [HALT SEQUENCE ACTIVATED]\n- Severing neural link...\n- Purging runtime cache...\n- Initiating reboot cycle...",
        },
      ]);
      setIsLoading(false);
      setTimeout(() => {
        onTriggerCrash();
      }, 1200);
      return;
    }

    // Call chat API for clean JSON response
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: cmd }],
        }),
      });

      if (!res.ok) throw new Error("Terminal link failed");

      const data = await res.json();
      const responseText = data.text || `[PROCESSED] Command '${cmd}' acknowledged.`;

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: responseText.trim(),
        },
      ]);
    } catch {
      // Local graceful fallback
      let fallback = `[SYSTEM 2.0 :: OFFLINE SIMULATION]\nProcessed query: "${cmd}".\nStatus: Systems operational. Explore tabs in the dock below for Projects, Skills, and Telemetry.`;
      if (lower.includes("project") || lower.includes("work")) {
        fallback =
          "Flagship 2026 Projects:\n1. slothpfn (Zero-effort Tabular AI Agent)\n2. Ghost Data Audit Agent (GDPR Deletion Verifier)\n3. PodSnippet Studio (Gemma 2 + ElevenLabs Podcast Engine)\n4. The 80% Attendance Protocol (Flutter + Gemini)\n5. The Living Blueprint Agent (Architecture & PRD AI)";
      } else if (lower.includes("who") || lower.includes("about") || lower.includes("inusha")) {
        fallback =
          "Inusha Thathsara Gunasekara is an IT Undergraduate at University of Moratuwa, Sri Lanka.\nSpecializes in Agentic AI, local LLMs (Gemma, TabPFN), scalable web platforms, and cloud infrastructure.";
      } else if (lower.includes("contact") || lower.includes("email") || lower.includes("reach") || lower.includes("hire") || lower.includes("linkedin") || lower.includes("github")) {
        fallback =
          "Direct Transmission Channels:\n• Email:    inusha.thathsara@gmail.com\n• LinkedIn: linkedin.com/in/inusha-gunasekara-9996632a5\n• GitHub:   github.com/inusha-thathsara (55+ Repos)\n• DEV.to:   dev.to/inushathathsara\n• Location: Colombo, Sri Lanka 🇱🇰";
      }

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: fallback,
        },
      ]);
    } finally {
      setIsLoading(false);
      // Ensure terminal stays scrolled down
      setTimeout(() => scrollToBottom(true), 50);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    sound.playClick(1100);
    if (e.key === "Enter") {
      e.preventDefault();
      handleCommand(input);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length > 0 && historyIndex < history.length - 1) {
        const nextIdx = historyIndex + 1;
        setHistoryIndex(nextIdx);
        setInput(history[nextIdx]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        const prevIdx = historyIndex - 1;
        setHistoryIndex(prevIdx);
        setInput(history[prevIdx]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput("");
      }
    }
  };

  return (
    <div className="flex flex-col h-full flex-1 min-h-[460px] relative">
      {/* Terminal Message Stream Container */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto space-y-3 pr-2 font-mono text-xs sm:text-sm text-gray-300 scroll-smooth terminal-scrollbar min-h-0"
        style={{ scrollBehavior: "smooth" }}
      >
        {messages.map((m, idx) => {
          const isAssistant = m.role === "assistant";
          const isSystem = m.role === "system";
          const isLast = idx === messages.length - 1;

          return (
            <div
              key={m.id}
              className={`p-3.5 rounded-xl border leading-relaxed shadow-sm transition-all ${
                isSystem
                  ? "bg-[#00f5d4]/5 border-[#00f5d4]/20 text-[#00f5d4]"
                  : isAssistant
                  ? "bg-white/[0.03] border-white/10 text-gray-200"
                  : "bg-[#8b5cf6]/10 border-[#8b5cf6]/30 text-white ml-4 sm:ml-8"
              }`}
            >
              <div className="flex items-center gap-2 mb-1.5 opacity-70 text-[10px] tracking-wider uppercase select-none">
                <span
                  className={
                    isSystem
                      ? "text-[#00f5d4] font-bold"
                      : isAssistant
                      ? "text-[#06b6d4] font-bold"
                      : "text-[#8b5cf6] font-bold"
                  }
                >
                  {isSystem ? "SYSTEM_KERNEL" : isAssistant ? "DIGITAL_TWIN" : "GUEST_TERMINAL"}
                </span>
                <span className="text-gray-600">::</span>
                <span className="text-gray-400" suppressHydrationWarning>{m.timestamp || "ONLINE"}</span>
              </div>

              {isAssistant && isLast ? (
                <TypedMessage
                  content={m.content}
                  showCursor={true}
                  speed={12}
                  onUpdate={() => scrollToBottom(false)}
                  onComplete={() => scrollToBottom(true)}
                />
              ) : (
                <div className="whitespace-pre-wrap font-mono">{m.content}</div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-gray-400 flex items-center gap-2 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-[#00f5d4] animate-ping" />
            <span>Neural core parsing transmission...</span>
          </div>
        )}

        {/* Scroll anchor target */}
        <div ref={bottomRef} className="h-1 w-full" />
      </div>

      {/* Floating "Scroll to Bottom" button if user scrolled up */}
      {showScrollBottomBtn && (
        <button
          onClick={() => scrollToBottom(true)}
          className="absolute bottom-16 right-4 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0b0f19] border border-[#00f5d4] text-[#00f5d4] text-xs font-mono shadow-[0_0_15px_rgba(0,245,212,0.3)] hover:bg-[#00f5d4]/10 transition-all cursor-pointer animate-bounce"
        >
          <ArrowDown size={13} />
          <span>Scroll to latest</span>
        </button>
      )}

      {/* Quick Prompts Bar */}
      <div className="pt-3 pb-2 flex flex-wrap gap-1.5 sm:gap-2 select-none">
        {quickPrompts.map((p) => (
          <button
            key={p.cmd}
            onClick={() => {
              sound.playClick(950);
              if (p.action) p.action();
              handleCommand(p.cmd);
            }}
            className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-[#00f5d4]/10 border border-white/10 hover:border-[#00f5d4]/40 text-[11px] font-mono text-gray-300 hover:text-[#00f5d4] transition-all cursor-pointer flex items-center gap-1 active:scale-95"
          >
            <span>{p.label}</span>
          </button>
        ))}
      </div>

      {/* Interactive Command Input */}
      <div className="mt-1 relative flex items-center bg-black/60 border border-white/15 focus-within:border-[#00f5d4] focus-within:shadow-[0_0_12px_rgba(0,245,212,0.2)] rounded-xl px-3 py-2.5 transition-all shadow-inner">
        <span className="text-[#00f5d4] font-mono font-bold mr-2 select-none">
          ➜
        </span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Ask anything about Inusha or type a command (help, projects, skills)..."
          className="flex-1 bg-transparent border-none outline-none text-white text-xs sm:text-sm font-mono placeholder:text-gray-500"
          autoFocus
        />
        <button
          onClick={() => handleCommand(input)}
          disabled={!input.trim() || isLoading}
          className="p-1.5 rounded-lg bg-[#00f5d4]/20 hover:bg-[#00f5d4]/30 text-[#00f5d4] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
          title="Submit command"
        >
          <CornerDownLeft size={14} />
        </button>
      </div>
    </div>
  );
}
