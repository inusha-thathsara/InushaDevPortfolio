"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { sound } from "@/app/lib/audio";

export type FluidPaletteId = "violet" | "cyber" | "matrix" | "sunset";

export interface PaletteConfig {
  id: FluidPaletteId;
  name: string;
  colors: string[];
  preview: string[];
}

export const FLUID_PALETTES: Record<FluidPaletteId, PaletteConfig> = {
  violet: {
    id: "violet",
    name: "Luminous Electric Violet",
    colors: [
      "#7c3aed",
      "#00f5d4",
      "#8b5cf6",
      "#06b6d4",
      "#1e3a8a",
      "#a855f7",
      "#0369a1",
      "#4c1d95",
    ],
    preview: ["#7c3aed", "#00f5d4", "#1e3a8a", "#8b5cf6"],
  },
  cyber: {
    id: "cyber",
    name: "Cyberpunk Neon Aqua",
    colors: [
      "#00f5d4",
      "#06b6d4",
      "#ec4899",
      "#3b82f6",
      "#10b981",
      "#f43f5e",
      "#8b5cf6",
    ],
    preview: ["#00f5d4", "#06b6d4", "#ec4899", "#3b82f6"],
  },
  matrix: {
    id: "matrix",
    name: "Neural Emerald Matrix",
    colors: [
      "#10b981",
      "#059669",
      "#00f5d4",
      "#047857",
      "#34d399",
      "#064e3b",
      "#6ee7b7",
    ],
    preview: ["#10b981", "#059669", "#00f5d4", "#047857"],
  },
  sunset: {
    id: "sunset",
    name: "Synthwave Sunset",
    colors: [
      "#ec4899",
      "#f59e0b",
      "#8b5cf6",
      "#ef4444",
      "#f97316",
      "#d946ef",
      "#fbbf24",
    ],
    preview: ["#ec4899", "#f59e0b", "#8b5cf6", "#ef4444"],
  },
};

export interface SystemContextType {
  // Hard glitch state
  isCritical: boolean;
  setCritical: (critical: boolean) => void;

  // Fluid Smoke Simulation
  fluidEnabled: boolean;
  setFluidEnabled: (enabled: boolean) => void;
  activePalette: FluidPaletteId;
  setActivePalette: (palette: FluidPaletteId) => void;
  fluidIntensity: number;
  setFluidIntensity: (intensity: number) => void;
  currentPaletteColors: string[];

  // Sound Synthesizer
  isAudio: boolean;
  toggleAudio: () => boolean;
  setAudio: (val: boolean) => void;

  // CRT Scanlines & Optical Vignette
  scanlines: boolean;
  setScanlines: (enabled: boolean) => void;

  // Neural Link (Wi-Fi)
  wifiActive: boolean;
  setWifiActive: (active: boolean) => void;

  // Factory reset
  resetDefaults: () => void;
}

const SystemContext = createContext<SystemContextType | undefined>(undefined);

export const SystemProvider = ({ children }: { children: React.ReactNode }) => {
  const [isCritical, setCritical] = useState(false);
  const [fluidEnabled, setFluidEnabledState] = useState(true);
  const [activePalette, setActivePaletteState] =
    useState<FluidPaletteId>("violet");
  const [fluidIntensity, setFluidIntensityState] = useState(1.3);
  const [scanlines, setScanlinesState] = useState(true);
  const [isAudio, setIsAudioState] = useState(true);
  const [wifiActive, setWifiActiveState] = useState(true);

  // Hydrate settings from localStorage on client mount
  useEffect(() => {
    try {
      const savedFluid = localStorage.getItem("cyberpunk_os_fluid");
      if (savedFluid !== null) {
        setFluidEnabledState(savedFluid === "true");
      }

      const savedPalette = localStorage.getItem("cyberpunk_os_palette");
      if (savedPalette === "violet" || (savedPalette && FLUID_PALETTES[savedPalette as FluidPaletteId])) {
        setActivePaletteState(savedPalette as FluidPaletteId);
      } else {
        setActivePaletteState("violet");
      }

      const savedIntensity = localStorage.getItem(
        "cyberpunk_os_fluid_intensity"
      );
      if (savedIntensity !== null) {
        const parsed = parseFloat(savedIntensity);
        if (!Number.isNaN(parsed) && parsed > 0) {
          setFluidIntensityState(parsed);
        }
      }

      const savedScanlines = localStorage.getItem("cyberpunk_os_scanlines");
      if (savedScanlines !== null) {
        setScanlinesState(savedScanlines === "true");
      }

      const savedWifi = localStorage.getItem("cyberpunk_os_wifi");
      if (savedWifi !== null) {
        setWifiActiveState(savedWifi === "true");
      }

      setIsAudioState(sound.isEnabled());
    } catch {
      // Fallback gracefully if localStorage is unavailable
    }
  }, []);

  // Glitch effect on document.body
  useEffect(() => {
    if (isCritical) {
      document.body.classList.add("animate-hard-glitch");
    } else {
      document.body.classList.remove("animate-hard-glitch");
    }
  }, [isCritical]);

  const setFluidEnabled = useCallback((val: boolean) => {
    setFluidEnabledState(val);
    try {
      localStorage.setItem("cyberpunk_os_fluid", String(val));
    } catch {}
  }, []);

  const setActivePalette = useCallback((val: FluidPaletteId) => {
    setActivePaletteState(val);
    try {
      localStorage.setItem("cyberpunk_os_palette", val);
    } catch {}
  }, []);

  const setFluidIntensity = useCallback((val: number) => {
    setFluidIntensityState(val);
    try {
      localStorage.setItem("cyberpunk_os_fluid_intensity", String(val));
    } catch {}
  }, []);

  const setScanlines = useCallback((val: boolean) => {
    setScanlinesState(val);
    try {
      localStorage.setItem("cyberpunk_os_scanlines", String(val));
    } catch {}
  }, []);

  const setWifiActive = useCallback((val: boolean) => {
    setWifiActiveState(val);
    try {
      localStorage.setItem("cyberpunk_os_wifi", String(val));
    } catch {}
  }, []);

  const toggleAudio = useCallback(() => {
    const next = sound.toggle();
    setIsAudioState(next);
    return next;
  }, []);

  const setAudio = useCallback((val: boolean) => {
    sound.setEnabled(val);
    setIsAudioState(val);
  }, []);

  const resetDefaults = useCallback(() => {
    setFluidEnabled(true);
    setActivePalette("violet");
    setFluidIntensity(1.3);
    setScanlines(true);
    setAudio(true);
    setWifiActive(true);
    sound.playReboot();
  }, [
    setFluidEnabled,
    setActivePalette,
    setFluidIntensity,
    setScanlines,
    setAudio,
    setWifiActive,
  ]);

  const currentPaletteColors = useMemo(() => {
    return (
      FLUID_PALETTES[activePalette]?.colors ?? FLUID_PALETTES.violet.colors
    );
  }, [activePalette]);

  return (
    <SystemContext.Provider
      value={{
        isCritical,
        setCritical,
        fluidEnabled,
        setFluidEnabled,
        activePalette,
        setActivePalette,
        fluidIntensity,
        setFluidIntensity,
        currentPaletteColors,
        isAudio,
        toggleAudio,
        setAudio,
        scanlines,
        setScanlines,
        wifiActive,
        setWifiActive,
        resetDefaults,
      }}
    >
      {children}
    </SystemContext.Provider>
  );
};

export const useSystem = () => {
  const context = useContext(SystemContext);
  if (context === undefined) {
    throw new Error("useSystem must be used within a SystemProvider");
  }
  return context;
};
