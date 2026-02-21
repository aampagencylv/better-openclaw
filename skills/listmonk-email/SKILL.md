---
name: listmonk-email
description: Self-hosted newsletter and mailing list with Listmonk
version: 1.0.0
tags: [email, newsletter, marketing, self-hosted]
---

# Listmonk – Self-Hosted Newsletter Manager

Listmonk is a high-performance, self-hosted newsletter and mailing
list manager with a modern admin UI and powerful templating.

- **GitHub**: github.com/knadh/listmonk (16 000+ ⭐)
- **License**: AGPL-3.0
- **Security**: Single Go binary. No telemetry. No malware.

## Environment Variables

| Variable | Description |
|---|---|
| `{{LISTMONK_URL}}` | Base URL |
| `{{LISTMONK_USER}}` | Admin username |
| `{{LISTMONK_PASSWORD}}` | Admin password |

## Usage Examples

### List subscribers

```bash
curl -s -u "{{LISTMONK_USER}}:{{LISTMONK_PASSWORD}}" \
  "{{LISTMONK_URL}}/api/subscribers"
```

### Create a campaign

```bash
curl -s -X POST -u "{{LISTMONK_USER}}:{{LISTMONK_PASSWORD}}" \
  "{{LISTMONK_URL}}/api/campaigns" \
  -H "Content-Type: application/json" \
  -d '{"name": "Weekly Update", "subject": "Weekly Digest", "lists": [1], "type": "regular", "content_type": "richtext", "body": "<p>Hello!</p>"}'
```

## AI Agent Tips

- Handles millions of subscribers with minimal resources.
- Go + PostgreSQL backend — single binary deployment.
- Template variables and dynamic content for personalisation.
- Bounce and DKIM/SPF management built-in.
