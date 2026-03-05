/**
 * Strips host port bindings from a Docker Compose YAML string.
 *
 * When deploying to a PaaS like Dokploy or Coolify, services don't need
 * host port mappings because routing is handled by the platform's built-in
 * reverse proxy (Traefik). Binding to host ports causes "port already
 * allocated" errors when ports are in use by other services on the server.
 *
 * Transforms port mappings:
 *   "8080:8080"        → "8080"        (container port only)
 *   "0.0.0.0:8080:80"  → "80"          (container port only)
 *   "8080:80/tcp"       → "80/tcp"      (preserves protocol)
 *   { published: 8080, target: 80 }    → { target: 80 }
 *
 * The `expose` field is left untouched since it only defines internal ports.
 */

import { parse, stringify } from "yaml";

interface ComposeService {
	ports?: (string | PortObject)[];
	volumes?: (string | Record<string, unknown>)[];
	[key: string]: unknown;
}

interface PortObject {
	target: number;
	published?: number | string;
	host_ip?: string;
	protocol?: string;
	[key: string]: unknown;
}

interface ComposeFile {
	services?: Record<string, ComposeService>;
	[key: string]: unknown;
}

/**
 * Strips host port bindings from a Docker Compose YAML string,
 * keeping only the container (target) ports.
 *
 * Returns the modified YAML string.
 */
export function stripHostPorts(composeYaml: string): string {
	const doc = parse(composeYaml) as ComposeFile;

	if (!doc?.services) return composeYaml;

	for (const [, service] of Object.entries(doc.services)) {
		if (!service.ports || !Array.isArray(service.ports)) continue;

		service.ports = service.ports.map((port) => {
			if (typeof port === "string") {
				return stripStringPort(port);
			}
			if (typeof port === "object" && port !== null) {
				return stripObjectPort(port);
			}
			return port;
		});
	}

	return stringify(doc, { lineWidth: 200 });
}

/**
 * Strips host portion from a string port mapping.
 *
 * "8080:80"          → "80"
 * "0.0.0.0:8080:80"  → "80"
 * "80"               → "80"  (no change)
 * "80/tcp"           → "80/tcp"
 * "8080:80/tcp"      → "80/tcp"
 */
function stripStringPort(port: string): string {
	// Split off protocol if present (e.g. "/tcp", "/udp")
	const protocolIdx = port.lastIndexOf("/");
	let protocol = "";
	let portSpec = port;

	if (protocolIdx > 0) {
		protocol = port.substring(protocolIdx); // includes the "/"
		portSpec = port.substring(0, protocolIdx);
	}

	// Split by ":" — formats are:
	//   "80"                → container only
	//   "8080:80"           → host:container
	//   "0.0.0.0:8080:80"  → ip:host:container
	const parts = portSpec.split(":");

	// Take the last part as the container port
	const containerPort = parts[parts.length - 1];

	return `${containerPort}${protocol}`;
}

/**
 * Strips host/published from an object port mapping.
 *
 * { target: 80, published: 8080 }  → { target: 80 }
 */
function stripObjectPort(port: PortObject): PortObject {
	const { published: _, host_ip: __, ...rest } = port;
	return rest;
}

/**
 * Strips local bind mounts (paths starting with `./`) from a Docker
 * Compose YAML string.
 *
 * When deploying to a PaaS like Dokploy or Coolify as a raw compose
 * stack, there is no cloned repository — so host-relative volume mounts
 * like `./postgres/init-databases.sh:/docker-entrypoint-initdb.d/...`
 * will fail because the file doesn't exist on the remote server.
 *
 * Named volumes (e.g. `redis-data:/data`) and absolute system paths
 * (e.g. `/var/run/docker.sock`) are kept intact.
 */
export function stripLocalBindMounts(composeYaml: string): string {
	const doc = parse(composeYaml) as ComposeFile;

	if (!doc?.services) return composeYaml;

	for (const [, service] of Object.entries(doc.services)) {
		if (!service.volumes || !Array.isArray(service.volumes)) continue;

		service.volumes = (service.volumes as (string | Record<string, unknown>)[]).filter((vol) => {
			if (typeof vol === "string") {
				// Bind mounts starting with "./" reference local files
				return !vol.startsWith("./");
			}
			// Object-form: { type: "bind", source: "./..." }
			if (typeof vol === "object" && vol !== null) {
				const src = (vol as Record<string, unknown>).source;
				return !(typeof src === "string" && src.startsWith("./"));
			}
			return true;
		});

		// Remove empty volumes array to keep YAML clean
		if (service.volumes.length === 0) {
			delete service.volumes;
		}
	}

	return stringify(doc, { lineWidth: 200 });
}

/**
 * Strips security hardening options (`cap_drop`, `cap_add`, `security_opt`)
 * from all services in a Docker Compose YAML string.
 *
 * Many Docker images (PostgreSQL, Redis, MinIO, etc.) start as root and
 * use `gosu`/`su-exec` to drop privileges to a non-root user.  This
 * requires `SETUID`, `SETGID`, and other capabilities.  The hardened
 * compose output adds `cap_drop: ALL` + `no-new-privileges`, which
 * prevents this user switch and causes containers to crash with:
 *   "failed switching to 'postgres': operation not permitted"
 *
 * PaaS platforms (Dokploy, Coolify) manage their own container security,
 * so these options are unnecessary and should be removed.
 */
export function stripSecurityHardening(composeYaml: string): string {
	const doc = parse(composeYaml) as ComposeFile;

	if (!doc?.services) return composeYaml;

	for (const [, service] of Object.entries(doc.services)) {
		delete service.cap_drop;
		delete service.cap_add;
		delete service.security_opt;
	}

	return stringify(doc, { lineWidth: 200 });
}

/**
 * Applies all PaaS-specific sanitisations to a Docker Compose YAML string:
 * 1. Strips host port bindings (avoids "port already allocated" errors)
 * 2. Strips local bind mounts (files don't exist on remote PaaS servers)
 * 3. Strips security hardening (cap_drop/security_opt break user switching)
 */
export function sanitizeComposeForPaas(composeYaml: string): string {
	return stripSecurityHardening(stripLocalBindMounts(stripHostPorts(composeYaml)));
}
