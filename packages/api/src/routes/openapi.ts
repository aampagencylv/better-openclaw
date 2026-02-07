import { Hono } from "hono";

const route = new Hono();

route.get("/", (c) => {
	const spec = {
		openapi: "3.1.0",
		info: {
			title: "better-openclaw API",
			description:
				"REST API for generating production-ready OpenClaw Docker Compose stacks",
			version: "1.0.0",
			contact: { name: "Bachir @ bidew.io" },
		},
		servers: [{ url: "/v1", description: "API v1" }],
		paths: {
			"/health": {
				get: {
					summary: "Health check",
					responses: {
						"200": {
							description: "API is healthy",
							content: {
								"application/json": {
									schema: {
										type: "object",
										properties: {
											status: { type: "string" },
											version: { type: "string" },
										},
									},
								},
							},
						},
					},
				},
			},
			"/services": {
				get: {
					summary: "List all available services",
					parameters: [
						{
							name: "category",
							in: "query",
							schema: { type: "string" },
							description: "Filter by service category",
						},
						{
							name: "maturity",
							in: "query",
							schema: {
								type: "string",
								enum: ["stable", "beta", "experimental"],
							},
							description: "Filter by maturity level",
						},
					],
					responses: { "200": { description: "List of services" } },
				},
			},
			"/skills": {
				get: {
					summary: "List available skill packs",
					parameters: [
						{
							name: "services",
							in: "query",
							schema: { type: "string" },
							description:
								"Comma-separated service IDs to filter compatible packs",
						},
					],
					responses: { "200": { description: "List of skill packs" } },
				},
			},
			"/presets": {
				get: {
					summary: "List preset configurations",
					responses: { "200": { description: "List of presets" } },
				},
			},
			"/validate": {
				post: {
					summary: "Validate a stack configuration",
					requestBody: {
						required: true,
						content: {
							"application/json": {
								schema: {
									type: "object",
									properties: {
										services: {
											type: "array",
											items: { type: "string" },
										},
										skillPacks: {
											type: "array",
											items: { type: "string" },
										},
										proxy: { type: "string" },
										domain: { type: "string" },
										gpu: { type: "boolean" },
										platform: { type: "string" },
									},
								},
							},
						},
					},
					responses: {
						"200": { description: "Validation result" },
						"422": { description: "Validation error" },
					},
				},
			},
			"/generate": {
				post: {
					summary: "Generate a complete stack",
					requestBody: {
						required: true,
						content: {
							"application/json": {
								schema: {
									type: "object",
									required: ["projectName"],
									properties: {
										projectName: { type: "string" },
										services: {
											type: "array",
											items: { type: "string" },
										},
										skillPacks: {
											type: "array",
											items: { type: "string" },
										},
										proxy: { type: "string" },
										domain: { type: "string" },
										gpu: { type: "boolean" },
										platform: { type: "string" },
										deployment: { type: "string" },
										generateSecrets: { type: "boolean" },
										openclawVersion: { type: "string" },
									},
								},
							},
						},
					},
					responses: {
						"200": { description: "Generated stack files or ZIP" },
						"400": { description: "Invalid request" },
					},
				},
			},
		},
	};

	return c.json(spec);
});

export { route as openapiRoute };
