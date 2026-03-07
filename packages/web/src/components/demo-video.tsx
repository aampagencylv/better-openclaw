import { PlayCircle } from "lucide-react";

export function DemoVideo() {
	return (
		<section
			id="demo"
			className="relative border-y border-border/50 bg-background py-24 sm:py-32 overflow-hidden"
		>
			{/* Architectural Background */}
			<div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/30 to-transparent" />
			<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_50%_50%,rgba(163,135,95,0.05)_0%,transparent_100%)]" />

			<div className="relative mx-auto max-w-7xl px-6 lg:px-8">
				<div className="mx-auto max-w-2xl text-center mb-16">
					<h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
						See it in Action
					</h2>
					<p className="mt-4 text-lg text-muted-foreground">
						Watch how easily you can design, validate, and deploy an enterprise-grade AI
						architecture in under 5 minutes.
					</p>
				</div>

				<div className="mx-auto max-w-5xl">
					{/* Video Player Placeholder */}
					<div className="relative aspect-video w-full rounded-2xl border border-border/50 bg-[#0a0a0a] shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden group">
						{/* Placeholder Gradient / Grid */}
						<div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-size-[32px_32px] opacity-20" />
						<div className="absolute inset-0 bg-linear-to-tr from-primary/5 via-transparent to-primary/5" />

						{/* Mock Video UI Controls */}
						<div className="absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-black/80 to-transparent flex items-end px-6 pb-4">
							<div className="w-full flex items-center gap-4">
								<div className="h-2 flex-1 rounded-full bg-white/20 overflow-hidden">
									<div className="h-full w-1/3 bg-primary rounded-full relative">
										<div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
									</div>
								</div>
								<div className="text-xs font-mono text-white/70">01:24 / 03:45</div>
							</div>
						</div>

						{/* Play Button Overlay */}
						<div className="absolute inset-0 flex items-center justify-center">
							<button
								aria-label="Play Demo Video"
								type="button"
								className="group/btn relative flex h-20 w-20 items-center justify-center rounded-full bg-primary/20 backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-primary/30 border border-primary/50"
							>
								<div className="absolute inset-0 rounded-full bg-primary/20 blur-xl transition-all duration-300 group-hover/btn:bg-primary/40 group-hover/btn:blur-2xl" />
								<PlayCircle className="relative z-10 h-10 w-10 text-primary-foreground ml-1" />
							</button>
						</div>

						{/* Mock Top Bar */}
						<div className="absolute top-0 inset-x-0 h-12 bg-linear-to-b from-black/60 to-transparent flex items-start justify-between px-6 pt-4">
							<div className="font-mono text-xs uppercase tracking-widest text-white/50">
								better-openclaw architecture builder demo
							</div>
							<div className="flex gap-1.5">
								<div className="w-2 h-2 rounded-full bg-red-500/50" />
								<div className="w-2 h-2 rounded-full bg-amber-500/50" />
								<div className="w-2 h-2 rounded-full bg-emerald-500/50" />
							</div>
						</div>

						{/* Placeholder text for User to replace */}
						<div className="absolute inset-0 flex items-center justify-center z-[-1] opacity-50">
							<span className="font-mono text-muted-foreground/30 text-2xl uppercase tracking-[0.2em] pointer-events-none">
								[ Placeholder Video Element ]
							</span>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
