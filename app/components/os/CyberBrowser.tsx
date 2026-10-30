"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Globe,
  ArrowLeft,
  ArrowRight,
  RotateCw,
  Home,
  Plus,
  X,
  Lock,
  ExternalLink,
  Shield,
  Search,
  Bookmark,
  Sparkles,
  Github,
  Linkedin,
  FileText,
  Compass,
  Cpu,
  Share2,
  Clock,
  Trash2,
  Check,
  Video,
  Code2,
  BookOpen,
} from "lucide-react";
import { sound } from "@/app/lib/audio";

interface BrowserTab {
  id: string;
  title: string;
  url: string;
  history: string[];
  historyIndex: number;
  isLoading: boolean;
  proxyMode: boolean;
}

interface SearchResultItem {
  title: string;
  url: string;
  displayUrl: string;
  snippet: string;
  category?: string;
  badge?: string;
}

const DEFAULT_HOME_URL = "cyber://start";

interface BookmarkItem {
  id: string;
  title: string;
  url: string;
  icon: string | React.ReactNode;
  category: "operator" | "web" | "knowledge";
  description?: string;
  badge?: string;
}

const SPEED_DIAL_ITEMS: BookmarkItem[] = [
  {
    id: "github",
    title: "Inusha Gunasekara (GitHub)",
    url: "https://github.com/inusha-thathsara",
    icon: <Github size={16} className="text-white" />,
    category: "operator",
    description: "55+ open-source repos, AI agents, and ML architectures",
    badge: "55+ REPOS",
  },
  {
    id: "linkedin",
    title: "LinkedIn Profile",
    url: "https://linkedin.com/in/inusha-gunasekara-9996632a5",
    icon: <Linkedin size={16} className="text-[#38bdf8]" />,
    category: "operator",
    description: "Connect with Inusha on LinkedIn · University of Moratuwa",
    badge: "NETWORK",
  },
  {
    id: "devto",
    title: "DEV Community Blog",
    url: "https://dev.to/inushathathsara",
    icon: <FileText size={16} className="text-[#ec4899]" />,
    category: "operator",
    description: "Technical deep-dives on agentic frameworks and AI pipelines",
    badge: "DEV ARTICLES",
  },
  {
    id: "youtube",
    title: "CyberTube (YouTube)",
    url: "cyber://youtube",
    icon: "▶️",
    category: "web",
    description: "Stream developer talks, cyberpunk ambient, and tech tutorials",
    badge: "MEDIA HUB",
  },
  {
    id: "wikipedia",
    title: "Wikipedia (Mobile)",
    url: "https://en.m.wikipedia.org/wiki/Artificial_intelligence",
    icon: "📖",
    category: "knowledge",
    description: "Comprehensive encyclopedia on AI and Cybernetics",
    badge: "KNOWLEDGE",
  },
  {
    id: "hackernews",
    title: "Hacker News",
    url: "https://news.ycombinator.com",
    icon: "🟧",
    category: "web",
    description: "Real-time technology, startup, and computer science discourse",
    badge: "LIVE FEED",
  },
  {
    id: "duckduckgo",
    title: "DuckDuckGo HTML",
    url: "https://html.duckduckgo.com/html/?q=cyberpunk",
    icon: "🦆",
    category: "web",
    description: "HTML privacy search engine with zero frame-blocking scripts",
    badge: "SEARCH",
  },
  {
    id: "mdn",
    title: "MDN Web Docs",
    url: "https://developer.mozilla.org/en-US/",
    icon: "📚",
    category: "knowledge",
    description: "Authoritative reference for Web APIs, JavaScript, CSS, and HTML",
    badge: "DOCS",
  },
  {
    id: "nextjs",
    title: "Next.js Framework",
    url: "https://nextjs.org",
    icon: "▲",
    category: "web",
    description: "The React framework for the Web with App Router and Turbopack",
    badge: "DEV STACK",
  },
];

// --- Subcomponent: Dedicated CyberSearch Engine Results View ---
function CyberSearchResultsView({
  query,
  onNavigate,
  onRefineQuery,
}: {
  query: string;
  onNavigate: (url: string) => void;
  onRefineQuery: (q: string) => void;
}) {
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<string>("all");
  const [searchInput, setSearchInput] = useState<string>(query);

  useEffect(() => {
    setSearchInput(query);
    let active = true;
    setLoading(true);

    fetch(`/api/search?q=${encodeURIComponent(query)}`)
      .then((res) => res.json())
      .then((data) => {
        if (active) {
          setResults(data.results || []);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Search fetch failed:", err);
        if (active) {
          setResults([]);
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [query]);

  const filteredResults = results.filter((r) => {
    if (filter === "all") return true;
    if (filter === "media")
      return (
        r.category === "Media" ||
        r.url.includes("youtube") ||
        r.url.includes("video") ||
        r.url.includes("vimeo")
      );
    if (filter === "dev")
      return (
        r.category === "Developer" ||
        r.category === "Operator" ||
        r.url.includes("github") ||
        r.url.includes("dev.to") ||
        r.url.includes("stackoverflow")
      );
    if (filter === "wiki")
      return r.category === "Wikipedia" || r.url.includes("wikipedia");
    return true;
  });

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#070b16] font-sans">
      <div className="max-w-4xl mx-auto flex flex-col gap-5">
        {/* Top Search Refinement Strip */}
        <div className="bg-[#0b1022] p-4 rounded-2xl border border-white/10 shadow-lg flex flex-col gap-3">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (searchInput.trim()) {
                onRefineQuery(searchInput.trim());
              }
            }}
            className="flex items-center gap-2"
          >
            <div className="relative flex-1 flex items-center">
              <Search
                size={16}
                className="absolute left-3.5 text-gray-400 pointer-events-none"
              />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search web, documentation, or portals..."
                className="w-full bg-black/40 border border-white/15 focus:border-[#00f5d4] rounded-xl py-2 pl-10 pr-3 text-xs sm:text-sm text-white font-mono placeholder:text-gray-500 outline-none"
              />
            </div>
            <button
              type="submit"
              className="bg-[#00f5d4] hover:bg-[#00f5d4]/90 text-black font-bold font-mono text-xs px-4 py-2 rounded-xl transition-all cursor-pointer shadow-md shrink-0"
            >
              SEARCH
            </button>
          </form>

          {/* Engine & Category Filters */}
          <div className="flex items-center justify-between flex-wrap gap-2 pt-1 border-t border-white/5 text-xs font-mono">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-gray-500 text-[11px] mr-1">Filter:</span>
              <button
                onClick={() => setFilter("all")}
                className={`px-2.5 py-1 rounded-lg border text-[11px] cursor-pointer transition-all ${
                  filter === "all"
                    ? "bg-[#00f5d4]/15 border-[#00f5d4]/50 text-[#00f5d4] font-bold"
                    : "border-white/10 text-gray-400 hover:text-white"
                }`}
              >
                All Results ({results.length})
              </button>
              <button
                onClick={() => setFilter("media")}
                className={`px-2.5 py-1 rounded-lg border text-[11px] cursor-pointer transition-all ${
                  filter === "media"
                    ? "bg-[#38bdf8]/15 border-[#38bdf8]/50 text-[#38bdf8] font-bold"
                    : "border-white/10 text-gray-400 hover:text-white"
                }`}
              >
                Videos & Media
              </button>
              <button
                onClick={() => setFilter("dev")}
                className={`px-2.5 py-1 rounded-lg border text-[11px] cursor-pointer transition-all ${
                  filter === "dev"
                    ? "bg-[#8b5cf6]/15 border-[#8b5cf6]/50 text-[#8b5cf6] font-bold"
                    : "border-white/10 text-gray-400 hover:text-white"
                }`}
              >
                Code & Repos
              </button>
              <button
                onClick={() => setFilter("wiki")}
                className={`px-2.5 py-1 rounded-lg border text-[11px] cursor-pointer transition-all ${
                  filter === "wiki"
                    ? "bg-amber-400/15 border-amber-400/50 text-amber-300 font-bold"
                    : "border-white/10 text-gray-400 hover:text-white"
                }`}
              >
                Wikipedia
              </button>
            </div>

            {/* Quick Outbound Jump */}
            <div className="flex items-center gap-2 text-[11px] text-gray-400">
              <span>View On:</span>
              <a
                href={`https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate(`https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`);
                }}
                className="text-[#38bdf8] hover:underline cursor-pointer"
              >
                DuckDuckGo HTML
              </a>
              <span>•</span>
              <a
                href={`https://www.google.com/search?q=${encodeURIComponent(query)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#00f5d4] hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                <span>Google</span>
                <ExternalLink size={10} />
              </a>
            </div>
          </div>
        </div>

        {/* Results List or Loading Skeleton */}
        {loading ? (
          <div className="flex flex-col gap-3 py-2">
            <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
              <RotateCw size={13} className="animate-spin text-[#00f5d4]" />
              <span>Querying neural web index for &quot;{query}&quot;...</span>
            </div>
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-[#0b1022]/60 p-4 rounded-xl border border-white/5 flex flex-col gap-2.5 animate-pulse"
              >
                <div className="h-4 w-1/3 bg-white/10 rounded" />
                <div className="h-3 w-1/4 bg-white/5 rounded" />
                <div className="h-10 w-full bg-white/5 rounded" />
              </div>
            ))}
          </div>
        ) : filteredResults.length > 0 ? (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between text-xs font-mono text-gray-400 px-1">
              <span>
                Found {filteredResults.length} web destination{filteredResults.length > 1 ? "s" : ""} for &quot;{query}&quot;
              </span>
              <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                <Check size={12} />
                <span>Verified Endpoints</span>
              </span>
            </div>

            {filteredResults.map((item, idx) => (
              <div
                key={idx}
                className="group bg-[#0b1022]/80 hover:bg-[#0e162e] border border-white/10 hover:border-[#00f5d4]/40 p-4 rounded-xl transition-all shadow-md flex flex-col gap-2 relative"
              >
                {/* Domain Pill & Category Badge */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
                    <Globe size={13} className="text-[#00f5d4]" />
                    <span className="text-gray-300 font-medium truncate max-w-[280px]">
                      {item.displayUrl}
                    </span>
                  </div>
                  {item.badge && (
                    <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-[#00f5d4]/10 border border-[#00f5d4]/30 text-[#00f5d4]">
                      {item.badge}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3
                  onClick={() => onNavigate(item.url)}
                  className="text-sm sm:text-base font-bold text-white group-hover:text-[#00f5d4] transition-colors cursor-pointer leading-snug"
                >
                  {item.title}
                </h3>

                {/* Snippet */}
                <p className="text-xs text-gray-400 leading-relaxed font-sans">
                  {item.snippet}
                </p>

                {/* Action Toolbar on Item */}
                <div className="flex items-center gap-2 pt-2 border-t border-white/5 text-xs font-mono">
                  <button
                    onClick={() => onNavigate(item.url)}
                    className="bg-[#00f5d4]/15 hover:bg-[#00f5d4]/30 border border-[#00f5d4]/40 text-[#00f5d4] px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Visit in CyberBrowser</span>
                    <ArrowRight size={12} />
                  </button>
                  <button
                    onClick={() => window.open(item.url, "_blank", "noopener,noreferrer")}
                    className="hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white px-3 py-1 rounded-lg text-xs transition-all cursor-pointer flex items-center gap-1"
                  >
                    <span>Open External</span>
                    <ExternalLink size={11} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-[#0b1022] p-8 rounded-2xl border border-white/10 text-center flex flex-col items-center gap-3">
            <Globe size={32} className="text-gray-500" />
            <h3 className="text-white font-mono text-sm font-bold">
              No Direct Matches for &quot;{query}&quot;
            </h3>
            <p className="text-xs text-gray-400 max-w-md">
              Try searching via DuckDuckGo HTML, Wikipedia, or open directly in Google.
            </p>
            <div className="flex items-center gap-2 mt-2">
              <button
                onClick={() => onNavigate(`https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`)}
                className="bg-[#00f5d4] text-black font-bold text-xs px-4 py-2 rounded-xl cursor-pointer"
              >
                Search on DuckDuckGo
              </button>
              <button
                onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, "_blank")}
                className="bg-white/10 text-white font-bold text-xs px-4 py-2 rounded-xl cursor-pointer flex items-center gap-1"
              >
                <span>Google ↗</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// --- Subcomponent: Dedicated CyberTube Hub & Embedded Video Player ---
function CyberTubePortalView({
  onNavigate,
}: {
  onNavigate: (url: string) => void;
}) {
  const [activeVideoId, setActiveVideoId] = useState("4xDzrJKXOOY");
  const [customInput, setCustomInput] = useState("");

  const videos = [
    {
      id: "4xDzrJKXOOY",
      title: "Cyberpunk Synthwave & Lofi Beats",
      channel: "Lofi Girl / Synthwave",
      tag: "AMBIENT",
      desc: "Coding & hacking soundtrack in high definition",
    },
    {
      id: "T83USwG68n8",
      title: "Next.js Architecture Keynote",
      channel: "Vercel",
      tag: "FULLSTACK",
      desc: "App Router, Turbopack, and Server Actions deep dive",
    },
    {
      id: "kCc8FmEb1nY",
      title: "Building Autonomous AI Coding Agents",
      channel: "AI Engineering",
      tag: "AI AGENTS",
      desc: "Multi-agent coordination, tools, and sandbox execution",
    },
    {
      id: "m0L-8s47sV4",
      title: "Cyber Security & Red Team Fundamentals",
      channel: "NetworkChuck",
      tag: "SECURITY",
      desc: "Packet inspection, web vulnerabilities, and defensive ops",
    },
  ];

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = customInput.trim();
    if (!trimmed) return;
    const match = trimmed.match(/(?:watch\?v=|youtu\.be\/|embed\/|shorts\/)([a-zA-Z0-9_-]{11})/);
    if (match && match[1]) {
      setActiveVideoId(match[1]);
      setCustomInput("");
    } else {
      onNavigate(`https://html.duckduckgo.com/html/?q=${encodeURIComponent(trimmed + " site:youtube.com")}`);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#060913] text-gray-200 flex flex-col gap-5">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)]">
            <Video size={20} />
          </div>
          <div>
            <h2 className="text-white font-mono font-bold text-base flex items-center gap-2">
              <span>CYBERTUBE MEDIA HUB</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30">
                OFFICIAL EMBED
              </span>
            </h2>
            <p className="text-xs text-gray-400 font-mono">
              Embedded YouTube player with zero CORS restrictions & hardware accelerated streaming
            </p>
          </div>
        </div>

        <button
          onClick={() => window.open("https://www.youtube.com", "_blank", "noopener,noreferrer")}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 border border-white/15 text-xs font-mono text-white transition-all cursor-pointer shrink-0"
        >
          <span>Open Full YouTube Tab</span>
          <ExternalLink size={12} />
        </button>
      </div>

      {/* Main Video Player */}
      <div className="w-full aspect-video max-h-[500px] rounded-2xl overflow-hidden bg-black border border-white/15 shadow-[0_15px_40px_rgba(0,0,0,0.8)] relative">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${activeVideoId}?autoplay=0&enablejsapi=1`}
          title="CyberTube Player"
          className="w-full h-full border-none"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>

      {/* Quick Search / Paste URL */}
      <form onSubmit={handleCustomSubmit} className="flex gap-2">
        <input
          type="text"
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          placeholder="Paste any YouTube video link or search term..."
          className="flex-1 bg-[#0b1020] border border-white/15 focus:border-[#00f5d4] rounded-xl px-4 py-2.5 text-xs font-mono text-white placeholder:text-gray-500 outline-none"
        />
        <button
          type="submit"
          className="bg-[#00f5d4] hover:bg-[#00f5d4]/90 text-black font-bold font-mono text-xs px-4 py-2.5 rounded-xl cursor-pointer transition-all"
        >
          LOAD STREAM
        </button>
      </form>

      {/* Curated Channels Grid */}
      <div className="flex flex-col gap-2">
        <div className="text-xs font-mono font-bold text-gray-400">
          FEATURED DEV & CYBERPUNK STREAMS
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {videos.map((vid) => (
            <div
              key={vid.id}
              onClick={() => setActiveVideoId(vid.id)}
              className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                activeVideoId === vid.id
                  ? "bg-red-500/10 border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.2)]"
                  : "bg-[#0b1020]/70 hover:bg-[#0e162e] border-white/10 hover:border-white/20"
              }`}
            >
              <div>
                <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-white/5 text-gray-300">
                  {vid.tag}
                </span>
                <h4 className="text-xs font-bold text-white mt-1.5 line-clamp-1">
                  {vid.title}
                </h4>
                <p className="text-[11px] text-gray-400 line-clamp-2 mt-1">
                  {vid.desc}
                </p>
              </div>
              <div className="text-[10px] font-mono text-gray-500">
                {vid.channel}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function CyberBrowser() {
  const [tabs, setTabs] = useState<BrowserTab[]>([
    {
      id: "tab-1",
      title: "CyberNet Gateway",
      url: DEFAULT_HOME_URL,
      history: [DEFAULT_HOME_URL],
      historyIndex: 0,
      isLoading: false,
      proxyMode: true,
    },
  ]);
  const [activeTabId, setActiveTabId] = useState<string>("tab-1");
  const [omnibarInput, setOmnibarInput] = useState<string>(DEFAULT_HOME_URL);
  const [searchEngine, setSearchEngine] = useState<"cyber" | "ddg" | "wiki" | "google">("cyber");
  const [recentHistory, setRecentHistory] = useState<string[]>([
    "https://github.com/inusha-thathsara",
    "https://en.m.wikipedia.org/wiki/Cyberpunk",
    "https://news.ycombinator.com",
    "cyber://youtube",
  ]);

  const activeTab = tabs.find((t) => t.id === activeTabId) || tabs[0];
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync address bar input when active tab changes
  useEffect(() => {
    if (activeTab) {
      setOmnibarInput(activeTab.url);
    }
  }, [activeTab?.id, activeTab?.url]);

  // Normalize URL helper
  const formatTargetUrl = (input: string): string => {
    const trimmed = input.trim();
    if (!trimmed) return DEFAULT_HOME_URL;
    if (trimmed.startsWith("cyber://")) return trimmed;
    
    // Automatically map YouTube URLs to CyberTube or official zero-error embed
    if (trimmed.includes("youtube.com") || trimmed.includes("youtu.be")) {
      const match = trimmed.match(/(?:watch\?v=|youtu\.be\/|embed\/|shorts\/)([a-zA-Z0-9_-]{11})/);
      if (match && match[1]) {
        return `https://www.youtube-nocookie.com/embed/${match[1]}?autoplay=1`;
      }
      return "cyber://youtube";
    }

    // Normalize duckduckgo to html.duckduckgo.com so it never blank-screens in iframe
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
      if (trimmed.includes("duckduckgo.com") && trimmed.includes("?q=")) {
        return trimmed.replace("duckduckgo.com/?q=", "html.duckduckgo.com/html/?q=");
      }
      return trimmed;
    }

    // If it looks like a domain name (contains . and no spaces, e.g. github.com)
    if (trimmed.includes(".") && !trimmed.includes(" ")) {
      return `https://${trimmed}`;
    }

    // Otherwise, treat as search query
    if (searchEngine === "wiki") {
      return `https://en.m.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(trimmed)}`;
    }
    if (searchEngine === "ddg") {
      return `https://html.duckduckgo.com/html/?q=${encodeURIComponent(trimmed)}`;
    }
    if (searchEngine === "google") {
      return `https://www.google.com/search?q=${encodeURIComponent(trimmed)}`;
    }
    return `cyber://search?q=${encodeURIComponent(trimmed)}`;
  };

  // Navigate the active tab to a target URL
  const navigateActiveTab = (targetUrl: string, autoProxy = true) => {
    sound.playClick(950);
    const formatted = formatTargetUrl(targetUrl);

    setTabs((current) =>
      current.map((tab) => {
        if (tab.id !== activeTabId) return tab;

        // Truncate forward history if navigating from a past index
        const newHistory = tab.history.slice(0, tab.historyIndex + 1);
        newHistory.push(formatted);

        let title = "Web Page";
        if (formatted === DEFAULT_HOME_URL) title = "CyberNet Gateway";
        else if (formatted.startsWith("cyber://search?q=")) {
          title = `Search: ${decodeURIComponent(formatted.replace("cyber://search?q=", ""))}`;
        } else if (formatted === "cyber://youtube" || formatted.startsWith("cyber://youtube?")) {
          title = "CyberTube Media Hub";
        } else if (formatted.includes("youtube-nocookie.com/embed/") || formatted.includes("youtube.com/embed/")) {
          title = "CyberTube Stream";
        } else {
          try {
            const host = new URL(formatted).hostname.replace("www.", "");
            title = host;
          } catch {
            title = formatted;
          }
        }

        const isInternalPage = formatted.startsWith("cyber://");

        return {
          ...tab,
          url: formatted,
          title,
          history: newHistory,
          historyIndex: newHistory.length - 1,
          isLoading: !isInternalPage,
          proxyMode: autoProxy,
        };
      })
    );

    if (!formatted.startsWith("cyber://")) {
      setRecentHistory((prev) => {
        const filtered = prev.filter((u) => u !== formatted);
        return [formatted, ...filtered].slice(0, 15);
      });
    }
  };

  // Tab management
  const createNewTab = (initialUrl = DEFAULT_HOME_URL) => {
    sound.playBlip(1100);
    const newId = `tab-${Date.now()}`;
    const newTab: BrowserTab = {
      id: newId,
      title: initialUrl === DEFAULT_HOME_URL ? "New Tab" : "Loading...",
      url: initialUrl,
      history: [initialUrl],
      historyIndex: 0,
      isLoading: !initialUrl.startsWith("cyber://"),
      proxyMode: true,
    };
    setTabs((prev) => [...prev, newTab]);
    setActiveTabId(newId);
  };

  const closeTab = (tabId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playClick(700);

    if (tabs.length === 1) {
      // Don't close last tab, just reset to home
      setTabs([
        {
          id: `tab-${Date.now()}`,
          title: "CyberNet Gateway",
          url: DEFAULT_HOME_URL,
          history: [DEFAULT_HOME_URL],
          historyIndex: 0,
          isLoading: false,
          proxyMode: true,
        },
      ]);
      return;
    }

    const index = tabs.findIndex((t) => t.id === tabId);
    const remaining = tabs.filter((t) => t.id !== tabId);
    setTabs(remaining);

    if (activeTabId === tabId) {
      const nextActive = remaining[Math.max(0, index - 1)] || remaining[0];
      setActiveTabId(nextActive.id);
    }
  };

  // Navigation toolbar actions
  const goBack = () => {
    if (!activeTab || activeTab.historyIndex <= 0) return;
    sound.playClick(850);
    const nextIndex = activeTab.historyIndex - 1;
    const targetUrl = activeTab.history[nextIndex];

    setTabs((current) =>
      current.map((t) =>
        t.id === activeTabId
          ? {
              ...t,
              url: targetUrl,
              historyIndex: nextIndex,
              isLoading: !targetUrl.startsWith("cyber://"),
            }
          : t
      )
    );
  };

  const goForward = () => {
    if (!activeTab || activeTab.historyIndex >= activeTab.history.length - 1)
      return;
    sound.playClick(850);
    const nextIndex = activeTab.historyIndex + 1;
    const targetUrl = activeTab.history[nextIndex];

    setTabs((current) =>
      current.map((t) =>
        t.id === activeTabId
          ? {
              ...t,
              url: targetUrl,
              historyIndex: nextIndex,
              isLoading: !targetUrl.startsWith("cyber://"),
            }
          : t
      )
    );
  };

  const reloadCurrent = () => {
    sound.playClick(1050);
    setTabs((current) =>
      current.map((t) =>
        t.id === activeTabId
          ? { ...t, isLoading: !t.url.startsWith("cyber://") }
          : t
      )
    );
  };

  const toggleProxyMode = () => {
    sound.playClick(1150);
    setTabs((current) =>
      current.map((t) =>
        t.id === activeTabId ? { ...t, proxyMode: !t.proxyMode } : t
      )
    );
  };

  const openInNativeWindow = () => {
    if (activeTab && !activeTab.url.startsWith("cyber://")) {
      sound.playClick(1200);
      window.open(activeTab.url, "_blank", "noopener,noreferrer");
    }
  };

  const handleOmnibarSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (omnibarInput.trim()) {
      navigateActiveTab(omnibarInput, activeTab?.proxyMode ?? true);
    }
  };

  const handleIframeLoaded = (tabId: string) => {
    setTabs((current) =>
      current.map((t) => (t.id === tabId ? { ...t, isLoading: false } : t))
    );
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#080c16] text-gray-200 select-none overflow-hidden font-sans">
      {/* 1. Chrome Tab Strip */}
      <div className="flex items-center bg-[#050811] px-2 pt-2 border-b border-white/10 gap-1 overflow-x-auto scrollbar-none shrink-0">
        <div className="flex items-center gap-1.5 flex-1 min-w-0">
          {tabs.map((tab) => {
            const isActive = tab.id === activeTabId;
            return (
              <div
                key={tab.id}
                onClick={() => {
                  sound.playClick(1100);
                  setActiveTabId(tab.id);
                }}
                className={`group flex items-center gap-2 px-3 py-1.5 rounded-t-xl text-xs max-w-[200px] min-w-[110px] cursor-pointer transition-all border-t border-x ${
                  isActive
                    ? "bg-[#0b1020] border-white/15 text-white font-medium shadow-[0_-2px_10px_rgba(0,0,0,0.4)]"
                    : "bg-white/[0.03] border-transparent text-gray-400 hover:bg-white/[0.06] hover:text-gray-200"
                }`}
              >
                {/* Tab Icon */}
                <span className="shrink-0">
                  {tab.isLoading ? (
                    <RotateCw size={12} className="animate-spin text-[#00f5d4]" />
                  ) : tab.url === DEFAULT_HOME_URL ? (
                    <Sparkles size={12} className="text-[#38bdf8]" />
                  ) : tab.url.startsWith("cyber://search") ? (
                    <Search size={12} className="text-[#00f5d4]" />
                  ) : (
                    <Globe size={12} className="text-[#8b5cf6]" />
                  )}
                </span>

                {/* Tab Title */}
                <span className="truncate flex-1 text-[11px] font-mono">
                  {tab.title}
                </span>

                {/* Close Tab Button */}
                <button
                  onClick={(e) => closeTab(tab.id, e)}
                  title="Close Tab"
                  className="opacity-0 group-hover:opacity-100 hover:bg-white/15 p-0.5 rounded-md text-gray-400 hover:text-white transition-opacity cursor-pointer shrink-0"
                >
                  <X size={11} />
                </button>
              </div>
            );
          })}

          {/* New Tab Button */}
          <button
            onClick={() => createNewTab()}
            title="New Tab"
            className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-[#00f5d4] transition-colors cursor-pointer shrink-0"
          >
            <Plus size={14} />
          </button>
        </div>

        {/* Global Browser Status Badge */}
        <div className="hidden sm:flex items-center gap-2 text-[10px] font-mono text-gray-500 pr-2">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00f5d4] animate-pulse" />
            <span>PROXY ACTIVE</span>
          </span>
        </div>
      </div>

      {/* 2. Omnibar & Navigation Toolbar */}
      <div className="flex items-center gap-2 p-2 bg-[#0b1020] border-b border-white/10 shrink-0">
        {/* Back / Forward / Refresh / Home Buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={goBack}
            disabled={!activeTab || activeTab.historyIndex <= 0}
            title="Back"
            className="p-1.5 rounded-lg hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent text-gray-300 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft size={14} />
          </button>
          <button
            onClick={goForward}
            disabled={!activeTab || activeTab.historyIndex >= activeTab.history.length - 1}
            title="Forward"
            className="p-1.5 rounded-lg hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent text-gray-300 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowRight size={14} />
          </button>
          <button
            onClick={reloadCurrent}
            title="Reload Page"
            className="p-1.5 rounded-lg hover:bg-white/10 text-gray-300 hover:text-white transition-colors cursor-pointer"
          >
            <RotateCw
              size={13}
              className={activeTab?.isLoading ? "animate-spin text-[#00f5d4]" : ""}
            />
          </button>
          <button
            onClick={() => navigateActiveTab(DEFAULT_HOME_URL)}
            title="CyberNet Start Page"
            className="p-1.5 rounded-lg hover:bg-white/10 text-gray-300 hover:text-[#38bdf8] transition-colors cursor-pointer"
          >
            <Home size={14} />
          </button>
        </div>

        {/* Omnibar Address Bar */}
        <form
          onSubmit={handleOmnibarSubmit}
          className="flex-1 flex items-center bg-black/40 border border-white/15 hover:border-white/25 focus-within:border-[#00f5d4]/60 rounded-xl px-2.5 py-1 text-xs transition-colors shadow-inner"
        >
          {/* Security Indicator */}
          <div className="flex items-center gap-1.5 pr-2 border-r border-white/10 text-gray-400">
            {activeTab?.url === DEFAULT_HOME_URL ? (
              <span className="flex items-center gap-1 text-[10px] text-[#38bdf8] font-mono">
                <Shield size={11} />
                <span className="hidden sm:inline">GATEWAY</span>
              </span>
            ) : activeTab?.url.startsWith("cyber://youtube") || activeTab?.url.includes("youtube") ? (
              <span className="flex items-center gap-1 text-[10px] text-red-400 font-mono">
                <Video size={11} />
                <span className="hidden sm:inline">CYBERTUBE</span>
              </span>
            ) : activeTab?.url.startsWith("cyber://search") ? (
              <span className="flex items-center gap-1 text-[10px] text-[#00f5d4] font-mono">
                <Search size={11} />
                <span className="hidden sm:inline">SEARCH</span>
              </span>
            ) : activeTab?.url.startsWith("https://") ? (
              <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
                <Lock size={11} />
                <span className="hidden sm:inline">SECURE</span>
              </span>
            ) : (
              <Globe size={12} className="text-gray-400" />
            )}
          </div>

          {/* URL Input */}
          <input
            ref={inputRef}
            type="text"
            value={omnibarInput}
            onChange={(e) => setOmnibarInput(e.target.value)}
            onFocus={(e) => e.target.select()}
            placeholder="Search web (e.g. youtube, react) or enter URL (e.g. github.com)..."
            className="flex-1 bg-transparent border-none outline-none text-white text-xs px-2 font-mono placeholder:text-gray-500"
          />

          {/* Quick Clear or Enter Action */}
          {omnibarInput && (
            <button
              type="button"
              onClick={() => {
                setOmnibarInput("");
                inputRef.current?.focus();
              }}
              className="text-gray-500 hover:text-gray-300 p-0.5 rounded cursor-pointer mr-1"
            >
              <X size={12} />
            </button>
          )}

          <button
            type="submit"
            className="bg-[#00f5d4]/15 hover:bg-[#00f5d4]/30 border border-[#00f5d4]/40 text-[#00f5d4] px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer"
          >
            GO
          </button>
        </form>

        {/* Proxy Mode Toggle & Native Tab Popout */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={toggleProxyMode}
            title={
              activeTab?.proxyMode
                ? "Proxy Shield Active: Bypasses X-Frame-Options & CORS blocking. Click to switch to Direct."
                : "Direct Mode Active: Loads directly from source host. Click to enable Proxy Shield."
            }
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold transition-all cursor-pointer border ${
              activeTab?.proxyMode
                ? "bg-[#38bdf8]/15 border-[#38bdf8]/40 text-[#38bdf8]"
                : "bg-white/5 border-white/10 text-gray-400 hover:text-white"
            }`}
          >
            <Shield size={12} />
            <span className="hidden md:inline">
              {activeTab?.proxyMode ? "PROXY" : "DIRECT"}
            </span>
          </button>

          <button
            onClick={openInNativeWindow}
            disabled={!activeTab || activeTab.url.startsWith("cyber://")}
            title="Open Current Page in External Browser Tab"
            className="p-1.5 rounded-lg hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent text-gray-300 hover:text-white transition-colors cursor-pointer"
          >
            <ExternalLink size={14} />
          </button>
        </div>
      </div>

      {/* 3. Bookmarks Quick-Access Shelf */}
      <div className="flex items-center gap-1.5 px-3 py-1 bg-[#070b15] border-b border-white/5 overflow-x-auto scrollbar-none shrink-0 text-xs font-mono">
        <Bookmark size={11} className="text-gray-500 shrink-0 mr-1" />

        {SPEED_DIAL_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => navigateActiveTab(item.url)}
            className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white/[0.03] hover:bg-white/10 text-gray-400 hover:text-white transition-colors shrink-0 text-[11px] border border-white/5 hover:border-white/15 cursor-pointer"
          >
            <span className="text-[10px]">{item.icon}</span>
            <span>{item.title.split(" ")[0]}</span>
          </button>
        ))}
      </div>

      {/* 4. Active Tab Content Area */}
      <div className="flex-1 relative overflow-hidden bg-[#060913]">
        {/* Loading Bar Indicator */}
        {activeTab?.isLoading && (
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00f5d4] to-transparent animate-pulse z-30" />
        )}

        {/* Tab Viewport Instances */}
        {tabs.map((tab) => {
          const isThisTabActive = tab.id === activeTabId;
          const isStartPage = tab.url === DEFAULT_HOME_URL;
          const isSearchPage = tab.url.startsWith("cyber://search?q=");
          const searchQuery = isSearchPage
            ? decodeURIComponent(tab.url.replace("cyber://search?q=", ""))
            : "";

          // Determine Iframe Source: if proxyMode is enabled, pass through our Next.js proxy route
          const iframeSrc = tab.proxyMode
            ? `/api/proxy?url=${encodeURIComponent(tab.url)}`
            : tab.url;

          return (
            <div
              key={tab.id}
              style={{ display: isThisTabActive ? "flex" : "none" }}
              className="flex-col h-full w-full relative"
            >
              {isStartPage ? (
                /* --- CYBERNET START PAGE & SPEED DIAL --- */
                <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex flex-col items-center">
                  <div className="w-full max-w-4xl flex flex-col gap-8 my-auto py-4">
                    {/* Header Banner */}
                    <div className="text-center flex flex-col items-center gap-2">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#00f5d4]/20 via-[#38bdf8]/20 to-[#8b5cf6]/20 border border-[#00f5d4]/40 flex items-center justify-center shadow-[0_0_30px_rgba(0,245,212,0.2)]">
                        <Globe size={28} className="text-[#00f5d4]" />
                      </div>
                      <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-mono">
                        CYBERNET <span className="text-[#00f5d4]">GATEWAY</span>
                      </h1>
                      <p className="text-xs text-gray-400 font-mono max-w-md">
                        Integrated Web Surfer & Hypermedia Browser inside Cyberpunk OS. Browse external sites, live documentation, and developer portals.
                      </p>
                    </div>

                    {/* Central Search Box */}
                    <div className="flex flex-col gap-2 w-full max-w-2xl mx-auto">
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          const val = (e.currentTarget.elements.namedItem("search") as HTMLInputElement)?.value;
                          if (val) navigateActiveTab(val);
                        }}
                        className="relative flex items-center"
                      >
                        <Search
                          size={18}
                          className="absolute left-4 text-gray-400 pointer-events-none"
                        />
                        <input
                          name="search"
                          type="text"
                          placeholder="Search the web (e.g. youtube, react, wiki)..."
                          className="w-full bg-[#0b1020] border border-white/20 hover:border-white/30 focus:border-[#00f5d4] rounded-2xl py-3 pl-12 pr-28 text-sm text-white font-mono placeholder:text-gray-500 shadow-[0_10px_30px_rgba(0,0,0,0.6)] outline-none transition-all"
                        />
                        <button
                          type="submit"
                          className="absolute right-2.5 bg-gradient-to-r from-[#00f5d4] to-[#38bdf8] text-black font-bold font-mono text-xs px-4 py-2 rounded-xl hover:opacity-95 transition-opacity cursor-pointer shadow-md"
                        >
                          SURF
                        </button>
                      </form>

                      {/* Engine Selector Pills */}
                      <div className="flex items-center justify-center gap-2 text-xs font-mono">
                        <span className="text-gray-500 text-[11px]">Default Engine:</span>
                        <button
                          type="button"
                          onClick={() => setSearchEngine("cyber")}
                          className={`px-2 py-0.5 rounded-lg border text-[10px] cursor-pointer ${
                            searchEngine === "cyber"
                              ? "bg-[#00f5d4]/10 border-[#00f5d4]/50 text-[#00f5d4] font-bold"
                              : "border-white/10 text-gray-400 hover:text-white"
                          }`}
                        >
                          ⚡ CyberSearch
                        </button>
                        <button
                          type="button"
                          onClick={() => setSearchEngine("ddg")}
                          className={`px-2 py-0.5 rounded-lg border text-[10px] cursor-pointer ${
                            searchEngine === "ddg"
                              ? "bg-[#38bdf8]/10 border-[#38bdf8]/50 text-[#38bdf8] font-bold"
                              : "border-white/10 text-gray-400 hover:text-white"
                          }`}
                        >
                          DuckDuckGo HTML
                        </button>
                        <button
                          type="button"
                          onClick={() => setSearchEngine("wiki")}
                          className={`px-2 py-0.5 rounded-lg border text-[10px] cursor-pointer ${
                            searchEngine === "wiki"
                              ? "bg-amber-400/10 border-amber-400/50 text-amber-300 font-bold"
                              : "border-white/10 text-gray-400 hover:text-white"
                          }`}
                        >
                          Wikipedia
                        </button>
                        <button
                          type="button"
                          onClick={() => setSearchEngine("google")}
                          className={`px-2 py-0.5 rounded-lg border text-[10px] cursor-pointer ${
                            searchEngine === "google"
                              ? "bg-[#8b5cf6]/10 border-[#8b5cf6]/50 text-[#8b5cf6] font-bold"
                              : "border-white/10 text-gray-400 hover:text-white"
                          }`}
                        >
                          Google
                        </button>
                      </div>
                    </div>

                    {/* Speed Dial Grid */}
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center justify-between text-xs font-mono text-gray-400 border-b border-white/10 pb-2">
                        <span className="font-bold text-white flex items-center gap-2">
                          <Compass size={14} className="text-[#00f5d4]" />
                          <span>Speed Dial & Portals</span>
                        </span>
                        <span className="text-[10px] text-gray-500">
                          Click to launch inside OS
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        {SPEED_DIAL_ITEMS.map((item) => (
                          <div
                            key={item.id}
                            onClick={() => navigateActiveTab(item.url)}
                            className="group p-3.5 rounded-xl bg-[#0b1020]/80 hover:bg-[#0e162e] border border-white/10 hover:border-[#00f5d4]/40 transition-all cursor-pointer flex flex-col justify-between gap-3 shadow-lg hover:shadow-[0_0_20px_rgba(0,245,212,0.15)]"
                          >
                            <div className="flex items-start justify-between">
                              <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-lg group-hover:scale-105 transition-transform">
                                {item.icon}
                              </div>
                              {item.badge && (
                                <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-white/5 text-gray-400 group-hover:text-[#00f5d4] group-hover:bg-[#00f5d4]/10 transition-colors">
                                  {item.badge}
                                </span>
                              )}
                            </div>

                            <div>
                              <h3 className="text-xs font-bold text-white group-hover:text-[#00f5d4] transition-colors truncate">
                                {item.title}
                              </h3>
                              <p className="text-[11px] text-gray-400 line-clamp-2 mt-1 leading-relaxed">
                                {item.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Quick System Telemetry / History Bar */}
                    <div className="bg-[#0b1020]/60 rounded-xl p-3 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] font-mono text-gray-400">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1.5 text-emerald-400">
                          <Shield size={12} />
                          <span>Anti-Tracking Shield ON</span>
                        </span>
                        <span>•</span>
                        <span>Proxy Server: Colombo Hub</span>
                        <span>•</span>
                        <span>TLS 1.3 Strict</span>
                      </div>

                      {recentHistory.length > 0 && (
                        <div className="flex items-center gap-2">
                          <Clock size={12} className="text-gray-500" />
                          <span className="text-gray-500">Recent:</span>
                          <span
                            onClick={() => navigateActiveTab(recentHistory[0])}
                            className="text-[#38bdf8] hover:underline cursor-pointer truncate max-w-[150px]"
                          >
                            {recentHistory[0].replace("https://", "")}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : isSearchPage ? (
                /* --- NATIVE CYBERSEARCH ENGINE VIEW --- */
                <CyberSearchResultsView
                  query={searchQuery}
                  onNavigate={(targetUrl) => navigateActiveTab(targetUrl)}
                  onRefineQuery={(newQuery) =>
                    navigateActiveTab(`cyber://search?q=${encodeURIComponent(newQuery)}`)
                  }
                />
              ) : tab.url === "cyber://youtube" || tab.url.startsWith("cyber://youtube?") ? (
                /* --- NATIVE CYBERTUBE MEDIA HUB --- */
                <CyberTubePortalView onNavigate={(url) => navigateActiveTab(url)} />
              ) : tab.url.includes("youtube-nocookie.com/embed/") || tab.url.includes("youtube.com/embed/") ? (
                /* --- HARDWARE ACCELERATED YOUTUBE EMBED --- */
                <div className="flex-1 relative w-full h-full bg-black flex flex-col">
                  <iframe
                    src={tab.url}
                    title={tab.title}
                    className="w-full h-full border-none flex-1"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                  <div className="bg-[#0b1020] border-t border-white/10 px-3 py-1.5 flex items-center justify-between text-[11px] font-mono text-gray-400 shrink-0">
                    <span className="text-red-400 font-bold flex items-center gap-1.5">
                      <Video size={12} />
                      <span>CyberTube Embedded Stream (Zero CORS)</span>
                    </span>
                    <button
                      onClick={() => window.open(tab.url.replace("embed/", "watch?v="), "_blank", "noopener,noreferrer")}
                      className="text-[#38bdf8] hover:underline flex items-center gap-1 cursor-pointer text-[10px]"
                    >
                      <span>Open on YouTube ↗</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* --- LIVE EMBEDDED IFRAME VIEWPORT --- */
                <div className="flex-1 relative w-full h-full bg-white flex flex-col">
                  {/* Embedded Iframe */}
                  <iframe
                    src={iframeSrc}
                    title={tab.title}
                    onLoad={() => handleIframeLoaded(tab.id)}
                    className="w-full h-full border-none flex-1"
                    sandbox="allow-scripts allow-forms allow-popups allow-modals allow-downloads"
                    referrerPolicy="no-referrer-when-downgrade"
                  />

                  {/* Fallback Helper Bar at the bottom of iframe viewport */}
                  <div className="bg-[#0b1020] border-t border-white/10 px-3 py-1.5 flex items-center justify-between text-[11px] font-mono text-gray-400 shrink-0">
                    <div className="flex items-center gap-2 truncate pr-2">
                      <span className="text-[#00f5d4]">•</span>
                      <span className="text-gray-300 truncate">
                        {tab.url}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={toggleProxyMode}
                        className="hover:text-white transition-colors cursor-pointer text-[10px] underline"
                      >
                        {tab.proxyMode
                          ? "Switch to Direct Frame"
                          : "Switch to Proxy Shield"}
                      </button>
                      <span>|</span>
                      <button
                        onClick={openInNativeWindow}
                        className="text-[#38bdf8] hover:underline flex items-center gap-1 cursor-pointer text-[10px]"
                      >
                        <span>Open in Real Tab</span>
                        <ExternalLink size={10} />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
