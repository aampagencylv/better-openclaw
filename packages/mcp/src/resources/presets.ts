import { getAllPresets } from "@better-openclaw/core";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export function registerPresetsResource(server: McpServer): void {
	server.registerResource(
		"preset-catalog",
		"openclaw://presets",
		{
			description: "All available stack presets — curated service bundles for common use cases",
			mimeType: "application/json",
		},
		async () => {
			const presets = getAllPresets();
			const catalog = presets.map((p) => ({
				id: p.id,
				name: p.name,
				description: p.description,
				services: p.services,
				skillPacks: p.skillPacks ?? [],
				estimatedMemoryMB: p.estimatedMemoryMB,
			}));

			return {
				contents: [
					{
						uri: "openclaw://presets",
						mimeType: "application/json",
						text: JSON.stringify({ presets: catalog, total: catalog.length }, null, 2),
					},
				],
			};
		},
	);
}
