"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Maximize2, Minimize2, X, Terminal, Sparkles } from "lucide-react";
import { sound } from "@/app/lib/audio";

interface WindowFrameProps {
  title: string;
  badge?: string;
  icon?: React.ReactNode;
  subtitle?: string;
  children: React.ReactNode;
  isMaximizedDefault?: boolean;
  onClose?: () => void;
  accentColor?: string;
}

export default function WindowFrame({
  title,
  badge,
  icon,
  subtitle,
  children,
  isMaximizedDefault = false,
  onClose,
  accentColor = "#00f5d4",
}: WindowFrameProps) {
  const [isMaximized, setIsMaximized] = useState(isMaximizedDefault);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [hasOverflow, setHasOverflow] = useState(false);
  const contentRef = React.useRef<HTMLDivElement>(null);

  const toggleMaximize = () => {
    sound.playClick(1000);
    setIsMaximized(!isMaximized);
  };

  const handleScroll = () => {
    if (!contentRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
    const totalScrollable = scrollHeight - clientHeight;
    if (totalScrollable > 10) {
      setHasOverflow(true);
      const pct = Math.min(100, Math.max(0, (scrollTop / totalScrollable) * 100));
      setScrollProgress(pct);
    } else {
      setHasOverflow(false);
      setScrollProgress(0);
    }
  };

  React.useEffect(() => {
    handleScroll();
  }, [children]);

  return (
    <motion.section
      initial={{ opacity: 0, scale: 0.98, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, y: -10 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={`relative flex flex-col cyber-panel rounded-2xl border border-white/10 overflow-hidden shadow-2xl transition-all duration-300 ${
        isMaximized
          ? "fixed inset-4 z-50 rounded-2xl bg-[#06080f]/95"
          : "w-full min-h-[560px] max-h-[82vh]"
      }`}
    >
      {/* Corner Brackets */}
      <div className="corner-bracket-tl" />
      <div className="corner-bracket-br" />

      {/* Top Accent Gradient Bar */}
      <div
        className="w-full h-[2px]"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${accentColor} 50%, transparent 100%)`,
        }}
      />

      {/* Header Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-white/[0.04] border-b border-white/10 select-none relative">
        <div className="flex items-center gap-2.5">
          <div
            className="w-6 h-6 rounded flex items-center justify-center text-black font-bold text-xs"
            style={{ backgroundColor: accentColor }}
          >
            {icon || <Terminal size={13} />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-white text-xs sm:text-sm font-mono font-bold tracking-wider uppercase">
                {title}
              </h2>
              {badge && (
                <span
                  className="text-[10px] px-1.5 py-0.5 rounded font-mono font-semibold"
                  style={{
                    backgroundColor: `${accentColor}20`,
                    color: accentColor,
                    border: `1px solid ${accentColor}40`,
                  }}
                >
                  {badge}
                </span>
              )}
            </div>
            {subtitle && (
              <p className="text-[10px] text-gray-400 font-mono hidden sm:block">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Window controls & scroll telemetry */}
        <div className="flex items-center gap-3">
          {hasOverflow && (
            <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded bg-black/40 border border-white/5 text-[10px] font-mono">
              <span className="text-gray-500">SCROLL:</span>
              <span className="font-bold" style={{ color: accentColor }}>
                {Math.round(scrollProgress)}%
              </span>
            </div>
          )}

          <button
            onClick={toggleMaximize}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title={isMaximized ? "Restore Window Size" : "Maximize Window"}
          >
            {isMaximized ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
          </button>
          {onClose && (
            <button
              onClick={() => {
                sound.playClick(600);
                onClose();
              }}
              className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
              title="Close Panel"
            >
              <X size={13} />
            </button>
          )}
        </div>

        {/* Dynamic Holographic Scroll Progress Bar */}
        {hasOverflow && (
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/5">
            <div
              className="h-full transition-all duration-75"
              style={{
                width: `${scrollProgress}%`,
                backgroundColor: accentColor,
                boxShadow: `0 0 10px ${accentColor}`,
              }}
            />
          </div>
        )}
      </div>

      {/* Content Area */}
      <div
        ref={contentRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 sm:p-5 text-gray-300 font-mono text-sm leading-relaxed relative flex flex-col min-h-0 scroll-smooth"
      >
        {children}
      </div>
    </motion.section>
  );
}
