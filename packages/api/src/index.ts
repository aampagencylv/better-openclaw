import { serve } from "@hono/node-server";
import { app } from "./app.js";

// Start server
const port = Number(process.env.PORT) || 3456;
console.log(`better-openclaw API server running on http://localhost:${port}`);
serve({ fetch: app.fetch, port });

export { app };
