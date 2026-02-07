import type { ResolverOutput } from "../types.js";

/**
 * Options for README generation.
 */
export interface ReadmeOptions {
	projectName: string;
	domain?: string;
	proxy?: string;
}

/**
 * Generates a comprehensive README.md for the OpenClaw project.
 *
 * Includes: project description, service table, quick start instructions,
 * service URLs, skill packs, and scripts documentation.
 */
export function generateReadme(
	resolved: ResolverOutput,
	options: ReadmeOptions,
): string {
	const { projectName, domain, proxy } = options;
	const sections: string[] = [];

	// ── Title & Description ─────────────────────────────────────────────────

	sections.push(`# ${projectName}

> Self-hosted AI agent infrastructure powered by [OpenClaw](https://openclaw.dev).

This project provides a fully configured Docker Compose stack with ${resolved.services.length} services, ready to deploy on any server.

---`);

	// ── Service Table ────────────────────────────────────────────────────────

	const serviceRows = resolved.services
		.map(({ definition }) => {
			const mainPort = definition.ports.find((p) => p.exposed);
			const url = mainPort
				? domain
					? `https://${definition.id}.${domain}`
					: `http://localhost:${mainPort.host}`
				: "N/A (internal)";
			return `| ${definition.icon} | **${definition.name}** | ${url} | ${definition.description} |`;
		})
		.join("\n");

	sections.push(`## Services

| | Service | URL | Description |
|---|---------|-----|-------------|
${serviceRows}
`);

	// ── Quick Start ──────────────────────────────────────────────────────────

	sections.push(`## Quick Start

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) (v24+)
- [Docker Compose](https://docs.docker.com/compose/install/) (v2+)
- At least ${Math.ceil(resolved.estimatedMemoryMB / 1024)}GB of RAM available

### 1. Configure Environment

\`\`\`bash
cp .env.example .env
\`\`\`

Edit \`.env\` and update any values as needed. Secret values have been pre-generated—review and change them for production use.

### 2. Start Services

\`\`\`bash
docker compose up -d
\`\`\`

Or use the provided start script:

\`\`\`bash
chmod +x scripts/*.sh
./scripts/start.sh
\`\`\`

### 3. Verify

\`\`\`bash
docker compose ps
\`\`\`

All services should show a healthy status within 1–2 minutes.
`);

	// ── Service URLs & Ports ─────────────────────────────────────────────────

	const portRows = resolved.services
		.filter(({ definition }) => definition.ports.length > 0)
		.map(({ definition }) => {
			const ports = definition.ports
				.map((p) => `\`${p.host}\` → \`${p.container}\` (${p.description})`)
				.join(", ");
			return `| ${definition.icon} ${definition.name} | ${ports} |`;
		})
		.join("\n");

	if (portRows) {
		sections.push(`## Ports

| Service | Ports |
|---------|-------|
${portRows}
`);
	}

	// ── Skill Packs ─────────────────────────────────────────────────────────

	const allSkills = resolved.services
		.flatMap(({ definition }) =>
			definition.skills.map((s) => ({
				skillId: s.skillId,
				serviceName: definition.name,
				serviceIcon: definition.icon,
			})),
		);

	if (allSkills.length > 0) {
		const skillRows = allSkills
			.map((s) => `| \`${s.skillId}\` | ${s.serviceIcon} ${s.serviceName} |`)
			.join("\n");

		sections.push(`## Skills

The following OpenClaw skills are automatically installed:

| Skill | Service |
|-------|---------|
${skillRows}

Skills are located in \`openclaw/workspace/skills/\`. Each skill provides a \`SKILL.md\` with usage instructions.
`);
	}

	// ── Proxy Configuration ─────────────────────────────────────────────────

	if (proxy && proxy !== "none") {
		const proxyName = proxy === "caddy" ? "Caddy" : "Traefik";
		sections.push(`## Reverse Proxy

This stack uses **${proxyName}** as a reverse proxy.${domain ? ` All services are available under \`${domain}\`.` : ""}

${proxy === "caddy" ? "The Caddyfile is located at `config/Caddyfile`." : "Traefik configuration is handled via Docker labels."}
`);
	}

	// ── Scripts ──────────────────────────────────────────────────────────────

	sections.push(`## Scripts

| Script | Description |
|--------|-------------|
| \`scripts/start.sh\` | Validates environment and starts all services |
| \`scripts/stop.sh\` | Gracefully stops all services |
| \`scripts/update.sh\` | Pulls latest images and restarts services |
| \`scripts/backup.sh\` | Backs up all named Docker volumes |
| \`scripts/status.sh\` | Shows current status of all services |
`);

	// ── Data & Volumes ──────────────────────────────────────────────────────

	const volumeRows = resolved.services
		.flatMap(({ definition }) =>
			definition.volumes.map((v) => ({
				name: v.name,
				path: v.containerPath,
				description: v.description,
				serviceName: definition.name,
			})),
		);

	if (volumeRows.length > 0) {
		const rows = volumeRows
			.map((v) => `| \`${v.name}\` | ${v.serviceName} | ${v.description} |`)
			.join("\n");

		sections.push(`## Volumes

| Volume | Service | Description |
|--------|---------|-------------|
${rows}

> **Tip:** Use \`scripts/backup.sh\` to back up all volumes before updates.
`);
	}

	// ── Estimated Resources ─────────────────────────────────────────────────

	sections.push(`## Resource Estimates

- **Services:** ${resolved.services.length}
- **Estimated RAM:** ~${(resolved.estimatedMemoryMB / 1024).toFixed(1)}GB
- **Recommended minimum:** ${Math.ceil(resolved.estimatedMemoryMB / 1024) + 2}GB RAM
`);

	// ── Warnings ─────────────────────────────────────────────────────────────

	if (resolved.warnings.length > 0) {
		const warningList = resolved.warnings
			.map((w) => `- ⚠️ ${w.message}`)
			.join("\n");

		sections.push(`## Warnings

${warningList}
`);
	}

	// ── Footer ──────────────────────────────────────────────────────────────

	sections.push(`---

Generated by [OpenClaw](https://openclaw.dev) • ${new Date().toISOString().split("T")[0]}
`);

	return sections.join("\n");
}
