# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x     | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability in better-openclaw, please report it responsibly.

**Do NOT open a public GitHub issue for security vulnerabilities.**

### How to Report

1. **Email**: Send details to [bachir@bidew.io](mailto:bachir@bidew.io)
2. **GitHub Security Advisories**: Use the [private vulnerability reporting](https://github.com/bidewio/better-openclaw/security/advisories/new) feature

### Required in Reports

1. **Title**
2. **Severity Assessment**
3. **Impact**
4. **Affected Component**
5. **Technical Reproduction**
6. **Demonstrated Impact**
7. **Environment**
8. **Remediation Advice**

Reports without reproduction steps, demonstrated impact, and remediation advice will be deprioritized. Given the volume of AI-generated scanner findings, we must ensure we're receiving vetted reports from researchers who understand the issues.

### What to Include

- Exact vulnerable path (`file`, function, and line range) on a current revision
- Tested version details (better-openclaw version and/or commit SHA)
- Reproducible PoC against latest `main` or latest released version
- Demonstrated impact specific to better-openclaw
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
- Scanner-only claims against stale/nonexistent paths, or claims without a working repro
- Exposed secrets that are third-party/user-controlled credentials (not better-openclaw-owned and not granting access to better-openclaw-operated infrastructure/services)

## Security Best Practices

When using better-openclaw:

- Always review generated `.env` files before deploying
- Never commit `.env` files to version control
- Use `--generate-secrets` (default) to create unique passwords per stack
- Keep Docker images updated (`docker compose pull`)
- Use a reverse proxy (Caddy/Traefik) with TLS in production
- Review generated Docker Compose files for security implications
- Use dedicated networks for service isolation
- Follow principle of least privilege when configuring services

## Security Scanning

This project uses `detect-secrets` for automated secret detection in CI/CD.
See `.detect-secrets.cfg` for configuration and `.secrets.baseline` for the baseline.

Run locally:

```bash
pip install detect-secrets==1.5.0
detect-secrets scan --baseline .secrets.baseline
```

To update the baseline after adding legitimate high-entropy strings:

```bash
detect-secrets scan --baseline .secrets.baseline --update
```
