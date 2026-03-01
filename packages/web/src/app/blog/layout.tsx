import type { Metadata } from "next";
import Script from "next/script";
import { Navbar } from "@/components/navbar";

export const metadata: Metadata = {
	title: {
		default: "Blog — Self-Hosting, AI Agents & Docker Guides",
		template: "%s | better-openclaw Blog",
	},
	description:
		"Expert guides, tutorials, comparisons, and top lists on self-hosting AI agents, Docker Compose stacks, homelab setups, and DevOps best practices with better-openclaw.",
	keywords: [
		"self-hosted AI",
		"Docker Compose",
		"homelab",
		"AI agents",
		"DevOps",
		"Ollama",
		"n8n",
		"Qdrant",
		"vector database",
		"self-hosting guide",
		"open-source AI",
		"LLM hosting",
		"better-openclaw blog",
	],
	openGraph: {
		title: "Blog | better-openclaw",
		description:
			"Expert guides on self-hosting AI agents, Docker Compose, homelab infrastructure, and DevOps automation.",
		url: "https://better-openclaw.dev/blog",
		type: "website",
		siteName: "better-openclaw",
	},
	twitter: {
		card: "summary_large_image",
		title: "Blog | better-openclaw",
		description:
			"Expert guides on self-hosting AI agents, Docker Compose, homelab infrastructure, and DevOps automation.",
	},
	alternates: { canonical: "https://better-openclaw.dev/blog" },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
	const blogJsonLd = {
		"@context": "https://schema.org",
		"@type": "Blog",
		name: "better-openclaw Blog",
		description:
			"Expert guides, tutorials, comparisons, and top lists on self-hosting AI agents, Docker Compose stacks, homelab setups, and DevOps best practices.",
		url: "https://better-openclaw.dev/blog",
		publisher: {
			"@type": "Organization",
			name: "better-openclaw",
			url: "https://better-openclaw.dev",
		},
	};

	const breadcrumbJsonLd = {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: [
			{
				"@type": "ListItem",
				position: 1,
				name: "Home",
				item: "https://better-openclaw.dev",
			},
			{
				"@type": "ListItem",
				position: 2,
				name: "Blog",
				item: "https://better-openclaw.dev/blog",
			},
		],
	};

	return (
		<div className="min-h-screen bg-background">
			<Navbar />
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
			/>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
			/>
			<main className="pt-16">{children}</main>
		</div>
	);
}
