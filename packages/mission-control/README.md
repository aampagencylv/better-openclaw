# @better-openclaw/mission-control

Real-time agent oversight dashboard for Better OpenClaw. Built with **Vite + React + Convex + Tailwind CSS**.

## Features

- 🎯 **Kanban Mission Queue** — Inbox → Assigned → In Progress → Review → Done
- 🤖 **Agent Sidebar** — Real-time agent status, roles, and quick task assignment
- 📄 **Document Browser** — Files created by agents with preview and conversation context
- 📡 **Live Activity Feed** — Real-time stream of agent actions and status updates
- 🔗 **OpenClaw Integration** — Webhook handler that auto-creates tasks from agent runs
- 🔒 **Auth** — Convex Auth with email/password
- 📱 **Responsive** — Drawer-based sidebars on mobile

## Quick Start

### Prerequisites

- Node.js ≥ 20
- A [Convex](https://convex.dev) account (free tier works)

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Set Up Convex

```bash
cd packages/mission-control
npx convex dev --once   # Creates your Convex project
```

This generates a `.env.local` file with your `VITE_CONVEX_URL`.

### 3. Seed Sample Data (Optional)

```bash
npx convex run seed:run
```

### 4. Start Development

```bash
pnpm dev
```

This runs both the Vite dev server (port 3660) and Convex dev in parallel.

### 5. Install OpenClaw Hook (Automatic)

```bash
npm run setup
# or: npm run setup -- --url https://your-project.convex.site/openclaw/event
```

This copies the hook handler to `~/.openclaw/hooks/mission-control/` and updates your OpenClaw config.

## Architecture

```
packages/mission-control/
├── convex/              # Convex backend
│   ├── schema.ts        # Database schema (agents, tasks, messages, etc.)
│   ├── openclaw.ts      # Webhook mutation for OpenClaw events
│   ├── http.ts          # HTTP endpoint: POST /openclaw/event
│   ├── queries.ts       # Read queries (listAgents, listTasks, etc.)
│   ├── tasks.ts         # Task mutations (create, update, archive)
│   ├── agents.ts        # Agent mutations (CRUD)
│   ├── documents.ts     # Document queries and mutations
│   ├── messages.ts      # Message send mutation
│   └── seed.ts          # Sample data seeder
├── hooks/               # OpenClaw hook
│   └── mission-control/
│       ├── handler.ts   # Event capture and webhook POST
│       └── HOOK.md      # Hook metadata
├── src/                 # React frontend
│   ├── main.tsx         # Entry point with ConvexAuthProvider
│   ├── App.tsx          # Main layout orchestrator
│   ├── index.css        # Design system (Tailwind v4 + custom vars)
│   └── components/      # UI components
│       ├── Header.tsx
│       ├── AgentsSidebar.tsx
│       ├── MissionQueue.tsx
│       ├── KanbanColumn.tsx
│       ├── TaskCard.tsx
│       ├── TaskDetailPanel.tsx
│       ├── AddTaskModal.tsx
│       ├── AddAgentModal.tsx
│       ├── AgentDetailTray.tsx
│       ├── SignIn.tsx
│       ├── RightSidebar/
│       └── Trays/
├── setup.mjs            # Auto-install hook script
├── vite.config.ts
└── package.json
```

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `VITE_CONVEX_URL` | Convex deployment URL | Set by `npx convex dev` |
| `MISSION_CONTROL_URL` | Webhook endpoint for hook | `http://127.0.0.1:3211/openclaw/event` |

## Docker

```bash
docker build -t mission-control .
docker run -p 3660:3660 mission-control
```

> **Note**: The Docker image serves the static SPA build. You still need a running Convex backend.
