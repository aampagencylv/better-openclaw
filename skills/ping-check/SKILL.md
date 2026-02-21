---
name: ping-check
description: "Check host reachability and network latency."
metadata:
  openclaw:
    emoji: "📡"
---

# Ping Check

Test connectivity to hosts within the Docker network.

## Ping Host

```bash
# Check reachability
ping -c 4 hostname

# Quick check with timeout
ping -c 1 -W 2 hostname
```

## Tips for AI Agents

- Use `-c` to limit the number of pings.
- Use `-W` for timeout in seconds.
- Ping may be blocked by firewalls — use `nc` or `curl` as alternatives.
