import { getAllServices, SERVICE_CATEGORIES } from "@better-openclaw/core";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export function registerServicesResource(server: McpServer): void {
	server.registerResource(
		"service-catalog",
		"openclaw://services",
		{
			description: "Complete catalog of all available Docker services with summaries",
			mimeType: "application/json",
		},
		async () => {
			const services = getAllServices();
			const catalog = services.map((s) => ({
				id: s.id,
				name: s.name,
				description: s.description,
				category: s.category,
				maturity: s.maturity,
				tags: s.tags,
			}));

			return {
				contents: [
					{
						uri: "openclaw://services",
						mimeType: "application/json",
						text: JSON.stringify(
							{
								services: catalog,
								total: catalog.length,
								categories: SERVICE_CATEGORIES.map((c) => ({
									id: c.id,
									name: c.name,
									icon: c.icon,
								})),
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
