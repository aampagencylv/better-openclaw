import { Hono } from "hono";
import { db, savedStack } from "@better-openclaw/db";
import { eq, and } from "drizzle-orm";
import { requireSession } from "../middleware/session.js";

const route = new Hono();

// Apply session middleware to all routes
route.use("/*", requireSession());

// GET /stacks — list user's saved stacks
route.get("/", async (c) => {
	const user = c.get("user" as never) as { id: string };
	const stacks = await db
		.select()
		.from(savedStack)
		.where(eq(savedStack.userId, user.id))
		.orderBy(savedStack.createdAt);
	return c.json({ stacks });
});

// POST /stacks — save a new stack
route.post("/", async (c) => {
	const user = c.get("user" as never) as { id: string };
	const body = await c.req.json();
	const { name, description, services, config } = body;

	if (!name || typeof name !== "string") {
		return c.json({ error: { code: "VALIDATION_ERROR", message: "Stack name is required" } }, 400);
	}
	if (!Array.isArray(services)) {
		return c.json(
			{ error: { code: "VALIDATION_ERROR", message: "Services must be an array" } },
			400,
		);
	}

	const [stack] = await db
		.insert(savedStack)
		.values({
			userId: user.id,
			name,
			description: description ?? null,
			services,
			config: config ?? {},
		})
		.returning();

	return c.json({ stack }, 201);
});

// GET /stacks/:id — get a specific stack
route.get("/:id", async (c) => {
	const user = c.get("user" as never) as { id: string };
	const id = c.req.param("id");

	const [stack] = await db
		.select()
		.from(savedStack)
		.where(and(eq(savedStack.id, id), eq(savedStack.userId, user.id)));

	if (!stack) {
		return c.json({ error: { code: "NOT_FOUND", message: "Stack not found" } }, 404);
	}
	return c.json({ stack });
});

// PATCH /stacks/:id — update a stack name/description
route.patch("/:id", async (c) => {
	const user = c.get("user" as never) as { id: string };
	const id = c.req.param("id");
	const body = await c.req.json();
	const { name, description } = body;

	const [stack] = await db
		.update(savedStack)
		.set({
			...(name ? { name } : {}),
			...(description !== undefined ? { description } : {}),
			updatedAt: new Date(),
		})
		.where(and(eq(savedStack.id, id), eq(savedStack.userId, user.id)))
		.returning();

	if (!stack) {
		return c.json({ error: { code: "NOT_FOUND", message: "Stack not found" } }, 404);
	}
	return c.json({ stack });
});

// DELETE /stacks/:id — delete a stack
route.delete("/:id", async (c) => {
	const user = c.get("user" as never) as { id: string };
	const id = c.req.param("id");

	const [deleted] = await db
		.delete(savedStack)
		.where(and(eq(savedStack.id, id), eq(savedStack.userId, user.id)))
		.returning({ id: savedStack.id });

	if (!deleted) {
		return c.json({ error: { code: "NOT_FOUND", message: "Stack not found" } }, 404);
	}
	return c.json({ success: true });
});

export { route as stacksRoute };
