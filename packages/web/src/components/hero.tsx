"use client";

import { HeroContent, HeroHUD } from "./HeroContent";

/* ── Particle Component ───────────────────────────────────────────────────── */
function Particles() {
	return (
		<div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
			<div
				className="absolute bottom-[20%] left-[30%] h-1 w-1 rounded-full bg-primary/80"
				style={{ animation: "particle-drift-1 6s ease-out infinite" }}
			/>
			<div
				className="absolute bottom-[15%] left-[50%] h-1.5 w-1.5 rounded-full bg-accent/60"
				style={{ animation: "particle-drift-2 8s ease-out infinite 2s" }}
			/>
			<div
				className="absolute bottom-[25%] left-[45%] h-0.5 w-0.5 rounded-full bg-primary/70"
				style={{ animation: "particle-drift-3 7s ease-out infinite 1s" }}
			/>
			<div
				className="absolute bottom-[10%] left-[55%] h-1 w-1 rounded-full bg-foreground/30"
				style={{ animation: "particle-drift-1 9s ease-out infinite 3s" }}
			/>
			<div
				className="absolute bottom-[30%] left-[40%] h-0.5 w-0.5 rounded-full bg-primary/50"
				style={{ animation: "particle-drift-2 10s ease-out infinite 4s" }}
			/>
			<div
				className="absolute bottom-[18%] left-[60%] h-1 w-1 rounded-full bg-accent/40"
				style={{ animation: "particle-drift-3 8s ease-out infinite 5s" }}
			/>
		</div>
	);
}

export function Hero() {
	return (
		<div className="relative flex min-h-[calc(100vh-3.5rem)] w-full flex-col items-center justify-center overflow-hidden">
			<Particles />

			{/* Scan Line Effect */}
			<div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
				<div
					className="absolute left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"
					style={{ animation: "scan-line 8s linear infinite" }}
				/>
			</div>

			<HeroContent />
			<HeroHUD />
		</div>
	);
}
