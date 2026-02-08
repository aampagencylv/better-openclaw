import type { Metadata } from "next";
import { DocsSidebar } from "@/components/docs-sidebar";
import { Navbar } from "@/components/navbar";

export const metadata: Metadata = {
	title: "Documentation",
	description:
		"Documentation for better-openclaw: installation, CLI, wizard, API endpoints, services, skill packs, deployment guides.",
	openGraph: {
		title: "Documentation | better-openclaw",
		description:
			"Learn how to install, configure, and deploy OpenClaw stacks with better-openclaw.",
		url: "https://better-openclaw.dev/docs",
		type: "website",
	},
	alternates: { canonical: "https://better-openclaw.dev/docs" },
};

export default function DocsLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="min-h-screen bg-background">
			<Navbar />
			<div className="mx-auto max-w-7xl pt-14 lg:flex">
				<DocsSidebar />
				<main className="flex-1 px-6 py-8 lg:px-12 lg:py-10 min-w-0">
					<div className="prose prose-slate dark:prose-invert max-w-3xl [&_pre]:bg-surface [&_pre]:border [&_pre]:border-border [&_pre]:rounded-lg [&_pre]:p-4 [&_pre]:overflow-x-auto [&_code]:font-mono [&_code]:text-sm [&_a]:text-primary [&_a]:no-underline hover:[&_a]:underline [&_h1]:text-foreground [&_h2]:text-foreground [&_h3]:text-foreground [&_h4]:text-foreground [&_p]:text-muted-foreground [&_li]:text-muted-foreground [&_strong]:text-foreground [&_td]:text-muted-foreground [&_th]:text-foreground [&_blockquote]:border-primary/50 [&_blockquote]:text-muted-foreground [&_hr]:border-border [&_table]:border-collapse [&_th]:border [&_th]:border-border [&_th]:px-3 [&_th]:py-2 [&_th]:bg-surface [&_td]:border [&_td]:border-border [&_td]:px-3 [&_td]:py-2">
						{children}
					</div>
				</main>
			</div>
		</div>
	);
}
