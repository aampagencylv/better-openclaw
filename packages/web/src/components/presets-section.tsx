"use client";

import { getAllPresets } from "@better-openclaw/core";
import { motion } from "framer-motion";
import Link from "next/link";

const presets = getAllPresets();

function formatRam(mb: number | undefined): string {
	if (!mb) return "—";
	return mb >= 1024 ? `${(mb / 1024).toFixed(mb % 1024 === 0 ? 0 : 1)} GB` : `${mb} MB`;
}

const container = {
	hidden: {},
	show: { transition: { staggerChildren: 0.07 } },
};

const card = {
	hidden: { opacity: 0, y: 14 },
	show: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.35, ease: "easeOut" as const },
	},
};

export function PresetsSection() {
	return (
		<section id="presets" className="py-20 md:py-28 bg-muted/30">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				{/* Heading */}
				<div className="mb-14 text-center">
					<h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
						Presets for every use case
					</h2>
					<p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
						One-click starter stacks tuned for common workflows. Customize after scaffolding.
					</p>
				</div>

				{/* Grid */}
				<motion.div
					variants={container}
					initial="hidden"
					whileInView="show"
					viewport={{ once: true, amount: 0.15 }}
					className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
				>
					{presets.map((preset, idx) => (
						<motion.div key={preset.id} variants={card}>
							<Link
								href={`/new?preset=${preset.id}`}
								className="group block overflow-hidden rounded-xl border border-border bg-surface transition-colors hover:border-primary/30"
							>
								{/* Colored top bar */}
								<div className={`h-1 ${idx === 0 ? "bg-primary" : "bg-accent"}`} />

								<div className="p-5">
									<h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">
										{preset.name}
									</h3>
									<p className="mt-1.5 text-sm leading-relaxed text-muted-foreground line-clamp-2">
										{preset.description}
									</p>

									{/* Meta */}
									<div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
										<span>
											<strong className="font-semibold text-foreground">
												{preset.services.length}
											</strong>{" "}
											services
										</span>
										<span>~{formatRam(preset.estimatedMemoryMB)} RAM</span>
									</div>
								</div>
							</Link>
						</motion.div>
					))}
				</motion.div>
			</div>
		</section>
	);
}
