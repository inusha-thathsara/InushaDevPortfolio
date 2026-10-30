"use client";

import React, { useState } from "react";
import Card3D from "../3d/Card3D";
import CyberGlitchText from "../ui/CyberGlitchText";
import { Mail, Linkedin, Github, Send, Copy, Check, ExternalLink, Radio, MessageSquare } from "lucide-react";
import { sound } from "@/app/lib/audio";

export default function TransceiverModal() {
  const [copied, setCopied] = useState<string | null>(null);
  const [msgName, setMsgName] = useState("");
  const [msgBody, setMsgBody] = useState("");
  const [isSent, setIsSent] = useState(false);

  const channels = [
    {
      id: "email",
      label: "Direct Neural Transmission (Gmail)",
      handle: "inusha.thathsara@gmail.com",
      url: "mailto:inusha.thathsara@gmail.com",
      icon: <Mail size={16} className="text-[#00f5d4]" />,
      actionLabel: "Email Summon",
    },
    {
      id: "linkedin",
      label: "Professional Signal (LinkedIn)",
      handle: "in/inusha-gunasekara-9996632a5",
      url: "https://linkedin.com/in/inusha-gunasekara-9996632a5",
      icon: <Linkedin size={16} className="text-[#06b6d4]" />,
      actionLabel: "Connect Signal",
    },
    {
      id: "devto",
      label: "Technical Intelligence (DEV.to)",
      handle: "dev.to/inushathathsara",
      url: "https://dev.to/inushathathsara",
      icon: <MessageSquare size={16} className="text-[#8b5cf6]" />,
      actionLabel: "Read Articles",
    },
    {
      id: "github",
      label: "Code Vaults & Commits (GitHub)",
      handle: "github.com/inusha-thathsara",
      url: "https://github.com/inusha-thathsara",
      icon: <Github size={16} className="text-white" />,
      actionLabel: "Inspect Code",
    },
  ];

  const handleCopy = (text: string, id: string) => {
    sound.playClick(1200);
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!msgBody.trim()) return;
    sound.playAlert();
    setIsSent(true);
    // Prefill mailto link to open their default mail client
    window.open(
      `mailto:inusha.thathsara@gmail.com?subject=Contact from Cyberpunk OS: ${encodeURIComponent(
        msgName || "Visitor"
      )}&body=${encodeURIComponent(msgBody)}`
    );
  };

  return (
    <div className="space-y-6">
      {/* Channels List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {channels.map((chan) => (
          <Card3D key={chan.id} maxTilt={8} glareColor="rgba(0, 245, 212, 0.16)" className="h-full">
            <div className="bg-[#0b0f19]/80 border border-white/10 hover:border-[#00f5d4]/40 rounded-xl p-4 flex flex-col justify-between h-full transition-all group">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  {chan.icon}
                  <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">
                    {chan.label}
                  </span>
                </div>
                <p className="text-sm font-mono font-bold text-white group-hover:text-[#00f5d4] transition-colors truncate">
                  <CyberGlitchText text={chan.handle} speed={25} />
                </p>
              </div>

              <div className="flex items-center gap-2 mt-4 pt-3 border-t border-white/5">
                <a
                  href={chan.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => sound.playClick(1000)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-mono text-gray-200 hover:text-white transition-colors"
                >
                  <span>{chan.actionLabel}</span>
                  <ExternalLink size={12} />
                </a>

                <button
                  onClick={() => handleCopy(chan.handle, chan.id)}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer ml-auto"
                  title="Copy to clipboard"
                >
                  {copied === chan.id ? (
                    <Check size={14} className="text-[#00f5d4]" />
                  ) : (
                    <Copy size={14} />
                  )}
                </button>
              </div>
            </div>
          </Card3D>
        ))}
      </div>

      {/* Quick Transmission Dispatch Form */}
      <div className="bg-[#0b0f19]/80 border border-white/10 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <Radio size={16} className="text-[#00f5d4] animate-pulse" />
          <h3 className="text-sm font-bold font-mono text-white tracking-wider">
            TRANSMIT DIRECT ENCRYPTED SIGNAL
          </h3>
        </div>
        <p className="text-xs text-gray-400 font-mono mb-4 leading-relaxed">
          Need an AI agent built, a full-stack product shipped, or looking to collaborate on a hackathon?
          Send a transmission straight to Inusha's terminal.
        </p>

        {isSent ? (
          <div className="p-4 bg-[#00f5d4]/10 border border-[#00f5d4]/30 rounded-xl text-center font-mono text-xs text-[#00f5d4]">
            Transmission packaged and dispatched to mail client! Inusha will respond shortly.
          </div>
        ) : (
          <form onSubmit={handleSendMessage} className="space-y-3 font-mono text-xs">
            <input
              type="text"
              value={msgName}
              onChange={(e) => setMsgName(e.target.value)}
              placeholder="Your Call-Sign / Name or Email..."
              className="w-full bg-black/40 border border-white/15 focus:border-[#00f5d4] rounded-xl px-3 py-2.5 text-white outline-none"
              required
            />
            <textarea
              rows={3}
              value={msgBody}
              onChange={(e) => setMsgBody(e.target.value)}
              placeholder="Brief transmission payload / project scope..."
              className="w-full bg-black/40 border border-white/15 focus:border-[#00f5d4] rounded-xl px-3 py-2.5 text-white outline-none resize-none"
              required
            />
            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#00f5d4] to-[#06b6d4] text-black font-bold font-mono flex items-center justify-center gap-2 hover:opacity-90 transition-opacity cursor-pointer shadow-[0_0_15px_rgba(0,245,212,0.3)]"
            >
              <Send size={14} />
              <span>TRANSMIT DISPATCH PAYLOAD</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
