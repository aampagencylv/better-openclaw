---
name: appwrite-backend
description: Backend-as-a-service with Appwrite
version: 1.0.0
tags: [backend, auth, database, storage, functions]
---

# Appwrite – Open-Source Backend Platform

Appwrite provides databases, authentication, storage, functions,
and messaging as a self-hosted backend-as-a-service platform.

- **GitHub**: github.com/appwrite/appwrite (48 000+ ⭐)
- **License**: BSD-3-Clause
- **Security**: SOC 2 Type 2 compliant. No malware.

## Environment Variables

| Variable | Description |
|---|---|
| `{{APPWRITE_URL}}` | Appwrite endpoint |
| `{{APPWRITE_PROJECT_ID}}` | Project ID |
| `{{APPWRITE_API_KEY}}` | Server-side API key |

## Usage Examples

### List documents

```bash
curl -s "{{APPWRITE_URL}}/v1/databases/<db_id>/collections/<col_id>/documents" \
  -H "X-Appwrite-Project: {{APPWRITE_PROJECT_ID}}" \
  -H "X-Appwrite-Key: {{APPWRITE_API_KEY}}"
```

### Create a user

```bash
curl -s -X POST "{{APPWRITE_URL}}/v1/users" \
  -H "X-Appwrite-Project: {{APPWRITE_PROJECT_ID}}" \
  -H "X-Appwrite-Key: {{APPWRITE_API_KEY}}" \
  -H "Content-Type: application/json" \
  -d '{"userId": "unique()", "email": "user@example.com", "password": "securepass"}'
```

## AI Agent Tips

- Full-featured BaaS: databases, auth, storage, functions, and realtime.
- SDKs for 15+ platforms (Web, Flutter, iOS, Android, etc.).
- Self-hosted with Docker Compose — full data ownership.
- Built-in realtime subscriptions via WebSocket.
