"use client";

import { useEffect, useState } from "react";

const SECTIONS = [
	{ id: "hero", label: "01" },
	{ id: "features", label: "02" },
	{ id: "presets", label: "03" },
	{ id: "flow", label: "04" },
	{ id: "demo", label: "05" },
	{ id: "validation", label: "06" },
	{ id: "pricing", label: "07" },
];

/**
 * SideNavigation — Fixed left-side vertical nav with section indicators.
 * Owns its own IntersectionObserver for tracking active section.
 */
export function SideNavigation() {
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
						aria-label={`Navigate to section ${sec.label}`}
						className={`group relative flex h-7 w-7 items-center justify-center rounded-sm border transition-all duration-300
								${
									activeSection === sec.id
										? "bg-primary/10 border-primary/50 text-primary shadow-[0_0_12px_rgba(163,135,95,0.3)]"
										: "border-border/50 text-muted-foreground/60 hover:text-muted-foreground hover:border-border/50"
								}
							`}
					>
						<span className="font-mono text-[11px]">{sec.label}</span>
						{activeSection === sec.id ? (
							<div
								className="absolute -right-px top-1/2 h-4 w-[2px] -translate-y-1/2 bg-primary"
								style={{ animation: "pulse-glow 2s ease-in-out infinite" }}
							/>
						) : null}
					</a>
				))}
			</div>
			<div className="flex h-16 w-full items-end justify-center pb-4">
				<span className="font-mono text-[11px] text-muted-foreground/60 [writing-mode:vertical-rl]">
					V1.0_LTS
				</span>
			</div>
		</div>
	);
}
