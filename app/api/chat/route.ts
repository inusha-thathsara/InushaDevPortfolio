import { createUIMessageStream, createUIMessageStreamResponse } from 'ai';
import { PROJECTS } from '@/app/data/projects';
import { SKILL_CATEGORIES } from '@/app/data/skills';

export const maxDuration = 30;

// Knowledge base for Inusha Gunasekara's Digital Twin
const KNOWLEDGE_RESPONSES: Record<string, string> = {
  help: `
[CYBERPUNK OS 2.0 PROTOCOLS]
--------------------------------------------------
[CORE COMMANDS]
> projects    :: Holographic index of 2026 agentic projects
> skills      :: Neural capabilities & runtime proficiencies
> hackathons  :: Collegiate & national competition dossier
> education   :: University of Moratuwa academic telemetry
> contact     :: Direct encrypted transmission channels
> whoami      :: System identity & digital twin telemetry
> about       :: Biography & engineering philosophy

[DIAGNOSTICS & EASTER EGGS]
> status      :: Live telemetry, gas monitor & container vitals
> matrix      :: Access the neural construct
> sudo delete :: Emergency core wipe sequence
> clear       :: Wipe terminal buffer
`,

  whoami: `
[IDENTITY VERIFIED]
NAME:        Malawige Inusha Thathsara Gunasekara (Inusha Thathsara)
ROLE:        AI Engineer & Full-Stack Systems Architect
ACADEMIC:    IT Undergraduate @ University of Moratuwa, Sri Lanka 🇱🇰
VENTURES:    Co-Founder @ Tekkeys (Agentic Developer Tooling)
STATUS:      Building & shipping high-reliability AI systems
`,

  about: `
I am Inusha Gunasekara, an IT undergraduate at the University of Moratuwa, Sri Lanka.
I specialize in engineering autonomous AI agents, local LLM orchestration (Gemma 2, TabPFN), and high-performance full-stack web and cross-platform Flutter applications.
I believe in "reliability as a core feature" — building systems that hold up under real-world load with zero fluff.
`,

  projects: `
[2026 ARTIFACT VAULT INDEX]
--------------------------------------------------
1. slothpfn
   > Zero-effort Tabular AI Agent powered by Prior Labs TabPFN & ElevenLabs.
2. Ghost Data Audit Agent
   > Autonomous Deletion-Audit Agent for GDPR/CCPA enterprise compliance.
3. PodSnippet Studio
   > AI podcast & audio teaser engine for technical writers (Gemma 2 + ElevenLabs).
4. The Living Blueprint Agent
   > Process-to-Document partner for software architecture & threat models.
5. The 80% Attendance Protocol
   > Offline-first Flutter app with Gemini timetable OCR & skip algorithm.
6. Urban Flow AI (SLIIT CodeFest Finalist)
   > End-to-end mobility intelligence platform trained on 48 Million records.
7. VaultGuard (Duothan 6.0)
   > Zero-trust enterprise secrets vault built during 36h hackathon.

[Tip: Click 'Project Vault' in the bottom dock to inspect blueprints!]
`,

  skills: `
[NEURAL RADAR & SKILL GAUGES]
--------------------------------------------------
• AI & ALCHEMY:
  - Agentic Workflows (95%) | Gemini 2.5/3 (94%) | Gemma 2 (90%) | ElevenLabs (88%) | TabPFN (86%)
• RUNTIME ENGINES:
  - Python (96%) | TypeScript (94%) | JavaScript (96%) | Dart/Flutter (90%) | SQL (88%)
• NEURAL FRAMEWORKS:
  - Next.js 15/16 (95%) | React 19 (94%) | Tailwind CSS v4 (95%) | FastAPI (90%) | Node.js (92%)
• INFRASTRUCTURE:
  - Docker Multi-Stage (90%) | Google Cloud Run (88%) | Firebase (90%) | DuckDB (85%)
`,

  hackathons: `
[COMPETITIVE DOSSIER & HACKATHON COMBAT]
--------------------------------------------------
🏆 SLIIT CodeFest Datathon:
   > Placed in Top 8 Finalists nationwide. Processed 48M urban transit records.
🏆 Duothan 6.0 Hackathon:
   > Built 'VaultGuard' zero-trust secrets platform with Team BackTrack in 36 hours.
🏆 Hacktoberfest 2026:
   > Published 'slothpfn' (Week 3) and 'PodSnippet Studio' (Week 2).
🏆 All Things Agentic Hackathon:
   > Developed 'The Living Blueprint Agent' for architecture automation.
🏆 NeuroX 1.0:
   > Engineered 'FleetSpec-Agent' for autonomous tire inspection telemetry.
🏆 Mora SP Cup 2026 & Tensor Titans Sri Lanka 2026:
   > Active participant in national AI and signal processing challenges.
`,

  education: `
[ACADEMIC TELEMETRY]
--------------------------------------------------
INSTITUTION: University of Moratuwa, Sri Lanka (UoM)
DEGREE:      B.Sc. (Hons) in Information Technology
MODULES:     Data Structures & Algorithms, Web Technologies (IN1621),
             Software Engineering (IN2201), Distributed Systems
HIGHLIGHT:   Creator of 'The 80% Protocol' attendance app used by fellow students.
`,

  contact: `
[ENCRYPTED COMMUNICATION CHANNELS]
--------------------------------------------------
• Email:    inusha.thathsara@gmail.com
• LinkedIn: linkedin.com/in/inusha-gunasekara-9996632a5
• DEV.to:   dev.to/inushathathsara (20+ Published Technical Articles)
• GitHub:   github.com/inusha-thathsara (55+ Repositories)
• X:        @InushaThathsara

[Tip: Click 'Comms Portal' in the dock to transmit directly!]
`,

  status: `
[SYSTEM DIAGNOSTICS :: NOMINAL]
--------------------------------------------------
RUNTIME:     Next.js 16.1.1 (Turbopack Containerized)
DEPLOY:      Google Cloud Run (Scale-to-Zero, us-central1)
DATABASE:    Firebase & Etherscan Realtime Gas Proxy
TELEMETRY:   Nominal / All Services Active
`,

  matrix: `Wake up, Neo... The Matrix has you. Follow the white rabbit. 🐇`,
};

function resolveQuery(rawQuery: string): string {
  const q = rawQuery.trim().toLowerCase();

  // 1. Direct command match
  if (KNOWLEDGE_RESPONSES[q]) {
    return KNOWLEDGE_RESPONSES[q];
  }

  // 2. Keyword heuristic matching for conversational questions
  if (q.includes("project") || q.includes("built") || q.includes("work") || q.includes("portfolio")) {
    return KNOWLEDGE_RESPONSES["projects"];
  }

  if (q.includes("skill") || q.includes("stack") || q.includes("tech") || q.includes("language") || q.includes("python") || q.includes("ai")) {
    return KNOWLEDGE_RESPONSES["skills"];
  }

  if (q.includes("hackathon") || q.includes("competition") || q.includes("codefest") || q.includes("duothan") || q.includes("contest")) {
    return KNOWLEDGE_RESPONSES["hackathons"];
  }

  if (q.includes("education") || q.includes("university") || q.includes("moratuwa") || q.includes("degree") || q.includes("college")) {
    return KNOWLEDGE_RESPONSES["education"];
  }

  if (q.includes("contact") || q.includes("email") || q.includes("hire") || q.includes("reach") || q.includes("linkedin")) {
    return KNOWLEDGE_RESPONSES["contact"];
  }

  if (q.includes("slothpfn") || q.includes("tabular")) {
    return `[slothpfn ARTIFACT]\nZero-effort Tabular AI Agent powered by Prior Labs TabPFN foundation model and ElevenLabs Voice AI. Built for Hacktoberfest Week 3.\nRepository: github.com/inusha-thathsara/slothpfn`;
  }

  if (q.includes("ghost") || q.includes("gdpr")) {
    return `[GHOST DATA AUDIT AGENT]\nAutonomous deletion-audit agent for GDPR/CCPA compliance across distributed enterprise systems. Built for HackerRank Orchestrate.\nRepository: github.com/inusha-thathsara/ghost-data-audit-agent`;
  }

  if (q.includes("80") || q.includes("attendance")) {
    return `[THE 80% ATTENDANCE PROTOCOL]\nCross-platform Flutter app with offline-first SQLite and Gemini AI timetable parsing. Features custom 'Safe to Skip' cut-off algorithm.\nLive App: attendance-tracker-5d550.web.app`;
  }

  if (q.includes("who") || q.includes("about") || q.includes("inusha") || q.includes("experience")) {
    return KNOWLEDGE_RESPONSES["whoami"];
  }

  // Fallback conversational answer
  return `
[DIGITAL TWIN RESPONSE]
I received your transmission: "${rawQuery}".

I am the digital representation of Inusha Gunasekara.
Try typing:
- 'projects' to see my 2026 agentic AI applications
- 'skills' for my technical stack breakdown
- 'hackathons' to inspect my competition wins (SLIIT CodeFest, Duothan 6.0)
- 'contact' to get in touch directly
`;
}

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const lastMessage = messages[messages.length - 1];
    const rawContent = (lastMessage as any).parts
      ? (lastMessage as any).parts.map((p: any) => p.text).join('')
      : (lastMessage?.content || '');

    const responseText = resolveQuery(rawContent);

    return Response.json({ text: responseText.trim() });
  } catch (err: any) {
    return Response.json(
      { text: `[ERROR] Neural link disconnected: ${String(err?.message || err)}` },
      { status: 500 }
    );
  }
}
