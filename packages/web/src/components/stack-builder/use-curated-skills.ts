import { useMemo, useState } from "react";
import type { SkillManifestEntry } from "@/lib/skill-manifest-client";
import { getClientManifestSkills } from "@/lib/skill-manifest-client";

export function deriveCategory(skill: SkillManifestEntry): string {
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

export const CATEGORY_ORDER = [
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

export function useCuratedSkills() {
	const [search, setSearch] = useState("");
	const [activeCategory, setActiveCategory] = useState<string | null>(null);

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

	return {
		search,
		setSearch,
		activeCategory,
		setActiveCategory,
		curatedSkills,
		categorizedSkills,
		categories,
		filteredCurated,
		groupedFiltered,
	};
}
