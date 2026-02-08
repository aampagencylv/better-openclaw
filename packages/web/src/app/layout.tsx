import type { Metadata } from "next";
import Script from "next/script";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

export const metadata: Metadata = {
	metadataBase: new URL("https://better-openclaw.dev"),
	title: {
		default: "better-openclaw — Build your OpenClaw superstack",
		template: "%s | better-openclaw",
	},
	description:
		"CLI tool, REST API, and web UI for scaffolding production-ready OpenClaw stacks with Docker Compose. 58+ services, 10 skill packs, one command.",
	keywords: [
		"OpenClaw",
		"docker-compose",
		"self-hosted",
		"AI stack",
		"automation",
		"homelab",
		"n8n",
		"qdrant",
		"ollama",
	],
	openGraph: {
		title: "better-openclaw — Build your OpenClaw superstack",
		description:
			"Generate Docker Compose stacks with 58+ companion services pre-wired with OpenClaw skills",
		type: "website",
		siteName: "better-openclaw",
		images: [{ url: "/og/og-image.svg", width: 1200, height: 630 }],
	},
	twitter: {
		card: "summary_large_image",
		title: "better-openclaw — Build your OpenClaw superstack",
		description:
			"Generate Docker Compose stacks with 58+ companion services pre-wired with OpenClaw skills",
		images: ["/og/og-image.svg"],
	},
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const umamiUrl = process.env.NEXT_PUBLIC_UMAMI_URL;
	const umamiId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;

	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<link
					href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap"
					rel="stylesheet"
				/>
			</head>
			<body className="bg-background text-foreground font-sans antialiased min-h-screen">
				<ThemeProvider>
					{children}
				</ThemeProvider>

				{/* Umami Analytics (only in production) */}
				{umamiUrl && umamiId && process.env.NODE_ENV === "production" && (
					<Script
						defer
						src={umamiUrl}
						data-website-id={umamiId}
						strategy="afterInteractive"
					/>
				)}
			</body>
		</html>
	);
}
