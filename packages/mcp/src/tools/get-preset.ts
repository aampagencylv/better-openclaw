import { getPresetById, resolve } from "@better-openclaw/core";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

export function registerGetPreset(server: McpServer): void {
	server.registerTool(
		"get-preset",
		{
			title: "Get Preset Details",
			description:
				"Get full details of a preset by ID, including its resolved service list with all transitive dependencies expanded. Shows exactly what services will be deployed.",
			inputSchema: {
				id: z
					.string()
					.describe("Preset ID (e.g. 'minimal', 'researcher', 'devops', 'full', 'ai-playground')"),
			},
		},
		async ({ id }) => {
			const preset = getPresetById(id);
			if (!preset) {
				return {
					content: [
						{
							type: "text" as const,
							text: JSON.stringify({
								error: `Preset "${id}" not found. Use list-presets to see available presets.`,
							}),
						},
					],
					isError: true,
				};
			}

			try {
				const resolved = resolve({
					services: preset.services,
					skillPacks: preset.skillPacks ?? [],
				});

				return {
					content: [
						{
							type: "text" as const,
							text: JSON.stringify(
								{
									preset,
									resolved: {
										isValid: resolved.isValid,
										services: resolved.services.map((s) => ({
											id: s.definition.id,
											name: s.definition.name,
											addedBy: s.addedBy,
										})),
										addedDependencies: resolved.addedDependencies,
										warnings: resolved.warnings,
										estimatedMemoryMB: resolved.estimatedMemoryMB,
									},
								},
								null,
								2,
							),
						},
					],
				};
			} catch (err) {
				return {
					content: [
						{
							type: "text" as const,
							text: JSON.stringify(
								{
									preset,
									resolveError: err instanceof Error ? err.message : String(err),
								},
								null,
								2,
							),
						},
					],
				};
			}
		},
	);
}
