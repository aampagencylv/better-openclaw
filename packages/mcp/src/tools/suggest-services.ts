import { getAllServices } from "@better-openclaw/core";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

const KEYWORD_ALIASES: Record<string, string[]> = {
	database: ["db", "sql", "storage", "data"],
	monitoring: ["metrics", "observability", "alerting", "dashboard"],
	ai: ["llm", "machine-learning", "ml", "gpt", "chat", "inference"],
	automation: ["workflow", "automate", "pipeline", "cron"],
	search: ["fulltext", "full-text", "index", "query"],
	vector: ["embedding", "similarity", "semantic", "rag"],
	media: ["video", "audio", "image", "transcode"],
	proxy: ["reverse-proxy", "gateway", "load-balancer", "ssl", "https"],
	browser: ["scraping", "crawling", "headless", "puppeteer", "playwright"],
	communication: ["notification", "push", "alert", "webhook", "notify"],
	security: ["auth", "authentication", "sso", "identity"],
	coding: ["ide", "editor", "code", "git", "development"],
};

function expandQuery(query: string): string[] {
	const words = query
		.toLowerCase()
		.split(/[\s,;.]+/)
		.filter(Boolean);
	const expanded = new Set(words);

	for (const word of words) {
		for (const [key, aliases] of Object.entries(KEYWORD_ALIASES)) {
			if (word === key || aliases.includes(word)) {
				expanded.add(key);
				for (const alias of aliases) expanded.add(alias);
			}
		}
	}

	return [...expanded];
}

export function registerSuggestServices(server: McpServer): void {
	server.registerTool(
		"suggest-services",
		{
			title: "Suggest Services",
			description:
				"Suggest services based on a natural language description of what the user wants to build. Uses keyword matching and scoring — no LLM required. Great for translating requirements like 'I need a research assistant with vector search' into concrete service selections.",
			inputSchema: {
				description: z
					.string()
					.describe(
						"Natural language description of what to build (e.g. 'AI chatbot with document search and monitoring')",
					),
				limit: z.number().int().min(1).max(30).optional().describe("Max suggestions (default 10)"),
			},
		},
		async ({ description, limit }) => {
			const all = getAllServices();
			const keywords = expandQuery(description);
			const maxResults = limit ?? 10;

			const scored = all
				.map((s) => {
					let score = 0;
					const fields = [
						s.id,
						s.name.toLowerCase(),
						s.description.toLowerCase(),
						s.category,
						...(s.tags ?? []).map((t) => t.toLowerCase()),
					].join(" ");

					for (const kw of keywords) {
						if (s.id === kw) score += 5;
						else if (s.category === kw) score += 3;
						else if (s.tags?.some((t) => t.toLowerCase() === kw)) score += 3;
						else if (s.name.toLowerCase().includes(kw)) score += 2;
						else if (fields.includes(kw)) score += 1;
					}

					return { service: s, score };
				})
				.filter((x) => x.score > 0)
				.sort((a, b) => b.score - a.score)
				.slice(0, maxResults);

			const suggestions = scored.map((x) => ({
				id: x.service.id,
				name: x.service.name,
				description: x.service.description,
				category: x.service.category,
				relevanceScore: x.score,
				reason: `Matched keywords in: ${[
					x.service.id,
					x.service.category,
					...(x.service.tags ?? []),
				]
					.filter((f) => keywords.some((kw) => f.toLowerCase().includes(kw)))
					.join(", ")}`,
			}));

			return {
				content: [
					{
						type: "text" as const,
						text: JSON.stringify(
							{
								suggestions,
								total: suggestions.length,
								query: description,
								expandedKeywords: keywords,
							},
							null,
							2,
						),
					},
				],
			};
		},
	);
}
