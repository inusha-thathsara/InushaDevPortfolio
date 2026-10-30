"use client";

import React, { useRef } from "react";
import { sound } from "@/app/lib/audio";

interface DesktopIconProps {
  id: string;
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  accentColor: string;
  isOpen: boolean;
  isSelected?: boolean;
  onSelect?: () => void;
  onDeselect?: () => void;
  onOpen: () => void;
  badge?: string;
}

export default function DesktopIcon({
  id,
  title,
  subtitle,
  icon,
  accentColor,
  isOpen,
  isSelected = false,
  onSelect,
  onDeselect,
  onOpen,
  badge,
}: DesktopIconProps) {
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (clickTimeoutRef.current) {
      // Double click: open app and clear highlight
      clearTimeout(clickTimeoutRef.current);
      clickTimeoutRef.current = null;
      onDeselect?.();
      sound.playOpen();
      onOpen();
    } else {
      // Single click: select and allow opening
      sound.playClick(1200);
      onSelect?.();

      clickTimeoutRef.current = setTimeout(() => {
        clickTimeoutRef.current = null;
        // On single click timeout, also launch or keep selected until click away
      }, 300);
    }
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
      clickTimeoutRef.current = null;
    }
    onDeselect?.();
    sound.playOpen();
    onOpen();
  };

  return (
    <button
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onBlur={() => onDeselect?.()}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onDeselect?.();
          sound.playOpen();
          onOpen();
        }
      }}
      className={`group relative flex flex-col items-center justify-center p-2 rounded-2xl w-[86px] sm:w-[94px] transition-all duration-150 cursor-pointer select-none outline-none ${
        isSelected
          ? "bg-white/10 ring-1 ring-[#00f5d4]/40 backdrop-blur-md shadow-lg"
          : "hover:bg-white/5 active:scale-95"
      }`}
    >
      {/* Icon Badge container */}
      <div
        className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center shadow-xl transition-all duration-200 group-hover:scale-105 group-hover:shadow-[0_0_20px_rgba(0,245,212,0.3)] border ${
          isSelected ? "border-[#00f5d4]/50 shadow-[0_0_15px_rgba(0,245,212,0.25)]" : "border-white/10"
        }`}
        style={{
          background: `linear-gradient(135deg, ${accentColor}25 0%, rgba(11,15,25,0.85) 100%)`,
        }}
      >
        {/* Glow Pip behind icon */}
        <div
          className="absolute inset-1 rounded-xl opacity-30 blur-sm pointer-events-none"
          style={{ backgroundColor: accentColor }}
        />

        <div
          className="relative z-10 transition-transform duration-200 group-hover:scale-110"
          style={{ color: accentColor }}
        >
          {icon}
        </div>

        {/* Running status badge */}
        {isOpen && (
          <span
            className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full ring-2 ring-[#06080f] shadow-[0_0_8px_currentColor]"
            style={{ backgroundColor: accentColor, color: accentColor }}
          />
        )}

        {badge && (
          <span
            className="absolute -bottom-1 -right-1 text-[9px] px-1 rounded font-mono font-bold leading-tight border border-white/20 text-black shadow-sm"
            style={{ backgroundColor: accentColor }}
          >
            {badge}
          </span>
        )}
      </div>

      {/* Label */}
      <span className="mt-1.5 text-[11px] sm:text-xs font-mono font-medium text-gray-200 text-center leading-tight drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] max-w-full truncate px-1 group-hover:text-white">
        {title}
      </span>
      {subtitle && (
        <span className="text-[9px] text-gray-400 font-mono text-center truncate max-w-full opacity-80 group-hover:opacity-100">
          {subtitle}
        </span>
      )}
    </button>
  );
}
