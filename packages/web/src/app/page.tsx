"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { FeaturesGrid } from "@/components/features-grid";
import { PresetsSection } from "@/components/presets-section";
import { CommonSetups } from "@/components/common-setups";
import { Footer } from "@/components/footer";

const SECTIONS = [
	{ id: "hero", label: "01" },
	{ id: "features", label: "02" },
	{ id: "presets", label: "03" },
	{ id: "flow", label: "04" },
	{ id: "validation", label: "05" },
	{ id: "pricing", label: "06" },
];

const TICKER_MESSAGES = [
	"WARN: Latency_spike detected in zone_3 (resolved)",
	"INFO: New node registered [US-WEST-2] — status: ONLINE",
	"SYS: Auto-scaling triggered — +2 compute nodes allocated",
	"OK: Health check passed — all 58 services nominal",
	"INFO: Skill pack 'researcher' deployed to cluster_alpha",
	"SYS: TLS certificates renewed — expires: 2027-02-21",
];

export default function HomePage() {
	const [activeSection, setActiveSection] = useState("hero");

	useEffect(() => {
		document.documentElement.classList.add("dark");

		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						setActiveSection(entry.target.id);
					}
				}
			},
			{ threshold: 0.3 }
		);

		for (const sec of SECTIONS) {
			const el = document.getElementById(sec.id);
			if (el) observer.observe(el);
		}

		return () => observer.disconnect();
	}, []);

	return (
		<div className="relative min-h-screen bg-black text-foreground selection:bg-primary/20">
			{/* Grid Background Overlay with subtle animation */}
			<div className="pointer-events-none fixed inset-0 z-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px]" />

			{/* Left Vertical Navigation */}
			<div className="fixed left-0 top-0 z-40 hidden h-full w-14 flex-col border-r border-white/5 bg-black/40 backdrop-blur-md lg:flex">
				<div className="flex h-16 w-full items-center justify-center border-b border-white/5">
					<span
						className="font-mono text-xs text-zinc-600"
						style={{ animation: "data-refresh 4s ease-in-out infinite" }}
					>
						SYS
					</span>
				</div>
				<div className="flex flex-1 flex-col items-center justify-center gap-4 py-4">
					{SECTIONS.map((sec) => (
						<a
							key={sec.id}
							href={`#${sec.id}`}
							className={`group relative flex h-7 w-7 items-center justify-center rounded-sm border transition-all duration-300
								${activeSection === sec.id
									? "bg-primary/10 border-primary/50 text-primary shadow-[0_0_12px_rgba(163,135,95,0.3)]"
									: "border-white/5 text-zinc-600 hover:text-zinc-400 hover:border-white/10"}
							`}
						>
							<span className="font-mono text-[11px]">{sec.label}</span>
							{activeSection === sec.id && (
								<div
									className="absolute -right-px top-1/2 h-4 w-[2px] -translate-y-1/2 bg-primary"
									style={{ animation: "pulse-glow 2s ease-in-out infinite" }}
								/>
							)}
						</a>
					))}
				</div>
				<div className="flex h-16 w-full items-end justify-center pb-4">
					<span className="font-mono text-[11px] text-zinc-600 [writing-mode:vertical-rl]">
						V1.0_LTS
					</span>
				</div>
			</div>

			<Navbar />

			{/* ─── Scrolling Notification Ticker ──────────────────────────────── */}
			<div className="fixed top-16 left-0 right-0 z-30 h-8 overflow-hidden border-b border-white/5 bg-black/80 backdrop-blur-md lg:left-14">
				<div
					className="flex h-full items-center gap-12 whitespace-nowrap"
					style={{ animation: "ticker-scroll 40s linear infinite" }}
				>
					{/* Double the messages for seamless loop */}
					{[...TICKER_MESSAGES, ...TICKER_MESSAGES].map((msg, i) => (
						<span key={i} className="flex items-center gap-3 font-mono text-xs tracking-wider">
							<span className="text-zinc-600">{`${String(Math.floor(Math.random() * 24)).padStart(2, "0")}:${String(Math.floor(Math.random() * 60)).padStart(2, "0")}:${String(Math.floor(Math.random() * 60)).padStart(2, "0")}`}</span>
							<span className={msg.startsWith("WARN") ? "text-amber-500" : msg.startsWith("OK") ? "text-emerald-500" : "text-zinc-400"}>
								{msg}
							</span>
						</span>
					))}
				</div>
			</div>

			{/* Main Content Area */}
			<main className="relative z-10 lg:pl-14">
				<section id="hero" className="min-h-screen pt-[calc(4rem+2rem)]">
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
					{/* Validation Console is inside the Footer */}
				</section>

				<section id="pricing" className="min-h-[60vh]">
					{/* Pricing is inside the Footer */}
				</section>
			</main>

			<div className="relative z-10 lg:pl-14">
				<Footer />
			</div>
		</div>
	);
}
