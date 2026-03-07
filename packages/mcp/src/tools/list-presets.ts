import { getAllPresets } from "@better-openclaw/core";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export function registerListPresets(server: McpServer): void {
	server.registerTool(
		"list-presets",
		{
			title: "List Presets",
			description:
				"List all available stack presets. Presets are curated combinations of services for common use cases (e.g. 'researcher', 'devops', 'ai-playground'). Use get-preset for full details including resolved service lists.",
		},
		async () => {
			const presets = getAllPresets();
			const summary = presets.map((p) => ({
				id: p.id,
				name: p.name,
				description: p.description,
				serviceCount: p.services.length,
				services: p.services,
				skillPacks: p.skillPacks ?? [],
				estimatedMemoryMB: p.estimatedMemoryMB,
			}));

			return {
				content: [
					{
						type: "text" as const,
						text: JSON.stringify({ presets: summary, total: summary.length }, null, 2),
					},
				],
			};
		},
	);
}
