import { GenerationInputSchema, generate } from "@better-openclaw/core";
import { Hono } from "hono";

const route = new Hono();

route.post("/", async (c) => {
	try {
		const body = await c.req.json();

		// Validate request body against schema
		const parsed = GenerationInputSchema.safeParse(body);
		if (!parsed.success) {
			return c.json(
				{
					error: {
						code: "VALIDATION_ERROR",
						message: "Invalid generation input",
						details: parsed.error.issues.map((issue: { path: PropertyKey[]; message: string }) => ({
							field: issue.path.join("."),
							message: issue.message,
						})),
					},
				},
				400,
			);
		}

		// Generate the stack
		const result = generate(parsed.data);

		const accept = c.req.header("Accept") || "";

		// If client requests a downloadable format, return JSON with
		// Content-Disposition so the browser triggers a file download.
		// The client is responsible for assembling the files from the JSON payload.
		// TODO: Add full ZIP support (e.g. using archiver) for a single-file download
		if (accept.includes("application/zip")) {
			const projectName = parsed.data.projectName || "project";
			c.header("Content-Disposition", `attachment; filename="${projectName}.zip"`);
			c.header("Content-Type", "application/json");

			return c.json({
				files: result.files,
				metadata: result.metadata,
				_download: true,
				_hint: "Assemble files on the client. Full ZIP support coming soon.",
			});
		}

		// Default: Return as JSON (files map + metadata)
		return c.json({
			files: result.files,
			metadata: result.metadata,
		});
	} catch (err) {
		const message = err instanceof Error ? err.message : "Generation failed";

		// Distinguish between config errors and internal errors
		const isConfigError =
			message.includes("Invalid stack configuration") || message.includes("Validation failed");

		return c.json(
			{
				error: {
					code: isConfigError ? "CONFLICT_ERROR" : "GENERATION_ERROR",
					message,
				},
			},
			isConfigError ? 409 : 500,
		);
	}
});

export { route as generateRoute };
