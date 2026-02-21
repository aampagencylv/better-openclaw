---
name: convex-realtime
description: "Query and mutate real-time data using Convex at {{CONVEX_HOST}}:{{CONVEX_PORT}}."
metadata:
  openclaw:
    emoji: "⚡"
---

# Convex Realtime

Convex is available at `http://{{CONVEX_HOST}}:{{CONVEX_PORT}}` within the Docker network.

## Query Data

```bash
curl -X POST "http://{{CONVEX_HOST}}:{{CONVEX_PORT}}/api/query" \
  -H "Content-Type: application/json" \
  -d '{"path": "messages:list", "args": {}}'
```

## Mutate Data

```bash
curl -X POST "http://{{CONVEX_HOST}}:{{CONVEX_PORT}}/api/mutation" \
  -H "Content-Type: application/json" \
  -d '{"path": "messages:send", "args": {"body": "Hello from OpenClaw"}}'
```

## Tips for AI Agents

- Convex provides real-time subscriptions — queries auto-update when data changes.
- Use mutations for writes and queries for reads.
- Scheduled functions enable cron-like background jobs.
