---
name: ghost-publish
description: Professional publishing with Ghost CMS
version: 1.0.0
tags: [cms, blog, publishing, content]
---

# Ghost – Professional Publishing Platform

Ghost is a powerful CMS for professional, SEO-optimised content
publishing with built-in newsletters and memberships.

- **GitHub**: github.com/TryGhost/Ghost (50 000+ ⭐)
- **License**: MIT
- **Security**: Well-maintained. Active security team. No malware.

## Environment Variables

| Variable | Description |
|---|---|
| `{{GHOST_URL}}` | Ghost site URL |
| `{{GHOST_ADMIN_API_KEY}}` | Admin API key |
| `{{GHOST_CONTENT_API_KEY}}` | Content API key |

## Usage Examples

### List posts (Content API)

```bash
curl -s "{{GHOST_URL}}/ghost/api/content/posts/?key={{GHOST_CONTENT_API_KEY}}"
```

### Create a post (Admin API)

```bash
curl -s -X POST "{{GHOST_URL}}/ghost/api/admin/posts/" \
  -H "Authorization: Ghost {{GHOST_ADMIN_API_KEY}}" \
  -H "Content-Type: application/json" \
  -d '{"posts": [{"title": "New Post", "html": "<p>Content here</p>"}]}'
```

## AI Agent Tips

- Content API is read-only for public content; Admin API for CRUD.
- Built-in newsletter system and paid memberships.
- Markdown and HTML editor for content creation.
- SEO-optimised themes with structured data support.
