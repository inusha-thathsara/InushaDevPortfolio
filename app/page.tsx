"use client";

import React, { useState, useEffect, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import OSMenuBar from "./components/os/OSMenuBar";
import CyberDock, { OSModule } from "./components/os/CyberDock";
import DraggableWindow from "./components/os/DraggableWindow";
import DesktopIcon from "./components/os/DesktopIcon";
import DesktopContextMenu from "./components/os/DesktopContextMenu";
import ControlCenter from "./components/os/ControlCenter";
import LaunchpadModal from "./components/os/LaunchpadModal";
import TerminalModule from "./components/os/TerminalModule";
import ProjectsVault from "./components/os/ProjectsVault";
import SkillsRadar from "./components/os/SkillsRadar";
import TelemetryDeck from "./components/os/TelemetryDeck";
import TransceiverModal from "./components/os/TransceiverModal";
import AboutWindow from "./components/os/AboutWindow";
import SettingsWindow from "./components/os/SettingsWindow";
import CyberBrowser from "./components/os/CyberBrowser";
import CommandPalette from "./components/os/CommandPalette";
import CyberBackground from "./components/os/CyberBackground";
import CrashOverlay, { CrashStage } from "./components/effects/CrashOverlay";
import { sound } from "./lib/audio";
import { PROJECTS } from "./data/projects";
import {
  Terminal,
  FolderKanban,
  Cpu,
  Activity,
  Radio,
  Info,
  Settings,
  Globe,
} from "lucide-react";

interface WindowState {
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
}

export default function CyberpunkOS() {
  const [mounted, setMounted] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isLaunchpadOpen, setIsLaunchpadOpen] = useState(false);
  const [isControlCenterOpen, setIsControlCenterOpen] = useState(false);
  const [crashStage, setCrashStage] = useState<CrashStage | null>(null);

  const desktopRef = useRef<HTMLDivElement | null>(null);

  // Right-click context menu state
  const [contextMenu, setContextMenu] = useState<{
    isOpen: boolean;
    x: number;
    y: number;
  }>({
    isOpen: false,
    x: 0,
    y: 0,
  });

  // Selected desktop icon (only one active at a time, cleared on click away)
  const [selectedDesktopIcon, setSelectedDesktopIcon] = useState<string | null>(null);

  // Window Manager States
  const [windowStates, setWindowStates] = useState<Record<OSModule, WindowState>>({
    terminal: { isOpen: true, isMinimized: false, isMaximized: false, zIndex: 10 },
    browser: { isOpen: false, isMinimized: false, isMaximized: false, zIndex: 1 },
    projects: { isOpen: false, isMinimized: false, isMaximized: false, zIndex: 1 },
    skills: { isOpen: false, isMinimized: false, isMaximized: false, zIndex: 1 },
    telemetry: { isOpen: false, isMinimized: false, isMaximized: false, zIndex: 1 },
    comms: { isOpen: false, isMinimized: false, isMaximized: false, zIndex: 1 },
    about: { isOpen: false, isMinimized: false, isMaximized: false, zIndex: 1 },
    settings: { isOpen: false, isMinimized: false, isMaximized: false, zIndex: 1 },
  });

  const [activeWindowId, setActiveWindowId] = useState<OSModule | null>("terminal");
  const [highestZIndex, setHighestZIndex] = useState(10);

  useEffect(() => {
    setMounted(true);
    // Initial boot chime
    const timer = setTimeout(() => {
      sound.playReboot();
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const crashTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearCrashTimers = () => {
    crashTimersRef.current.forEach(clearTimeout);
    crashTimersRef.current = [];
  };

  const triggerHaltSequence = () => {
    clearCrashTimers();
    sound.setEnabled(true);
    setCrashStage("meltdown");

    // Phase 1 (terminals spawn & run fake malicious commands) -> Phase 2 (screen goes dark) after 9s
    crashTimersRef.current.push(
      setTimeout(() => {
        sound.stopCrashAdrenalineTrack(100);
        sound.playCRTShutdown();
        setCrashStage("collapse");
      }, 9000)
    );

    // Phase 2 -> Phase 3 (reboot console) after 9.7s
    crashTimersRef.current.push(
      setTimeout(() => {
        setCrashStage("reboot");
      }, 9700)
    );
  };

  const handleRecover = () => {
    clearCrashTimers();
    sound.stopCrashAdrenalineTrack(80);
    sound.playReboot();
    setCrashStage(null);
  };

  // Window Actions
  const bringToFront = (id: OSModule) => {
    setHighestZIndex((prev) => {
      const nextZ = prev + 1;
      setWindowStates((current) => ({
        ...current,
        [id]: {
          ...current[id],
          isOpen: true,
          isMinimized: false,
          zIndex: nextZ,
        },
      }));
      return nextZ;
    });
    setActiveWindowId(id);
  };

  const openWindow = (id: OSModule) => {
    setSelectedDesktopIcon(null);
    sound.playOpen();
    bringToFront(id);
  };

  const minimizeWindow = (id: OSModule) => {
    setWindowStates((current) => ({
      ...current,
      [id]: { ...current[id], isMinimized: true },
    }));

    // Focus next highest open and non-minimized window
    const remaining = (Object.keys(windowStates) as OSModule[]).filter(
      (key) => key !== id && windowStates[key].isOpen && !windowStates[key].isMinimized
    );
    if (remaining.length > 0) {
      const top = remaining.sort(
        (a, b) => windowStates[b].zIndex - windowStates[a].zIndex
      )[0];
      setActiveWindowId(top);
    } else {
      setActiveWindowId(null);
    }
  };

  const closeWindow = (id: OSModule) => {
    setWindowStates((current) => ({
      ...current,
      [id]: { ...current[id], isOpen: false, isMinimized: false },
    }));

    const remaining = (Object.keys(windowStates) as OSModule[]).filter(
      (key) => key !== id && windowStates[key].isOpen && !windowStates[key].isMinimized
    );
    if (remaining.length > 0) {
      const top = remaining.sort(
        (a, b) => windowStates[b].zIndex - windowStates[a].zIndex
      )[0];
      setActiveWindowId(top);
    } else {
      setActiveWindowId(null);
    }
  };

  const toggleMaximizeWindow = (id: OSModule) => {
    setWindowStates((current) => ({
      ...current,
      [id]: { ...current[id], isMaximized: !current[id].isMaximized },
    }));
  };

  const handleDockSelect = (id: OSModule) => {
    const win = windowStates[id];
    if (!win.isOpen) {
      openWindow(id);
    } else if (win.isMinimized) {
      bringToFront(id);
    } else if (activeWindowId === id) {
      minimizeWindow(id);
    } else {
      bringToFront(id);
    }
  };

  const appMeta: Record<
    OSModule,
    {
      title: string;
      subtitle: string;
      badge?: string;
      accentColor: string;
      icon: React.ReactNode;
      initialPos: { x: number; y: number };
      initialSize: { width: number | string; height: number | string };
    }
  > = {
    terminal: {
      title: "Neural Terminal 2.0 // Digital Twin",
      subtitle: "Natural language reasoning, classic shell protocols & AI twin",
      badge: "AI CORE v2.5",
      accentColor: "#00f5d4",
      icon: <Terminal size={14} />,
      initialPos: { x: 30, y: 30 },
      initialSize: { width: 880, height: 560 },
    },
    browser: {
      title: "CyberNet Web Surfer",
      subtitle: "Tabbed browser, live proxy shield & hypermedia gateway",
      badge: "WEB 3.0",
      accentColor: "#38bdf8",
      icon: <Globe size={14} />,
      initialPos: { x: 65, y: 35 },
      initialSize: { width: 940, height: 620 },
    },
    projects: {
      title: "Holographic Artifact Vault",
      subtitle: "Verified 2026 production applications & hackathon finalists",
      badge: `${PROJECTS.length} ARTIFACTS`,
      accentColor: "#8b5cf6",
      icon: <FolderKanban size={14} />,
      initialPos: { x: 70, y: 50 },
      initialSize: { width: 920, height: 600 },
    },
    skills: {
      title: "Neural Radar & System Specs",
      subtitle: "Runtime capabilities, agentic frameworks & cloud infrastructure",
      badge: "SPECIALIZED",
      accentColor: "#06b6d4",
      icon: <Cpu size={14} />,
      initialPos: { x: 100, y: 70 },
      initialSize: { width: 860, height: 580 },
    },
    telemetry: {
      title: "Live Infrastructure & Gas Telemetry",
      subtitle: "Real-time Ethereum gwei tracker & Cloud Run telemetry",
      badge: "LIVE DATA",
      accentColor: "#f59e0b",
      icon: <Activity size={14} />,
      initialPos: { x: 130, y: 80 },
      initialSize: { width: 860, height: 580 },
    },
    comms: {
      title: "Encrypted Transceiver",
      subtitle: "Direct channels to dispatch transmissions to Inusha",
      badge: "SECURE COMMS",
      accentColor: "#ec4899",
      icon: <Radio size={14} />,
      initialPos: { x: 90, y: 60 },
      initialSize: { width: 680, height: 540 },
    },
    about: {
      title: "About Inusha Gunasekara",
      subtitle: "AI Systems Engineer · University of Moratuwa",
      badge: "DIGITAL TWIN",
      accentColor: "#3b82f6",
      icon: <Info size={14} />,
      initialPos: { x: 140, y: 90 },
      initialSize: { width: 680, height: 520 },
    },
    settings: {
      title: "System Preferences",
      subtitle: "Fluid Smoke, Audio Synthesis & Visual Displays",
      badge: "CONFIG",
      accentColor: "#a855f7",
      icon: <Settings size={14} />,
      initialPos: { x: 160, y: 100 },
      initialSize: { width: 680, height: 520 },
    },
  };

  if (!mounted) {
    return <div className="min-h-screen bg-[#06080f]" />;
  }

  const isCritical = crashStage === "meltdown";
  const openModulesSet = new Set(
    (Object.keys(windowStates) as OSModule[]).filter(
      (k) => windowStates[k].isOpen
    )
  );

  const activeMeta = activeWindowId ? appMeta[activeWindowId] : null;

  return (
    <main
      onContextMenu={(e) => {
        // Only trigger context menu on desktop empty clicks
        if ((e.target as HTMLElement).closest(".cyber-panel, button, input, a, pre")) {
          return;
        }
        e.preventDefault();
        sound.playClick(1100);
        setContextMenu({
          isOpen: true,
          x: e.clientX,
          y: e.clientY,
        });
      }}
      onClick={() => {
        if (contextMenu.isOpen) {
          setContextMenu({ isOpen: false, x: 0, y: 0 });
        }
        setSelectedDesktopIcon(null);
      }}
      className={`min-h-screen h-screen w-screen bg-[#06080f] text-gray-200 relative overflow-hidden flex flex-col select-none selection:bg-[#00f5d4] selection:text-black ${
        ""
      }`}
    >
      {/* Living Atmospheric Cyber Background with WebGL Fluid Smoke */}
      <CyberBackground />

      {/* Top OS Menu Bar */}
      <OSMenuBar
        activeAppTitle={activeMeta ? activeMeta.title : "Cyberpunk OS 2.0"}
        isCritical={crashStage !== null}
        onEmergencyHalt={triggerHaltSequence}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onOpenLaunchpad={() => setIsLaunchpadOpen(true)}
        onToggleControlCenter={() => setIsControlCenterOpen(!isControlCenterOpen)}
        onOpenApp={(id) => openWindow(id as OSModule)}
      />

      {/* Control Center Popover */}
      <ControlCenter
        isOpen={isControlCenterOpen}
        onClose={() => setIsControlCenterOpen(false)}
        onEmergencyHalt={triggerHaltSequence}
        isCritical={crashStage !== null}
      />

      {/* Launchpad Fullscreen App Grid */}
      <LaunchpadModal
        isOpen={isLaunchpadOpen}
        onClose={() => setIsLaunchpadOpen(false)}
        onOpenApp={(id) => openWindow(id as OSModule)}
      />

      {/* Global Command Palette */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectModule={(mod) => {
          openWindow(mod);
          setIsCommandPaletteOpen(false);
        }}
        onTriggerCrash={triggerHaltSequence}
      />

      {/* Cinematic Meltdown, CRT Collapse & Quantum Reboot Overlay */}
      {crashStage && (
        <CrashOverlay stage={crashStage} onRecover={handleRecover} />
      )}

      {/* Desktop Workspace (contains Desktop Icons + Draggable Windows) */}
      <div
        ref={desktopRef}
        className="flex-1 w-full h-full relative pt-9 pb-16 sm:pb-20 overflow-hidden z-10"
      >
        {/* Desktop Icons Column (Left side) */}
        <div className="absolute top-12 left-4 sm:left-6 flex flex-col gap-2 z-10 pointer-events-auto">
          {(Object.keys(appMeta) as OSModule[]).map((id) => {
            const meta = appMeta[id];
            const state = windowStates[id];
            return (
              <DesktopIcon
                key={id}
                id={id}
                title={id === "terminal" ? "Terminal" : id === "browser" ? "Browser" : id === "projects" ? "Artifacts" : id === "skills" ? "Radar" : id === "telemetry" ? "Telemetry" : id === "comms" ? "Transceiver" : id === "about" ? "About Me" : "Settings"}
                icon={meta.icon}
                accentColor={meta.accentColor}
                isOpen={state.isOpen}
                isSelected={selectedDesktopIcon === id}
                onSelect={() => setSelectedDesktopIcon(id)}
                onDeselect={() => {
                  if (selectedDesktopIcon === id) setSelectedDesktopIcon(null);
                }}
                onOpen={() => {
                  setSelectedDesktopIcon(null);
                  openWindow(id);
                }}
                badge={id === "projects" ? String(PROJECTS.length) : undefined}
              />
            );
          })}
        </div>

        {/* Windows Stack */}
        <AnimatePresence>
          {/* 1. Terminal Window */}
          {windowStates.terminal.isOpen && (
            <DraggableWindow
              key="terminal"
              id="terminal"
              title={appMeta.terminal.title}
              subtitle={appMeta.terminal.subtitle}
              badge={appMeta.terminal.badge}
              icon={appMeta.terminal.icon}
              accentColor={appMeta.terminal.accentColor}
              isOpen={windowStates.terminal.isOpen}
              isMinimized={windowStates.terminal.isMinimized}
              isMaximized={windowStates.terminal.isMaximized}
              isFocused={activeWindowId === "terminal"}
              zIndex={windowStates.terminal.zIndex}
              initialPosition={appMeta.terminal.initialPos}
              initialSize={appMeta.terminal.initialSize}
              onFocus={() => bringToFront("terminal")}
              onClose={() => closeWindow("terminal")}
              onMinimize={() => minimizeWindow("terminal")}
              onToggleMaximize={() => toggleMaximizeWindow("terminal")}
              constraintsRef={desktopRef}
            >
              <TerminalModule
                onTriggerCrash={triggerHaltSequence}
                onNavigateToProjects={() => openWindow("projects")}
                onNavigateToSkills={() => openWindow("skills")}
                onNavigateToComms={() => openWindow("comms")}
              />
            </DraggableWindow>
          )}

          {/* 2. Projects Vault Window */}
          {windowStates.projects.isOpen && (
            <DraggableWindow
              key="projects"
              id="projects"
              title={appMeta.projects.title}
              subtitle={appMeta.projects.subtitle}
              badge={appMeta.projects.badge}
              icon={appMeta.projects.icon}
              accentColor={appMeta.projects.accentColor}
              isOpen={windowStates.projects.isOpen}
              isMinimized={windowStates.projects.isMinimized}
              isMaximized={windowStates.projects.isMaximized}
              isFocused={activeWindowId === "projects"}
              zIndex={windowStates.projects.zIndex}
              initialPosition={appMeta.projects.initialPos}
              initialSize={appMeta.projects.initialSize}
              onFocus={() => bringToFront("projects")}
              onClose={() => closeWindow("projects")}
              onMinimize={() => minimizeWindow("projects")}
              onToggleMaximize={() => toggleMaximizeWindow("projects")}
              constraintsRef={desktopRef}
            >
              <ProjectsVault />
            </DraggableWindow>
          )}

          {/* 3. Skills Radar Window */}
          {windowStates.skills.isOpen && (
            <DraggableWindow
              key="skills"
              id="skills"
              title={appMeta.skills.title}
              subtitle={appMeta.skills.subtitle}
              badge={appMeta.skills.badge}
              icon={appMeta.skills.icon}
              accentColor={appMeta.skills.accentColor}
              isOpen={windowStates.skills.isOpen}
              isMinimized={windowStates.skills.isMinimized}
              isMaximized={windowStates.skills.isMaximized}
              isFocused={activeWindowId === "skills"}
              zIndex={windowStates.skills.zIndex}
              initialPosition={appMeta.skills.initialPos}
              initialSize={appMeta.skills.initialSize}
              onFocus={() => bringToFront("skills")}
              onClose={() => closeWindow("skills")}
              onMinimize={() => minimizeWindow("skills")}
              onToggleMaximize={() => toggleMaximizeWindow("skills")}
              constraintsRef={desktopRef}
            >
              <SkillsRadar />
            </DraggableWindow>
          )}

          {/* 4. Telemetry Deck Window */}
          {windowStates.telemetry.isOpen && (
            <DraggableWindow
              key="telemetry"
              id="telemetry"
              title={appMeta.telemetry.title}
              subtitle={appMeta.telemetry.subtitle}
              badge={appMeta.telemetry.badge}
              icon={appMeta.telemetry.icon}
              accentColor={appMeta.telemetry.accentColor}
              isOpen={windowStates.telemetry.isOpen}
              isMinimized={windowStates.telemetry.isMinimized}
              isMaximized={windowStates.telemetry.isMaximized}
              isFocused={activeWindowId === "telemetry"}
              zIndex={windowStates.telemetry.zIndex}
              initialPosition={appMeta.telemetry.initialPos}
              initialSize={appMeta.telemetry.initialSize}
              onFocus={() => bringToFront("telemetry")}
              onClose={() => closeWindow("telemetry")}
              onMinimize={() => minimizeWindow("telemetry")}
              onToggleMaximize={() => toggleMaximizeWindow("telemetry")}
              constraintsRef={desktopRef}
            >
              <TelemetryDeck />
            </DraggableWindow>
          )}

          {/* 5. Transceiver Window */}
          {windowStates.comms.isOpen && (
            <DraggableWindow
              key="comms"
              id="comms"
              title={appMeta.comms.title}
              subtitle={appMeta.comms.subtitle}
              badge={appMeta.comms.badge}
              icon={appMeta.comms.icon}
              accentColor={appMeta.comms.accentColor}
              isOpen={windowStates.comms.isOpen}
              isMinimized={windowStates.comms.isMinimized}
              isMaximized={windowStates.comms.isMaximized}
              isFocused={activeWindowId === "comms"}
              zIndex={windowStates.comms.zIndex}
              initialPosition={appMeta.comms.initialPos}
              initialSize={appMeta.comms.initialSize}
              onFocus={() => bringToFront("comms")}
              onClose={() => closeWindow("comms")}
              onMinimize={() => minimizeWindow("comms")}
              onToggleMaximize={() => toggleMaximizeWindow("comms")}
              constraintsRef={desktopRef}
            >
              <TransceiverModal />
            </DraggableWindow>
          )}

          {/* 6. About Twin Window */}
          {windowStates.about.isOpen && (
            <DraggableWindow
              key="about"
              id="about"
              title={appMeta.about.title}
              subtitle={appMeta.about.subtitle}
              badge={appMeta.about.badge}
              icon={appMeta.about.icon}
              accentColor={appMeta.about.accentColor}
              isOpen={windowStates.about.isOpen}
              isMinimized={windowStates.about.isMinimized}
              isMaximized={windowStates.about.isMaximized}
              isFocused={activeWindowId === "about"}
              zIndex={windowStates.about.zIndex}
              initialPosition={appMeta.about.initialPos}
              initialSize={appMeta.about.initialSize}
              onFocus={() => bringToFront("about")}
              onClose={() => closeWindow("about")}
              onMinimize={() => minimizeWindow("about")}
              onToggleMaximize={() => toggleMaximizeWindow("about")}
              constraintsRef={desktopRef}
            >
              <AboutWindow />
            </DraggableWindow>
          )}

          {/* 7. Settings Window */}
          {windowStates.settings.isOpen && (
            <DraggableWindow
              key="settings"
              id="settings"
              title={appMeta.settings.title}
              subtitle={appMeta.settings.subtitle}
              badge={appMeta.settings.badge}
              icon={appMeta.settings.icon}
              accentColor={appMeta.settings.accentColor}
              isOpen={windowStates.settings.isOpen}
              isMinimized={windowStates.settings.isMinimized}
              isMaximized={windowStates.settings.isMaximized}
              isFocused={activeWindowId === "settings"}
              zIndex={windowStates.settings.zIndex}
              initialPosition={appMeta.settings.initialPos}
              initialSize={appMeta.settings.initialSize}
              onFocus={() => bringToFront("settings")}
              onClose={() => closeWindow("settings")}
              onMinimize={() => minimizeWindow("settings")}
              onToggleMaximize={() => toggleMaximizeWindow("settings")}
              constraintsRef={desktopRef}
            >
              <SettingsWindow />
            </DraggableWindow>
          )}

          {/* 8. CyberNet Browser Window */}
          {windowStates.browser.isOpen && (
            <DraggableWindow
              key="browser"
              id="browser"
              title={appMeta.browser.title}
              subtitle={appMeta.browser.subtitle}
              badge={appMeta.browser.badge}
              icon={appMeta.browser.icon}
              accentColor={appMeta.browser.accentColor}
              isOpen={windowStates.browser.isOpen}
              isMinimized={windowStates.browser.isMinimized}
              isMaximized={windowStates.browser.isMaximized}
              isFocused={activeWindowId === "browser"}
              zIndex={windowStates.browser.zIndex}
              initialPosition={appMeta.browser.initialPos}
              initialSize={appMeta.browser.initialSize}
              onFocus={() => bringToFront("browser")}
              onClose={() => closeWindow("browser")}
              onMinimize={() => minimizeWindow("browser")}
              onToggleMaximize={() => toggleMaximizeWindow("browser")}
              constraintsRef={desktopRef}
            >
              <CyberBrowser />
            </DraggableWindow>
          )}
        </AnimatePresence>

        {/* Desktop Right-Click Context Menu */}
        <DesktopContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          isOpen={contextMenu.isOpen}
          onClose={() => setContextMenu({ isOpen: false, x: 0, y: 0 })}
          onOpenApp={(id) => openWindow(id as OSModule)}
          onTriggerCrash={triggerHaltSequence}
          onRefresh={() => {
            sound.playReboot();
          }}
        />
      </div>

      {/* Floating Bottom CyberDock */}
      <CyberDock
        activeModule={activeWindowId}
        openModules={openModulesSet}
        onSelectModule={handleDockSelect}
        onOpenLaunchpad={() => setIsLaunchpadOpen(true)}
        projectCount={PROJECTS.length}
      />
    </main>
  );
}
