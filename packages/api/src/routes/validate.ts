import { resolve, ValidateRequestSchema } from "@better-openclaw/core";
import { Hono } from "hono";

const route = new Hono();

route.post("/", async (c) => {
	try {
		const body = await c.req.json();

		// Validate request body against schema
		const parsed = ValidateRequestSchema.safeParse(body);
		if (!parsed.success) {
			return c.json(
				{
					error: {
						code: "VALIDATION_ERROR",
						message: "Invalid request body",
						details: parsed.error.issues.map((issue: { path: PropertyKey[]; message: string }) => ({
							field: issue.path.join("."),
							message: issue.message,
						})),
					},
				},
				400,
			);
		}

		const { services, skillPacks, proxy, gpu, platform } = parsed.data;

		// Run resolver
		const resolved = resolve({
			services,
			skillPacks,
			proxy,
			gpu,
			platform,
		});

		return c.json({
			valid: resolved.isValid,
			resolvedServices: resolved.services.map((s: { definition: { id: string } }) => s.definition.id),
			addedDependencies: resolved.addedDependencies,
			warnings: resolved.warnings,
			conflicts: resolved.errors,
			estimatedMemoryMB: resolved.estimatedMemoryMB,
		});
	} catch (err) {
		const message = err instanceof Error ? err.message : "Validation failed";
		return c.json(
			{
				error: {
					code: "INTERNAL_ERROR",
					message,
				},
			},
			500,
		);
	}
});

export { route as validateRoute };
