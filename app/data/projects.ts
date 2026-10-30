export interface ProjectItem {
  id: string;
  title: string;
  category: "agentic-ai" | "mobile" | "data-systems" | "fullstack";
  shortDesc: string;
  fullDesc: string;
  techStack: string[];
  githubUrl: string;
  liveUrl?: string;
  articleUrl?: string;
  status: "ONLINE" | "DEPLOYED" | "FINALIST" | "OPEN_SOURCE";
  badge: string;
  stats?: { label: string; value: string }[];
  highlight: string;
}

export const PROJECTS: ProjectItem[] = [
  {
    id: "slothpfn",
    title: "slothpfn",
    category: "agentic-ai",
    badge: "Hacktoberfest '26 Week 3",
    status: "OPEN_SOURCE",
    shortDesc: "Zero-effort tabular AI agent powered by Prior Labs TabPFN foundation model and ElevenLabs Voice AI.",
    fullDesc: "An autonomous agent built for technical data analysts and developers that ingests raw tabular datasets, automatically identifies schema traps, runs Bayesian prior inference using TabPFN without hyperparameter tuning, and generates audio-narrated executive briefings via ElevenLabs.",
    techStack: ["Python", "TabPFN", "ElevenLabs", "Autonomous Agents", "Pandas"],
    githubUrl: "https://github.com/inusha-thathsara/slothpfn",
    articleUrl: "https://dev.to/inushathathsara/the-zero-touch-tabular-ai-agent-built-for-the-truly-lazy-4okf",
    stats: [
      { label: "Model", value: "TabPFN v2" },
      { label: "Voice Engine", value: "ElevenLabs" },
      { label: "Latency", value: "<1.2s" },
    ],
    highlight: "Featured on DEV Community Hacktoberfest Challenge with zero-touch automated ML pipelines."
  },
  {
    id: "ghost-data-audit-agent",
    title: "Ghost Data Audit Agent",
    category: "agentic-ai",
    badge: "HackerRank Orchestrate",
    status: "DEPLOYED",
    shortDesc: "Autonomous deletion-audit agent for GDPR/CCPA compliance across distributed enterprise systems.",
    fullDesc: "Under GDPR Article 17, users possess the legal Right to be Forgotten. Ghost Data Audit Agent automatically traverses distributed microservices, databases, and message queues to verify data deletion, detecting residual 'ghost data' with zero token waste.",
    techStack: ["Python", "Distributed Systems", "Compliance AI", "FastAPI", "Docker"],
    githubUrl: "https://github.com/inusha-thathsara/ghost-data-audit-agent",
    articleUrl: "https://dev.to/inushathathsara/ghost-data-still-exists-building-a-zero-token-deletion-audit-agent-for-gdpr-compliance-4j8g",
    stats: [
      { label: "Standard", value: "GDPR Art. 17" },
      { label: "Audit Mode", value: "Zero-Token" },
      { label: "Architecture", value: "Distributed" },
    ],
    highlight: "Engineered for HackerRank Orchestrate to eliminate enterprise compliance liabilities."
  },
  {
    id: "podsnippet-studio",
    title: "PodSnippet Studio",
    category: "agentic-ai",
    badge: "Hacktoberfest '26 Week 2",
    status: "OPEN_SOURCE",
    shortDesc: "AI podcast & audio teaser engine for technical writers with Gemma 2 and ElevenLabs.",
    fullDesc: "Transforms dense Markdown technical articles into conversational, multi-host podcast dialogues and viral 30-second audio snippets. Leverages Google Gemma 2 for script extraction and ElevenLabs for multi-speaker voice synthesis.",
    techStack: ["JavaScript", "Google Gemma 2", "ElevenLabs", "Audio Synthesis", "Next.js"],
    githubUrl: "https://github.com/inusha-thathsara/podsnippet-studio",
    articleUrl: "https://dev.to/inushathathsara/podsnippet-studio-repurpose-tech-articles-into-viral-audio-teasers-podcasts-with-gemma-2-and-38j2",
    stats: [
      { label: "Core LLM", value: "Gemma 2" },
      { label: "Voice Actors", value: "Multi-Host" },
      { label: "Format", value: "MP3 / Waveform" },
    ],
    highlight: "Repurposes complex developer blog posts into viral multi-speaker audio teasers."
  },
  {
    id: "the-living-blueprint-agent",
    title: "The Living Blueprint Agent",
    category: "agentic-ai",
    badge: "All Things Agentic Hackathon",
    status: "DEPLOYED",
    shortDesc: "AI-powered Process-to-Document partner for software architecture design, PRDs, and threat models.",
    fullDesc: "Collaborative agent that interviews software architects, analyzes system boundaries, and generates living architectural blueprints, complete engineering PRDs, and STRIDE security threat models automatically.",
    techStack: ["Python", "Agentic Workflows", "LLM PRD", "FastAPI", "TypeScript"],
    githubUrl: "https://github.com/inusha-thathsara/the-living-blueprint-agent",
    stats: [
      { label: "Output", value: "STRIDE + PRD" },
      { label: "Workflow", value: "Multi-Agent" },
      { label: "Engine", value: "Gemini 2.5" },
    ],
    highlight: "Built for the All Things Agentic Hackathon to streamline enterprise design docs."
  },
  {
    id: "the-80-percent",
    title: "The 80% Attendance Protocol",
    category: "mobile",
    badge: "University of Moratuwa",
    status: "ONLINE",
    shortDesc: "Cross-platform Flutter app for university attendance tracking with Gemini AI and 'Safe to Skip' algorithm.",
    fullDesc: "Engineered specifically for undergraduates balancing coursework and startups. Combines an offline-first SQLite database, Gemini multimodal OCR for timetable parsing, and a custom algorithm that computes precise cut-off margins.",
    techStack: ["Flutter", "Dart", "Google Gemini AI", "SQLite", "Firebase"],
    githubUrl: "https://github.com/inusha-thathsara/the-80-percent",
    liveUrl: "https://attendance-tracker-5d550.web.app",
    articleUrl: "https://dev.to/inushathathsara/how-i-built-a-flutter-gemini-ai-app-to-hack-my-university-attendance-open-source-292i",
    stats: [
      { label: "Codebase", value: "15,000+ Lines" },
      { label: "Architecture", value: "Offline-First" },
      { label: "Platform", value: "Android & Web" },
    ],
    highlight: "Saved hundreds of student hours with algorithmic skip calculations and OCR parsing."
  },
  {
    id: "urban-flow-ai",
    title: "Urban Flow AI (SLIIT CodeFest)",
    category: "data-systems",
    badge: "Top 8 Finalist",
    status: "FINALIST",
    shortDesc: "End-to-end urban mobility and traffic flow intelligence platform trained on 48 Million records.",
    fullDesc: "Designed and built for the SLIIT CodeFest Datathon. Handled massive spatial-temporal traffic datasets, optimized ingestion pipelines with DuckDB & Python, and served predictive congestion metrics to city planners.",
    techStack: ["Python", "Data Science", "DuckDB", "Machine Learning", "Streamlit"],
    githubUrl: "https://github.com/inusha-thathsara",
    articleUrl: "https://dev.to/inushathathsara/from-48m-records-to-top-8-finalists-how-we-built-an-end-to-end-urban-flow-ai-53gp",
    stats: [
      { label: "Dataset Size", value: "48M Records" },
      { label: "Standing", value: "Top 8 Finalist" },
      { label: "Query Engine", value: "DuckDB" },
    ],
    highlight: "Placed in Top 8 Finalists among nationwide university teams at SLIIT CodeFest."
  },
  {
    id: "documind",
    title: "DocuMind Knowledge Agent",
    category: "fullstack",
    badge: "Next.js 15 + Sanity CMS",
    status: "DEPLOYED",
    shortDesc: "Intelligent real-time technical documentation and knowledge agent powered by Gemini AI.",
    fullDesc: "A developer documentation hub that integrates Sanity CMS for headless content editing and embeds a context-aware Google Gemini agent capable of answering complex API questions with source citations.",
    techStack: ["Next.js 15", "Sanity CMS", "Google Gemini", "TypeScript", "Tailwind CSS"],
    githubUrl: "https://github.com/inusha-thathsara/documind",
    stats: [
      { label: "Framework", value: "Next.js 15" },
      { label: "CMS", value: "Sanity.io" },
      { label: "LLM", value: "Gemini Pro" },
    ],
    highlight: "Bridges structured CMS technical content with context-grounded AI assistance."
  },
  {
    id: "duothan-vaultguard",
    title: "VaultGuard (Duothan 6.0)",
    category: "data-systems",
    badge: "Duothan 6.0 Hackathon",
    status: "OPEN_SOURCE",
    shortDesc: "Zero-trust secrets protection and enterprise credentials telemetry platform.",
    fullDesc: "Built during the prestigious 36-hour Duothan 6.0 collegiate hackathon in Sri Lanka (Team BackTrack). Features real-time secret leak detection, terraform/HCL integration, and encrypted vault storage.",
    techStack: ["TypeScript", "Next.js", "Docker", "Terraform / HCL", "PostgreSQL"],
    githubUrl: "https://github.com/inusha-thathsara/Duothan-6-Team-BackTrack-VaultGuard",
    stats: [
      { label: "Hackathon", value: "Duothan 6.0" },
      { label: "Team", value: "BackTrack" },
      { label: "Duration", value: "36 Hours" },
    ],
    highlight: "Comprehensive zero-trust architecture built under strict hackathon time constraints."
  }
];
