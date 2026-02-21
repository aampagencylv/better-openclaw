---
name: dns-lookup
description: "Perform DNS resolution and record lookups."
metadata:
  openclaw:
    emoji: "🔍"
---

# DNS Lookup

Resolve DNS records for domain names.

## Lookup Records

```bash
# A records
dig example.com A +short

# MX records
dig example.com MX +short

# TXT records
dig example.com TXT +short

# All records
dig example.com ANY +noall +answer
```

## Tips for AI Agents

- Use `+short` for concise output.
- Use `@8.8.8.8` to query specific DNS servers.
- `nslookup` is an alternative for simpler lookups.
