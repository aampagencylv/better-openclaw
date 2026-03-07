import { getAllServices } from "@better-openclaw/core";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

export function registerSearchServices(server: McpServer): void {
	server.registerTool(
		"search-services",
		{
			title: "Search Services",
			description:
				"Search services by keyword across name, description, tags, and category. Use this to find services matching a concept or technology.",
			inputSchema: {
				query: z
					.string()
					.describe("Search query (matched against id, name, description, tags, and category)"),
				limit: z
					.number()
					.int()
					.min(1)
					.max(50)
					.optional()
					.describe("Max results to return (default 20)"),
			},
		},
		async ({ query, limit }) => {
			const all = getAllServices();
			const q = query.toLowerCase();
			const maxResults = limit ?? 20;

			const scored = all
				.map((s) => {
					let score = 0;
					if (s.id.toLowerCase().includes(q)) score += 3;
					if (s.name.toLowerCase().includes(q)) score += 3;
					if (s.category.toLowerCase().includes(q)) score += 2;
					if (s.tags?.some((t) => t.toLowerCase().includes(q))) score += 2;
					if (s.description.toLowerCase().includes(q)) score += 1;
					return { service: s, score };
				})
				.filter((x) => x.score > 0)
				.sort((a, b) => b.score - a.score)
				.slice(0, maxResults);

			const results = scored.map((x) => ({
				id: x.service.id,
				name: x.service.name,
				description: x.service.description,
				category: x.service.category,
				maturity: x.service.maturity,
				score: x.score,
			}));

			return {
				content: [
					{
						type: "text" as const,
						text: JSON.stringify({ results, total: results.length, query }, null, 2),
					},
				],
			};
		},
	);
}
