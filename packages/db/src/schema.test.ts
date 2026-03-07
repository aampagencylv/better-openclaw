import { getTableColumns, getTableName } from "drizzle-orm";
import { describe, expect, it } from "vitest";

import { account, favorite, savedStack, session, user, verification } from "./schema";

describe("database schema", () => {
	it("exports the expected table names", () => {
		expect(getTableName(user)).toBe("user");
		expect(getTableName(session)).toBe("session");
		expect(getTableName(account)).toBe("account");
		expect(getTableName(verification)).toBe("verification");
		expect(getTableName(savedStack)).toBe("saved_stack");
		expect(getTableName(favorite)).toBe("favorite");
	});

	it("includes the saved stack columns used by the app", () => {
		expect(Object.keys(getTableColumns(savedStack))).toEqual(
			expect.arrayContaining(["id", "userId", "name", "description", "services", "config"]),
		);
	});

	it("includes the favorite relationship columns", () => {
		expect(Object.keys(getTableColumns(favorite))).toEqual(
			expect.arrayContaining(["id", "userId", "stackId", "createdAt"]),
		);
	});
});
