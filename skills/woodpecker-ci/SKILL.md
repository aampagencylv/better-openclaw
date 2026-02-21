---
name: woodpecker-ci
description: Lightweight container-native CI/CD with Woodpecker
version: 1.0.0
tags: [ci-cd, devops, containers, self-hosted]
---

# Woodpecker CI – Container-Native CI/CD

Woodpecker CI is a lightweight, fully open-source CI/CD system
that runs pipeline steps in Docker containers.

- **GitHub**: github.com/woodpecker-ci/woodpecker (5 000+ ⭐)
- **License**: Apache-2.0
- **Security**: Community-driven Drone CI fork. No malware.

## Environment Variables

| Variable | Description |
|---|---|
| `{{WOODPECKER_URL}}` | Base URL of the Woodpecker server |
| `{{WOODPECKER_TOKEN}}` | Personal API token |

## Usage Examples

### List repos

```bash
curl -s "{{WOODPECKER_URL}}/api/user/repos" \
  -H "Authorization: Bearer {{WOODPECKER_TOKEN}}"
```

### Get pipeline status

```bash
curl -s "{{WOODPECKER_URL}}/api/repos/<owner>/<repo>/pipelines/latest" \
  -H "Authorization: Bearer {{WOODPECKER_TOKEN}}"
```

## AI Agent Tips

- Each step runs in its own container for isolation.
- YAML pipeline definitions live alongside your code.
- Supports Gitea, GitHub, GitLab, and Forgejo as Git providers.
- Multi-platform builds (Linux, ARM) via agents.
