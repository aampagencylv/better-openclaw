"use client";

import { motion } from "framer-motion";
import { Bot, Globe, Layers, LayoutDashboard, Package, Terminal } from "lucide-react";

const features = [
	{
		icon: Terminal,
		title: "Interactive CLI",
		description:
			"Beautiful wizard powered by @clack/prompts. Pick services, resolve deps, generate stacks — all from your terminal.",
	},
	{
		icon: Globe,
		title: "REST API",
		description:
			"Programmatic stack generation via a lightweight HTTP API. Integrate with CI/CD, scripts, or your own tooling.",
	},
	{
		icon: LayoutDashboard,
		title: "Visual Builder",
		description:
			"Point-and-click service selection with live dependency graphs and instant docker-compose preview.",
	},
	{
		icon: Layers,
		title: "Docker Compose Profiles",
		description:
			"Split stacks into profile groups — dev, monitoring, ai — and start only what you need.",
	},
	{
		icon: Bot,
		title: "AI Coding Agents",
		description:
			"Claude Code, OpenCode, Codex, Gemini CLI — first-class support for running coding agents in containers.",
	},
	{
		icon: Package,
		title: "58+ Services",
		description:
			"Databases, vector stores, browsers, monitoring, notifications, media processing, and more — all pre-configured.",
	},
];

const container = {
	hidden: {},
	show: { transition: { staggerChildren: 0.08 } },
};

const card = {
	hidden: { opacity: 0, y: 16 },
	show: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.4, ease: "easeOut" as const },
	},
};

export function FeaturesGrid() {
	return (
		<section id="features" className="py-20 md:py-28">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				{/* Heading */}
				<div className="mb-14 text-center">
					<h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
						Everything you need
					</h2>
					<p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
						Stop wrestling with docker-compose files. Focus on building the brain, not the body.
					</p>
				</div>

				{/* Grid */}
				<motion.div
					variants={container}
					initial="hidden"
					whileInView="show"
					viewport={{ once: true, amount: 0.2 }}
					className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
				>
					{features.map((f) => {
						const Icon = f.icon;
						return (
							<motion.div
								key={f.title}
								variants={card}
								className="group rounded-xl border border-border bg-surface p-6 transition-colors hover:border-primary/30"
							>
								<div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
									<Icon className="h-5 w-5" />
								</div>
								<h3 className="text-lg font-semibold text-foreground">{f.title}</h3>
								<p className="mt-2 text-sm leading-relaxed text-muted-foreground">
									{f.description}
								</p>
							</motion.div>
						);
					})}
				</motion.div>
			</div>
		</section>
	);
}
