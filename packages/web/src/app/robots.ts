import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
	return {
		rules: [
			{
				userAgent: "*",
				allow: ["/", "/blog", "/docs", "/showcase", "/api-docs"],
				disallow: ["/api/", "/_next/", "/private/"],
			},
			{
				userAgent: "Googlebot",
				allow: "/",
				disallow: ["/api/"],
			},
		],
		sitemap: "https://better-openclaw.dev/sitemap.xml",
		host: "https://better-openclaw.dev",
	};
}

