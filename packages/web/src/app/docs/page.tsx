import Link from "next/link";

export const metadata = {
	title: "Documentation — better-openclaw",
	description: "Getting started guide, service reference, and API documentation for better-openclaw",
};

const sections = [
	{
		title: "Getting Started",
		description: "Install and create your first OpenClaw stack in under 5 minutes",
		href: "#getting-started",
	},
	{
		title: "Service Reference",
		description: "Complete catalog of all companion services with configuration details",
		href: "/docs/services",
	},
	{
		title: "Skill Packs",
		description: "Curated bundles of OpenClaw skills for common use cases",
		href: "#skill-packs",
	},
	{
		title: "API Reference",
		description: "REST API endpoints for programmatic stack generation",
		href: "#api",
	},
	{
		title: "Deployment Guides",
		description: "Deploy your stack to VPS, homelab, or cloud providers",
		href: "/docs/deployment",
	},
	{
		title: "Security",
		description: "Security best practices for production deployments",
		href: "#security",
	},
];

export default function DocsPage() {
	return (
		<div className="min-h-screen bg-background text-foreground">
			<header className="border-b border-border">
				<div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
					<Link href="/" className="text-xl font-bold text-primary">
						better-openclaw
					</Link>
					<nav className="flex gap-6 text-sm text-muted-foreground">
						<Link href="/new" className="hover:text-foreground transition-colors">
							Builder
						</Link>
						<Link href="/docs" className="text-foreground">
							Docs
						</Link>
					</nav>
				</div>
			</header>

			<main className="mx-auto max-w-4xl px-6 py-12">
				<h1 className="text-4xl font-bold mb-4">Documentation</h1>
				<p className="text-lg text-muted-foreground mb-12">
					Everything you need to build and deploy OpenClaw stacks with companion services.
				</p>

				<div className="grid gap-6 sm:grid-cols-2">
					{sections.map((section) => (
						<a
							key={section.href}
							href={section.href}
							className="block p-6 rounded-lg bg-surface border border-border hover:border-primary/50 transition-colors"
						>
							<h2 className="text-lg font-semibold mb-2">{section.title}</h2>
							<p className="text-sm text-muted-foreground">{section.description}</p>
						</a>
					))}
				</div>

				<section id="getting-started" className="mt-16">
					<h2 className="text-3xl font-bold mb-6">Getting Started</h2>

					<div className="prose prose-invert max-w-none">
						<h3 className="text-xl font-semibold mt-8 mb-4">Quick Install</h3>
						<pre className="bg-surface border border-border rounded-lg p-4 overflow-x-auto">
							<code className="text-sm font-mono text-accent">
								{`# Create a new OpenClaw stack
pnpm create better-openclaw@latest my-stack

# Or with npx
npx create-better-openclaw@latest my-stack

# Or with bun
bun create better-openclaw@latest my-stack`}
							</code>
						</pre>

						<h3 className="text-xl font-semibold mt-8 mb-4">Using a Preset</h3>
						<pre className="bg-surface border border-border rounded-lg p-4 overflow-x-auto">
							<code className="text-sm font-mono text-accent">
								{`# Research stack: OpenClaw + Qdrant + SearXNG + Browserless
npx create-better-openclaw my-stack --preset researcher --yes

# DevOps stack: OpenClaw + n8n + Grafana + monitoring
npx create-better-openclaw my-stack --preset devops --yes

# Full stack: everything enabled
npx create-better-openclaw my-stack --preset full --yes`}
							</code>
						</pre>

						<h3 className="text-xl font-semibold mt-8 mb-4">Start Your Stack</h3>
						<pre className="bg-surface border border-border rounded-lg p-4 overflow-x-auto">
							<code className="text-sm font-mono text-accent">
								{`cd my-stack
cp .env.example .env      # Edit with your API keys
docker compose up -d      # Start everything
docker compose logs -f openclaw-gateway  # Watch OpenClaw boot`}
							</code>
						</pre>
					</div>
				</section>

				<section id="api" className="mt-16">
					<h2 className="text-3xl font-bold mb-6">API Reference</h2>
					<div className="space-y-6">
						{[
							{ method: "GET", path: "/v1/health", desc: "Health check" },
							{ method: "GET", path: "/v1/services", desc: "List all available services" },
							{ method: "GET", path: "/v1/skills", desc: "List all skill packs" },
							{ method: "GET", path: "/v1/presets", desc: "List preset configurations" },
							{ method: "POST", path: "/v1/validate", desc: "Validate a stack configuration" },
							{ method: "POST", path: "/v1/generate", desc: "Generate a complete stack" },
						].map((endpoint) => (
							<div
								key={endpoint.path}
								className="p-4 rounded-lg bg-surface border border-border"
							>
								<div className="flex items-center gap-3 mb-2">
									<span
										className={`px-2 py-0.5 rounded text-xs font-bold ${
											endpoint.method === "GET"
												? "bg-accent/20 text-accent"
												: "bg-primary/20 text-primary"
										}`}
									>
										{endpoint.method}
									</span>
									<code className="font-mono text-sm">{endpoint.path}</code>
								</div>
								<p className="text-sm text-muted-foreground">{endpoint.desc}</p>
							</div>
						))}
					</div>
				</section>
			</main>
		</div>
	);
}
