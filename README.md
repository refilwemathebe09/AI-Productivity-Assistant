# CostPilot AI

> **Evidence-Grounded Construction Cost Control & Commercial Management Platform**

CostPilot AI is a full-stack, enterprise-grade commercial management and Quantity Surveying (QS) application designed for civil engineering, infrastructure, and commercial building projects. Powered by Google Gemini models, CostPilot AI pairs real-time financial ledgers and contract records with evidence-based intelligence to eliminate budget overruns, streamline variation auditing, and ensure compliance.

---

## Key Capabilities & Modules

### 1. Executive Commercial Dashboard
- **Real-Time Project Health**: Monitor Approved Contract Budget, Total Commitments, Certified Spend, Forecast at Completion (FAC), Net Variance, and Contingency Balances.
- **Visual Financial Progress**: Interactive S-curve tracking, package-by-package spend bars, and risk exposure gauges.
- **Quick Action Bar**: Fast shortcuts for Variation Audits, Interim Payment Notices, Risk Mitigations, and Meeting Summaries.

### 2. Cost Control & Package Ledger
- **Standardized Work Breakdown Structures (WBS)**: Granular package tracking (e.g., Substructure, Superstructure, MEP, Finishes, External Works).
- **Variance Tracking**: Automatic calculation of commitments, actual certified valuations, and projected variances.
- **Variation & Change Order Log**: Track variation claims (VAR-001 to VAR-008), comparing Contractor Claims vs. QS Assessed Values, schedule impacts (EoT), and approval states.

### 3. Evidence-Grounded AI Copilot
- **Deterministic & Verifiable Responses**: Generates structured commercial answers broken down into **Facts**, **Calculations**, **Assumptions**, **Recommendations**, and **Document Citations**.
- **Model Cascading & High Availability**: Connects via `@google/genai` with automatic fallback routing across `gemini-3.7-flash`, `gemini-2.5-flash`, `gemini-flash-latest`, and `gemini-3.1-flash-lite`, with built-in exponential backoff for transient rate limits.
- **Domain-Specific Offline Fallbacks**: Includes a grounded fallback engine based on live project records to guarantee uptime during external network latency.

### 4. Smart Contractual Correspondence & Email Generator
- **Contract-Compliant Notices**: Generates legally sound notices for Interim Payment Certificates (IPC), Variation Confirmations, Delay Damages, and Defect Rectifications.
- **Configurable Tone & Audience**: Adapt notices for Client Finance Desks, Main Contractor Project Managers, or Employer Agents under standard contract conditions (NEC4 / JCT / FIDIC).

### 5. Risk Register & 5x5 Heat Matrix
- **Quantitative Risk Scoring**: Evaluates likelihood (1–5) and impact (1–5) to calculate financial exposures and schedule delay days.
- **Contingency Drawdown Simulator**: Live tracking of the R750k contingency pool versus approved and pending cost variations.
- **Task Conversion**: Convert mitigation strategies directly into actionable schedule tasks with one click.

### 6. Meeting Minute Intelligence
- **Transcript Parser**: Ingests site progress and commercial meeting transcripts to extract agreed variations, payment decisions, and critical deadlines.
- **Action Item Distribution**: Automatically assigns owners, priorities, and deadlines to action items.

### 7. Daily QS Task Planner & Gantt Milestones
- **Interactive Kanban & Milestone Tracker**: Manage operational workflows across Backlog, In Progress, In Review, and Completed.
- **AI Task Optimizer**: Identifies schedule conflicts, batching opportunities, and cutoff deadlines for payment runs.

### 8. Native Multi-Currency Engine (Default: ZAR / South African Rand)
- **South African Rand (ZAR - `R`)**: Standardized baseline across all ledgers, variation claims, risks, and reports.
- **Global Currency Switcher**: Switch on-the-fly to USD (`$`), EUR (`€`), GBP (`£`), AED, AUD, CAD, and more with real-time conversion options.

---

## Tech Stack

- **Frontend**:
  - [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
  - [Tailwind CSS v4](https://tailwindcss.com/)
  - [Motion](https://motion.dev/) (Framer Motion)
  - [Lucide React](https://lucide.dev/) (Icons)
  - [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)
- **Backend**:
  - [Express.js](https://expressjs.com/) (Node.js)
  - [@google/genai SDK](https://www.npmjs.com/package/@google/genai)
  - [tsx](https://github.com/privatenumber/tsx) (Dev execution) & [esbuild](https://esbuild.github.io/) (CJS Production bundling)
- **Build Tool**:
  - [Vite 6](https://vitejs.dev/)

---

## Getting Started

### Prerequisites
- Node.js 18+ or 20+
- npm, pnpm, or bun

### 1. Installation
Clone the repository and install dependencies:
```bash
git clone <repo-url>
cd costpilot-ai
npm install
```

### 2. Environment Configuration
Create a `.env` file in the project root (or set secrets in the environment):
```env
# Google Gemini API Key for AI features
GEMINI_API_KEY=your_gemini_api_key_here

# Application URL (optional, defaults to http://localhost:3000)
APP_URL=http://localhost:3000
```

### 3. Running Locally (Development Mode)
Start the unified full-stack development server on port `3000`:
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:3000`.

### 4. Production Build & Start
Compile client assets and server bundle:
```bash
npm run build
npm start
```

---

## API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Service health status and Gemini client configuration check. |
| `POST` | `/api/ai/chat` | Evidence-grounded commercial Q&A assistant with citations and structured output. |
| `POST` | `/api/ai/email` | Generates contractual letters, notices, and payment reminders. |
| `POST` | `/api/ai/meeting-summarize`| Extracts decisions, variations, and action items from meeting transcripts. |
| `POST` | `/api/ai/task-plan` | Analyzes QS schedules, resolves bottlenecks, and prioritizes daily tasks. |
| `POST` | `/api/ai/report-generate` | Generates structured monthly Cost Value Reconciliation (CVR) reports. |

---

## Project Structure

```text
├── src/
│   ├── components/            # UI Views & Core Components
│   │   ├── AiAssistantView.tsx        # Evidence-grounded commercial AI assistant
│   │   ├── CostControlView.tsx        # WBS ledger, cost codes & variation tracker
│   │   ├── DashboardView.tsx          # Executive KPIs, charts & quick actions
│   │   ├── DocumentsView.tsx          # Contract & specification document vault
│   │   ├── EvidenceCitationModal.tsx  # Document citation & audit drilldown modal
│   │   ├── Header.tsx                 # Top navigation, project selector & currency switcher
│   │   ├── IntegrationsView.tsx       # ERP, Procore, and CDE connectors
│   │   ├── MeetingsView.tsx           # Minutes, transcript summaries & decisions
│   │   ├── ReportsView.tsx            # Executive monthly report generation
│   │   ├── RiskRegisterView.tsx       # 5x5 Probability/Impact risk heat matrix
│   │   ├── ScheduleTasksView.tsx      # Kanban board, Gantt milestones & task conflicts
│   │   ├── SettingsView.tsx           # Preferences, currency defaults & project metadata
│   │   ├── Sidebar.tsx                # Main application navigation menu
│   │   ├── SmartEmailView.tsx         # Contractual correspondence & notices
│   │   └── TaskPlannerView.tsx        # Daily QS routine & schedule optimization
│   ├── context/
│   │   └── CurrencyContext.tsx        # Global currency state, formatting & conversions
│   ├── data/
│   │   └── sampleProject.ts           # Baseline project model, WBS packages, claims & risks
│   ├── utils/
│   │   └── currency.ts                # Currency configurations, symbols & compact formatters
│   ├── types.ts                       # Shared TypeScript domain interfaces & types
│   ├── App.tsx                        # Application root layout & view state router
│   ├── main.tsx                       # React application bootstrap
│   └── index.css                      # Global styles & Tailwind CSS v4 entry point
├── server.ts                          # Express backend with Gemini API proxy & Vite middleware
├── metadata.json                      # AI Studio platform configuration
├── vite.config.ts                     # Vite build configuration
├── package.json                       # Dependencies and build scripts
└── README.md                          # Project documentation
```

---

## License

This project is licensed under the MIT License.
