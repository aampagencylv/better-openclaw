import { OpenAPIHono } from "@hono/zod-openapi";
import { cors } from "hono/cors";
import { generateRateLimiter, rateLimiter } from "./middleware/rate-limit.js";
import { requestId } from "./middleware/request-id.js";
import { generateRoute } from "./routes/generate.js";
import { healthRoute } from "./routes/health.js";
import { presetsRoute } from "./routes/presets.js";
import { servicesRoute } from "./routes/services.js";
import { skillsRoute } from "./routes/skills.js";
import { validateRoute } from "./routes/validate.js";

const app = new OpenAPIHono().basePath("/v1");

// Middleware
app.use("/*", requestId());
app.use("/*", cors());
app.use("/*", rateLimiter());
app.use("/generate", generateRateLimiter());

// Error handler
app.onError((err, c) => {
	console.error(err);
	return c.json(
		{
			error: {
				code: "INTERNAL_ERROR",
				message: err.message || "Internal server error",
			},
		},
		500,
	);
});

// Routes
app.route("/health", healthRoute);
app.route("/services", servicesRoute);
app.route("/skills", skillsRoute);
app.route("/presets", presetsRoute);
app.route("/validate", validateRoute);
app.route("/generate", generateRoute);

// Auto-generated OpenAPI spec
app.doc("/openapi.json", {
	openapi: "3.1.0",
	info: {
		title: "better-openclaw API",
		description: "REST API for generating production-ready OpenClaw Docker Compose stacks",
		version: "1.0.0",
		contact: { name: "bachir@bidew.io" },
	},
	servers: [{ url: "/v1", description: "API v1" }],
});

// Swagger UI
app.get("/docs", (c) => {
	return c.html(`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>OpenClaw API Docs</title>
<link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css" />
</head>
<body>
<div id="swagger-ui"></div>
<script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
<script>SwaggerUIBundle({ url: "./openapi.json", dom_id: "#swagger-ui" });</script>
</body>
</html>`);
});

export { app };
