"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CommonSetups } from "@/components/common-setups";
import { FeaturesGrid } from "@/components/features-grid";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { HeroAlternative } from "@/components/hero-alternative";
import { Navbar } from "@/components/navbar";
import { PresetsSection } from "@/components/presets-section";

export default function HomePage() {
	const [useAltHero, setUseAltHero] = useState(false);
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
		// Randomly select hero variant on client mount
		if (Math.random() > 0.5) {
			setUseAltHero(true);
		}
	}, []);

	// Default to main Hero during SSR/hydration to prevent mismatches
	// Then switch to alternative if selected
	const HeroComponent = mounted && useAltHero ? HeroAlternative : Hero;

	return (
		<div className="min-h-screen bg-background text-foreground">
			<Navbar />

			<main>
				<HeroComponent />
				<FeaturesGrid />
				<PresetsSection />
				<CommonSetups />

				{/* ── CTA Banner ─────────────────────────────────────── */}
				<section className="py-20 md:py-28">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.5 }}
						className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
					>
						<div className="relative overflow-hidden rounded-2xl border border-border bg-surface p-10 text-center md:p-16">
							{/* Background glow */}
							<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />

							<h2 className="relative text-3xl font-bold tracking-tight text-foreground md:text-4xl">
								Ready to build?
							</h2>
							<p className="relative mx-auto mt-4 max-w-lg text-lg text-muted-foreground">
								Scaffold your production-ready OpenClaw stack in under a minute.
							</p>
							<div className="relative mt-8">
								<Link
									href="/new"
									className="inline-flex items-center justify-center rounded-lg bg-primary px-8 py-3.5 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/25"
								>
									Start Building
								</Link>
							</div>
						</div>
					</motion.div>
				</section>
			</main>

			<Footer />
		</div>
	);
}
