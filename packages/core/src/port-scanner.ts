import type { ServiceDefinition } from "./types.js";

/**
 * Scans system for ports in use and suggests alternatives for conflicts
 */
export interface PortConflict {
	port: number;
	serviceId: string;
	description: string;
	suggestedPort: number;
}

/**
 * Check if a port is available using a two-phase approach:
 * 1. TCP connect — detects if something is already listening
 * 2. Bind check — detects OS-reserved/excluded port ranges (e.g. Hyper-V on Windows)
 *
 * The connect-only approach misses Windows excluded port ranges because
 * ECONNREFUSED (nothing listening) looks the same as "available" even though
 * Docker's bind() will fail on those reserved ranges.
 */
async function isPortAvailable(port: number): Promise<boolean> {
	try {
		const net = await import("node:net");

		// Phase 1: TCP connect check — is something actively listening?
		const isListening = await new Promise<boolean>((resolve) => {
			const socket = new net.Socket();
			let resolved = false;

			const cleanup = () => {
				if (!resolved) {
					resolved = true;
					socket.removeAllListeners();
					socket.destroy();
				}
			};

			socket.once("connect", () => {
				cleanup();
				resolve(true);
			});

			socket.once("error", () => {
				cleanup();
				resolve(false);
			});

			socket.setTimeout(500);
			socket.once("timeout", () => {
				cleanup();
				resolve(false);
			});

			socket.connect(port, "127.0.0.1");
		});

		if (isListening) return false; // Port is in use

		// Phase 2: Bind check — catches OS-reserved/excluded port ranges
		// On Windows, Hyper-V/WSL reserve dynamic port ranges that TCP connect
		// cannot detect. Attempting to bind reveals these reservations.
		const canBind = await new Promise<boolean>((resolve) => {
			const server = net.createServer();

			server.once("error", (_err: NodeJS.ErrnoException) => {
				// EACCES / EADDRINUSE / EPERM = port is reserved or in use
				resolve(false);
			});

			server.listen(port, "0.0.0.0", () => {
				// Successfully bound — port is truly available
				server.close(() => resolve(true));
			});
		});

		return canBind;
	} catch (error) {
		console.warn(`Port scanner error for port ${port}:`, error);
		return true; // Failsafe: assume available
	}
}

/**
 * Find next available port starting from a base port.
 * Also skips ports already claimed by other services in this generation.
 */
async function findNextAvailablePort(
	startPort: number,
	claimedPorts: Set<number>,
	maxAttempts = 100,
): Promise<number> {
	for (let i = 0; i < maxAttempts; i++) {
		const port = startPort + i;
		if (port > 65535) break;
		if (claimedPorts.has(port)) continue;
		if (await isPortAvailable(port)) {
			return port;
		}
	}
	// Fallback: return a high random port
	return 50000 + Math.floor(Math.random() * 10000);
}

/**
 * Scan for port conflicts and suggest alternatives.
 *
 * Detects two types of conflicts:
 * 1. Host conflicts — port is already in use or reserved by the OS
 * 2. Inter-service conflicts — multiple selected services claim the same host port
 */
export async function scanPortConflicts(
	services: ServiceDefinition[],
): Promise<Map<string, Map<number, number>>> {
	const portReassignments = new Map<string, Map<number, number>>();

	// Track which host ports are already claimed by services in this stack.
	// First service to claim a port wins; subsequent services get reassigned.
	const claimedPorts = new Map<number, string>(); // port → serviceId that claimed it

	for (const service of services) {
		if (!service.ports || service.ports.length === 0) continue;

		const serviceReassignments = new Map<number, number>();

		for (const portDef of service.ports) {
			if (!portDef.exposed) continue;

			const port = portDef.host;

			// Check inter-service conflict first
			const claimedBy = claimedPorts.get(port);
			if (claimedBy && claimedBy !== service.id) {
				// Another service already claimed this port — must reassign
				const newPort = await findNextAvailablePort(port + 1000, new Set(claimedPorts.keys()));
				serviceReassignments.set(port, newPort);
				claimedPorts.set(newPort, service.id);
				continue;
			}

			// Check host availability (TCP connect + bind check)
			const isAvailable = await isPortAvailable(port);

			if (!isAvailable) {
				const newPort = await findNextAvailablePort(port + 1000, new Set(claimedPorts.keys()));
				serviceReassignments.set(port, newPort);
				claimedPorts.set(newPort, service.id);
			} else {
				// Port is available and not claimed — claim it
				claimedPorts.set(port, service.id);
			}
		}

		if (serviceReassignments.size > 0) {
			portReassignments.set(service.id, serviceReassignments);
		}
	}

	return portReassignments;
}

/**
 * Get conflicts in a user-friendly format
 */
export function formatPortConflicts(
	services: ServiceDefinition[],
	reassignments: Map<string, Map<number, number>>,
): PortConflict[] {
	const conflicts: PortConflict[] = [];

	for (const service of services) {
		const serviceReassignments = reassignments.get(service.id);
		if (!serviceReassignments) continue;

		for (const portDef of service.ports || []) {
			const newPort = serviceReassignments.get(portDef.host);
			if (newPort) {
				conflicts.push({
					port: portDef.host,
					serviceId: service.id,
					description: portDef.description || `${service.name} port`,
					suggestedPort: newPort,
				});
			}
		}
	}

	return conflicts;
}
