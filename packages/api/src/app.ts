import { OpenAPIHono } from "@hono/zod-openapi";
import { cors } from "hono/cors";
import { secureHeaders } from 'hono/secure-headers';
import { optionalApiKey } from "./middleware/api-key.js";
import { generateRateLimiter, rateLimiter } from "./middleware/rate-limit.js";
import { requestId } from "./middleware/request-id.js";
import { authRoute } from "./routes/auth.js";
import { deployRoute } from "./routes/deploy.js";
import { favoritesRoute } from "./routes/favorites.js";
import { generateRoute } from "./routes/generate.js";
import { healthRoute } from "./routes/health.js";
import { presetsRoute } from "./routes/presets.js";
import { servicesRoute } from "./routes/services.js";
import { skillsRoute } from "./routes/skills.js";
import { stacksRoute } from "./routes/stacks.js";
import { validateRoute } from "./routes/validate.js";

const app = new OpenAPIHono().basePath("/v1");

const trustedOrigins = process.env.TRUSTED_ORIGINS?.split(",") || ["http://localhost:5173", "http://localhost:3000", "http://localhost:5174", "http://localhost:5175", "http://localhost:3001"];

// Middleware
app.use("/*", requestId());
// Security: Enable secure headers (X-Content-Type-Options, X-Frame-Options, etc.)
app.use('/*', secureHeaders({
    xFrameOptions: 'DENY',
    xContentTypeOptions: 'nosniff',
    referrerPolicy: 'strict-origin-when-cross-origin',
    strictTransportSecurity: 'max-age=31536000; includeSubDomains',
    xXssProtection: '1; mode=block',
}));

app.use('/*', cors({
    origin: trustedOrigins,
    allowHeaders: ['Set-Cookie', 'Cookie', 'Content-Type', 'Authorization', 'x-api-key', 'baggage', 'sentry-trace', 'sentry-release', 'X-RateLimit-Limit', 'X-RateLimit-Remaining', 'X-RateLimit-Reset', 'Idempotency-Key'],
    allowMethods: ['POST', 'GET', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    exposeHeaders: ['Set-Cookie', 'Cookie', 'Content-Length', 'X-RateLimit-Limit', 'X-RateLimit-Remaining', 'X-RateLimit-Reset', 'Retry-After', 'Idempotency-Key', 'X-Idempotent-Replayed'],
    maxAge: 600,
    credentials: true,
}));
app.use("/*", optionalApiKey());
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
app.route("/deploy", deployRoute);
app.route("/auth", authRoute);
app.route("/stacks", stacksRoute);
app.route("/favorites", favoritesRoute);

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
