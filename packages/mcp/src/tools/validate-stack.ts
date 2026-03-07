import { compose, resolve, validate } from "@better-openclaw/core";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

export function registerValidateStack(server: McpServer): void {
	server.registerTool(
		"validate-stack",
		{
			title: "Validate Stack",
			description:
				"Validate a stack configuration end-to-end: resolves dependencies, generates Docker Compose YAML, and checks for port conflicts, volume uniqueness, YAML validity, and dependency graph issues. Returns validation result with any errors and warnings.",
			inputSchema: {
				services: z.array(z.string()).describe("Service IDs to validate"),
				skillPacks: z.array(z.string()).optional(),
				proxy: z.enum(["none", "caddy", "traefik"]).optional(),
				domain: z.string().optional(),
				gpu: z.boolean().optional(),
				platform: z.enum(["linux/amd64", "linux/arm64"]).optional(),
				monitoring: z.boolean().optional(),
			},
		},
		async ({ services, skillPacks, proxy, domain, gpu, platform, monitoring }) => {
			try {
				const resolved = resolve({
					services,
					skillPacks: skillPacks ?? [],
					proxy,
					gpu,
					platform,
					monitoring,
				});

				if (!resolved.isValid) {
					return {
						content: [
							{
								type: "text" as const,
								text: JSON.stringify(
									{
										valid: false,
										stage: "resolution",
										errors: resolved.errors,
										warnings: resolved.warnings,
									},
									null,
									2,
								),
							},
						],
					};
				}

				const composedYaml = compose(resolved, {
					projectName: "validation-check",
					proxy: proxy ?? "none",
					domain,
				});

				const validation = validate(resolved, composedYaml, { domain });

				return {
					content: [
						{
							type: "text" as const,
							text: JSON.stringify(
								{
									valid: validation.valid,
									stage: "complete",
									errors: validation.errors,
									warnings: [...resolved.warnings, ...validation.warnings],
									serviceCount: resolved.services.length,
									estimatedMemoryMB: resolved.estimatedMemoryMB,
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
