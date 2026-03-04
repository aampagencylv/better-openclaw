import { db, favorite, savedStack } from "@better-openclaw/db";
import { and, eq } from "drizzle-orm";
import { Hono } from "hono";
import { requireSession } from "../middleware/session.js";

const route = new Hono();

// Apply session middleware to all routes
route.use("/*", requireSession());

// GET /favorites — list user's favorites (with stack details)
route.get("/", async (c) => {
	const user = c.get("user" as never) as { id: string };
	const favorites = await db
		.select({
			favoriteId: favorite.id,
			createdAt: favorite.createdAt,
			stack: savedStack,
		})
		.from(favorite)
		.innerJoin(savedStack, eq(favorite.stackId, savedStack.id))
		.where(eq(favorite.userId, user.id))
		.orderBy(favorite.createdAt);
	return c.json({ favorites });
});

// POST /favorites — add a favorite { stackId }
route.post("/", async (c) => {
	const user = c.get("user" as never) as { id: string };
	const { stackId } = await c.req.json();

	if (!stackId) {
		return c.json({ error: { code: "VALIDATION_ERROR", message: "stackId is required" } }, 400);
	}

	// Verify stack belongs to user
	const [stack] = await db
		.select()
		.from(savedStack)
		.where(and(eq(savedStack.id, stackId), eq(savedStack.userId, user.id)));
	if (!stack) {
		return c.json({ error: { code: "NOT_FOUND", message: "Stack not found" } }, 404);
	}

	// Upsert — ignore if already favorited
	const existing = await db
		.select()
		.from(favorite)
		.where(and(eq(favorite.userId, user.id), eq(favorite.stackId, stackId)));

	if (existing.length > 0) {
		return c.json({ favorite: existing[0] });
	}

	const [fav] = await db.insert(favorite).values({ userId: user.id, stackId }).returning();

	return c.json({ favorite: fav }, 201);
});

// DELETE /favorites/:stackId — remove a favorite
route.delete("/:stackId", async (c) => {
	const user = c.get("user" as never) as { id: string };
	const stackId = c.req.param("stackId");

	await db.delete(favorite).where(and(eq(favorite.userId, user.id), eq(favorite.stackId, stackId)));

	return c.json({ success: true });
});

export { route as favoritesRoute };
