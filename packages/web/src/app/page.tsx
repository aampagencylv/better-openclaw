"use client";

import { useEffect, useState } from "react";
import { CommonSetups } from "@/components/common-setups";
import { FeaturesGrid } from "@/components/features-grid";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { Navbar } from "@/components/navbar";
import { PresetsSection } from "@/components/presets-section";
import { DemoVideo } from "@/components/demo-video";

const SECTIONS = [
	{ id: "hero", label: "01" },
	{ id: "features", label: "02" },
	{ id: "presets", label: "03" },
	{ id: "flow", label: "04" },
	{ id: "demo", label: "05" },
	{ id: "validation", label: "06" },
	{ id: "pricing", label: "07" },
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
		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						setActiveSection(entry.target.id);
					}
				}
			},
			{ threshold: 0.3 },
		);

		for (const sec of SECTIONS) {
			const el = document.getElementById(sec.id);
			if (el) observer.observe(el);
		}

		return () => observer.disconnect();
	}, []);

	return (
		<div className="relative min-h-screen bg-background text-foreground selection:bg-primary/20">
			{/* Grid Background Overlay with subtle animation */}
			<div className="pointer-events-none fixed inset-0 z-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px]" />

			{/* ─── MASTER CONTINUOUS BACKGROUND ─────────────────────────────────── */}
			<div className="absolute inset-0 z-0 overflow-hidden pointer-events-none bg-background">
				{/* Deep ambient base for the entire page */}
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(240,235,230,0.5)_0%,transparent_100%)] dark:bg-[radial-gradient(circle_at_50%_0%,rgba(30,20,10,1)_0%,rgba(0,0,0,1)_100%)]" />

				{/* 1. HERO SECTION BACKGROUND (0 - 100vh) */}
				<div className="absolute top-0 w-full h-[100vh]">
					{/* The Core Horizon (Intense bottom glow) */}
					<div className="absolute bottom-0 left-1/2 w-[1200px] h-[600px] -translate-x-1/2 translate-y-1/2 rounded-[100%] bg-[radial-gradient(closest-side,rgba(255,200,100,0.8)_0%,rgba(200,100,20,0.4)_40%,transparent_100%)] blur-[80px]" />

					{/* Concentric Accretion Rings (Ellipses) */}
					<div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[60%] w-[140vw] min-w-[1200px] aspect-[2.5/1] flex items-center justify-center">
						<div className="absolute w-full h-full rounded-[100%] border-[2px] border-primary/20 shadow-[0_0_100px_rgba(163,135,95,0.2)_inset]" />
						<div
							className="absolute w-[80%] h-[80%] rounded-[100%] border-[4px] border-[#c2a67a]/40 shadow-[0_0_80px_rgba(194,166,122,0.3)_inset]"
							style={{ animation: "pulse-glow 8s ease-in-out infinite" }}
						/>
						<div
							className="absolute w-[60%] h-[60%] rounded-[100%] border-[8px] border-[#ffb347]/60 shadow-[0_0_120px_rgba(255,179,71,0.5)_inset,0_0_120px_rgba(255,179,71,0.5)]"
							style={{ animation: "pulse-glow 4s ease-in-out infinite" }}
						/>
						<div className="absolute w-[40%] h-[40%] rounded-[100%] bg-[#ff9b26]/5 border-[16px] border-[#ffecd2]/80 shadow-[0_0_150px_rgba(255,236,210,0.8)_inset,0_0_150px_rgba(255,236,210,0.8)] blur-[2px]" />
					</div>

					{/* The Vertical Light Beam */}
					<div
						className="absolute top-0 left-1/2 w-[4px] h-full -translate-x-1/2 bg-gradient-to-b from-transparent via-[#ffecd2] to-[#ffecd2]"
						style={{ animation: "beam-pulse 3s ease-in-out infinite" }}
					/>
					<div className="absolute top-0 left-1/2 w-[40px] h-full -translate-x-1/2 bg-gradient-to-b from-transparent via-[#ffb347]/40 to-[#ffb347]/80 blur-[8px]" />
					<div
						className="absolute top-0 left-1/2 w-[300px] h-full -translate-x-1/2 bg-gradient-to-b from-transparent via-[#a3875f]/10 to-[#ffb347]/30 blur-[40px]"
						style={{ animation: "pulse-glow 6s ease-in-out infinite" }}
					/>
				</div>

				{/* 2. FEATURES GRID BACKGROUND (100vh - 250vh) */}
				<div className="absolute top-[100vh] w-full h-[150vh]">
					<div
						className="absolute top-[30%] left-[10%] w-[120%] h-[80%] -translate-y-1/2 -translate-x-[10%] rounded-full bg-[radial-gradient(closest-side,rgba(255,140,40,0.15)_0%,rgba(200,80,20,0.05)_50%,transparent_100%)] blur-[120px]"
						style={{ animation: "pulse-glow 10s ease-in-out infinite" }}
					/>

					<div
						className="absolute top-[40%] left-[-20%] w-[140%] h-[600px] -translate-y-1/2 flex items-end justify-center transform-gpu -rotate-[12deg] pointer-events-none"
						style={{ animation: "nebula-drift-2 20s ease-in-out infinite" }}
					>
						<div className="absolute bottom-[80px] w-full h-[300px] bg-gradient-to-r from-transparent via-[#ff8c28]/20 to-[rgba(100,180,255,0.15)] blur-[60px]" />
						<div className="absolute bottom-[100px] w-[80%] h-[60px] bg-gradient-to-r from-transparent via-[#ffb347]/60 to-[rgba(100,180,255,0.4)] blur-[20px]" />
						<div className="absolute bottom-[120px] w-[70%] h-[4px] bg-gradient-to-r from-transparent via-[#ffffff] to-[rgba(180,220,255,0.8)] blur-[2px]" />
					</div>
				</div>

				{/* 3. CONNECTIVE TISSUES (250vh - Bottom) */}
				<div className="absolute top-[250vh] bottom-[100vh] w-full opacity-70">
					<div
						className="absolute top-0 right-0 w-[80%] h-[1200px] bg-[radial-gradient(ellipse_70%_50%_at_80%_30%,rgba(163,135,95,0.15)_0%,transparent_70%)]"
						style={{ animation: "nebula-drift-1 25s ease-in-out infinite" }}
					/>
					<div
						className="absolute top-[600px] left-[-20%] w-[100%] h-[1500px] bg-[radial-gradient(ellipse_50%_60%_at_30%_50%,rgba(100,140,200,0.1)_0%,transparent_70%)]"
						style={{ animation: "nebula-drift-2 30s ease-in-out infinite reverse" }}
					/>
					<div
						className="absolute top-[1800px] left-1/2 w-[120%] h-[1000px] -translate-x-1/2 bg-[radial-gradient(ellipse_60%_40%_at_50%_50%,rgba(194,166,122,0.1)_0%,transparent_60%)]"
						style={{ animation: "nebula-drift-3 22s ease-in-out infinite" }}
					/>
				</div>

				{/* 4. BOTTOM SECTION (Footer space) - section-bg.png */}
				<div className="absolute bottom-0 w-full h-[150vh]">
					<div className="absolute inset-0 bg-gradient-to-b from-transparent to-background dark:to-black/80 z-10" />
					<img
						src="/section-bg.png"
						alt="Deep Nebula Base"
						className="absolute bottom-0 w-full h-full object-cover opacity-10 dark:opacity-40 mix-blend-multiply dark:mix-blend-screen"
					/>
					<div
						className="absolute bottom-[-10%] left-[20%] w-[60%] h-[80%] rounded-full bg-[radial-gradient(closest-side,rgba(255,200,100,0.15)_0%,transparent_100%)] blur-[100px] z-10"
						style={{ animation: "nebula-drift-3 28s ease-in-out infinite" }}
					/>
				</div>
			</div>

			{/* Left Vertical Navigation */}
			<div className="fixed left-0 top-0 z-40 hidden h-full w-14 flex-col border-r border-border/50 bg-background/40 backdrop-blur-md lg:flex">
				<div className="flex h-16 w-full items-center justify-center border-b border-border/50">
					<span
						className="font-mono text-xs text-muted-foreground/60"
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
								${
									activeSection === sec.id
										? "bg-primary/10 border-primary/50 text-primary shadow-[0_0_12px_rgba(163,135,95,0.3)]"
										: "border-border/50 text-muted-foreground/60 hover:text-muted-foreground hover:border-border/50"
								}
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
					<span className="font-mono text-[11px] text-muted-foreground/60 [writing-mode:vertical-rl]">
						V1.0_LTS
					</span>
				</div>
			</div>

			<Navbar />

			{/* ─── Scrolling Notification Ticker ──────────────────────────────── */}
			<div className="fixed top-16 left-0 right-0 z-30 h-8 overflow-hidden border-b border-border/50 bg-background/80 backdrop-blur-md lg:left-14">
				<div
					className="flex h-full items-center gap-12 whitespace-nowrap"
					style={{ animation: "ticker-scroll 40s linear infinite" }}
				>
					{/* Double the messages for seamless loop */}
					{[...TICKER_MESSAGES, ...TICKER_MESSAGES].map((msg, i) => (
						<span key={i} className="flex items-center gap-3 font-mono text-xs tracking-wider">
							<span className="text-muted-foreground/60">{`${String(Math.floor(Math.random() * 24)).padStart(2, "0")}:${String(Math.floor(Math.random() * 60)).padStart(2, "0")}:${String(Math.floor(Math.random() * 60)).padStart(2, "0")}`}</span>
							<span
								className={
									msg.startsWith("WARN")
										? "text-amber-500"
										: msg.startsWith("OK")
											? "text-emerald-500"
											: "text-muted-foreground"
								}
							>
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

				<DemoVideo />

				{/* Validation Console is inside the Footer */}
				{/* <section id="validation" className="min-h-[60vh]">
					
				</section> */}

				{/* Pricing is inside the Footer */}
				{/* <section id="pricing" className="min-h-[60vh]">
					
				</section> */}
			</main>

			<div className="relative z-10 lg:pl-14">
				<Footer />
			</div>
		</div>
	);
}
