import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
	const baseUrl = "https://better-openclaw.dev";
	const now = new Date();

	return [
		{
			url: baseUrl,
			lastModified: now,
			changeFrequency: "weekly",
			priority: 1,
		},
		{
			url: `${baseUrl}/new`,
			lastModified: now,
			changeFrequency: "weekly",
			priority: 0.9,
		},
		{
			url: `${baseUrl}/docs`,
			lastModified: now,
			changeFrequency: "weekly",
			priority: 0.9,
		},
		{
			url: `${baseUrl}/docs/api`,
			lastModified: now,
			changeFrequency: "weekly",
			priority: 0.8,
		},
		{
			url: `${baseUrl}/docs/api/endpoints`,
			lastModified: now,
			changeFrequency: "weekly",
			priority: 0.7,
		},
		{
			url: `${baseUrl}/docs/cli`,
			lastModified: now,
			changeFrequency: "weekly",
			priority: 0.8,
		},
		{
			url: `${baseUrl}/docs/cli/wizard`,
			lastModified: now,
			changeFrequency: "weekly",
			priority: 0.7,
		},
		{
			url: `${baseUrl}/docs/contributing`,
			lastModified: now,
			changeFrequency: "monthly",
			priority: 0.6,
		},
		{
			url: `${baseUrl}/docs/deployment`,
			lastModified: now,
			changeFrequency: "weekly",
			priority: 0.8,
		},
		{
			url: `${baseUrl}/docs/deployment/homelab`,
			lastModified: now,
			changeFrequency: "monthly",
			priority: 0.7,
		},
		{
			url: `${baseUrl}/docs/deployment/vps`,
			lastModified: now,
			changeFrequency: "monthly",
			priority: 0.7,
		},
		{
			url: `${baseUrl}/docs/installation`,
			lastModified: now,
			changeFrequency: "weekly",
			priority: 0.8,
		},
		{
			url: `${baseUrl}/docs/services`,
			lastModified: now,
			changeFrequency: "weekly",
			priority: 0.8,
		},
		{
			url: `${baseUrl}/docs/services/adding`,
			lastModified: now,
			changeFrequency: "monthly",
			priority: 0.6,
		},
		{
			url: `${baseUrl}/docs/skill-packs`,
			lastModified: now,
			changeFrequency: "weekly",
			priority: 0.8,
		},
		{
			url: `${baseUrl}/showcase`,
			lastModified: now,
			changeFrequency: "weekly",
			priority: 0.9,
		},
		{
			url: `${baseUrl}/submit`,
			lastModified: now,
			changeFrequency: "monthly",
			priority: 0.7,
		},
		{
			url: `${baseUrl}/api-docs`,
			lastModified: now,
			changeFrequency: "weekly",
			priority: 0.9,
		},
	];
}
