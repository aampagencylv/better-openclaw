"use client";

import { motion } from "framer-motion";
import { Database, Layers, Shield, TerminalSquare } from "lucide-react";
import Link from "next/link";

const features = [
	{
		id: "01",
		icon: TerminalSquare,
		title: "STACK GENERATION",
		description:
			"Instant provisioning of 58+ companion services and automated docker-compose configurations across distributed environments.",
	},
	{
		id: "02",
		icon: Layers,
		title: "SKILL INTEGRATION",
		description:
			"Pre-wired skill packs injecting core capabilities directly into your autonomous agents in sub-millisecond timeframes.",
	},
	{
		id: "03",
		icon: Shield,
		title: "PRODUCTION READY",
		description:
			"Secure-by-default environment with automated network isolation, persistent volume management, and TLS-ready ingress.",
	},
	{
		id: "04",
		icon: Database,
		title: "OPEN INFRASTRUCTURE",
		description:
			"100% open-source architecture ensuring zero vendor lock-in and complete data sovereignty for enterprise stacks.",
	},
];

const container = {
	hidden: { opacity: 0 },
	show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const card = {
	hidden: { opacity: 0, y: 20 },
	show: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
	},
};

export function FeaturesGrid() {
	return (
		<section className="relative w-full py-20 lg:py-32 overflow-hidden border-t border-white/5">
			{/* Background ambient glow matching Axion */}
			<div className="absolute left-1/4 top-1/2 -z-10 h-[400px] w-[800px] -translate-y-1/2 -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,rgba(163,135,95,0.1)_0%,transparent_60%)] blur-[80px]" />

			<div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
				{/* Header Section */}
				<motion.div
					initial={{ opacity: 0, y: 15 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6 }}
					className="mb-16 flex flex-col gap-4"
				>
					<div className="flex items-center gap-3">
						<span className="h-1.5 w-1.5 bg-primary shadow-[0_0_8px_rgba(163,135,95,0.8)]" />
						<span className="font-mono text-[10px] tracking-widest text-primary uppercase">
							// CORE_CAPABILITIES
						</span>
					</div>

					<h2 className="text-3xl font-bold tracking-tight text-white md:text-5xl">
						INFRASTRUCTURE <span className="text-zinc-600">PRIMITIVES</span>
					</h2>

					<p className="max-w-xl text-sm leading-relaxed text-zinc-400 mt-2">
						The four pillars of the better-openclaw engine. Modular, scalable, and secure by design.
					</p>

					<div className="absolute right-8 top-32 hidden lg:block">
						<Link
							href="/docs"
							className="font-mono text-[9px] tracking-widest text-zinc-500 uppercase transition-colors hover:text-white"
						>
							EXPLORE ALL FEATURES &rarr;
						</Link>
					</div>
				</motion.div>

				{/* 4 Pillar Grid */}
				<motion.div
					variants={container}
					initial="hidden"
					whileInView="show"
					viewport={{ once: true, amount: 0.2 }}
					className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
				>
					{features.map((f, i) => {
						const Icon = f.icon;
						return (
							<motion.div
								key={f.id}
								variants={card}
								className={`group relative flex min-h-[320px] flex-col justify-between border-white/5 bg-black/40 p-6 backdrop-blur-sm transition-colors hover:bg-zinc-900/50
									${i === 0 ? "border border-r-0 lg:border-r" : ""}
									${i > 0 && i < 3 ? "border-y border-r-0 lg:border-r lg:border-l-0" : ""}
									${i === 3 ? "border lg:border-l-0" : ""}
								`}
							>
								{/* Hover Glow Edge Effect */}
								<div className="absolute left-0 top-0 h-full w-[1px] bg-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100 shadow-[0_0_12px_rgba(163,135,95,0.8)]" />

								<div>
									{/* Top Row: Fig Label + Icon */}
									<div className="mb-8 flex items-center justify-between">
										<div className="flex px-2 py-1 border border-zinc-800 rounded-sm">
											<span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest">
												FIG. {f.id}
											</span>
										</div>
										<Icon className="h-4 w-4 text-zinc-600 transition-colors group-hover:text-primary" />
									</div>

									<h3 className="mb-4 font-sans text-sm font-bold uppercase tracking-wide text-white">
										{f.title}
									</h3>

									<p className="font-mono text-[10px] leading-relaxed text-zinc-500">
										{f.description}
									</p>
								</div>

								{/* Bottom Link */}
								<div className="mt-8">
									<Link
										href="/docs"
										className="font-mono text-[9px] uppercase tracking-widest text-zinc-600 transition-colors group-hover:text-white"
									>
										READ SPECS &rarr;
									</Link>
								</div>
							</motion.div>
						);
					})}
				</motion.div>
			</div>
		</section>
	);
}
