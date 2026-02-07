import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { healthRoute } from "./routes/health.js";
import { servicesRoute } from "./routes/services.js";
import { skillsRoute } from "./routes/skills.js";
import { presetsRoute } from "./routes/presets.js";
import { validateRoute } from "./routes/validate.js";
import { generateRoute } from "./routes/generate.js";
import { openapiRoute } from "./routes/openapi.js";
import { rateLimiter } from "./middleware/rate-limit.js";

const app = new Hono().basePath("/v1");

// Middleware
app.use("/*", cors());
app.use("/*", rateLimiter());

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
app.route("/openapi.json", openapiRoute);

// Start server
const port = Number(process.env.PORT) || 3456;
console.log(`better-openclaw API server running on http://localhost:${port}`);
serve({ fetch: app.fetch, port });

export { app };
