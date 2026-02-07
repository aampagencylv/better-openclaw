import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://better-openclaw.dev"),
  title: "better-openclaw — Build your OpenClaw superstack",
  description:
    "CLI tool, REST API, and web UI for scaffolding production-ready OpenClaw stacks with Docker Compose",
  keywords: [
    "OpenClaw",
    "docker-compose",
    "self-hosted",
    "AI stack",
    "automation",
    "homelab",
  ],
  openGraph: {
    title: "better-openclaw — Build your OpenClaw superstack",
    description:
      "Generate Docker Compose stacks with 56+ companion services pre-wired with OpenClaw skills",
    type: "website",
    images: [{ url: "/og/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "better-openclaw — Build your OpenClaw superstack",
    description:
      "Generate Docker Compose stacks with 56+ companion services pre-wired with OpenClaw skills",
    images: ["/og/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-background text-foreground font-sans antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
