export interface SkillCategory {
  title: string;
  tagline: string;
  color: string;
  skills: { name: string; level: number; highlight?: string; iconUrl?: string }[];
}

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    title: "AI & ALCHEMY",
    tagline: "Autonomous Agents & Foundation Models",
    color: "#8b5cf6", // Purple
    skills: [
      { name: "Agentic Workflows", level: 95, highlight: "Multi-agent systems" },
      { name: "Google Gemini 2.5 / 3", level: 94, highlight: "Multimodal & Vision" },
      { name: "Google Gemma 2", level: 90, highlight: "Local LLM Inference" },
      { name: "ElevenLabs Voice AI", level: 88, highlight: "Audio Synthesis" },
      { name: "TabPFN", level: 86, highlight: "Prior Labs Tabular AI" },
      { name: "PyTorch & OpenCV", level: 82, highlight: "Computer Vision & ML" },
      { name: "LangGraph & ADK", level: 85, highlight: "Agent Orchestration" },
    ]
  },
  {
    title: "RUNTIME ENGINES",
    tagline: "High-Performance Systems & Languages",
    color: "#00f5d4", // Cyan
    skills: [
      { name: "Python", level: 96, highlight: "FastAPI, Pandas, AI" },
      { name: "TypeScript", level: 94, highlight: "Strict Typed Enterprise" },
      { name: "JavaScript (ES2026)", level: 96, highlight: "Async / Full-Stack" },
      { name: "Dart (Flutter)", level: 90, highlight: "Cross-platform mobile" },
      { name: "SQL & PostgreSQL", level: 88, highlight: "Relational optimization" },
      { name: "Solidity", level: 78, highlight: "Smart contract logic" },
    ]
  },
  {
    title: "NEURAL FRAMEWORKS",
    tagline: "Modern Web & Mobile Architecture",
    color: "#06b6d4", // Blue-cyan
    skills: [
      { name: "Next.js 15 / 16 (App Router)", level: 95, highlight: "SSR & Server Actions" },
      { name: "React 19", level: 94, highlight: "Hooks, Suspense, Concurrent" },
      { name: "Tailwind CSS v4", level: 95, highlight: "Modern utility-first styling" },
      { name: "Flutter SDK", level: 90, highlight: "Offline-first mobile architecture" },
      { name: "Node.js & Express", level: 92, highlight: "REST & Microservices" },
      { name: "FastAPI", level: 90, highlight: "Async Python APIs" },
    ]
  },
  {
    title: "INFRASTRUCTURE & PROTOCOLS",
    tagline: "Cloud, Containers & Telemetry",
    color: "#f59e0b", // Amber
    skills: [
      { name: "Docker & Multi-Stage Builds", level: 90, highlight: "Container optimization" },
      { name: "Google Cloud (Cloud Run)", level: 88, highlight: "Scale-to-zero serverless" },
      { name: "Firebase & Supabase", level: 90, highlight: "Auth, Firestore & Storage" },
      { name: "MCP (Model Context Protocol)", level: 88, highlight: "Standardized AI tools" },
      { name: "DuckDB & Vector DBs", level: 85, highlight: "High-velocity data processing" },
      { name: "Linux / CLI tooling", level: 92, highlight: "Debian, Alpine & Bash" },
    ]
  }
];
