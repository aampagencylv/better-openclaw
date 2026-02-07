import type {
	GeneratedFiles,
	GenerationInput,
	GenerationResult,
	ResolverInput,
} from "./types.js";
import { resolve } from "./resolver.js";
import { composeMultiFile } from "./composer.js";
import { validate } from "./validator.js";
import { generateEnvFiles } from "./generators/env.js";
import { generateSkillFiles } from "./generators/skills.js";
import { generateReadme } from "./generators/readme.js";
import { generateScripts } from "./generators/scripts.js";
import { generateCaddyfile } from "./generators/caddy.js";
import { generatePrometheusConfig } from "./generators/prometheus.js";
import { generateGrafanaConfig, generateGrafanaDashboard } from "./generators/grafana.js";
import { generateN8nWorkflows } from "./generators/n8n-workflows.js";

/**
 * Main orchestration function: takes generation input, resolves dependencies,
 * generates all files, validates, and returns the complete file tree.
 */
export function generate(input: GenerationInput): GenerationResult {
	// 1. Resolve dependencies
	const resolverInput: ResolverInput = {
		services: input.services,
		skillPacks: input.skillPacks,
		proxy: input.proxy,
		gpu: input.gpu,
		platform: input.platform,
		monitoring: input.monitoring,
	};
	const resolved = resolve(resolverInput);

	if (!resolved.isValid) {
		throw new Error(
			`Invalid stack configuration: ${resolved.errors.map((e) => e.message).join("; ")}`,
		);
	}

	// 2. Generate Docker Compose YAML (multi-file)
	const composeOptions = {
		projectName: input.projectName,
		proxy: input.proxy,
		domain: input.domain,
		gpu: input.gpu,
		platform: input.platform,
		deployment: input.deployment,
		openclawVersion: input.openclawVersion,
	};
	const composeResult = composeMultiFile(resolved, composeOptions);

	// 3. Validate (using the base docker-compose.yml)
	const validation = validate(resolved, composeResult.files["docker-compose.yml"] ?? "", {
		domain: input.domain,
		generateSecrets: input.generateSecrets,
	});
	if (!validation.valid) {
		throw new Error(
			`Validation failed: ${validation.errors.map((e) => e.message).join("; ")}`,
		);
	}

	// 4. Generate all files
	const files: GeneratedFiles = {};

	// Docker Compose (multi-file output)
	for (const [filename, content] of Object.entries(composeResult.files)) {
		files[filename] = content;
	}

	// Environment files
	const envFiles = generateEnvFiles(resolved, {
		generateSecrets: input.generateSecrets,
		domain: input.domain,
		openclawVersion: input.openclawVersion,
	});
	files[".env.example"] = envFiles.envExample;
	files[".env"] = envFiles.env;

	// .gitignore
	files[".gitignore"] = [
		".env",
		".env.local",
		".env.*.local",
		"*.log",
		"docker-compose.override.yml",
	].join("\n");

	// Skills
	const skillFiles = generateSkillFiles(resolved);
	for (const [path, content] of Object.entries(skillFiles)) {
		files[path] = content;
	}

	// README
	files["README.md"] = generateReadme(resolved, {
		projectName: input.projectName,
		domain: input.domain,
		proxy: input.proxy,
	});

	// Scripts
	const scripts = generateScripts();
	for (const [path, content] of Object.entries(scripts)) {
		files[path] = content;
	}

	// n8n workflows
	const n8nWorkflows = generateN8nWorkflows(resolved);
	for (const [path, content] of Object.entries(n8nWorkflows)) {
		files[path] = content;
	}

	// Caddy config
	if (input.proxy === "caddy" && input.domain) {
		files["caddy/Caddyfile"] = generateCaddyfile(resolved, input.domain);
	}

	// Prometheus config
	const hasPrometheus = resolved.services.some((s) => s.definition.id === "prometheus");
	if (hasPrometheus) {
		files["prometheus/prometheus.yml"] = generatePrometheusConfig(resolved);
	}

	// Grafana config
	const hasGrafana = resolved.services.some((s) => s.definition.id === "grafana");
	if (hasGrafana) {
		const grafanaFiles = generateGrafanaConfig();
		for (const [path, content] of Object.entries(grafanaFiles)) {
			files[path] = content;
		}
		// Grafana dashboard
		files["config/grafana/dashboards/openclaw-stack-overview.json"] = generateGrafanaDashboard();
	}

	// Docker Compose override (empty template)
	files["docker-compose.override.yml"] = [
		"# Local overrides for docker-compose.yml",
		"# This file is gitignored — use it for personal port changes, extra volumes, etc.",
		"services: {}",
		"",
	].join("\n");

	// SERVICES.md documentation
	files["docs/SERVICES.md"] = generateServicesDoc(resolved);

	// 5. Calculate metadata
	const skillCount = resolved.services.reduce(
		(sum, s) => sum + s.definition.skills.length,
		0,
	);

	return {
		files,
		metadata: {
			serviceCount: resolved.services.length,
			skillCount,
			estimatedMemoryMB: resolved.estimatedMemoryMB,
			generatedAt: new Date().toISOString(),
		},
	};
}

function generateServicesDoc(resolved: import("./types.js").ResolverOutput): string {
	const lines: string[] = [
		"# Service Reference",
		"",
		"This document describes all companion services in your OpenClaw stack.",
		"",
	];

	for (const svc of resolved.services) {
		const def = svc.definition;
		lines.push(`## ${def.icon} ${def.name}`);
		lines.push("");
		lines.push(def.description);
		lines.push("");
		lines.push(`- **Image**: \`${def.image}:${def.imageTag}\``);
		lines.push(`- **Category**: ${def.category}`);
		lines.push(`- **Maturity**: ${def.maturity}`);
		if (def.minMemoryMB) {
			lines.push(`- **Min Memory**: ${def.minMemoryMB}MB`);
		}
		if (def.ports.length > 0) {
			lines.push("- **Ports**:");
			for (const p of def.ports) {
				lines.push(`  - \`${p.container}\` — ${p.description}${p.exposed ? "" : " (internal only)"}`);
			}
		}
		lines.push(`- **Docs**: ${def.docsUrl}`);
		lines.push("");
	}

	return lines.join("\n");
}
