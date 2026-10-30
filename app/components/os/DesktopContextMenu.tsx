"use client";

import React, { useEffect, useRef } from "react";
import {
  Terminal,
  FolderKanban,
  Cpu,
  Activity,
  Radio,
  Info,
  Settings,
  Sparkles,
  RefreshCw,
  AlertOctagon,
  Layers,
  Globe,
} from "lucide-react";
import { sound } from "@/app/lib/audio";

interface DesktopContextMenuProps {
  x: number;
  y: number;
  isOpen: boolean;
  onClose: () => void;
  onOpenApp: (appId: string) => void;
  onTriggerCrash: () => void;
  onRefresh: () => void;
}

export default function DesktopContextMenu({
  x,
  y,
  isOpen,
  onClose,
  onOpenApp,
  onTriggerCrash,
  onRefresh,
}: DesktopContextMenuProps) {
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      window.addEventListener("mousedown", handleClickOutside);
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Adjust position so it doesn't overflow screen
  const menuWidth = 220;
  const menuHeight = 310;
  const adjustedX = Math.min(x, window.innerWidth - menuWidth - 16);
  const adjustedY = Math.min(y, window.innerHeight - menuHeight - 16);

  const menuItems = [
    {
      label: "New AI Terminal",
      icon: <Terminal size={14} className="text-[#00f5d4]" />,
      action: () => onOpenApp("terminal"),
      shortcut: "⌥T",
    },
    {
      label: "Open CyberNet Browser",
      icon: <Globe size={14} className="text-[#38bdf8]" />,
      action: () => onOpenApp("browser"),
      shortcut: "⌥B",
    },
    {
      label: "Browse Artifact Vault",
      icon: <FolderKanban size={14} className="text-[#8b5cf6]" />,
      action: () => onOpenApp("projects"),
      shortcut: "⌥P",
    },
    {
      label: "Neural Skills Radar",
      icon: <Cpu size={14} className="text-[#06b6d4]" />,
      action: () => onOpenApp("skills"),
      shortcut: "⌥S",
    },
    {
      label: "Live Telemetry Deck",
      icon: <Activity size={14} className="text-[#f59e0b]" />,
      action: () => onOpenApp("telemetry"),
    },
    {
      label: "Encrypted Transceiver",
      icon: <Radio size={14} className="text-[#ec4899]" />,
      action: () => onOpenApp("comms"),
    },
    { divider: true },
    {
      label: "About Inusha (Digital Twin)",
      icon: <Info size={14} className="text-gray-300" />,
      action: () => onOpenApp("about"),
    },
    {
      label: "System Preferences",
      icon: <Settings size={14} className="text-gray-300" />,
      action: () => onOpenApp("settings"),
    },
    {
      label: "Refresh Workspace",
      icon: <RefreshCw size={14} className="text-gray-300" />,
      action: () => {
        sound.playBlip(1100);
        onRefresh();
      },
    },
    { divider: true },
    {
      label: "Trigger System Meltdown",
      icon: <AlertOctagon size={14} className="text-red-400" />,
      action: onTriggerCrash,
      danger: true,
    },
  ];

  return (
    <div
      ref={menuRef}
      style={{ left: adjustedX, top: adjustedY }}
      className="fixed z-[120] w-[220px] bg-[#0b0f19]/95 backdrop-blur-2xl border border-white/15 rounded-xl shadow-[0_15px_40px_rgba(0,0,0,0.85)] p-1.5 font-mono text-xs text-gray-200 select-none animate-in fade-in zoom-in-95 duration-100"
    >
      {menuItems.map((item, idx) => {
        if ("divider" in item) {
          return (
            <div
              key={`div-${idx}`}
              className="my-1.5 h-[1px] bg-white/10 mx-1"
            />
          );
        }

        return (
          <button
            key={item.label}
            onClick={() => {
              sound.playClick(900);
              item.action?.();
              onClose();
            }}
            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer text-left ${
              item.danger
                ? "text-red-400 hover:bg-red-500/15"
                : "hover:bg-white/10 hover:text-white"
            }`}
          >
            <div className="flex items-center gap-2">
              {item.icon}
              <span>{item.label}</span>
            </div>
            {item.shortcut && (
              <span className="text-[10px] text-gray-500 font-mono">
                {item.shortcut}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
