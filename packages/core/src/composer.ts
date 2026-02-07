import { stringify } from "yaml";
import type { ComposeOptions, ResolverOutput, ServiceCategory } from "./types.js";

// ── Public Types ────────────────────────────────────────────────────────────

export interface ComposeResult {
	files: Record<string, string>; // filename -> YAML content
	mainFile: string; // "docker-compose.yml"
	profiles: string[]; // list of profiles used
}

// ── Category → Profile Mapping ──────────────────────────────────────────────

const CATEGORY_PROFILE_MAP: Partial<Record<ServiceCategory, { file: string; profile: string }>> = {
	ai: { file: "docker-compose.ai.yml", profile: "ai" },
	"ai-platform": { file: "docker-compose.ai.yml", profile: "ai" },
	media: { file: "docker-compose.media.yml", profile: "media" },
	monitoring: { file: "docker-compose.monitoring.yml", profile: "monitoring" },
	analytics: { file: "docker-compose.monitoring.yml", profile: "monitoring" },
	"dev-tools": { file: "docker-compose.tools.yml", profile: "tools" },
	"coding-agent": { file: "docker-compose.tools.yml", profile: "tools" },
	"social-media": { file: "docker-compose.social.yml", profile: "social" },
	knowledge: { file: "docker-compose.knowledge.yml", profile: "knowledge" },
	communication: { file: "docker-compose.communication.yml", profile: "communication" },
};

const YAML_OPTIONS = { lineWidth: 120, nullStr: "" };

/**
 * Generates a Docker Compose YAML string from resolved services and options.
 *
 * Uses Docker Compose v3.8 conventions (no `version` field).
 * The OpenClaw gateway is always the first service, followed by companion
 * services in their topologically-sorted order.
 *
 * Returns a single YAML string with ALL services in one file (backward-compatible).
 */
export function compose(resolved: ResolverOutput, options: ComposeOptions): string {
	const services: Record<string, Record<string, unknown>> = {};
	const allVolumes = new Set<string>(["openclaw-config", "openclaw-workspace"]);

	// ── Collect gateway environment & volume mounts from all companion services ──

	const gatewayEnv: Record<string, string> = {
		HOME: "/home/node",
		TERM: "xterm-256color",
		OPENCLAW_GATEWAY_TOKEN: "${OPENCLAW_GATEWAY_TOKEN}",
	};

	const gatewayVolumes: string[] = [
		"openclaw-config:/home/node/.openclaw",
		"openclaw-workspace:/home/node/.openclaw/workspace",
	];

	for (const { definition: def } of resolved.services) {
		for (const env of def.openclawEnvVars) {
			gatewayEnv[env.key] = env.secret ? `\${${env.key}}` : env.defaultValue;
		}
		if (def.openclawVolumeMounts) {
			for (const vol of def.openclawVolumeMounts) {
				allVolumes.add(vol.name);
				gatewayVolumes.push(`${vol.name}:${vol.containerPath}`);
			}
		}
	}

	// ── Gateway depends_on (all companion services) ──

	const gatewayDependsOn: Record<string, { condition: string }> = {};
	for (const { definition: def } of resolved.services) {
		gatewayDependsOn[def.id] = {
			condition: def.healthcheck ? "service_healthy" : "service_started",
		};
	}

	// ── OpenClaw Gateway (always first) ──

	const gateway: Record<string, unknown> = {
		image: `ghcr.io/openclaw/openclaw:\${OPENCLAW_VERSION:-${options.openclawVersion}}`,
		environment: gatewayEnv,
		volumes: gatewayVolumes,
		ports: ["${OPENCLAW_GATEWAY_PORT:-18789}:18789"],
		networks: ["openclaw-network"],
		init: true,
		restart: "unless-stopped",
	};

	if (Object.keys(gatewayDependsOn).length > 0) {
		gateway.depends_on = gatewayDependsOn;
	}

	services["openclaw-gateway"] = gateway;

	// ── Companion Services ──

	for (const { definition: def } of resolved.services) {
		const svc: Record<string, unknown> = {};

		// Image
		svc.image = `${def.image}:${def.imageTag}`;

		// Environment — secrets use ${KEY} syntax, non-secrets use defaultValue
		if (def.environment.length > 0) {
			const env: Record<string, string> = {};
			for (const e of def.environment) {
				env[e.key] = e.secret ? `\${${e.key}}` : e.defaultValue;
			}
			svc.environment = env;
		}

		// Ports – only exposed ports are host-mapped
		const exposedPorts = def.ports.filter((p) => p.exposed);
		if (exposedPorts.length > 0) {
			const prefix = def.id.toUpperCase().replace(/-/g, "_");
			svc.ports = exposedPorts.map((p, i) => {
				const suffix = exposedPorts.length > 1 ? `_${i}` : "";
				return `\${${prefix}_PORT${suffix}:-${p.host}}:${p.container}`;
			});
		}

		// Volumes
		if (def.volumes.length > 0) {
			svc.volumes = def.volumes.map((v) => {
				allVolumes.add(v.name);
				return `${v.name}:${v.containerPath}`;
			});
		}

		// Health check
		if (def.healthcheck) {
			const hc: Record<string, unknown> = {
				test: ["CMD-SHELL", def.healthcheck.test],
				interval: def.healthcheck.interval,
				timeout: def.healthcheck.timeout,
				retries: def.healthcheck.retries,
			};
			if (def.healthcheck.startPeriod) {
				hc.start_period = def.healthcheck.startPeriod;
			}
			svc.healthcheck = hc;
		}

		// Restart policy
		svc.restart = def.restartPolicy;

		// Networks
		svc.networks = def.networks;

		// Command & entrypoint
		if (def.command) {
			svc.command = def.command;
		}
		if (def.entrypoint) {
			svc.entrypoint = def.entrypoint;
		}

		// Labels
		if (def.labels && Object.keys(def.labels).length > 0) {
			svc.labels = def.labels;
		}

		// Deploy + GPU passthrough
		let deploy: Record<string, unknown> | undefined;

		if (def.deploy) {
			deploy = JSON.parse(JSON.stringify(def.deploy)) as Record<string, unknown>;
		}

		if (options.gpu && def.gpuRequired) {
			const base = deploy ?? {};
			const resources = (base.resources ?? {}) as Record<string, unknown>;
			deploy = {
				...base,
				resources: {
					...resources,
					reservations: {
						...((resources.reservations as Record<string, unknown>) ?? {}),
						devices: [
							{
								driver: "nvidia",
								count: "all",
								capabilities: ["gpu"],
							},
						],
					},
				},
			};
		}

		if (deploy) {
			svc.deploy = deploy;
		}

		// Depends on (from definition's dependsOn field)
		const depIds = def.dependsOn.filter((id) => resolved.services.some((s) => s.definition.id === id));
		if (depIds.length > 0) {
			const dependsOn: Record<string, { condition: string }> = {};
			for (const depId of depIds) {
				const dep = resolved.services.find((s) => s.definition.id === depId);
				dependsOn[depId] = {
					condition: dep?.definition.healthcheck ? "service_healthy" : "service_started",
				};
			}
			svc.depends_on = dependsOn;
		}

		services[def.id] = svc;
	}

	// ── Top-level volumes ──

	const volumes: Record<string, null> = {};
	for (const v of [...allVolumes].sort()) {
		volumes[v] = null;
	}

	// ── Top-level networks ──

	const networks = {
		"openclaw-network": { driver: "bridge" },
	};

	// ── Serialize to YAML ──

	return stringify({ services, volumes, networks }, YAML_OPTIONS);
}

/**
 * Generates multiple Docker Compose files, splitting services into profile-based
 * override files by category.
 *
 * Core / infrastructure services stay in the base `docker-compose.yml`.
 * Category-specific services are placed in dedicated override files with
 * Docker Compose `profiles` so they can be activated selectively.
 */
export function composeMultiFile(resolved: ResolverOutput, options: ComposeOptions): ComposeResult {
	const allVolumes = new Set<string>(["openclaw-config", "openclaw-workspace"]);

	// ── Collect gateway environment & volume mounts from all companion services ──

	const gatewayEnv: Record<string, string> = {
		HOME: "/home/node",
		TERM: "xterm-256color",
		OPENCLAW_GATEWAY_TOKEN: "${OPENCLAW_GATEWAY_TOKEN}",
	};

	const gatewayVolumes: string[] = [
		"openclaw-config:/home/node/.openclaw",
		"openclaw-workspace:/home/node/.openclaw/workspace",
	];

	for (const { definition: def } of resolved.services) {
		for (const env of def.openclawEnvVars) {
			gatewayEnv[env.key] = env.secret ? `\${${env.key}}` : env.defaultValue;
		}
		if (def.openclawVolumeMounts) {
			for (const vol of def.openclawVolumeMounts) {
				allVolumes.add(vol.name);
				gatewayVolumes.push(`${vol.name}:${vol.containerPath}`);
			}
		}
	}

	// ── Build all companion service entries & classify by category ──

	interface ServiceInfo {
		id: string;
		category: ServiceCategory;
		entry: Record<string, unknown>;
		volumeNames: string[];
	}

	const serviceInfos: ServiceInfo[] = [];

	for (const { definition: def } of resolved.services) {
		const svc: Record<string, unknown> = {};

		// Image
		svc.image = `${def.image}:${def.imageTag}`;

		// Environment — secrets use ${KEY} syntax, non-secrets use defaultValue
		if (def.environment.length > 0) {
			const env: Record<string, string> = {};
			for (const e of def.environment) {
				env[e.key] = e.secret ? `\${${e.key}}` : e.defaultValue;
			}
			svc.environment = env;
		}

		// Ports – only exposed ports are host-mapped
		const exposedPorts = def.ports.filter((p) => p.exposed);
		if (exposedPorts.length > 0) {
			const prefix = def.id.toUpperCase().replace(/-/g, "_");
			svc.ports = exposedPorts.map((p, i) => {
				const suffix = exposedPorts.length > 1 ? `_${i}` : "";
				return `\${${prefix}_PORT${suffix}:-${p.host}}:${p.container}`;
			});
		}

		// Volumes
		const volumeNames: string[] = [];
		if (def.volumes.length > 0) {
			svc.volumes = def.volumes.map((v) => {
				allVolumes.add(v.name);
				volumeNames.push(v.name);
				return `${v.name}:${v.containerPath}`;
			});
		}

		// Health check
		if (def.healthcheck) {
			const hc: Record<string, unknown> = {
				test: ["CMD-SHELL", def.healthcheck.test],
				interval: def.healthcheck.interval,
				timeout: def.healthcheck.timeout,
				retries: def.healthcheck.retries,
			};
			if (def.healthcheck.startPeriod) {
				hc.start_period = def.healthcheck.startPeriod;
			}
			svc.healthcheck = hc;
		}

		// Restart policy
		svc.restart = def.restartPolicy;

		// Networks
		svc.networks = def.networks;

		// Command & entrypoint
		if (def.command) {
			svc.command = def.command;
		}
		if (def.entrypoint) {
			svc.entrypoint = def.entrypoint;
		}

		// Labels
		if (def.labels && Object.keys(def.labels).length > 0) {
			svc.labels = def.labels;
		}

		// Deploy + GPU passthrough
		let deploy: Record<string, unknown> | undefined;

		if (def.deploy) {
			deploy = JSON.parse(JSON.stringify(def.deploy)) as Record<string, unknown>;
		}

		if (options.gpu && def.gpuRequired) {
			const base = deploy ?? {};
			const resources = (base.resources ?? {}) as Record<string, unknown>;
			deploy = {
				...base,
				resources: {
					...resources,
					reservations: {
						...((resources.reservations as Record<string, unknown>) ?? {}),
						devices: [
							{
								driver: "nvidia",
								count: "all",
								capabilities: ["gpu"],
							},
						],
					},
				},
			};
		}

		if (deploy) {
			svc.deploy = deploy;
		}

		// Depends on (from definition's dependsOn field)
		const depIds = def.dependsOn.filter((id) => resolved.services.some((s) => s.definition.id === id));
		if (depIds.length > 0) {
			const dependsOn: Record<string, { condition: string }> = {};
			for (const depId of depIds) {
				const dep = resolved.services.find((s) => s.definition.id === depId);
				dependsOn[depId] = {
					condition: dep?.definition.healthcheck ? "service_healthy" : "service_started",
				};
			}
			svc.depends_on = dependsOn;
		}

		serviceInfos.push({ id: def.id, category: def.category, entry: svc, volumeNames });
	}

	// ── Partition services into base vs. profile files ──

	const baseServiceIds = new Set<string>();
	const profileFileMap: Record<string, { profile: string; services: ServiceInfo[] }> = {};

	for (const info of serviceInfos) {
		const mapping = CATEGORY_PROFILE_MAP[info.category];
		if (mapping) {
			if (!profileFileMap[mapping.file]) {
				profileFileMap[mapping.file] = { profile: mapping.profile, services: [] };
			}
			profileFileMap[mapping.file]!.services.push(info);
		} else {
			baseServiceIds.add(info.id);
		}
	}

	// ── Gateway depends_on (only base services) ──

	const gatewayDependsOn: Record<string, { condition: string }> = {};
	for (const { definition: def } of resolved.services) {
		if (baseServiceIds.has(def.id)) {
			gatewayDependsOn[def.id] = {
				condition: def.healthcheck ? "service_healthy" : "service_started",
			};
		}
	}

	// ── OpenClaw Gateway (always in the base file) ──

	const gateway: Record<string, unknown> = {
		image: `ghcr.io/openclaw/openclaw:\${OPENCLAW_VERSION:-${options.openclawVersion}}`,
		environment: gatewayEnv,
		volumes: gatewayVolumes,
		ports: ["${OPENCLAW_GATEWAY_PORT:-18789}:18789"],
		networks: ["openclaw-network"],
		init: true,
		restart: "unless-stopped",
	};

	if (Object.keys(gatewayDependsOn).length > 0) {
		gateway.depends_on = gatewayDependsOn;
	}

	// ── Base file: gateway + core services + ALL volumes + networks ──

	const baseServices: Record<string, Record<string, unknown>> = {
		"openclaw-gateway": gateway,
	};

	for (const info of serviceInfos) {
		if (baseServiceIds.has(info.id)) {
			baseServices[info.id] = info.entry;
		}
	}

	const sortedAllVolumes: Record<string, null> = {};
	for (const v of [...allVolumes].sort()) {
		sortedAllVolumes[v] = null;
	}

	const networks = { "openclaw-network": { driver: "bridge" } };

	const files: Record<string, string> = {};
	files["docker-compose.yml"] = stringify(
		{ services: baseServices, volumes: sortedAllVolumes, networks },
		YAML_OPTIONS,
	);

	// ── Profile override files ──

	const usedProfiles = new Set<string>();

	for (const [fileName, { profile, services }] of Object.entries(profileFileMap)) {
		usedProfiles.add(profile);

		const profileServices: Record<string, Record<string, unknown>> = {};
		const profileVolumes = new Set<string>();

		for (const info of services) {
			profileServices[info.id] = { ...info.entry, profiles: [profile] };
			for (const vName of info.volumeNames) {
				profileVolumes.add(vName);
			}
		}

		const fileContent: Record<string, unknown> = { services: profileServices };

		if (profileVolumes.size > 0) {
			const sortedProfileVolumes: Record<string, null> = {};
			for (const v of [...profileVolumes].sort()) {
				sortedProfileVolumes[v] = null;
			}
			fileContent.volumes = sortedProfileVolumes;
		}

		files[fileName] = stringify(fileContent, YAML_OPTIONS);
	}

	return {
		files,
		mainFile: "docker-compose.yml",
		profiles: [...usedProfiles].sort(),
	};
}
