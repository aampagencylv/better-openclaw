import type { GenerationInput, Platform, ProxyType } from "@better-openclaw/core";
import {
	generate,
	getAllPresets,
	getAllServices,
	getAllSkillPacks,
	getPresetById,
	getServiceById,
	getSkillPackById,
} from "@better-openclaw/core";
import pc from "picocolors";
import { writeProject } from "./writer.js";

export interface NonInteractiveOptions {
	projectDirectory?: string;
	services?: string;
	skills?: string;
	preset?: string;
	proxy?: string;
	domain?: string;
	gpu?: boolean;
	monitoring?: boolean;
	platform?: string;
	dryRun?: boolean;
	yes?: boolean;
	outputFormat?: string;
}

/**
 * Runs the CLI in non-interactive mode.
 *
 * Supports:
 * - `--preset <name>` to use a predefined stack
 * - `--services <ids>` to specify services directly
 * - `--yes` to use defaults (minimal preset)
 * - `--dry-run` to preview without writing
 */
export async function runNonInteractive(options: NonInteractiveOptions): Promise<void> {
	let serviceIds: string[] = [];
	let skillPackIds: string[] = [];

	// Resolve project directory
	const projectDir = options.projectDirectory ?? "my-openclaw-stack";

	// If a preset is specified, load it
	if (options.preset) {
		const preset = getPresetById(options.preset);
		if (!preset) {
			const available = getAllPresets()
				.map((p) => p.id)
				.join(", ");
			throw new Error(`Unknown preset: "${options.preset}". Available presets: ${available}`);
		}
		serviceIds = [...preset.services];
		skillPackIds = [...preset.skillPacks];
		console.log(pc.cyan(`Using preset: ${preset.name}`));
		console.log(pc.dim(preset.description));
	}

	// Parse comma-separated service IDs (merge with preset if both given)
	if (options.services) {
		const parsed = options.services
			.split(",")
			.map((s) => s.trim())
			.filter(Boolean);

		// Validate each service ID
		for (const id of parsed) {
			if (!getServiceById(id)) {
				const available = getAllServices()
					.map((s) => s.id)
					.join(", ");
				throw new Error(`Unknown service: "${id}". Available services: ${available}`);
			}
		}

		serviceIds = [...new Set([...serviceIds, ...parsed])];
	}

	// Parse comma-separated skill pack IDs
	if (options.skills) {
		const parsed = options.skills
			.split(",")
			.map((s) => s.trim())
			.filter(Boolean);

		for (const id of parsed) {
			if (!getSkillPackById(id)) {
				const available = getAllSkillPacks()
					.map((p) => p.id)
					.join(", ");
				throw new Error(`Unknown skill pack: "${id}". Available skill packs: ${available}`);
			}
		}

		skillPackIds = [...new Set([...skillPackIds, ...parsed])];
	}

	// If --yes with no preset or services, use minimal defaults
	if (options.yes && serviceIds.length === 0 && !options.preset) {
		const minimal = getPresetById("minimal");
		if (minimal) {
			serviceIds = [...minimal.services];
			skillPackIds = [...minimal.skillPacks];
			console.log(pc.cyan("Using minimal preset (default with --yes)"));
		}
	}

	// Validate proxy type
	const proxy = (options.proxy ?? "none") as ProxyType;
	if (!["none", "caddy", "traefik"].includes(proxy)) {
		throw new Error(`Invalid proxy type: "${options.proxy}". Valid options: none, caddy, traefik`);
	}

	// Validate platform
	const platform = (options.platform ?? "linux/amd64") as Platform;
	if (!["linux/amd64", "linux/arm64"].includes(platform)) {
		throw new Error(
			`Invalid platform: "${options.platform}". Valid options: linux/amd64, linux/arm64`,
		);
	}

	// Build generation input
	const input: GenerationInput = {
		projectName: projectDir,
		services: serviceIds,
		skillPacks: skillPackIds,
		proxy,
		domain: options.domain,
		gpu: options.gpu ?? false,
		platform,
		deployment: "local",
		generateSecrets: true,
		openclawVersion: "latest",
		monitoring: options.monitoring ?? false,
	};

	console.log("");
	console.log(pc.bold("Generating stack..."));
	console.log(pc.dim(`  Services: ${serviceIds.length > 0 ? serviceIds.join(", ") : "(none)"}`));
	console.log(
		pc.dim(`  Skill packs: ${skillPackIds.length > 0 ? skillPackIds.join(", ") : "(none)"}`),
	);
	console.log(pc.dim(`  Proxy: ${proxy}`));
	if (options.domain) {
		console.log(pc.dim(`  Domain: ${options.domain}`));
	}
	if (options.gpu) {
		console.log(pc.dim(`  GPU: enabled`));
	}
	console.log("");

	// Generate
	const result = generate(input);

	// Write files or dry-run
	await writeProject(projectDir, result.files, {
		dryRun: options.dryRun,
		outputFormat: options.outputFormat,
	});

	// Summary
	if (!options.dryRun) {
		console.log("");
		console.log(pc.green(pc.bold("Stack generated successfully!")));
		console.log("");
		console.log(`  ${pc.cyan("Directory:")}  ${projectDir}`);
		console.log(`  ${pc.cyan("Services:")}   ${result.metadata.serviceCount}`);
		console.log(`  ${pc.cyan("Skills:")}     ${result.metadata.skillCount}`);
		console.log(`  ${pc.cyan("Memory:")}     ~${result.metadata.estimatedMemoryMB}MB`);
		console.log("");
		console.log("Next steps:");
		console.log(pc.dim(`  cd ${projectDir}`));
		console.log(pc.dim("  docker compose up -d"));
	}
}
