import {
	getAllPresets,
	getAllServices,
	getAllSkillPacks,
	SERVICE_CATEGORIES,
} from "@better-openclaw/core";
import { describe, expect, it } from "vitest";

describe("services resource data", () => {
	it("every service has required fields", () => {
		for (const s of getAllServices()) {
			expect(s.id).toBeTruthy();
			expect(s.name).toBeTruthy();
			expect(s.category).toBeTruthy();
			expect(s.description).toBeTruthy();
		}
	});

	it("categories are well-formed", () => {
		expect(SERVICE_CATEGORIES.length).toBeGreaterThan(0);
		for (const c of SERVICE_CATEGORIES) {
			expect(c.id).toBeTruthy();
			expect(c.name).toBeTruthy();
		}
	});
});

describe("presets resource data", () => {
	it("every preset has required fields", () => {
		for (const p of getAllPresets()) {
			expect(p.id).toBeTruthy();
			expect(p.name).toBeTruthy();
			expect(p.services.length).toBeGreaterThan(0);
		}
	});
});

describe("skills resource data", () => {
	it("every skill pack has required fields", () => {
		for (const s of getAllSkillPacks()) {
			expect(s.id).toBeTruthy();
			expect(s.name).toBeTruthy();
			expect(Array.isArray(s.requiredServices)).toBe(true);
		}
	});
});
