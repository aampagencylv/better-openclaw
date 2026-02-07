import { stringify } from "yaml";
import type { ComposeOptions, ResolverOutput } from "./types.js";

/**
 * Generates a Docker Compose YAML string from resolved services and options.
 *
 * Uses Docker Compose v3.8 conventions (no `version` field).
 * The OpenClaw gateway is always the first service, followed by companion
 * services in their topologically-sorted order.
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

	return stringify({ services, volumes, networks }, { lineWidth: 120, nullStr: "" });
}
