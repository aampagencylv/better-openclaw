---
name: strapi-cms
description: Customisable headless CMS with Strapi
version: 1.0.0
tags: [cms, api, headless, content-management]
---

# Strapi – Headless CMS

Strapi is the leading open-source headless CMS with a visual
content-type builder, REST/GraphQL APIs, and plugin ecosystem.

- **GitHub**: github.com/strapi/strapi (67 000+ ⭐)
- **License**: MIT (Community Edition)
- **Security**: 100M+ downloads. Enterprise-grade. No malware.

## Environment Variables

| Variable | Description |
|---|---|
| `{{STRAPI_URL}}` | Base URL |
| `{{STRAPI_API_TOKEN}}` | API token |

## Usage Examples

### List entries

```bash
curl -s "{{STRAPI_URL}}/api/articles" \
  -H "Authorization: Bearer {{STRAPI_API_TOKEN}}"
```

### Create an entry

```bash
curl -s -X POST "{{STRAPI_URL}}/api/articles" \
  -H "Authorization: Bearer {{STRAPI_API_TOKEN}}" \
  -H "Content-Type: application/json" \
  -d '{"data": {"title": "New Post", "body": "Content"}}'
```

## AI Agent Tips

- Visual content-type builder — no code needed for schema design.
- Auto-generates REST and GraphQL endpoints.
- Plugin marketplace for SEO, i18n, roles, and more.
- Self-hosted with full control over data and customisation.
