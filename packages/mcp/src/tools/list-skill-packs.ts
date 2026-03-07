import { getAllSkillPacks, getCompatibleSkillPacks } from "@better-openclaw/core";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

export function registerListSkillPacks(server: McpServer): void {
	server.registerTool(
		"list-skill-packs",
		{
			title: "List Skill Packs",
			description:
				"List available skill packs. Skill packs bundle related services for a specific workflow (e.g. 'research-agent', 'video-creator'). Optionally filter by compatibility with a set of already-selected services.",
			inputSchema: {
				serviceIds: z
					.array(z.string())
					.optional()
					.describe("If provided, only return skill packs compatible with these service IDs"),
			},
		},
		async ({ serviceIds }) => {
			const packs = serviceIds ? getCompatibleSkillPacks(serviceIds) : getAllSkillPacks();

			const summary = packs.map((p) => ({
				id: p.id,
				name: p.name,
				description: p.description,
				requiredServices: p.requiredServices,
				skills: p.skills,
				tags: p.tags,
			}));

			return {
				content: [
					{
						type: "text" as const,
						text: JSON.stringify({ skillPacks: summary, total: summary.length }, null, 2),
					},
				],
			};
		},
	);
}
