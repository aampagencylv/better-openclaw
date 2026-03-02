"use client";

import {
	type AiProvider,
	composeMultiFile,
	type GsdRuntime,
	generateEnvFiles,
	getAllPresets,
	getAllServices,
	getAllSkillPacks,
	type ResolverOutput,
	resolve,
	SERVICE_CATEGORIES,
	type ServiceDefinition,
	type SkillPack,
} from "@better-openclaw/core";
import JSZip from "jszip";
import {
	AlertTriangle,
	ArrowLeft,
	CheckCircle,
	Copy,
	Download,
	Loader2,
	Rocket,
	RotateCcw,
	Search,
	X,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { DependencyGraph } from "@/components/stack-builder/DependencyGraph";
import { DeployModal } from "@/components/stack-builder/DeployModal";
import { PreviewPanel } from "@/components/stack-builder/PreviewPanel";
import { ServiceGrid } from "@/components/stack-builder/ServiceGrid";
import {
	type SelectedSkill,
	SkillSelectorModal,
} from "@/components/stack-builder/SkillSelectorModal";
import { generateStack, generateStackAsZip, generateStackComplete } from "@/lib/api-client";
import { cn } from "@/lib/utils";

const CLAWEXA_DEPLOY_URL = process.env.NEXT_PUBLIC_CLAWEXA_DEPLOY_URL ?? "";
const CLAWEXA_SITE = "https://clawexa.net";

export default function NewStackPage() {
	const [selectedServices, setSelectedServices] = useState<Set<string>>(new Set(["tailscale"]));
	const [projectName, setProjectName] = useState("my-stack");
	const [searchQuery, setSearchQuery] = useState("");
	const [activePreset, setActivePreset] = useState<string | null>(null);
	const [isGenerating, setIsGenerating] = useState(false);
	const [generateError, setGenerateError] = useState<string | null>(null);
	const [downloadComplete, setDownloadComplete] = useState(false);
	const [pendingRemovalId, setPendingRemovalId] = useState<string | null>(null);
	const [showDeploymentModal, setShowDeploymentModal] = useState(false);
	const [deploymentType, setDeploymentType] = useState<"docker" | "bare-metal">("docker");
	const [platform, setPlatform] = useState<string>("linux/amd64");
	const [lastDownloadOptions, setLastDownloadOptions] = useState<{
		deploymentType: "docker" | "bare-metal";
		platform: string;
	} | null>(null);
	const [showClawexaModal, setShowClawexaModal] = useState(false);
	const [clawexaAction, setClawexaAction] = useState<"idle" | "loading" | "sent" | "error">("idle");
	const [selectedSkillPacks, setSelectedSkillPacks] = useState<Set<string>>(new Set());
	const [selectedAiProviders, setSelectedAiProviders] = useState<Set<AiProvider>>(
		new Set(["openai"]),
	);
	const [selectedGsdRuntimes, setSelectedGsdRuntimes] = useState<Set<GsdRuntime>>(new Set());
	const [resolverError, setResolverError] = useState<string | null>(null);
	const [showSkillModal, setShowSkillModal] = useState(false);
	const [showDeployToServerModal, setShowDeployToServerModal] = useState(false);
	const [selectedIndividualSkills, setSelectedIndividualSkills] = useState<
		Map<string, SelectedSkill>
	>(new Map());

	// Load all services, presets, and skill packs from core registry
	const allServices: ServiceDefinition[] = useMemo(() => getAllServices(), []);
	const allPresets = useMemo(() => getAllPresets(), []);
	const allSkillPacks: SkillPack[] = useMemo(() => getAllSkillPacks(), []);

	// Filter services based on search query
	const filteredServices = useMemo(() => {
		if (!searchQuery.trim()) return allServices;
		const q = searchQuery.toLowerCase().trim();
		return allServices.filter(
			(s) =>
				s.name.toLowerCase().includes(q) ||
				s.description.toLowerCase().includes(q) ||
				s.tags.some((t) => t.toLowerCase().includes(q)),
		);
	}, [allServices, searchQuery]);

	// Resolve dependencies in real-time
	const resolverOutput: ResolverOutput | null = useMemo(() => {
		if (selectedServices.size === 0 && selectedSkillPacks.size === 0) {
			setResolverError(null);
			return null;
		}
		try {
			const result = resolve({
				services: Array.from(selectedServices),
				skillPacks: Array.from(selectedSkillPacks),
				aiProviders: Array.from(selectedAiProviders),
				gsdRuntimes: Array.from(selectedGsdRuntimes),
				proxy: "none",
				gpu: false,
				platform: "linux/amd64",
				monitoring: false,
			});
			if (!result.isValid) {
				setResolverError(result.errors.map((e) => e.message).join("; "));
			} else {
				setResolverError(null);
			}
			return result;
		} catch (err) {
			setResolverError(err instanceof Error ? err.message : "Resolution failed");
			return null;
		}
	}, [selectedServices, selectedSkillPacks, selectedAiProviders, selectedGsdRuntimes]);

	// Build a set of all resolved service IDs (including auto-added deps)
	const resolvedServiceIds = useMemo(() => {
		if (!resolverOutput) return new Set<string>();
		return new Set(resolverOutput.services.map((s) => s.definition.id));
	}, [resolverOutput]);

	// Generate docker-compose preview using the multi-file composer
	const composeYaml = useMemo(() => {
		if (!resolverOutput || resolverOutput.services.length === 0) return "";
		try {
			const result = composeMultiFile(resolverOutput, {
				projectName: projectName || "my-stack",
				proxy: "none",
				gpu: false,
				platform: "linux/amd64",
				deployment: "local",
				openclawVersion: "latest",
				openclawImage: "official",
				hardened: true,
				openclawInstallMethod: "docker"
			});
			// Return the main file YAML as fallback for the composeYaml prop
			return result.files[result.mainFile] ?? "";
		} catch {
			return "# Error generating preview...";
		}
	}, [resolverOutput, projectName]);

	// Generate .env content for deploy-to-server
	const envContent = useMemo(() => {
		if (!resolverOutput || resolverOutput.services.length === 0) return "";
		try {
			const { env } = generateEnvFiles(resolverOutput, {
				generateSecrets: true,
				openclawVersion: "latest",
				openclawImage: "official",
			});
			return env;
		} catch {
			return "";
		}
	}, [resolverOutput]);

	// Toggle a service selection (mandatory services require confirmation to remove)
	const handleToggle = useCallback(
		(id: string) => {
			const service = allServices.find((s) => s.id === id);
			const isMandatory = service?.mandatory === true;
			const isDeselecting = selectedServices.has(id);

			if (isDeselecting && isMandatory) {
				setPendingRemovalId(id);
				return;
			}

			setSelectedServices((prev) => {
				const next = new Set(prev);
				if (next.has(id)) {
					next.delete(id);
				} else {
					next.add(id);
				}
				return next;
			});
			setActivePreset(null);
		},
		[allServices, selectedServices],
	);

	const confirmMandatoryRemoval = useCallback(() => {
		if (pendingRemovalId) {
			setSelectedServices((prev) => {
				const next = new Set(prev);
				next.delete(pendingRemovalId);
				return next;
			});
			setActivePreset(null);
			setPendingRemovalId(null);
		}
	}, [pendingRemovalId]);

	const cancelMandatoryRemoval = useCallback(() => {
		setPendingRemovalId(null);
	}, []);

	// Apply a preset
	const handlePreset = useCallback(
		(presetId: string) => {
			const preset = allPresets.find((p) => p.id === presetId);
			if (!preset) return;
			if (activePreset === presetId) {
				// Toggle off
				setSelectedServices(new Set());
				setActivePreset(null);
			} else {
				setSelectedServices(new Set(preset.services));
				setActivePreset(presetId);
			}
		},
		[allPresets, activePreset],
	);

	// Reset all selections
	const handleReset = useCallback(() => {
		setSelectedServices(new Set());
		setSelectedSkillPacks(new Set());
		setSelectedAiProviders(new Set(["openai"]));
		setSelectedGsdRuntimes(new Set());
		setSelectedIndividualSkills(new Map());
		setActivePreset(null);
		setSearchQuery("");
		setGenerateError(null);
		setResolverError(null);
	}, []);

	// Download generated stack as a real ZIP file (optionally with deployment type and platform from modal)
	const handleDownload = useCallback(
		async (opts?: { deploymentType: "docker" | "bare-metal"; platform: string }) => {
			if (selectedServices.size === 0) return;
			const deploymentType = opts?.deploymentType ?? "docker";
			const platform = opts?.platform ?? "linux/amd64";
			setLastDownloadOptions({ deploymentType, platform });
			setIsGenerating(true);
			setGenerateError(null);
			setDownloadComplete(false);
			try {
				const name = projectName || "my-stack";

				const result = await generateStack({
					projectName: name,
					services: Array.from(selectedServices),
					skillPacks: Array.from(selectedSkillPacks),
					aiProviders: Array.from(selectedAiProviders),
					gsdRuntimes: Array.from(selectedGsdRuntimes),
					proxy: "none",
					gpu: false,
					platform,
					deployment: "local",
					deploymentType,
					monitoring: false,
				});

				const zip = new JSZip();
				const folder = zip.folder(name);
				if (folder) {
					for (const [path, content] of Object.entries(result.files)) {
						folder.file(path, content);
					}
				}

				const blob = await zip.generateAsync({ type: "blob" });
				const url = URL.createObjectURL(blob);
				const a = document.createElement("a");
				a.href = url;
				a.download = `${name}.zip`;
				document.body.appendChild(a);
				a.click();
				document.body.removeChild(a);
				URL.revokeObjectURL(url);

				setDownloadComplete(true);
			} catch (err) {
				setGenerateError(err instanceof Error ? err.message : "Failed to generate stack");
			} finally {
				setIsGenerating(false);
			}
		},
		[selectedServices, projectName, selectedSkillPacks, selectedAiProviders, selectedGsdRuntimes],
	);

	return (
		<div className="flex min-h-screen flex-col">
			{/* Header */}
			<header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur-md">
				<div className="mx-auto flex max-w-[1600px] items-center justify-between px-4 py-3 md:px-6">
					<div className="flex items-center gap-4">
						<Link
							href="/"
							className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
						>
							<ArrowLeft className="h-4 w-4" />
							Home
						</Link>
						<div className="h-4 w-px bg-border" />
						<div className="flex items-center gap-2">
							<span className="text-lg">🦞</span>
							<h1 className="text-lg font-bold text-foreground">Stack Builder</h1>
						</div>
					</div>

					<div className="flex items-center gap-3">
						{/* Project name input */}
						<div className="hidden items-center gap-2 sm:flex">
							<label htmlFor="project-name" className="text-xs text-muted-foreground">
								Project:
							</label>
							<input
								id="project-name"
								type="text"
								value={projectName}
								onChange={(e) => setProjectName(e.target.value)}
								placeholder="my-stack"
								className="w-36 rounded-lg border border-border bg-surface px-3 py-1.5 font-mono text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
							/>
						</div>

						<button
							type="button"
							onClick={handleReset}
							className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
						>
							<RotateCcw className="h-3.5 w-3.5" />
							Reset
						</button>

						<button
							type="button"
							onClick={() => setShowDeployToServerModal(true)}
							disabled={selectedServices.size === 0}
							className={cn(
								"hidden items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-all sm:flex",
								selectedServices.size > 0
									? "border-primary/30 bg-primary/10 text-primary hover:bg-primary/20"
									: "border-border text-muted-foreground cursor-not-allowed",
							)}
						>
							<Rocket className="h-3.5 w-3.5" />
							Deploy to Server
						</button>
						<button
							type="button"
							onClick={() => setShowClawexaModal(true)}
							disabled={selectedServices.size === 0}
							className="hidden text-sm text-muted-foreground hover:text-foreground disabled:opacity-50 sm:block"
						>
							Deploy to clawexa.net
						</button>
						<button
							type="button"
							onClick={() => setShowDeploymentModal(true)}
							disabled={selectedServices.size === 0 || isGenerating}
							className={cn(
								"flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-sm font-semibold transition-all",
								selectedServices.size > 0
									? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm shadow-primary/20"
									: "bg-muted text-muted-foreground cursor-not-allowed",
							)}
						>
							{isGenerating ? (
								<>
									<Loader2 className="h-4 w-4 animate-spin" />
									Generating...
								</>
							) : (
								<>
									<Download className="h-4 w-4" />
									Download Stack
								</>
							)}
						</button>
					</div>
				</div>
			</header>

			{/* Error banners */}
			{generateError && (
				<div className="border-b border-red-500/20 bg-red-500/5 px-6 py-3 text-center text-sm text-red-400">
					{generateError}
				</div>
			)}
			{resolverError && (
				<div className="flex items-center justify-center gap-2 border-b border-amber-500/20 bg-amber-500/5 px-6 py-3 text-center text-sm text-amber-400">
					<AlertTriangle className="h-4 w-4 shrink-0" />
					{resolverError}
				</div>
			)}

			{/* Post-download instructions */}
			{downloadComplete && (
				<div className="border-b border-accent/20 bg-accent/5 px-6 py-4">
					<div className="mx-auto max-w-3xl">
						<div className="flex items-start gap-3">
							<CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
							<div className="flex-1">
								<p className="font-semibold text-accent">Stack downloaded successfully!</p>
								<p className="mt-1 text-sm text-muted-foreground">
									Extract the ZIP and follow these steps:
								</p>
								{lastDownloadOptions?.deploymentType === "bare-metal" && (
									<p className="mt-2 rounded bg-surface/80 px-3 py-2 font-mono text-xs text-foreground">
										{lastDownloadOptions.platform === "windows/amd64"
											? ".\\install.ps1"
											: "./install.sh"}{" "}
										— Run on your server to install Docker and start the stack.
									</p>
								)}
								<div className="mt-3 space-y-2">
									{[
										`cd ${projectName || "my-stack"}`,
										"cp .env.example .env        # Edit with your API keys",
										lastDownloadOptions?.deploymentType === "bare-metal"
											? lastDownloadOptions.platform === "windows/amd64"
												? ".\\install.ps1        # Install Docker and start (Windows)"
												: "./install.sh          # Install Docker and start (Linux/macOS)"
											: "docker compose up -d        # Start everything",
										"docker compose logs -f openclaw-gateway   # Watch OpenClaw boot",
									].map((cmd) => (
										<div
											key={cmd}
											className="flex items-center gap-2 rounded bg-surface/80 px-3 py-1.5 font-mono text-xs text-foreground"
										>
											<span className="text-muted-foreground">$</span>
											<code className="flex-1">{cmd}</code>
											<button
												type="button"
												onClick={() =>
													navigator.clipboard.writeText(cmd.split("#")[0]?.trim() ?? cmd)
												}
												className="text-muted-foreground hover:text-foreground"
												title="Copy command"
											>
												<Copy className="h-3 w-3" />
											</button>
										</div>
									))}
								</div>
								<div className="mt-3 flex flex-wrap items-center gap-2">
									<button
										type="button"
										onClick={() => setDownloadComplete(false)}
										className="text-xs text-muted-foreground hover:text-foreground"
									>
										Dismiss
									</button>
									<span className="text-muted-foreground">·</span>
									<button
										type="button"
										onClick={() => setShowDeployToServerModal(true)}
										className="text-xs text-primary hover:underline"
									>
										Deploy to Dokploy / Coolify
									</button>
									<span className="text-muted-foreground">·</span>
									<button
										type="button"
										onClick={() => setShowClawexaModal(true)}
										className="text-xs text-primary hover:underline"
									>
										Deploy to clawexa.net
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Deploy to clawexa.net modal */}
			{showClawexaModal && (
				<div
					className="fixed inset-0 z-50 flex items-center justify-center bg-background/50 p-4"
					role="dialog"
					aria-modal="true"
					aria-labelledby="clawexa-modal-title"
				>
					<div className="w-full max-w-md rounded-xl border border-border bg-background p-5 shadow-lg">
						<h2 id="clawexa-modal-title" className="text-lg font-semibold text-foreground">
							Deploy to clawexa.net
						</h2>
						<p className="mt-1 text-sm text-muted-foreground">
							Download as ZIP, copy complete JSON, or send to the clawexa.net endpoint (when
							configured).
						</p>
						<div className="mt-4 flex flex-col gap-2">
							<button
								type="button"
								disabled={isGenerating}
								onClick={async () => {
									if (selectedServices.size === 0) return;
									setIsGenerating(true);
									setGenerateError(null);
									try {
										const blob = await generateStackAsZip({
											projectName: projectName || "my-stack",
											services: Array.from(selectedServices),
											skillPacks: [],
											aiProviders: Array.from(selectedAiProviders),
											gsdRuntimes: Array.from(selectedGsdRuntimes),
											proxy: "none",
											gpu: false,
											platform: "linux/amd64",
											deployment: "local",
											deploymentType: "docker",
											monitoring: false,
										});
										const url = URL.createObjectURL(blob);
										const a = document.createElement("a");
										a.href = url;
										a.download = `${projectName || "my-stack"}.zip`;
										a.click();
										URL.revokeObjectURL(url);
									} catch (err) {
										setGenerateError(err instanceof Error ? err.message : "Failed to get ZIP");
									} finally {
										setIsGenerating(false);
									}
								}}
								className="rounded-lg border border-border bg-surface px-3 py-2 text-left text-sm font-medium text-foreground hover:bg-surface/80 disabled:opacity-50"
							>
								Download ZIP
							</button>
							<button
								type="button"
								disabled={isGenerating}
								onClick={async () => {
									if (selectedServices.size === 0) return;
									setIsGenerating(true);
									setGenerateError(null);
									try {
										const complete = await generateStackComplete({
											projectName: projectName || "my-stack",
											services: Array.from(selectedServices),
											skillPacks: [],
											aiProviders: Array.from(selectedAiProviders),
											gsdRuntimes: Array.from(selectedGsdRuntimes),
											proxy: "none",
											gpu: false,
											platform: "linux/amd64",
											deployment: "local",
											deploymentType: "docker",
											monitoring: false,
										});
										await navigator.clipboard.writeText(JSON.stringify(complete, null, 2));
										setShowClawexaModal(false);
									} catch (err) {
										setGenerateError(err instanceof Error ? err.message : "Failed to copy JSON");
									} finally {
										setIsGenerating(false);
									}
								}}
								className="rounded-lg border border-border bg-surface px-3 py-2 text-left text-sm font-medium text-foreground hover:bg-surface/80 disabled:opacity-50"
							>
								Copy complete JSON
							</button>
							<a
								href={CLAWEXA_SITE}
								target="_blank"
								rel="noopener noreferrer"
								className="rounded-lg border border-border bg-surface px-3 py-2 text-center text-sm font-medium text-primary hover:bg-surface/80"
							>
								Open clawexa.net
							</a>
							{CLAWEXA_DEPLOY_URL && (
								<button
									type="button"
									disabled={isGenerating || clawexaAction === "sent"}
									onClick={async () => {
										if (selectedServices.size === 0) return;
										setClawexaAction("loading");
										setGenerateError(null);
										try {
											const complete = await generateStackComplete({
												projectName: projectName || "my-stack",
												services: Array.from(selectedServices),
												skillPacks: [],
												aiProviders: Array.from(selectedAiProviders),
												gsdRuntimes: Array.from(selectedGsdRuntimes),
												proxy: "none",
												gpu: false,
												platform: "linux/amd64",
												deployment: "local",
												deploymentType: "docker",
												monitoring: false,
											});
											const res = await fetch(CLAWEXA_DEPLOY_URL, {
												method: "POST",
												headers: { "Content-Type": "application/json" },
												body: JSON.stringify(complete),
											});
											if (!res.ok) throw new Error(`Deploy failed: ${res.status}`);
											setClawexaAction("sent");
										} catch (err) {
											setGenerateError(err instanceof Error ? err.message : "Send failed");
											setClawexaAction("error");
										}
									}}
									className="rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
								>
									{clawexaAction === "loading"
										? "Sending..."
										: clawexaAction === "sent"
											? "Sent"
											: "Send to clawexa.net"}
								</button>
							)}
						</div>
						<div className="mt-4 flex justify-end">
							<button
								type="button"
								onClick={() => {
									setShowClawexaModal(false);
									setClawexaAction("idle");
								}}
								className="rounded-lg border border-border bg-muted px-3 py-2 text-sm font-medium text-foreground hover:bg-muted/80"
							>
								Close
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Main content - two panel layout */}
			<div className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col lg:flex-row">
				{/* Left panel - Service selector */}
				<div className="flex-1 overflow-y-auto border-r border-border p-4 md:p-6">
					<div className="mb-6">
						<h2 className="text-xl font-bold text-foreground">Select Services</h2>
						<p className="mt-1 text-sm text-muted-foreground">
							Pick the services for your stack. Dependencies are resolved automatically.
						</p>
					</div>

					{/* Search bar */}
					<div className="relative mb-4">
						<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
						<input
							type="text"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							placeholder="Search services..."
							className="w-full rounded-lg border border-border bg-surface/50 py-2 pl-9 pr-9 text-sm text-foreground placeholder:text-muted-foreground/50 transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
						/>
						{searchQuery && (
							<button
								type="button"
								onClick={() => setSearchQuery("")}
								className="absolute right-3 top-1/2 -translate-y-1/2 rounded-sm p-0.5 text-muted-foreground transition-colors hover:text-foreground"
								aria-label="Clear search"
							>
								<X className="h-3.5 w-3.5" />
							</button>
						)}
					</div>

					{/* Preset quick-select */}
					<div className="mb-6 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
						{allPresets.map((preset) => (
							<button
								key={preset.id}
								type="button"
								onClick={() => handlePreset(preset.id)}
								className={cn(
									"shrink-0 rounded-full border px-3 py-1 text-xs font-medium transition-all",
									activePreset === preset.id
										? "border-primary/30 bg-primary/10 text-primary"
										: "border-transparent bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary hover:border-primary/30",
								)}
							>
								{preset.name}
							</button>
						))}
					</div>

					{/* Advanced Skill Selection */}
					<div className="mb-6">
						<div className="flex items-center justify-between">
							<div>
								<h3 className="text-sm font-semibold text-foreground">Agent Skills</h3>
								<p className="mt-0.5 text-xs text-muted-foreground">
									{selectedIndividualSkills.size > 0
										? `${selectedIndividualSkills.size} skill${selectedIndividualSkills.size !== 1 ? "s" : ""} selected`
										: "Browse 180+ curated skills or search the SkillsMP marketplace"}
								</p>
							</div>
							<button
								type="button"
								onClick={() => setShowSkillModal(true)}
								className="flex items-center gap-2 rounded-lg bg-primary/10 px-4 py-2 text-sm font-semibold text-primary transition-all hover:bg-primary/20 border border-primary/20"
							>
								<Search className="h-4 w-4" />
								Browse Skills
							</button>
						</div>

						{/* Selected skills chips */}
						{selectedIndividualSkills.size > 0 && (
							<div className="mt-3 flex flex-wrap gap-1.5">
								{Array.from(selectedIndividualSkills.values()).map((skill) => (
									<span
										key={skill.id}
										className={cn(
											"inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium",
											skill.source === "curated"
												? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
												: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
										)}
									>
										{skill.emoji} {skill.name}
										<button
											aria-label="Remove skill"
											type="button"
											onClick={() => {
												setSelectedIndividualSkills((prev) => {
													const next = new Map(prev);
													next.delete(skill.id);
													return next;
												});
											}}
											className="ml-0.5 rounded-full p-0.5 hover:bg-background/10 dark:hover:bg-white/10"
										>
											<X className="h-3 w-3" />
										</button>
									</span>
								))}
							</div>
						)}

						{/* Quick Skill Packs */}
						{allSkillPacks.length > 0 && (
							<div className="mt-4">
								<p className="mb-2 text-xs font-medium text-muted-foreground">Quick Packs:</p>
								<div className="flex flex-wrap gap-1.5">
									{allSkillPacks.map((pack) => {
										const isSelected = selectedSkillPacks.has(pack.id);
										return (
											<button
												key={pack.id}
												type="button"
												onClick={() => {
													setSelectedSkillPacks((prev) => {
														const next = new Set(prev);
														if (next.has(pack.id)) {
															next.delete(pack.id);
														} else {
															next.add(pack.id);
														}
														return next;
													});
												}}
												className={cn(
													"shrink-0 rounded-full border px-3 py-1 text-xs font-medium transition-all",
													isSelected
														? "border-primary/30 bg-primary/10 text-primary"
														: "border-transparent bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary",
												)}
											>
												{pack.icon ?? ""} {pack.name}
											</button>
										);
									})}
								</div>
							</div>
						)}

						{/* AI Providers Selection */}
						<div className="mt-6 mb-6">
							<div className="flex items-center justify-between mb-2">
								<div>
									<h3 className="text-sm font-semibold text-foreground">AI Providers</h3>
									<p className="mt-0.5 text-xs text-muted-foreground">
										Select one or more LLM gateways to configure
									</p>
								</div>
							</div>
							<div className="flex flex-wrap gap-2 mt-3">
								{[
									{ id: "openai", name: "OpenAI" },
									{ id: "anthropic", name: "Anthropic" },
									{ id: "google", name: "Google Gemini" },
									{ id: "xai", name: "xAI Grok" },
									{ id: "deepseek", name: "DeepSeek" },
									{ id: "groq", name: "Groq" },
									{ id: "openrouter", name: "OpenRouter" },
									{ id: "mistral", name: "Mistral" },
									{ id: "together", name: "Together AI" },
									{ id: "ollama", name: "Ollama (Local)" },
									{ id: "lmstudio", name: "LM Studio" },
									{ id: "vllm", name: "vLLM" },
								].map((provider) => {
									const providerId = provider.id as AiProvider;
									const isSelected = selectedAiProviders.has(providerId);
									return (
										<button
											key={provider.id}
											type="button"
											onClick={() => {
												setSelectedAiProviders((prev) => {
													const next = new Set(prev);
													if (next.has(providerId)) {
														next.delete(providerId);
													} else {
														next.add(providerId);
													}
													return next;
												});
											}}
											className={cn(
												"shrink-0 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all",
												isSelected
													? "border-primary bg-primary/20 text-primary shadow-[0_0_10px_rgba(163,135,95,0.2)]"
													: "border-border/50 bg-surface/50 text-muted-foreground hover:bg-surface hover:text-foreground",
											)}
										>
											{provider.name}
										</button>
									);
								})}
							</div>
						</div>

						{/* Get-Shit-Done Channels Selection */}
						<div className="mt-6 mb-6">
							<div className="flex items-center justify-between mb-2">
								<div>
									<h3 className="text-sm font-semibold text-foreground">
										GSD AI Runtimes (Optional)
									</h3>
									<p className="mt-0.5 text-xs text-muted-foreground">
										Select one or more agent workflows to install automatically
									</p>
								</div>
							</div>
							<div className="flex flex-wrap gap-2 mt-3">
								{(
									[
										{ id: "claude", name: "Claude Code", emoji: "🟠" },
										{ id: "opencode", name: "OpenCode", emoji: "🟢" },
										{ id: "gemini", name: "Gemini CLI", emoji: "🔵" },
										{ id: "codex", name: "Codex", emoji: "🟣" },
									] as const
								).map((runtime) => {
									const runtimeId = runtime.id as unknown as GsdRuntime;
									const isSelected = selectedGsdRuntimes.has(runtimeId);
									return (
										<button
											key={runtime.id}
											type="button"
											onClick={() => {
												setSelectedGsdRuntimes((prev) => {
													const next = new Set(prev);
													if (next.has(runtime.id as GsdRuntime)) {
														next.delete(runtime.id as GsdRuntime);
													} else {
														next.add(runtime.id as GsdRuntime);
													}
													return next;
												});
											}}
											className={cn(
												"shrink-0 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all",
												isSelected
													? "border-primary bg-primary/20 text-primary shadow-[0_0_10px_rgba(163,135,95,0.2)]"
													: "border-border/50 bg-surface/50 text-muted-foreground hover:bg-surface hover:text-foreground",
											)}
										>
											{runtime.emoji} {runtime.name}
										</button>
									);
								})}
							</div>
						</div>
					</div>

					<ServiceGrid
						services={filteredServices}
						categories={SERVICE_CATEGORIES}
						selectedIds={resolvedServiceIds}
						resolvedServices={resolverOutput?.services ?? []}
						onToggle={handleToggle}
					/>

					{/* No results message */}
					{searchQuery && filteredServices.length === 0 && (
						<div className="py-12 text-center">
							<p className="text-sm text-muted-foreground">
								No services match &ldquo;{searchQuery}&rdquo;
							</p>
							<button
								type="button"
								onClick={() => setSearchQuery("")}
								className="mt-2 text-xs text-primary hover:underline"
							>
								Clear search
							</button>
						</div>
					)}
				</div>

				{/* Right panel - Preview (sticky on desktop) */}
				<div className="w-full shrink-0 bg-background/50 p-4 md:p-6 lg:sticky lg:top-[57px] lg:h-[calc(100vh-57px)] lg:w-[520px] lg:overflow-y-auto xl:w-[580px]">
					<div className="mb-4">
						<h2 className="text-xl font-bold text-foreground">Stack Preview</h2>
						<p className="mt-1 text-sm text-muted-foreground">
							Live preview of your generated configuration.
						</p>
					</div>
					<PreviewPanel
						composeYaml={composeYaml}
						resolverOutput={resolverOutput}
						projectName={projectName}
						selectedServiceIds={Array.from(selectedServices)}
					/>

					{/* Dependency Graph */}
					{resolverOutput && resolverOutput.services.length > 1 && (
						<div className="mt-6">
							<h3 className="mb-3 text-sm font-semibold text-foreground">Dependency Graph</h3>
							<DependencyGraph resolverOutput={resolverOutput} />
						</div>
					)}
				</div>
			</div>

			{/* Deployment options modal (before building) */}
			{showDeploymentModal && (
				<div
					className="fixed inset-0 z-50 flex items-center justify-center bg-background/50 p-4"
					role="dialog"
					aria-modal="true"
					aria-labelledby="deployment-modal-title"
				>
					<div className="w-full max-w-md rounded-xl border border-border bg-background p-5 shadow-lg">
						<h2 id="deployment-modal-title" className="text-lg font-semibold text-foreground">
							Deployment options
						</h2>
						<p className="mt-1 text-sm text-muted-foreground">
							Choose how you want to run the stack and your target platform.
						</p>

						<div className="mt-4">
							<label className="block text-sm font-medium text-foreground">Deployment</label>
							<div className="mt-2 flex gap-4">
								<label className="flex cursor-pointer items-center gap-2">
									<input
										type="radio"
										name="deploymentType"
										checked={deploymentType === "docker"}
										onChange={() => {
											setDeploymentType("docker");
											if (platform.startsWith("windows/") || platform.startsWith("macos/")) {
												setPlatform("linux/amd64");
											}
										}}
										className="h-4 w-4 border-border text-primary focus:ring-primary"
									/>
									<span className="text-sm text-foreground">Docker</span>
								</label>
								<label className="flex cursor-pointer items-center gap-2">
									<input
										type="radio"
										name="deploymentType"
										checked={deploymentType === "bare-metal"}
										onChange={() => setDeploymentType("bare-metal")}
										className="h-4 w-4 border-border text-primary focus:ring-primary"
									/>
									<span className="text-sm text-foreground">Bare-metal (native + Docker)</span>
								</label>
							</div>
							<p className="mt-1.5 text-xs text-muted-foreground">
								Docker: all services in containers. Bare-metal: some services (e.g. Redis) run
								natively on the host; the rest run in Docker. You get{" "}
								<code className="rounded bg-muted px-1">install.sh</code> /{" "}
								<code className="rounded bg-muted px-1">install.ps1</code> and{" "}
								<code className="rounded bg-muted px-1">native/</code> scripts.
							</p>
						</div>

						<div className="mt-4">
							<label
								htmlFor="platform-select"
								className="block text-sm font-medium text-foreground"
							>
								Platform
							</label>
							<select
								id="platform-select"
								value={platform}
								onChange={(e) => setPlatform(e.target.value)}
								className="mt-2 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
							>
								{deploymentType === "docker" ? (
									<>
										<option value="linux/amd64">Linux (amd64)</option>
										<option value="linux/arm64">Linux (arm64)</option>
									</>
								) : (
									<>
										<option value="linux/amd64">Linux (amd64)</option>
										<option value="linux/arm64">Linux (arm64)</option>
										<option value="windows/amd64">Windows</option>
										<option value="macos/amd64">macOS (Intel)</option>
										<option value="macos/arm64">macOS (Apple Silicon)</option>
									</>
								)}
							</select>
						</div>

						<div className="mt-6 flex justify-end gap-2">
							<button
								type="button"
								onClick={() => setShowDeploymentModal(false)}
								className="rounded-lg border border-border bg-muted px-3 py-2 text-sm font-medium text-foreground hover:bg-muted/80"
							>
								Cancel
							</button>
							<button
								type="button"
								onClick={() => {
									setShowDeploymentModal(false);
									handleDownload({ deploymentType, platform });
								}}
								disabled={isGenerating}
								className="rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
							>
								Generate and download
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Mandatory service removal confirmation */}
			{pendingRemovalId &&
				(() => {
					const svc = allServices.find((s) => s.id === pendingRemovalId);
					const name = svc?.name ?? pendingRemovalId;
					return (
						<div
							className="fixed inset-0 z-50 flex items-center justify-center bg-background/50 p-4"
							role="dialog"
							aria-modal="true"
							aria-labelledby="mandatory-removal-title"
						>
							<div className="w-full max-w-sm rounded-xl border border-border bg-background p-5 shadow-lg">
								<h2 id="mandatory-removal-title" className="text-lg font-semibold text-foreground">
									Remove {name}?
								</h2>
								<p className="mt-2 text-sm text-muted-foreground">
									{svc?.removalWarning ??
										`${name} is recommended for your stack. Removing it may affect functionality.`}{" "}
									Remove anyway?
								</p>
								<div className="mt-5 flex justify-end gap-2">
									<button
										type="button"
										onClick={cancelMandatoryRemoval}
										className="rounded-lg border border-border bg-muted px-3 py-2 text-sm font-medium text-foreground hover:bg-muted/80"
									>
										Cancel
									</button>
									<button
										type="button"
										onClick={confirmMandatoryRemoval}
										className="rounded-lg bg-destructive px-3 py-2 text-sm font-medium text-destructive-foreground hover:bg-destructive/90"
									>
										Remove
									</button>
								</div>
							</div>
						</div>
					);
				})()}

			{/* Deploy to Server Modal (Dokploy / Coolify) */}
			<DeployModal
				open={showDeployToServerModal}
				onClose={() => setShowDeployToServerModal(false)}
				projectName={projectName || "my-stack"}
				composeYaml={composeYaml}
				envContent={envContent}
			/>

			{/* Skill Selector Modal */}
			<SkillSelectorModal
				open={showSkillModal}
				onClose={() => setShowSkillModal(false)}
				selectedSkills={selectedIndividualSkills}
				onApply={(skills) => setSelectedIndividualSkills(skills)}
			/>
		</div>
	);
}
