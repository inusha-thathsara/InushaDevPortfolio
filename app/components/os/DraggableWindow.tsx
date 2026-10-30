"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useDragControls } from "framer-motion";
import { X, Minus, Maximize2, Minimize2 } from "lucide-react";
import { sound } from "@/app/lib/audio";

interface DraggableWindowProps {
  id: string;
  title: string;
  subtitle?: string;
  badge?: string;
  icon?: React.ReactNode;
  accentColor?: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  isFocused: boolean;
  zIndex: number;
  initialPosition?: { x: number; y: number };
  initialSize?: { width: number | string; height: number | string };
  onFocus: () => void;
  onClose: () => void;
  onMinimize: () => void;
  onToggleMaximize: () => void;
  children: React.ReactNode;
  constraintsRef?: React.RefObject<HTMLDivElement | null>;
}

const parseDimension = (
  val: number | string | undefined,
  defaultVal: number
): number => {
  if (typeof val === "number") return val;
  if (typeof val === "string") {
    const parsed = parseInt(val, 10);
    if (!Number.isNaN(parsed)) return parsed;
  }
  return defaultVal;
};

export default function DraggableWindow({
  id,
  title,
  subtitle,
  badge,
  icon,
  accentColor = "#00f5d4",
  isOpen,
  isMinimized,
  isMaximized,
  isFocused,
  zIndex,
  initialPosition = { x: 40, y: 30 },
  initialSize = { width: 900, height: 600 },
  onFocus,
  onClose,
  onMinimize,
  onToggleMaximize,
  children,
  constraintsRef,
}: DraggableWindowProps) {
  const dragControls = useDragControls();
  const windowRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  const [scrollProgress, setScrollProgress] = useState(0);
  const [hasOverflow, setHasOverflow] = useState(false);

  // Dynamic window size state for interactive resizing
  const [size, setSize] = useState<{ width: number; height: number }>({
    width: parseDimension(initialSize?.width, 880),
    height: parseDimension(initialSize?.height, 560),
  });

  const [isResizing, setIsResizing] = useState(false);

  const handleScroll = () => {
    if (!contentRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
    const totalScrollable = scrollHeight - clientHeight;
    if (totalScrollable > 15) {
      setHasOverflow(true);
      setScrollProgress((scrollTop / totalScrollable) * 100);
    } else {
      setHasOverflow(false);
      setScrollProgress(0);
    }
  };

  useEffect(() => {
    handleScroll();
  }, [children]);

  // Interactive Resizing Handlers (Corner & Edges)
  const handleResizeStart =
    (direction: "se" | "e" | "s") => (e: React.PointerEvent) => {
      e.preventDefault();
      e.stopPropagation();
      onFocus();

      const startX = e.clientX;
      const startY = e.clientY;
      const startWidth = size.width;
      const startHeight = size.height;

      setIsResizing(true);

      const onPointerMove = (moveEvent: PointerEvent) => {
        const deltaX = moveEvent.clientX - startX;
        const deltaY = moveEvent.clientY - startY;

        let newWidth = startWidth;
        let newHeight = startHeight;

        const minW = typeof window !== "undefined" && window.innerWidth < 640 ? 300 : 380;
        const maxW = typeof window !== "undefined" ? window.innerWidth - 20 : 1600;
        const minH = 280;
        const maxH = typeof window !== "undefined" ? window.innerHeight - 90 : 1000;

        if (direction === "se" || direction === "e") {
          newWidth = Math.max(minW, Math.min(maxW, startWidth + deltaX));
        }
        if (direction === "se" || direction === "s") {
          newHeight = Math.max(minH, Math.min(maxH, startHeight + deltaY));
        }

        setSize({
          width: Math.round(newWidth),
          height: Math.round(newHeight),
        });
      };

      const onPointerUp = () => {
        setIsResizing(false);
        sound.playClick(1000);
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("pointerup", onPointerUp);
      };

      window.addEventListener("pointermove", onPointerMove);
      window.addEventListener("pointerup", onPointerUp);
    };

  if (!isOpen) return null;

  return (
    <motion.div
      ref={windowRef}
      drag={!isMaximized}
      dragListener={false}
      dragControls={dragControls}
      dragMomentum={false}
      dragElastic={0.05}
      dragConstraints={constraintsRef}
      initial={{
        opacity: 0,
        scale: 0.94,
        x:
          typeof window !== "undefined" && window.innerWidth < 640
            ? 10
            : initialPosition.x,
        y:
          typeof window !== "undefined" && window.innerWidth < 640
            ? 15
            : initialPosition.y,
      }}
      animate={{
        opacity: isMinimized ? 0 : 1,
        scale: isMinimized ? 0.75 : 1,
        y: isMinimized
          ? window.innerHeight
          : isMaximized
          ? 0
          : typeof window !== "undefined" && window.innerWidth < 640
          ? 15
          : initialPosition.y,
        x: isMaximized
          ? 0
          : typeof window !== "undefined" && window.innerWidth < 640
          ? 10
          : initialPosition.x,
        pointerEvents: isMinimized ? "none" : "auto",
      }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      onPointerDown={onFocus}
      style={{
        zIndex,
        width: isMaximized
          ? "100%"
          : typeof window !== "undefined" && window.innerWidth < 640
          ? "calc(100vw - 20px)"
          : size.width,
        height: isMaximized ? "100%" : size.height,
        maxWidth: isMaximized ? "100%" : "calc(100vw - 20px)",
        maxHeight: isMaximized ? "100%" : "calc(100vh - 100px)",
      }}
      className={`absolute flex flex-col rounded-2xl overflow-hidden transition-shadow duration-200 select-none ${
        isMaximized
          ? "fixed inset-0 top-9 sm:top-10 bottom-16 sm:bottom-20 z-50 rounded-none sm:rounded-2xl border-0 sm:border border-white/15"
          : "border border-white/15 shadow-[0_25px_60px_rgba(0,0,0,0.85)]"
      } ${
        isFocused
          ? "ring-1 ring-white/20 shadow-[0_0_30px_rgba(0,0,0,0.9)]"
          : "opacity-95"
      } bg-[#0b0f19]/95 backdrop-blur-2xl`}
    >
      {/* Top Accent Gradient Line */}
      <div
        className="w-full h-[2px] shrink-0"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${accentColor} 50%, transparent 100%)`,
        }}
      />

      {/* Window Titlebar */}
      <div
        onPointerDown={(e) => {
          onFocus();
          if (!isMaximized) {
            dragControls.start(e);
          }
        }}
        onDoubleClick={onToggleMaximize}
        className={`flex items-center justify-between px-3.5 py-2.5 border-b border-white/10 shrink-0 transition-colors ${
          isFocused ? "bg-white/[0.06]" : "bg-white/[0.02]"
        } ${
          isMaximized ? "cursor-default" : "cursor-grab active:cursor-grabbing"
        }`}
      >
        {/* macOS Traffic Light Buttons */}
        <div className="flex items-center gap-2">
          {/* Close - Red */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              sound.playClick(600);
              onClose();
            }}
            title="Close"
            className="w-3.5 h-3.5 rounded-full bg-[#ff5f56] hover:bg-[#ff5f56]/80 flex items-center justify-center group transition-transform active:scale-90 cursor-pointer shadow-sm"
          >
            <X
              size={8}
              className="opacity-0 group-hover:opacity-100 text-black stroke-[3]"
            />
          </button>

          {/* Minimize - Yellow */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              sound.playBlip(700);
              onMinimize();
            }}
            title="Minimize"
            className="w-3.5 h-3.5 rounded-full bg-[#ffbd2e] hover:bg-[#ffbd2e]/80 flex items-center justify-center group transition-transform active:scale-90 cursor-pointer shadow-sm"
          >
            <Minus
              size={8}
              className="opacity-0 group-hover:opacity-100 text-black stroke-[3]"
            />
          </button>

          {/* Maximize / Restore - Green */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              sound.playClick(1000);
              onToggleMaximize();
            }}
            title={isMaximized ? "Restore" : "Maximize"}
            className="w-3.5 h-3.5 rounded-full bg-[#27c93f] hover:bg-[#27c93f]/80 flex items-center justify-center group transition-transform active:scale-90 cursor-pointer shadow-sm"
          >
            {isMaximized ? (
              <Minimize2
                size={8}
                className="opacity-0 group-hover:opacity-100 text-black stroke-[3]"
              />
            ) : (
              <Maximize2
                size={8}
                className="opacity-0 group-hover:opacity-100 text-black stroke-[3]"
              />
            )}
          </button>
        </div>

        {/* Center: Title & Icon */}
        <div className="flex items-center gap-2 max-w-[65%] truncate">
          {icon && (
            <span style={{ color: accentColor }} className="text-xs">
              {icon}
            </span>
          )}
          <span className="text-xs sm:text-sm font-mono font-bold text-gray-200 tracking-wider truncate">
            {title}
          </span>
          {badge && (
            <span
              className="hidden sm:inline text-[9px] px-1.5 py-0.5 rounded font-mono font-bold border"
              style={{
                backgroundColor: `${accentColor}20`,
                borderColor: `${accentColor}40`,
                color: accentColor,
              }}
            >
              {badge}
            </span>
          )}
        </div>

        {/* Right side stats / scroll percent / resize dimension */}
        <div className="flex items-center gap-2">
          {isResizing ? (
            <span className="text-[10px] font-mono text-[#00f5d4] font-bold animate-pulse">
              {size.width} × {size.height}px
            </span>
          ) : hasOverflow ? (
            <span className="hidden md:inline text-[10px] font-mono text-gray-500">
              {Math.round(scrollProgress)}%
            </span>
          ) : null}
          <div className="w-10 sm:w-14" />
        </div>
      </div>

      {/* Holographic Scroll Progress Bar */}
      {hasOverflow && (
        <div className="w-full h-[1px] bg-white/5 shrink-0">
          <div
            className="h-full transition-all duration-75"
            style={{
              width: `${scrollProgress}%`,
              backgroundColor: accentColor,
              boxShadow: `0 0 8px ${accentColor}`,
            }}
          />
        </div>
      )}

      {/* Scrollable Window Content */}
      <div
        ref={contentRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-3 sm:p-5 text-gray-300 font-mono text-sm leading-relaxed relative flex flex-col min-h-0 select-text scroll-smooth"
      >
        {children}
      </div>

      {/* --- Interactive Resizing Handles (Active when not maximized) --- */}
      {!isMaximized && (
        <>
          {/* Right Edge Handle */}
          <div
            onPointerDown={handleResizeStart("e")}
            className="absolute top-9 bottom-4 right-0 w-2 cursor-e-resize hover:bg-[#00f5d4]/20 transition-colors z-30"
            title="Drag to resize width"
          />

          {/* Bottom Edge Handle */}
          <div
            onPointerDown={handleResizeStart("s")}
            className="absolute bottom-0 left-4 right-5 h-2 cursor-s-resize hover:bg-[#00f5d4]/20 transition-colors z-30"
            title="Drag to resize height"
          />

          {/* Bottom-Right Corner Handle with Futuristic Diagonal Grip */}
          <div
            onPointerDown={handleResizeStart("se")}
            className="absolute bottom-0 right-0 w-6 h-6 cursor-se-resize flex items-end justify-end p-1.5 z-40 group"
            title="Drag corner to resize window"
          >
            <svg
              width="10"
              height="10"
              viewBox="0 0 10 10"
              className="text-white/30 group-hover:text-[#00f5d4] group-active:text-[#00f5d4] transition-colors"
              fill="currentColor"
            >
              <circle cx="8" cy="8" r="1.2" />
              <circle cx="8" cy="4" r="1.2" />
              <circle cx="4" cy="8" r="1.2" />
            </svg>
          </div>
        </>
      )}

      {/* Floating Dimension Tag during active resizing */}
      {isResizing && (
        <div className="absolute bottom-3 right-8 pointer-events-none px-2 py-0.5 rounded bg-black/90 border border-[#00f5d4]/40 text-[#00f5d4] font-mono text-[10px] shadow-lg z-50">
          {size.width} × {size.height}px
        </div>
      )}
    </motion.div>
  );
}
