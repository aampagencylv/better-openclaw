import {
	generate,
	getAllPresets,
	getAllServices,
	getAllSkillPacks,
	getCompatibleSkillPacks,
	getPresetById,
	getServiceById,
	getServicesByCategory,
	resolve,
	SERVICE_CATEGORIES,
} from "@better-openclaw/core";
import { describe, expect, it } from "vitest";

describe("list-services logic", () => {
	it("returns all services", () => {
		const services = getAllServices();
		expect(services.length).toBeGreaterThan(50);
	});

	it("filters by category", () => {
		const dbs = getServicesByCategory("database" as never);
		expect(dbs.length).toBeGreaterThan(0);
		for (const s of dbs) expect(s.category).toBe("database");
	});

	it("filters by maturity", () => {
		const stable = getAllServices().filter((s) => s.maturity === "stable");
		expect(stable.length).toBeGreaterThan(0);
		for (const s of stable) expect(s.maturity).toBe("stable");
	});

	it("has categories available", () => {
		expect(SERVICE_CATEGORIES.length).toBeGreaterThan(10);
	});
});

describe("get-service logic", () => {
	it("returns a service by id", () => {
		const redis = getServiceById("redis");
		expect(redis).toBeDefined();
		if (!redis) {
			throw new Error("Expected redis service to exist");
		}
		expect(redis.id).toBe("redis");
		expect(redis.name).toBeTruthy();
		expect(redis.image).toBeTruthy();
	});

	it("returns undefined for unknown id", () => {
		const unknown = getServiceById("nonexistent-service-xyz");
		expect(unknown).toBeUndefined();
	});
});

describe("search-services logic", () => {
	it("finds services by keyword", () => {
		const all = getAllServices();
		const q = "database";
		const matches = all.filter(
			(s) =>
				s.id.includes(q) ||
				s.name.toLowerCase().includes(q) ||
				s.description.toLowerCase().includes(q) ||
				s.category.includes(q),
		);
		expect(matches.length).toBeGreaterThan(0);
	});

	it("finds redis by name", () => {
		const all = getAllServices();
		const matches = all.filter(
			(s) => s.id.includes("redis") || s.name.toLowerCase().includes("redis"),
		);
		expect(matches.length).toBeGreaterThanOrEqual(1);
	});
});

describe("list-presets logic", () => {
	it("returns all presets", () => {
		const presets = getAllPresets();
		expect(presets.length).toBeGreaterThan(3);
	});

	it("each preset has required fields", () => {
		for (const p of getAllPresets()) {
			expect(p.id).toBeTruthy();
			expect(p.name).toBeTruthy();
			expect(p.services.length).toBeGreaterThan(0);
		}
	});
});

describe("get-preset logic", () => {
	it("returns a preset by id", () => {
		const preset = getPresetById("researcher");
		expect(preset).toBeDefined();
		if (!preset) {
			throw new Error("Expected researcher preset to exist");
		}
		expect(preset.id).toBe("researcher");
	});

	it("returns undefined for unknown preset", () => {
		expect(getPresetById("nonexistent-preset")).toBeUndefined();
	});

	it("resolves a preset's services", () => {
		const preset = getPresetById("minimal");
		expect(preset).toBeDefined();
		if (!preset) {
			throw new Error("Expected minimal preset to exist");
		}
		const resolved = resolve({
			services: preset.services,
			skillPacks: preset.skillPacks ?? [],
		});
		expect(resolved.isValid).toBe(true);
		expect(resolved.services.length).toBeGreaterThanOrEqual(preset.services.length);
	});
});

describe("list-skill-packs logic", () => {
	it("returns all skill packs", () => {
		const packs = getAllSkillPacks();
		expect(packs.length).toBeGreaterThan(0);
	});

	it("filters by compatible services", () => {
		const compatible = getCompatibleSkillPacks(["redis", "postgresql"]);
		expect(Array.isArray(compatible)).toBe(true);
	});
});

describe("resolve-dependencies logic", () => {
	it("resolves basic services", () => {
		const result = resolve({ services: ["redis"], skillPacks: [] });
		expect(result.isValid).toBe(true);
		expect(result.services.length).toBeGreaterThanOrEqual(1);
	});

	it("adds transitive dependencies", () => {
		const result = resolve({ services: ["n8n"], skillPacks: [] });
		const ids = result.services.map((s) => s.definition.id);
		expect(ids).toContain("postgresql");
	});

	it("reports estimated memory", () => {
		const result = resolve({
			services: ["redis", "postgresql"],
			skillPacks: [],
		});
		expect(result.estimatedMemoryMB).toBeGreaterThan(0);
	});
});

describe("generate-stack logic", () => {
	it("generates files for minimal input", () => {
		const result = generate({
			projectName: "test",
			services: ["redis"],
			skillPacks: [],
			aiProviders: [],
			gsdRuntimes: [],
			proxy: "none",
			gpu: false,
			platform: "linux/amd64",
			monitoring: false,
			generateSecrets: true,
			openclawVersion: "latest",
			deployment: "local",
			deploymentType: "docker",
			openclawImage: "official",
			deployTarget: "local",
			hardened: true,
			openclawInstallMethod: "docker",
		});
		expect(result.files).toHaveProperty("docker-compose.yml");
		expect(Object.keys(result.files).length).toBeGreaterThan(1);
		expect(result.metadata).toBeDefined();
	});

	it("generates with multiple services and proxy", () => {
		const result = generate({
			projectName: "multi",
			services: ["redis", "postgresql", "n8n"],
			skillPacks: [],
			aiProviders: [],
			gsdRuntimes: [],
			proxy: "caddy",
			domain: "example.com",
			gpu: false,
			platform: "linux/amd64",
			monitoring: false,
			generateSecrets: true,
			openclawVersion: "latest",
			deployment: "local",
			deploymentType: "docker",
			openclawImage: "official",
			deployTarget: "local",
			hardened: true,
			openclawInstallMethod: "docker",
		});
		expect(result.files).toHaveProperty("docker-compose.yml");
		// Caddyfile may be nested in a subdirectory
		const hasProxy = Object.keys(result.files).some(
			(f) => f.includes("Caddyfile") || f.includes("caddy"),
		);
		expect(hasProxy).toBe(true);
	});
});

describe("suggest-services logic", () => {
	it("matches ai-related keywords", () => {
		const all = getAllServices();
		const keywords = ["ai", "llm", "chat"];
		const matches = all.filter((s) => {
			const fields = [s.id, s.name.toLowerCase(), s.category].join(" ");
			return keywords.some((kw) => fields.includes(kw));
		});
		expect(matches.length).toBeGreaterThan(0);
	});
});
