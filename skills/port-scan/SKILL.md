---
name: port-scan
description: "Scan network ports to check service availability."
metadata:
  openclaw:
    emoji: "🔌"
---

# Port Scan

Scan network ports within the Docker network.

## Check Port

```bash
# Check if port is open
nc -zv hostname 80

# Scan port range
nc -zv hostname 80-443
```

## Tips for AI Agents

- Use `nc` (netcat) for quick single-port checks.
- Use this to verify service health within the Docker network.
- Always scan only internal services — never scan external hosts without permission.
