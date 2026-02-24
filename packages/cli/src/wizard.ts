import type { GenerationInput, Preset, ServiceDefinition, SkillPack } from "@better-openclaw/core";
import {
	generate,
	getAllPresets,
	getAllServices,
	getAllSkillPacks,
	getCompatibleSkillPacks,
	resolve,
	SERVICE_CATEGORIES,
} from "@better-openclaw/core";
import {
	cancel,
	confirm,
	groupMultiselect,
	intro,
	isCancel,
	multiselect,
	note,
	outro,
	select,
	spinner,
	text,
} from "@clack/prompts";
import pc from "picocolors";
import { writeProject } from "./writer.js";

/**
 * Guard that handles @clack/prompts cancel signals.
 * Every prompt returns `T | symbol` where symbol indicates cancellation.
 * This function narrows the type and exits gracefully on cancel.
 */
function ensureNotCancelled<T>(value: T | symbol): T {
	if (isCancel(value)) {
		cancel("Operation cancelled.");
		process.exit(0);
	}
	return value as T;
}

/**
 * Interactive wizard for scaffolding an OpenClaw stack.
 *
 * 8-step flow:
 *  1. Project setup (directory name, deployment target)
 *  2. Service selection (grouped by category)
 *  3. Auto-dependency resolution (confirm auto-added services)
 *  4. Skill pack selection (filtered by compatible packs)
 *  5. Networking & security (proxy, domain, GPU, secrets)
 *  6. Review summary
 *  7. Generation with spinner
 *  8. Outro with next steps
 */
export async function runWizard(initialProjectDir?: string): Promise<void> {
	intro(pc.bgCyan(pc.black(" create-better-openclaw ")));

	// ── Step 1: Project Setup ─────────────────────────────────────────────────

	const projectDir = ensureNotCancelled(
		await text({
			message: "Project directory name:",
			placeholder: "my-openclaw-stack",
			initialValue: initialProjectDir ?? "",
			validate(value: string | undefined) {
				if (value === undefined || !value.trim().length) {
					return "Project directory is required.";
				}
				if (!/^[a-z0-9][a-z0-9-]*[a-z0-9]$|^[a-z0-9]$/.test(value.trim())) {
					return "Must be lowercase alphanumeric with hyphens (e.g. my-stack).";
				}
				return undefined;
			},
		}),
	);

	const deployment = ensureNotCancelled(
		await select({
			message: "Deployment target:",
			options: [
				{ value: "local" as const, label: "Local / Docker Desktop", hint: "development & testing" },
				{ value: "vps" as const, label: "VPS / Cloud Server", hint: "production" },
				{ value: "homelab" as const, label: "Homelab", hint: "self-hosted on local hardware" },
			],
		}),
	);

	const deploymentType = ensureNotCancelled(
		await select({
			message: "Deployment type:",
			options: [
				{ value: "docker" as const, label: "Docker", hint: "compose + start scripts" },
				{
					value: "bare-metal" as const,
					label: "Bare metal (VPS / computer)",
					hint: "includes platform-specific installer script",
				},
			],
		}),
	);

	const platformOptions =
		deploymentType === "docker"
			? [
					{ value: "linux/amd64" as const, label: "Linux (amd64)" },
					{ value: "linux/arm64" as const, label: "Linux (arm64)" },
				]
			: [
					{ value: "linux/amd64" as const, label: "Linux (amd64)" },
					{ value: "linux/arm64" as const, label: "Linux (arm64)" },
					{ value: "windows/amd64" as const, label: "Windows" },
					{ value: "macos/amd64" as const, label: "macOS (Intel)" },
					{ value: "macos/arm64" as const, label: "macOS (Apple Silicon)" },
				];

	const platform = ensureNotCancelled(
		await select({
			message: "Platform:",
			options: platformOptions,
		}),
	);

	// ── Step 2: Build Method & Service Selection ──────────────────────────────

	const buildMethod = ensureNotCancelled(
		await select({
			message: "How would you like to build your stack?",
			options: [
				{ value: "preset", label: "Start from a preset", hint: "recommended" },
				{ value: "custom", label: "Custom build", hint: "select individual services" },
			],
		}),
	);

	const allServices = getAllServices();
	let serviceIds: string[] = [];
	let preset: Preset | undefined;

	if (buildMethod === "preset") {
		const allPresets = getAllPresets();
		const presetId = ensureNotCancelled(
			await select({
				message: "Select a preset:",
				options: allPresets.map((p: Preset) => ({
					value: p.id,
					label: p.name,
					hint: p.description,
				})),
			}),
		);
		preset = allPresets.find((p: Preset) => p.id === presetId);
		if (preset) {
			serviceIds = [...preset.services];
		}
	} else {
		// Build grouped options for groupMultiselect
		const serviceGroups: Record<string, { value: string; label: string; hint?: string }[]> = {};

		for (const cat of SERVICE_CATEGORIES) {
			const services = allServices.filter((s: ServiceDefinition) => s.category === cat.id);
			if (services.length === 0) continue;
			serviceGroups[`${cat.icon} ${cat.name}`] = services.map((s: ServiceDefinition) => ({
				value: s.id,
				label: s.name,
				hint: s.description,
			}));
		}

		const selectedServices = ensureNotCancelled(
			await groupMultiselect({
				message: "Select companion services:",
				options: serviceGroups,
				required: false,
			}),
		);

		serviceIds = (selectedServices as string[]).filter(Boolean);
	}

	// ── Step 3: Auto-Dependency Resolution ────────────────────────────────────

	const resolved = resolve({
		services: serviceIds,
		skillPacks: [],
		proxy: "none",
		gpu: false,
		platform: "linux/amd64",
		monitoring: false,
	});

	let finalServiceIds = serviceIds;

	if (resolved.addedDependencies.length > 0) {
		const depList = resolved.addedDependencies
			.map(
				(d: { service: string; reason: string }) => `  ${pc.cyan(d.service)} - ${pc.dim(d.reason)}`,
			)
			.join("\n");

		note(
			`The following services will be auto-added as dependencies:\n\n${depList}`,
			"Auto-Dependencies",
		);

		const acceptDeps = ensureNotCancelled(
			await confirm({
				message: "Include these auto-dependencies?",
				initialValue: true,
			}),
		);

		if (acceptDeps) {
			finalServiceIds = [
				...new Set([
					...serviceIds,
					...resolved.addedDependencies.map((d: { service: string; reason: string }) => d.service),
				]),
			];
		}
	}

	// ── Step 4: Skill Pack Selection ──────────────────────────────────────────

	const compatiblePacks = getCompatibleSkillPacks(finalServiceIds);
	let selectedSkillPacks: string[] = [];

	if (compatiblePacks.length > 0) {
		const initialSkillPacks = preset ? preset.skillPacks : [];
		
		const skillPackChoice = ensureNotCancelled(
			await multiselect({
				message: "Select skill packs (filtered to compatible):",
				options: compatiblePacks.map((p: SkillPack) => ({
					value: p.id,
					label: `${p.icon ?? "📦"} ${p.name}`,
					hint: p.description,
				})),
				initialValues: initialSkillPacks.filter((id) => compatiblePacks.some((p) => p.id === id)),
				required: false,
			}),
		);

		selectedSkillPacks = (skillPackChoice as string[]).filter(Boolean);
	} else {
		note(
			"No skill packs are compatible with your selected services.\nYou can add skill packs later by editing the configuration.",
			"Skill Packs",
		);
	}

	// ── Step 5: AI Providers & Networking ─────────────────────────────────────────

	const aiProvidersChoice = ensureNotCancelled(
		await multiselect({
			message: "Select AI Providers to enable (Space to select, Enter to confirm):",
			options: [
				{ value: "openai", label: "OpenAI" },
				{ value: "anthropic", label: "Anthropic (Claude)" },
				{ value: "google", label: "Google (Gemini)" },
				{ value: "xai", label: "xAI (Grok)" },
				{ value: "deepseek", label: "DeepSeek" },
				{ value: "groq", label: "Groq" },
				{ value: "openrouter", label: "OpenRouter" },
				{ value: "mistral", label: "Mistral" },
				{ value: "together", label: "Together AI" },
				{ value: "ollama", label: "Ollama (Local)" },
				{ value: "lmstudio", label: "LM Studio (Local)" },
				{ value: "vllm", label: "vLLM (Local)" },
			],
			initialValues: ["openai"],
			required: false,
		}),
	);
	
	const selectedAiProviders = (aiProvidersChoice as string[]).filter(Boolean) as GenerationInput["aiProviders"];

	const gsdRuntimesChoice = ensureNotCancelled(
		await multiselect({
			message: "Install Get-Shit-Done AI Workflows? Select target runtimes (Optional):",
			options: [
				{ value: "claude", label: "Claude Code", hint: "Anthropic's CLI" },
				{ value: "opencode", label: "OpenCode", hint: "Open source CLI" },
				{ value: "gemini", label: "Gemini CLI", hint: "Google's CLI" },
				{ value: "codex", label: "Codex", hint: "Skills-first agent" },
			],
			required: false,
		})
	);
	const selectedGsdRuntimes = (gsdRuntimesChoice as string[]).filter(Boolean) as GenerationInput["gsdRuntimes"];

	const proxy = ensureNotCancelled(
		await select({
			message: "Reverse proxy:",
			options: [
				{ value: "none" as const, label: "None", hint: "direct port access" },
				{ value: "caddy" as const, label: "Caddy", hint: "auto-SSL with Let's Encrypt" },
				{ value: "traefik" as const, label: "Traefik", hint: "dynamic routing with labels" },
			],
		}),
	);

	let domain: string | undefined;
	if (proxy !== "none") {
		const domainInput = ensureNotCancelled(
			await text({
				message: "Domain for auto-SSL (leave empty to skip):",
				placeholder: "example.com",
			}),
		);
		const trimmed = String(domainInput).trim();
		domain = trimmed.length > 0 ? trimmed : undefined;
	}

	// Check if any selected service requires GPU
	const hasGpuServices = finalServiceIds.some((id) => {
		const def = allServices.find((s: ServiceDefinition) => s.id === id);
		return def?.gpuRequired;
	});

	const gpuChoice = ensureNotCancelled(
		await confirm({
			message: hasGpuServices
				? "Some selected services benefit from GPU. Enable GPU passthrough?"
				: "Enable GPU passthrough for AI services?",
			initialValue: hasGpuServices,
		}),
	);
	const gpu: boolean = gpuChoice;

	const generateSecrets: boolean = ensureNotCancelled(
		await confirm({
			message: "Auto-generate secure secrets for .env?",
			initialValue: true,
		}),
	);

	const enableMonitoring: boolean = ensureNotCancelled(
		await confirm({
			message: "Include monitoring stack (Grafana, Prometheus, Uptime Kuma)?",
			initialValue: false,
		}),
	);

	const outputFormat = ensureNotCancelled(
		await select({
			message: "Output format:",
			options: [
				{ value: "directory" as const, label: "Directory", hint: "default" },
				{ value: "zip" as const, label: "Zip Archive" },
				{ value: "tar" as const, label: "Tar Archive" },
			],
		}),
	);

	// ── Step 6: Review Summary ────────────────────────────────────────────────

	const serviceNames = finalServiceIds
		.map((id) => {
			const def = allServices.find((s: ServiceDefinition) => s.id === id);
			return def ? `${def.icon} ${def.name}` : id;
		})
		.join("\n  ");

	const allPacks = getAllSkillPacks();
	const skillPackNames =
		selectedSkillPacks.length > 0
			? selectedSkillPacks
					.map((id) => {
						const pack = allPacks.find((p: SkillPack) => p.id === id);
						return pack ? `${pack.icon ?? "📦"} ${pack.name}` : id;
					})
					.join("\n  ")
			: pc.dim("(none)");

	const summaryLines = [
		`${pc.bold("Project:")}       ${projectDir}`,
		`${pc.bold("Deployment:")}    ${String(deployment)}`,
		`${pc.bold("Deploy type:")}   ${String(deploymentType)}`,
		`${pc.bold("Platform:")}      ${String(platform)}`,
		`${pc.bold("Format:")}        ${String(outputFormat)}`,
		...(preset ? [`${pc.bold("Preset:")}        ${preset.name}`] : []),
		`${pc.bold("Services:")}`,
		`  ${serviceNames || pc.dim("(none)")}`,
		`${pc.bold("Skill Packs:")}`,
		`  ${skillPackNames}`,
		`${pc.bold("AI Providers:")}`,
		`  ${selectedAiProviders?.length ? selectedAiProviders.join(", ") : pc.dim("(none)")}`,
		`${pc.bold("GSD Channels:")}`,
		`  ${selectedGsdRuntimes?.length ? selectedGsdRuntimes.join(", ") : pc.dim("(none)")}`,
		`${pc.bold("Proxy:")}         ${String(proxy)}${domain ? ` (${domain})` : ""}`,
		`${pc.bold("GPU:")}           ${gpu ? "yes" : "no"}`,
		`${pc.bold("Monitoring:")}    ${enableMonitoring ? "yes" : "no"}`,
		`${pc.bold("Secrets:")}       ${generateSecrets ? "auto-generated" : "placeholders"}`,
	].join("\n");

	note(summaryLines, "Review your configuration");

	const confirmGenerate = ensureNotCancelled(
		await confirm({
			message: "Generate this stack?",
			initialValue: true,
		}),
	);

	if (!confirmGenerate) {
		cancel("Generation cancelled.");
		return;
	}

	// ── Step 7: Generate ──────────────────────────────────────────────────────

	const s = spinner();
	s.start("Generating your OpenClaw stack...");

	const input: GenerationInput = {
		projectName: String(projectDir),
		services: finalServiceIds,
		skillPacks: selectedSkillPacks,
		aiProviders: selectedAiProviders,
		gsdRuntimes: selectedGsdRuntimes,
		proxy: String(proxy) as GenerationInput["proxy"],
		domain,
		gpu,
		platform: platform as GenerationInput["platform"],
		deployment: String(deployment) as GenerationInput["deployment"],
		deploymentType: deploymentType as GenerationInput["deploymentType"],
		generateSecrets,
		openclawVersion: "latest",
		monitoring: enableMonitoring,
	};

	let result: ReturnType<typeof generate>;
	try {
		result = generate(input);
	} catch (err) {
		s.stop("Generation failed.");
		console.error(pc.red(`\n${err instanceof Error ? err.message : String(err)}`));
		process.exit(1);
	}

	await writeProject(String(projectDir), result.files, {
		outputFormat: String(outputFormat),
	});

	s.stop("Stack generated successfully!");

	// ── Step 8: Outro ─────────────────────────────────────────────────────────

	const startCommand =
		deploymentType === "bare-metal"
			? platform === "windows/amd64"
				? ".\\install.ps1  # install Docker and start (Windows)"
				: "./install.sh    # install Docker and start (Linux/macOS)"
			: "docker compose up -d";

	const nextSteps = [
		`cd ${String(projectDir)}`,
		"cp .env.example .env  # review and customize",
		startCommand,
	].join("\n");

	note(nextSteps, "Next steps");

	outro(
		pc.green(
			`Done! ${result.metadata.serviceCount} services, ${result.metadata.skillCount} skills, ~${result.metadata.estimatedMemoryMB}MB estimated RAM.`,
		),
	);
}
