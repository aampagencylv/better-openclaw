import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "better-openclaw — Build your OpenClaw superstack",
  description:
    "A turbocharged stack generator for OpenClaw. Pick your services, resolve dependencies automatically, and generate a production-ready docker-compose.yml in seconds.",
  keywords: [
    "OpenClaw",
    "docker-compose",
    "self-hosted",
    "AI stack",
    "automation",
    "homelab",
  ],
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
