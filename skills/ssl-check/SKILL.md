---
name: ssl-check
description: "Check SSL certificates and TLS configuration for domains."
metadata:
  openclaw:
    emoji: "🛡️"
---

# SSL Certificate Check

Verify SSL certificates and TLS configurations.

## Check Certificate

```bash
echo | openssl s_client -connect example.com:443 -servername example.com 2>/dev/null | openssl x509 -noout -dates -subject -issuer
```

## Check Expiration

```bash
echo | openssl s_client -connect example.com:443 2>/dev/null | openssl x509 -noout -enddate
```

## Tips for AI Agents

- Check certificate chains with `-showcerts` flag.
- Use `-tls1_2` or `-tls1_3` to test specific TLS versions.
- Monitor certificates expiring within 30 days for renewal alerts.
