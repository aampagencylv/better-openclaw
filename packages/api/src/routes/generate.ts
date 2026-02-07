import { Hono } from "hono";
import { generate, GenerationInputSchema } from "@better-openclaw/core";

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
						details: parsed.error.issues.map((issue) => ({
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

		// Return as JSON (files map + metadata)
		return c.json({
			files: result.files,
			metadata: result.metadata,
		});
	} catch (err) {
		const message = err instanceof Error ? err.message : "Generation failed";

		// Distinguish between config errors and internal errors
		const isConfigError =
			message.includes("Invalid stack configuration") ||
			message.includes("Validation failed");

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
