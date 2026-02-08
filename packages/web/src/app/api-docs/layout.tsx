import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "API Reference",
	description:
		"REST API reference for better-openclaw. Generate stacks programmatically, list services and skill packs, validate configurations.",
	openGraph: {
		title: "API Reference | better-openclaw",
		description:
			"REST API for generating Docker Compose stacks. Endpoints for services, skills, presets, validate, and generate.",
		url: "https://better-openclaw.dev/api-docs",
		type: "website",
	},
	alternates: { canonical: "https://better-openclaw.dev/api-docs" },
};

export default function ApiDocsLayout({ children }: { children: React.ReactNode }) {
	return children;
}
