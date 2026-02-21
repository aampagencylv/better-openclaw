"use client";

import { useEffect, useState } from "react";
import { CommonSetups } from "@/components/common-setups";
import { FeaturesGrid } from "@/components/features-grid";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { Navbar } from "@/components/navbar";
import { PresetsSection } from "@/components/presets-section";

const SECTIONS = [
	{ id: "hero", label: "01" },
	{ id: "features", label: "02" },
	{ id: "presets", label: "03" },
	{ id: "flow", label: "04" },
	{ id: "validation", label: "05" },
	{ id: "pricing", label: "06" },
];

export default function HomePage() {
	const [activeSection, setActiveSection] = useState("hero");

	useEffect(() => {
		// Dark mode enforcement on the landing page
		document.documentElement.classList.add("dark");

		// Intersection Observer for scroll spy
		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						setActiveSection(entry.target.id);
					}
				}
			},
			{ threshold: 0.3 }, // Trigger when 30% of the section is visible
		);

		for (const sec of SECTIONS) {
			const el = document.getElementById(sec.id);
			if (el) observer.observe(el);
		}

		return () => observer.disconnect();
	}, []);

	return (
		<div className="relative min-h-screen bg-black text-foreground selection:bg-primary/20">
			{/* Grid Background Overlay */}
			<div className="pointer-events-none fixed inset-0 z-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px]" />

			{/* Left Vertical Navigation (Axion-style) */}
			<div className="fixed left-0 top-0 z-40 hidden h-full w-12 flex-col border-r border-white/5 bg-black/40 backdrop-blur-md lg:flex">
				<div className="flex h-14 w-full items-center justify-center border-b border-white/5">
					<span className="font-mono text-[10px] text-zinc-600">SYS</span>
				</div>
				<div className="flex flex-1 flex-col items-center justify-center gap-4 py-4">
					{SECTIONS.map((sec) => (
						<a
							key={sec.id}
							href={`#${sec.id}`}
							className={`group relative flex h-6 w-6 items-center justify-center rounded-sm border border-white/5 transition-all
								${activeSection === sec.id ? "bg-primary/10 border-primary/50 text-primary" : "text-zinc-600 hover:text-zinc-400"}
							`}
						>
							<span className="font-mono text-[9px]">{sec.label}</span>
							{/* Active Indicator Line */}
							{activeSection === sec.id && (
								<div className="absolute -right-[1px] top-1/2 h-4 w-[2px] -translate-y-1/2 bg-primary shadow-[0_0_8px_rgba(163,135,95,0.8)]" />
							)}
						</a>
					))}
				</div>
				<div className="flex h-14 w-full items-end justify-center pb-4">
					<span
						className="font-mono text-[9px] text-zinc-600"
						style={{ writingMode: "vertical-rl" }}
					>
						V1.0_LTS
					</span>
				</div>
			</div>

			<Navbar />

			{/* Main Content Area (padding left on desktop to account for left nav) */}
			<main className="relative z-10 lg:pl-12">
				<section id="hero" className="min-h-screen pt-14">
					<Hero />
				</section>

				<section id="features" className="min-h-screen">
					<FeaturesGrid />
				</section>

				<section id="presets" className="min-h-[80vh]">
					<PresetsSection />
				</section>

				<section id="flow" className="min-h-[80vh]">
					<CommonSetups />
				</section>

				<section id="validation" className="min-h-[60vh]">
					{/* Placeholder for Validation Console */}
				</section>

				<section id="pricing" className="min-h-[60vh]">
					{/* Placeholder for Pricing Tier */}
				</section>
			</main>

			<div className="relative z-10 lg:pl-12">
				<Footer />
			</div>
		</div>
	);
}
