import { resolve } from "@better-openclaw/core";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

export function registerResolveDeps(server: McpServer): void {
	server.registerTool(
		"resolve-dependencies",
		{
			title: "Resolve Dependencies",
			description:
				"Resolve service dependencies, detect conflicts, and estimate memory. Takes a list of service IDs (and optional skill packs/proxy/gpu/platform) and returns the complete resolved service list with auto-added dependencies, conflicts, warnings, and total memory estimate.",
			inputSchema: {
				services: z
					.array(z.string())
					.describe("Service IDs to resolve (e.g. ['n8n', 'redis', 'ollama'])"),
				skillPacks: z.array(z.string()).optional().describe("Skill pack IDs to include"),
				proxy: z.enum(["none", "caddy", "traefik"]).optional(),
				gpu: z.boolean().optional(),
				platform: z.enum(["linux/amd64", "linux/arm64"]).optional(),
				monitoring: z.boolean().optional(),
			},
		},
		async ({ services, skillPacks, proxy, gpu, platform, monitoring }) => {
			try {
				const result = resolve({
					services,
					skillPacks: skillPacks ?? [],
					proxy,
					gpu,
					platform,
					monitoring,
				});

				return {
					content: [
						{
							type: "text" as const,
							text: JSON.stringify(
								{
									isValid: result.isValid,
									services: result.services.map((s) => ({
										id: s.definition.id,
										name: s.definition.name,
										category: s.definition.category,
										addedBy: s.addedBy,
									})),
									addedDependencies: result.addedDependencies,
									errors: result.errors,
									warnings: result.warnings,
									estimatedMemoryMB: result.estimatedMemoryMB,
									totalServices: result.services.length,
								},
								null,
								2,
							),
						},
					],
				};
			} catch (err) {
				const message = err instanceof Error ? err.message : String(err);
				return {
					content: [
						{
							type: "text" as const,
							text: JSON.stringify({ error: message }),
						},
					],
					isError: true,
				};
			}
		},
	);
}
