import { Calendar, ExternalLink, Github } from "lucide-react";
import Link from "next/link";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";

export const metadata = {
	title: "Project Showcase",
	description:
		"Example OpenClaw stacks built with better-openclaw: AI research hubs, content pipelines, DevOps dashboards, and more.",
	openGraph: {
		title: "Project Showcase | better-openclaw",
		description:
			"Explore example stacks — AI research, content pipelines, DevOps dashboards — built with better-openclaw.",
		url: "https://better-openclaw.dev/showcase",
		type: "website",
	},
	alternates: { canonical: "https://better-openclaw.dev/showcase" },
};

const showcaseProjects = [
	{
		name: "AI Research Hub",
		description:
			"A research-oriented stack combining semantic search, web scraping, and local LLM inference for academic and industry research workflows.",
		services: ["qdrant", "searxng", "browserless", "ollama"],
		github: "https://github.com/example/ai-research-hub",
		daysAgo: 3,
		color: "from-primary/60 to-accent/40",
	},
	{
		name: "Content Pipeline",
		description:
			"End-to-end content creation and distribution pipeline with social scheduling, media processing, and object storage.",
		services: ["postiz", "ffmpeg", "minio", "redis"],
		github: "https://github.com/example/content-pipeline",
		daysAgo: 7,
		color: "from-accent/60 to-primary/30",
	},
	{
		name: "DevOps Dashboard",
		description:
			"Full observability and automation stack with workflow orchestration, metrics collection, and uptime monitoring.",
		services: ["n8n", "grafana", "prometheus", "uptime-kuma"],
		github: "https://github.com/example/devops-dashboard",
		daysAgo: 12,
		color: "from-primary/40 to-accent/60",
	},
	{
		name: "Local AI Playground",
		description:
			"Privacy-first local AI experimentation environment with model serving, chat UI, speech-to-text, and LLM gateway routing.",
		services: ["ollama", "open-webui", "whisper", "litellm"],
		github: "https://github.com/example/local-ai-playground",
		daysAgo: 18,
		color: "from-accent/50 to-primary/50",
	},
];

export default function ShowcasePage() {
	return (
		<div className="min-h-screen bg-background text-foreground">
			<Navbar />

			<main className="pt-14">
				{/* Hero */}
				<section className="border-b border-border">
					<div className="mx-auto max-w-7xl px-6 py-20 text-center lg:px-8">
						<h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
							Project <span className="text-gradient">Showcase</span>
						</h1>
						<p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
							Community projects built with better-openclaw
						</p>
					</div>
				</section>

				{/* Grid */}
				<section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
					<div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
						{showcaseProjects.map((project) => (
							<article
								key={project.name}
								className="group flex flex-col overflow-hidden rounded-xl border border-border bg-surface transition-all hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
							>
								{/* Thumbnail placeholder */}
								<div
									className={`h-40 bg-linear-to-br ${project.color} flex items-center justify-center`}
								>
									<span className="text-4xl font-bold text-foreground/80 drop-shadow-md">
										{project.name
											.split(" ")
											.map((w) => w[0])
											.join("")}
									</span>
								</div>

								<div className="flex flex-1 flex-col p-5">
									<h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
										{project.name}
									</h3>
									<p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
										{project.description}
									</p>

									{/* Service badges */}
									<div className="mt-4 flex flex-wrap gap-1.5">
										{project.services.map((service) => (
											<span
												key={service}
												className="inline-flex items-center rounded-full border border-border bg-muted/50 px-2.5 py-0.5 text-xs font-medium text-muted-foreground"
											>
												{service}
											</span>
										))}
									</div>

									{/* Footer row */}
									<div className="mt-4 flex items-center justify-between border-t border-border pt-4">
										<span className="flex items-center gap-1.5 text-xs text-muted-foreground">
											<Calendar className="h-3 w-3" />
											{project.daysAgo === 1 ? "1 day ago" : `${project.daysAgo} days ago`}
										</span>
										<a
											href={project.github}
											target="_blank"
											rel="noopener noreferrer"
											className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
										>
											<Github className="h-3.5 w-3.5" />
											Source
											<ExternalLink className="h-3 w-3" />
										</a>
									</div>
								</div>
							</article>
						))}
					</div>

					{/* CTA */}
					<div className="mt-16 text-center">
						<p className="mb-4 text-muted-foreground">Have a project built with better-openclaw?</p>
						<Link
							href="/submit"
							className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm shadow-primary/20 transition-all hover:bg-primary/90 hover:shadow-md hover:shadow-primary/25"
						>
							Submit your project
							<ExternalLink className="h-4 w-4" />
						</Link>
					</div>
				</section>
			</main>

			<Footer />
		</div>
	);
}
