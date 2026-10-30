"use client";

import React, { useState, useEffect } from "react";
import { Zap } from "lucide-react";
import { getCachedGasPrice } from "../lib/firebase";

interface GasData {
    SafeGasPrice: string;
    ProposeGasPrice: string;
    FastGasPrice: string;
}

export default function EthGasTracker() {
    const CACHE_KEY = "eth_gas_cache";
    const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

    const [gasData, setGasData] = useState<GasData | null>(null);
    const [loading, setLoading] = useState(true);
    const [isExample, setIsExample] = useState(false); // Track if we are using fallback data

    const generateMockData = (): GasData => {
        const base = 15 + Math.floor(Math.random() * 15);
        return {
            SafeGasPrice: base.toString(),
            ProposeGasPrice: (base + 2).toString(),
            FastGasPrice: (base + 5).toString()
        };
    };

    useEffect(() => {
        const fetchGas = async () => {
            const now = Date.now();
            const cached = localStorage.getItem(CACHE_KEY);

            // 1. Try Local Cache
            if (cached) {
                const { data, timestamp } = JSON.parse(cached);
                if (now - timestamp < CACHE_TTL) {
                    setGasData(data);
                    setLoading(false);
                    return;
                }
            }

            try {
                // Fetch from our internal proxy (no API key needed on client)
                const response = await fetch("/api/gas");

                if (!response.ok) {
                    throw new Error(`HTTP Error: ${response.status}`);
                }

                const data = await response.json();

                if (data.status === "1" && data.result) {
                    setGasData(data.result);
                    setIsExample(false); // We got real data

                    // Save to local cache
                    localStorage.setItem(CACHE_KEY, JSON.stringify({
                        data: data.result,
                        timestamp: now
                    }));

                } else {
                    throw new Error(data.message || "Invalid API response");
                }
            } catch (err) {
                // Failsafe 2 & 3: API/Network Error -> Try Firebase -> Then Mock
                console.error("ETH Gas Error (Active Failsafe):", err);
                const cachedFirebase = await getCachedGasPrice();
                const fallbackData = cachedFirebase ? (cachedFirebase as GasData) : generateMockData();
                setGasData(fallbackData);
                setIsExample(true);
            } finally {
                setLoading(false);
            }
        };

        fetchGas();
        const interval = setInterval(fetchGas, 60000); // Update every 60s

        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <div className="flex justify-between items-center text-[10px] text-gray-400 font-mono w-full">
                <span className="flex items-center gap-1"><Zap size={10} className="text-gray-500" /> ETH Gas:</span>
                <span className="text-gray-500 animate-pulse">Scanning...</span>
            </div>
        );
    }

    // Helper to format gas price
    const formatGas = (price: string) => {
        const num = parseFloat(price);
        return isNaN(num) ? price : num.toFixed(3);
    };

    if (!gasData) return null; // Should never happen with failsafe

    return (
        <div className="w-full pt-2 border-t border-white/10">
            <div className="flex justify-between items-center text-[10px] text-gray-400 font-mono mb-1">
                <span className="flex items-center gap-1 text-[#f59e0b]">
                    <Zap size={12} /> ETH Gas Tracker
                </span>
                <div className="flex items-center gap-2 group relative">
                    {isExample && (
                        <span className="text-[8px] px-1 rounded bg-yellow-500/20 text-yellow-500 border border-yellow-500/30 cursor-help">
                            EST
                        </span>
                    )}
                    <span
                        className="text-[#10b981] font-bold cursor-help border-b border-dotted border-[#10b981]/50"
                        title={gasData.ProposeGasPrice} // Native tooltip for precision
                    >
                        {formatGas(gasData.ProposeGasPrice)} gwei
                    </span>

                    {/* Tooltip */}
                    <div className="absolute bottom-full right-0 mb-2 px-2 py-1 bg-black border border-white/20 text-[10px] text-white whitespace-nowrap rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                        Live Mainnet Gas (Post-Pectra)
                    </div>
                </div>
            </div>

            <div className="flex justify-between gap-1 mt-1">
                <div className="flex flex-col items-center bg-white/5 rounded px-1 py-0.5 flex-1 border border-white/5" title={gasData.SafeGasPrice}>
                    <span className="text-[8px] text-gray-500">LOW</span>
                    <span className="text-[10px] text-gray-300">{formatGas(gasData.SafeGasPrice)}</span>
                </div>
                <div className="flex flex-col items-center bg-[#10b981]/10 rounded px-1 py-0.5 flex-1 border border-[#10b981]/20" title={gasData.ProposeGasPrice}>
                    <span className="text-[8px] text-[#10b981]">AVG</span>
                    <span className="text-[10px] text-[#10b981] font-bold">{formatGas(gasData.ProposeGasPrice)}</span>
                </div>
                <div className="flex flex-col items-center bg-white/5 rounded px-1 py-0.5 flex-1 border border-white/5" title={gasData.FastGasPrice}>
                    <span className="text-[8px] text-gray-500">FAST</span>
                    <span className="text-[10px] text-gray-300">{formatGas(gasData.FastGasPrice)}</span>
                </div>
            </div>
        </div>
    );
}
