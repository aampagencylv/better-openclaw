---
name: plausible-analytics
description: Privacy-friendly web analytics with Plausible
version: 1.0.0
tags: [analytics, privacy, web, self-hosted]
---

# Plausible – Privacy-Friendly Analytics

Plausible is a lightweight, open-source alternative to Google Analytics
that respects user privacy — no cookies, fully GDPR compliant.

- **GitHub**: github.com/plausible/analytics (22 000+ ⭐)
- **License**: AGPL-3.0
- **Security**: Cookie-less. GDPR/CCPA/PECR compliant. No malware.

## Environment Variables

| Variable | Description |
|---|---|
| `{{PLAUSIBLE_URL}}` | Base URL of Plausible |
| `{{PLAUSIBLE_API_KEY}}` | Stats API key |

## Usage Examples

### Get site stats

```bash
curl -s "{{PLAUSIBLE_URL}}/api/v1/stats/aggregate?site_id=example.com&period=30d&metrics=visitors,pageviews" \
  -H "Authorization: Bearer {{PLAUSIBLE_API_KEY}}"
```

### Get top pages

```bash
curl -s "{{PLAUSIBLE_URL}}/api/v1/stats/breakdown?site_id=example.com&period=7d&property=event:page" \
  -H "Authorization: Bearer {{PLAUSIBLE_API_KEY}}"
```

## AI Agent Tips

- Script is < 1 KB — no impact on page load speed.
- No cookies means no consent banners needed.
- Stats API provides breakdowns by page, source, country, device.
- Self-hosted with ClickHouse backend for fast queries.
