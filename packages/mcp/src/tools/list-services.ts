import { getAllServices, getServicesByCategory, SERVICE_CATEGORIES } from "@better-openclaw/core";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

const categoryIds = SERVICE_CATEGORIES.map((c) => c.id);

export function registerListServices(server: McpServer): void {
	server.registerTool(
		"list-services",
		{
			title: "List Services",
			description:
				"List all available Docker services in the OpenClaw registry. Optionally filter by category or maturity level. Returns summaries (id, name, description, category, maturity, tags) — use get-service for full details.",
			inputSchema: {
				category: z
					.string()
					.optional()
					.describe(`Filter by category. Valid: ${categoryIds.join(", ")}`),
				maturity: z
					.enum(["stable", "beta", "experimental"])
					.optional()
					.describe("Filter by maturity level"),
			},
		},
		async ({ category, maturity }) => {
			let services = category ? getServicesByCategory(category as never) : getAllServices();

			if (maturity) {
				services = services.filter((s) => s.maturity === maturity);
			}

			const summary = services.map((s) => ({
				id: s.id,
				name: s.name,
				description: s.description,
				category: s.category,
				maturity: s.maturity,
				tags: s.tags,
			}));

			return {
				content: [
					{
						type: "text" as const,
						text: JSON.stringify(
							{
								services: summary,
								total: summary.length,
								categories: categoryIds,
							},
							null,
							2,
						),
					},
				],
			};
		},
	);
}
