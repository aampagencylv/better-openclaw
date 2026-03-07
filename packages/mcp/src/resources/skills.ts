import { getAllSkillPacks } from "@better-openclaw/core";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export function registerSkillsResource(server: McpServer): void {
	server.registerResource(
		"skill-catalog",
		"openclaw://skills",
		{
			description: "All available skill packs — bundles of related services for specific workflows",
			mimeType: "application/json",
		},
		async () => {
			const packs = getAllSkillPacks();
			const catalog = packs.map((p) => ({
				id: p.id,
				name: p.name,
				description: p.description,
				requiredServices: p.requiredServices,
				skills: p.skills,
				tags: p.tags,
			}));

			return {
				contents: [
					{
						uri: "openclaw://skills",
						mimeType: "application/json",
						text: JSON.stringify({ skillPacks: catalog, total: catalog.length }, null, 2),
					},
				],
			};
		},
	);
}
