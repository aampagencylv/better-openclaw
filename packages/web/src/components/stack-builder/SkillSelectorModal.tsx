"use client";

import {
	Check,
	ExternalLink,
	Globe,
	Loader2,
	Search,
	ShieldCheck,
	Sparkles,
	X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { SkillManifestEntry } from "@/lib/skill-manifest-client";
import { getClientManifestSkills } from "@/lib/skill-manifest-client";
import { cn } from "@/lib/utils";

// ── Types ───────────────────────────────────────────────────────────────────

interface MarketplaceSkill {
	id: string;
	name: string;
	description: string;
	stars?: number;
	author?: string;
}

export interface SelectedSkill {
	id: string;
	name: string;
	emoji: string;
	source: "curated" | "marketplace";
}

interface SkillSelectorModalProps {
	open: boolean;
	onClose: () => void;
	selectedSkills: Map<string, SelectedSkill>;
	onApply: (skills: Map<string, SelectedSkill>) => void;
}

// ── Category derivation ─────────────────────────────────────────────────────

function deriveCategory(skill: SkillManifestEntry): string {
	const id = skill.id.toLowerCase();
	if (
		id.includes("ui") ||
		id.includes("design") ||
		id.includes("css") ||
		id.includes("tailwind") ||
		id.includes("responsive") ||
		id.includes("landing") ||
		id.includes("pricing") ||
		id.includes("prompting") ||
		id.includes("copywriting") ||
		id.includes("canvas") ||
		id.includes("reviewer") ||
		id.includes("interface") ||
		id.includes("asset")
	)
		return "Design & UI";
	if (
		id.includes("gsap") ||
		id.includes("anime") ||
		id.includes("animation") ||
		id.includes("vanta") ||
		id.includes("scroll") ||
		id.includes("blur") ||
		id.includes("interaction")
	)
		return "Animation";
	if (id.includes("three") || id.includes("globe") || id.includes("cobe") || id.includes("matter"))
		return "3D & Physics";
	if (id.includes("unicorn")) return "Embeds";
	if (
		id.includes("redis") ||
		id.includes("postgresql") ||
		id.includes("minio") ||
		id.includes("qdrant") ||
		id.includes("elasticsearch") ||
		id.includes("milvus") ||
		id.includes("meilisearch") ||
		id.includes("mongo")
	)
		return "Databases";
	if (
		id.includes("docker") ||
		id.includes("portainer") ||
		id.includes("coolify") ||
		id.includes("watchtower") ||
		id.includes("gitea") ||
		id.includes("jenkins") ||
		id.includes("argocd") ||
		id.includes("terraform") ||
		id.includes("ansible")
	)
		return "DevOps";
	if (
		id.includes("grafana") ||
		id.includes("prometheus") ||
		id.includes("loki") ||
		id.includes("signoz") ||
		id.includes("sentry") ||
		id.includes("uptime") ||
		id.includes("beszel") ||
		id.includes("gatus") ||
		id.includes("dozzle")
	)
		return "Monitoring";
	if (
		id.includes("ollama") ||
		id.includes("whisper") ||
		id.includes("litellm") ||
		id.includes("langchain") ||
		id.includes("llamaindex") ||
		id.includes("crewai") ||
		id.includes("autogpt") ||
		id.includes("haystack") ||
		id.includes("ragflow") ||
		id.includes("claude") ||
		id.includes("codex") ||
		id.includes("gemini") ||
		id.includes("opencode") ||
		id.includes("open-interpreter")
	)
		return "AI & LLM";
	if (
		id.includes("ffmpeg") ||
		id.includes("remotion") ||
		id.includes("image") ||
		id.includes("pdf") ||
		id.includes("excel") ||
		id.includes("csv") ||
		id.includes("json-transform") ||
		id.includes("xml") ||
		id.includes("markdown")
	)
		return "Media & Data";
	if (
		id.includes("n8n") ||
		id.includes("searxng") ||
		id.includes("browserless") ||
		id.includes("firecrawl") ||
		id.includes("huginn") ||
		id.includes("activepieces") ||
		id.includes("langflow")
	)
		return "Automation";
	if (
		id.includes("matrix") ||
		id.includes("mattermost") ||
		id.includes("rocketchat") ||
		id.includes("gotify") ||
		id.includes("ntfy") ||
		id.includes("email") ||
		id.includes("listmonk") ||
		id.includes("postiz")
	)
		return "Communication";
	if (
		id.includes("auth") ||
		id.includes("keycloak") ||
		id.includes("vault") ||
		id.includes("infisical") ||
		id.includes("netbird") ||
		id.includes("teleport") ||
		id.includes("crowdsec") ||
		id.includes("vaultwarden") ||
		id.includes("jwt") ||
		id.includes("hash") ||
		id.includes("ssl") ||
		id.includes("dns") ||
		id.includes("port-scan") ||
		id.includes("ping")
	)
		return "Security";
	if (
		id.includes("nextcloud") ||
		id.includes("immich") ||
		id.includes("jellyfin") ||
		id.includes("ghost") ||
		id.includes("strapi") ||
		id.includes("directus") ||
		id.includes("outline") ||
		id.includes("paperless") ||
		id.includes("docsgpt") ||
		id.includes("bookstack") ||
		id.includes("stirling") ||
		id.includes("excalidraw") ||
		id.includes("pocketbase") ||
		id.includes("appwrite") ||
		id.includes("supabase") ||
		id.includes("home-assistant")
	)
		return "Apps & Services";
	if (
		id.includes("matomo") ||
		id.includes("umami") ||
		id.includes("openpanel") ||
		id.includes("plausible")
	)
		return "Analytics";
	if (
		id.includes("api") ||
		id.includes("http") ||
		id.includes("webhook") ||
		id.includes("graphql") ||
		id.includes("kong") ||
		id.includes("rabbitmq")
	)
		return "API & Integration";
	if (
		id.includes("text-") ||
		id.includes("summarize") ||
		id.includes("translate") ||
		id.includes("classify") ||
		id.includes("embed")
	)
		return "NLP";
	return "Other";
}

const CATEGORY_ORDER = [
	"Design & UI",
	"Animation",
	"3D & Physics",
	"Embeds",
	"AI & LLM",
	"Databases",
	"DevOps",
	"Monitoring",
	"Media & Data",
	"Automation",
	"Communication",
	"Security",
	"Apps & Services",
	"Analytics",
	"API & Integration",
	"NLP",
	"Other",
];

// ── Component ───────────────────────────────────────────────────────────────

export function SkillSelectorModal({
	open,
	onClose,
	selectedSkills,
	onApply,
}: SkillSelectorModalProps) {
	const [tab, setTab] = useState<"curated" | "marketplace">("curated");
	const [search, setSearch] = useState("");
	const [activeCategory, setActiveCategory] = useState<string | null>(null);
	const [localSelection, setLocalSelection] = useState<Map<string, SelectedSkill>>(new Map());

	// Marketplace state
	const [mpQuery, setMpQuery] = useState("");
	const [mpResults, setMpResults] = useState<MarketplaceSkill[]>([]);
	const [mpLoading, setMpLoading] = useState(false);
	const [mpError, setMpError] = useState<string | null>(null);
	const [mpSearchMode, setMpSearchMode] = useState<"keyword" | "ai">("keyword");
	const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const modalRef = useRef<HTMLDivElement>(null);

	// Load curated skills
	const curatedSkills = useMemo(() => getClientManifestSkills(), []);

	// Derive categories from curated skills
	const categorizedSkills = useMemo(() => {
		const map = new Map<string, SkillManifestEntry[]>();
		for (const skill of curatedSkills) {
			const cat = deriveCategory(skill);
			const list = map.get(cat) ?? [];
			list.push(skill);
			map.set(cat, list);
		}
		return map;
	}, [curatedSkills]);

	const categories = useMemo(
		() => CATEGORY_ORDER.filter((c) => categorizedSkills.has(c)),
		[categorizedSkills],
	);

	// Sync prop → local on open
	useEffect(() => {
		if (open) {
			setLocalSelection(new Map(selectedSkills));
			setSearch("");
			setMpQuery("");
			setMpResults([]);
			setMpError(null);
		}
	}, [open, selectedSkills]);

	// Keyboard: Escape to close
	useEffect(() => {
		if (!open) return;
		const handler = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		};
		window.addEventListener("keydown", handler);
		return () => window.removeEventListener("keydown", handler);
	}, [open, onClose]);

	// Filter curated skills
	const filteredCurated = useMemo(() => {
		let skills = curatedSkills;
		if (activeCategory) {
			skills = skills.filter((s) => deriveCategory(s) === activeCategory);
		}
		if (search.trim()) {
			const q = search.toLowerCase().trim();
			skills = skills.filter((s) => s.id.toLowerCase().includes(q) || s.emoji.includes(q));
		}
		return skills;
	}, [curatedSkills, search, activeCategory]);

	// Group filtered curated skills by category
	const groupedFiltered = useMemo(() => {
		const map = new Map<string, SkillManifestEntry[]>();
		for (const skill of filteredCurated) {
			const cat = deriveCategory(skill);
			const list = map.get(cat) ?? [];
			list.push(skill);
			map.set(cat, list);
		}
		return map;
	}, [filteredCurated]);

	// Marketplace search with debounce
	const searchMarketplace = useCallback(
		async (q: string) => {
			if (!q.trim()) {
				setMpResults([]);
				return;
			}
			setMpLoading(true);
			setMpError(null);
			try {
				const res = await fetch(
					`/api/skills-search?q=${encodeURIComponent(q)}&mode=${mpSearchMode}&limit=30`,
				);
				const data = await res.json();
				if (data.success === false) {
					setMpError(data.error?.message ?? "Search failed");
					setMpResults([]);
				} else {
					setMpResults(data.data?.skills ?? []);
				}
			} catch {
				setMpError("Failed to connect to SkillsMP");
				setMpResults([]);
			} finally {
				setMpLoading(false);
			}
		},
		[mpSearchMode],
	);

	const handleMpQueryChange = useCallback(
		(value: string) => {
			setMpQuery(value);
			if (debounceRef.current) clearTimeout(debounceRef.current);
			debounceRef.current = setTimeout(() => searchMarketplace(value), 400);
		},
		[searchMarketplace],
	);

	// Toggle selection
	const toggleSkill = useCallback(
		(id: string, name: string, emoji: string, source: "curated" | "marketplace") => {
			setLocalSelection((prev) => {
				const next = new Map(prev);
				if (next.has(id)) {
					next.delete(id);
				} else {
					next.set(id, { id, name, emoji, source });
				}
				return next;
			});
		},
		[],
	);

	// Apply and close
	const handleApply = useCallback(() => {
		onApply(localSelection);
		onClose();
	}, [localSelection, onApply, onClose]);

	// Select / deselect all visible curated
	const selectAllVisible = useCallback(() => {
		setLocalSelection((prev) => {
			const next = new Map(prev);
			for (const skill of filteredCurated) {
				if (!next.has(skill.id)) {
					next.set(skill.id, {
						id: skill.id,
						name: skill.id.replace(/-/g, " "),
						emoji: skill.emoji,
						source: "curated",
					});
				}
			}
			return next;
		});
	}, [filteredCurated]);

	const deselectAllVisible = useCallback(() => {
		setLocalSelection((prev) => {
			const next = new Map(prev);
			for (const skill of filteredCurated) {
				next.delete(skill.id);
			}
			return next;
		});
	}, [filteredCurated]);

	if (!open) return null;

	const curatedCount = Array.from(localSelection.values()).filter(
		(s) => s.source === "curated",
	).length;
	const marketplaceCount = Array.from(localSelection.values()).filter(
		(s) => s.source === "marketplace",
	).length;

	return (
		<div
			className="fixed inset-0 z-50 flex items-start justify-center bg-background/60 backdrop-blur-sm"
			role="dialog"
			aria-modal="true"
			aria-labelledby="skill-modal-title"
			onClick={(e) => {
				if (e.target === e.currentTarget) onClose();
			}}
		>
			<div
				ref={modalRef}
				className="mx-4 mt-8 flex max-h-[calc(100vh-64px)] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-2xl"
			>
				{/* ── Header ─────────────────────────────────────────────── */}
				<div className="flex items-center justify-between border-b border-border px-6 py-4">
					<div>
						<h2 id="skill-modal-title" className="text-lg font-bold text-foreground">
							Browse Skills
						</h2>
						<p className="mt-0.5 text-xs text-muted-foreground">
							{localSelection.size} selected
							{curatedCount > 0 && (
								<span className="ml-1.5 inline-flex items-center gap-1 text-emerald-500">
									<ShieldCheck className="h-3 w-3" />
									{curatedCount} curated
								</span>
							)}
							{marketplaceCount > 0 && (
								<span className="ml-1.5 inline-flex items-center gap-1 text-blue-400">
									<Globe className="h-3 w-3" />
									{marketplaceCount} marketplace
								</span>
							)}
						</p>
					</div>
					<button
						type="button"
						onClick={onClose}
						className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
						aria-label="Close"
					>
						<X className="h-5 w-5" />
					</button>
				</div>

				{/* ── Tabs ───────────────────────────────────────────────── */}
				<div className="flex items-center gap-1 border-b border-border px-6">
					<button
						type="button"
						onClick={() => setTab("curated")}
						className={cn(
							"relative px-4 py-2.5 text-sm font-medium transition-colors",
							tab === "curated" ? "text-foreground" : "text-muted-foreground hover:text-foreground",
						)}
					>
						<span className="flex items-center gap-1.5">
							<ShieldCheck className="h-4 w-4" />
							Curated Skills
							<span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-500">
								{curatedSkills.length}
							</span>
						</span>
						{tab === "curated" && (
							<span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-primary" />
						)}
					</button>
					<button
						type="button"
						onClick={() => setTab("marketplace")}
						className={cn(
							"relative px-4 py-2.5 text-sm font-medium transition-colors",
							tab === "marketplace"
								? "text-foreground"
								: "text-muted-foreground hover:text-foreground",
						)}
					>
						<span className="flex items-center gap-1.5">
							<Globe className="h-4 w-4" />
							SkillsMP Marketplace
						</span>
						{tab === "marketplace" && (
							<span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-primary" />
						)}
					</button>
				</div>

				{/* ── Content ────────────────────────────────────────────── */}
				<div className="flex-1 overflow-y-auto">
					{tab === "curated" ? (
						<div className="px-6 py-4">
							{/* Search + bulk actions */}
							<div className="mb-4 flex items-center gap-3">
								<div className="relative flex-1">
									<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
									<input
										type="text"
										value={search}
										onChange={(e) => setSearch(e.target.value)}
										placeholder="Search curated skills..."
										className="w-full rounded-lg border border-border bg-surface/50 py-2 pl-9 pr-9 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
									/>
									{search && (
										<button
											aria-label="Clear search"
											type="button"
											onClick={() => setSearch("")}
											className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
										>
											<X className="h-3.5 w-3.5" />
										</button>
									)}
								</div>
								<button
									type="button"
									onClick={selectAllVisible}
									className="shrink-0 rounded-lg border border-border px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
								>
									Select all
								</button>
								<button
									type="button"
									onClick={deselectAllVisible}
									className="shrink-0 rounded-lg border border-border px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
								>
									Deselect all
								</button>
							</div>

							{/* Category chips */}
							<div className="mb-4 flex flex-wrap gap-1.5">
								<button
									type="button"
									onClick={() => setActiveCategory(null)}
									className={cn(
										"rounded-full px-3 py-1 text-xs font-medium transition-all",
										!activeCategory
											? "bg-primary/10 text-primary border border-primary/30"
											: "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary border border-transparent",
									)}
								>
									All ({curatedSkills.length})
								</button>
								{categories.map((cat) => {
									const count = categorizedSkills.get(cat)?.length ?? 0;
									return (
										<button
											key={cat}
											type="button"
											onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
											className={cn(
												"rounded-full px-3 py-1 text-xs font-medium transition-all",
												activeCategory === cat
													? "bg-primary/10 text-primary border border-primary/30"
													: "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary border border-transparent",
											)}
										>
											{cat} ({count})
										</button>
									);
								})}
							</div>

							{/* Skill cards grouped by category */}
							<div className="space-y-5">
								{CATEGORY_ORDER.filter((cat) => groupedFiltered.has(cat)).map((cat) => {
									const skills = groupedFiltered.get(cat)!;
									return (
										<div key={cat}>
											<h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
												{cat} <span className="font-normal">({skills.length})</span>
											</h4>
											<div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
												{skills.map((skill) => {
													const isSelected = localSelection.has(skill.id);
													return (
														<button
															key={skill.id}
															type="button"
															onClick={() =>
																toggleSkill(
																	skill.id,
																	skill.id
																		.replace(/-/g, " ")
																		.replace(/\b\w/g, (c) => c.toUpperCase()),
																	skill.emoji,
																	"curated",
																)
															}
															className={cn(
																"group flex items-center gap-3 rounded-lg border p-3 text-left transition-all duration-150",
																isSelected
																	? "border-emerald-500/40 bg-emerald-500/5 ring-1 ring-emerald-500/20"
																	: "border-border bg-surface/30 hover:border-muted-foreground/30 hover:bg-surface/60",
															)}
														>
															{/* Checkbox */}
															<div
																className={cn(
																	"flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors",
																	isSelected
																		? "border-emerald-500 bg-emerald-500 text-foreground"
																		: "border-muted-foreground/30 group-hover:border-muted-foreground/50",
																)}
															>
																{isSelected && <Check className="h-3.5 w-3.5" />}
															</div>

															{/* Emoji + Name */}
															<div className="min-w-0 flex-1">
																<div className="flex items-center gap-1.5">
																	<span className="text-base leading-none">{skill.emoji}</span>
																	<span className="truncate text-sm font-medium text-foreground">
																		{skill.id
																			.replace(/-/g, " ")
																			.replace(/\b\w/g, (c) => c.toUpperCase())}
																	</span>
																</div>
																{skill.services.length > 0 && (
																	<p className="mt-0.5 truncate text-[10px] text-muted-foreground">
																		Requires: {skill.services.join(", ")}
																	</p>
																)}
															</div>

															{/* Curated badge */}
															<span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-semibold text-emerald-500">
																<ShieldCheck className="h-2.5 w-2.5" />
																Curated
															</span>
														</button>
													);
												})}
											</div>
										</div>
									);
								})}
							</div>

							{filteredCurated.length === 0 && (
								<div className="py-12 text-center text-sm text-muted-foreground">
									No skills match your search.
								</div>
							)}
						</div>
					) : (
						/* ── Marketplace Tab ──────────────────────────────────── */
						<div className="px-6 py-4">
							<div className="mb-4 flex items-center gap-3">
								<div className="relative flex-1">
									<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
									<input
										type="text"
										value={mpQuery}
										onChange={(e) => handleMpQueryChange(e.target.value)}
										placeholder="Search SkillsMP marketplace..."
										className="w-full rounded-lg border border-border bg-surface/50 py-2 pl-9 pr-9 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
									/>
									{mpQuery && (
										<button
											aria-label="Clear search"
											type="button"
											onClick={() => {
												setMpQuery("");
												setMpResults([]);
											}}
											className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
										>
											<X className="h-3.5 w-3.5" />
										</button>
									)}
								</div>
								{/* Search mode toggle */}
								<div className="flex shrink-0 rounded-lg border border-border">
									<button
										type="button"
										onClick={() => setMpSearchMode("keyword")}
										className={cn(
											"rounded-l-lg px-3 py-2 text-xs font-medium transition-colors",
											mpSearchMode === "keyword"
												? "bg-primary/10 text-primary"
												: "text-muted-foreground hover:text-foreground",
										)}
									>
										<Search className="inline h-3 w-3 mr-1" />
										Keyword
									</button>
									<button
										type="button"
										onClick={() => setMpSearchMode("ai")}
										className={cn(
											"rounded-r-lg px-3 py-2 text-xs font-medium transition-colors",
											mpSearchMode === "ai"
												? "bg-primary/10 text-primary"
												: "text-muted-foreground hover:text-foreground",
										)}
									>
										<Sparkles className="inline h-3 w-3 mr-1" />
										AI Search
									</button>
								</div>
							</div>

							{/* Loading state */}
							{mpLoading && (
								<div className="flex items-center justify-center py-12">
									<Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
									<span className="ml-2 text-sm text-muted-foreground">Searching SkillsMP...</span>
								</div>
							)}

							{/* Error state */}
							{mpError && (
								<div className="rounded-lg border border-red-500/20 bg-red-500/5 p-4 text-center text-sm text-red-400">
									{mpError}
								</div>
							)}

							{/* Empty state */}
							{!mpLoading && !mpError && mpResults.length === 0 && (
								<div className="py-12 text-center">
									<Globe className="mx-auto mb-3 h-10 w-10 text-muted-foreground/30" />
									<p className="text-sm text-muted-foreground">
										{mpQuery
											? "No skills found — try different keywords"
											: "Search the SkillsMP marketplace for community skills"}
									</p>
									<p className="mt-1 text-xs text-muted-foreground/60">
										Powered by{" "}
										<a
											href="https://skillsmp.com"
											target="_blank"
											rel="noopener noreferrer"
											className="text-primary hover:underline"
										>
											skillsmp.com
											<ExternalLink className="ml-0.5 inline h-2.5 w-2.5" />
										</a>
									</p>
								</div>
							)}

							{/* Results */}
							{!mpLoading && mpResults.length > 0 && (
								<div className="grid gap-2 sm:grid-cols-2">
									{mpResults.map((skill) => {
										const isSelected = localSelection.has(skill.id);
										return (
											<button
												key={skill.id}
												type="button"
												onClick={() => toggleSkill(skill.id, skill.name, "🌐", "marketplace")}
												className={cn(
													"group flex items-start gap-3 rounded-lg border p-3 text-left transition-all duration-150",
													isSelected
														? "border-blue-500/40 bg-blue-500/5 ring-1 ring-blue-500/20"
														: "border-border bg-surface/30 hover:border-muted-foreground/30 hover:bg-surface/60",
												)}
											>
												{/* Checkbox */}
												<div
													className={cn(
														"mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors",
														isSelected
															? "border-blue-500 bg-blue-500 text-foreground"
															: "border-muted-foreground/30 group-hover:border-muted-foreground/50",
													)}
												>
													{isSelected && <Check className="h-3.5 w-3.5" />}
												</div>

												{/* Content */}
												<div className="min-w-0 flex-1">
													<div className="flex items-center gap-2">
														<span className="truncate text-sm font-medium text-foreground">
															{skill.name}
														</span>
														{skill.stars != null && (
															<span className="shrink-0 text-[10px] text-yellow-500">
																★ {skill.stars}
															</span>
														)}
													</div>
													{skill.description && (
														<p className="mt-0.5 text-xs leading-relaxed text-muted-foreground line-clamp-2">
															{skill.description}
														</p>
													)}
													{skill.author && (
														<p className="mt-1 text-[10px] text-muted-foreground/60">
															by {skill.author}
														</p>
													)}
												</div>

												{/* Marketplace badge */}
												<span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-blue-500/10 px-1.5 py-0.5 text-[9px] font-semibold text-blue-400">
													<Globe className="h-2.5 w-2.5" />
													Marketplace
												</span>
											</button>
										);
									})}
								</div>
							)}
						</div>
					)}
				</div>

				{/* ── Footer ─────────────────────────────────────────────── */}
				<div className="flex items-center justify-between border-t border-border px-6 py-4">
					<p className="text-xs text-muted-foreground">
						{localSelection.size} skill{localSelection.size !== 1 ? "s" : ""} selected
					</p>
					<div className="flex items-center gap-2">
						<button
							type="button"
							onClick={onClose}
							className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-surface"
						>
							Cancel
						</button>
						<button
							type="button"
							onClick={handleApply}
							className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm shadow-primary/20 transition-colors hover:bg-primary/90"
						>
							Apply Selection
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
