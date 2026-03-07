import { getServiceById } from "@better-openclaw/core";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

export function registerGetService(server: McpServer): void {
	server.registerTool(
		"get-service",
		{
			title: "Get Service Details",
			description:
				"Get the complete definition of a Docker service by ID. Returns image, ports, environment variables, volumes, dependencies, health check, resource limits, and all other configuration details.",
			inputSchema: {
				id: z
					.string()
					.describe("Service ID in kebab-case (e.g. 'postgresql', 'redis', 'n8n', 'ollama')"),
			},
		},
		async ({ id }) => {
			const service = getServiceById(id);
			if (!service) {
				return {
					content: [
						{
							type: "text" as const,
							text: JSON.stringify({
								error: `Service "${id}" not found. Use list-services to see all available service IDs.`,
							}),
						},
					],
					isError: true,
				};
			}
			return {
				content: [
					{
						type: "text" as const,
						text: JSON.stringify({ service }, null, 2),
					},
				],
			};
		},
	);
}
