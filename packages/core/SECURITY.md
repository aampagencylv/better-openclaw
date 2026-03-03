# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 5.1.x   | :white_check_mark: |
| 5.0.x   | :x:                |
| 4.0.x   | :white_check_mark: |
| < 4.0   | :x:                |


## Reporting a Vulnerability

If you discover a security vulnerability in better-openclaw, please report it responsibly.

**Do NOT open a public GitHub issue for security vulnerabilities.**

### How to Report

1. **Email**: Send details to [bachir@bidew.io](mailto:bachir@bidew.io)
2. **GitHub Security Advisories**: Use the [private vulnerability reporting](https://github.com/bidewio/better-openclaw/security/advisories/new) feature

### What to Include

- Description of the vulnerability
- Steps to reproduce
- Impact assessment
- Suggested fix (if any)

### Response Timeline

- **Acknowledgement**: Within 48 hours
- **Initial Assessment**: Within 1 week
- **Fix & Disclosure**: Coordinated with reporter, typically within 30 days

### Scope

The following are in scope:

- `@better-openclaw/core` — service definitions, resolver, composer, generators
- `@better-openclaw/mcp` — MCP server
- `create-better-openclaw` — CLI tool
- `@better-openclaw/api` — REST API
- Generated Docker Compose files and scripts
- Secret generation logic

### Out of Scope

- Third-party Docker images referenced by service definitions
- Vulnerabilities in upstream dependencies (report to the upstream project)
- The hosted website (better-openclaw.dev) infrastructure

## Security Best Practices

When using better-openclaw:

- Always review generated `.env` files before deploying
- Never commit `.env` files to version control
- Use `--generate-secrets` (default) to create unique passwords per stack
- Keep Docker images updated (`docker compose pull`)
- Use a reverse proxy (Caddy/Traefik) with TLS in production
