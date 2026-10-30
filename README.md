# Inusha Portfolio | System 1 (Digital Twin)

> A high-performance, terminal-styled developer portfolio built with Next.js 16, TypeScript, and Google Cloud Run. Designed to simulate a sentient operating system.

![Terminal Interface](./app/icon.png)

## 🚀 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Containerization**: Docker (Multi-stage build)
- **Infrastructure**: Google Cloud Run (Serverless)
- **State**: React Hooks (Stateless Architecture)

## ✨ Key Features

### 1. **Terminal Interface**
- **Typewriter Effect**: Custom `TypedMessage` component simulates real-time text generation.
- **Auto-Scroll**: Smart hook ensures the view always follows the cursor.
- **Command History**: Although currently stateless, the UI supports a history-like flow.
- **Glitch Effects**: CRT-style scanlines and RGB shifts (enabled via `GlitchWrapper`).

### 2. **Static Response Engine (Privacy First)**
- **Zero-Dependency**: Removed external AI (Gemini) APIs for a deterministic, privacy-focused experience.
- **Hardcoded Database**: `HARDCODED_DB` handles responses instantly (<5ms latency).
- **Quota Protection**: No API keys exposed or required for basic chat functions.

### 3. **Eth Gas Tracker (Optimized)**
- **Real-time Data**: Fetches mainnet gas prices via Etherscan V2 API.
- **Server-Side Proxy**: Securely routes requests through `/api/gas` to protect API keys.
- **Smart Caching**:
  - Browser `localStorage` cache (TTL: 5 minutes).
  - Reduced polling interval (60 seconds).
  - Firebase Fallback (Historical telemetry).

### 4. **System Commands**
- **Halt Sequence**: `sudo delete` -> `confirm` triggers a simulated system crash.
- **Reboot**: `sudo reboot` restores the interface.

## 🛠️ Installation

```bash
# Clone the repository
git clone https://github.com/inusha-thathsara/inusha-portfolio.git

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the terminal.

## 📦 Deployment (Google Cloud Run)

This project is configured for **stateless container deployment**.

### Prerequisites
- Google Cloud SDK (`gcloud`)
- Docker (optional, for local build)
- Active Billing Account (required for Cloud Build)

### 1. Build & Deploy
The following command builds the container source, pushes it to Artifact Registry, and deploys to Cloud Run.

```powershell
# Authenticate
gcloud auth login

# Set Project
gcloud config set project terminal-portfolio-b4bb5

# Deploy (One-Liner) with API Key injection
gcloud run deploy inusha-portfolio \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --labels "dev-tutorial=devnewyear2026" \
  --set-env-vars="ETHERSCAN_API_KEY=YOUR_ETHERSCAN_KEY"
```

### 2. Dockerfile Optimization
- **Standalone Output**: `next.config.ts` uses `output: 'standalone'` to minimize image size (~100MB).
- **Multi-Stage Build**: Separates dependencies (`deps`), builder (`builder`), and runner (`runner`) stages.
- **Non-Root User**: Runs as `nextjs` user for security.

## 💻 Command Reference

| Command | Description |
| :--- | :--- |
| `help` | List all available commands. |
| `about` / `whoami` | Identity verification and role. |
| `skills` / `stack` | Technical expertise and toolbelt. |
| `projects` | Index of active developments (80% Protocol, Crossword Arch, Inusha-PF). |
| `contact` | Social links (GitHub, LinkedIn). |
| `status` | System diagnostic report. |
| `ping` | Network latency check (Pong!). |
| `weather` | Local meteorology report. |
| `sudo delete` | **[RESTRICTED]** Initiates deletion sequence. |

## 📂 Project Structure

```
├── app/
│   ├── api/            # Server-side routes (e.g., /api/gas)
│   ├── components/     # UI Components (TypedMessage, TerminalInput)
│   ├── context/        # React Context (SystemState)
│   ├── lib/            # Utilities (Firebase, Helpers)
│   ├── text/           # Static content (ASCII Art)
│   ├── layout.tsx      # Root layout (Fonts, Meta)
│   └── page.tsx        # Main Terminal Page
├── public/             # Static Assets (Favicons, SVGs)
├── .dockerignore       # Build exclusion rules
├── Dockerfile          # Container instructions
├── next.config.ts      # Next.js configuration
└── tailwind.config.ts  # Style tokens
```

---
Running on **System 1 v2.0**.
