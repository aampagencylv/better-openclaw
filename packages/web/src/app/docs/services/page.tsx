import Link from "next/link";
import { getAllServices, SERVICE_CATEGORIES } from "@better-openclaw/core";

export const metadata = {
	title: "Service Reference — better-openclaw",
	description: "Complete catalog of all companion services available in better-openclaw",
};

export default function ServiceReferencePage() {
	const allServices = getAllServices();

	return (
		<div className="min-h-screen bg-background text-foreground">
			<header className="border-b border-border">
				<div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
					<Link href="/" className="text-xl font-bold text-primary">
						better-openclaw
					</Link>
					<nav className="flex gap-6 text-sm text-muted-foreground">
						<Link href="/new" className="hover:text-foreground transition-colors">
							Builder
						</Link>
						<Link href="/docs" className="text-foreground">
							Docs
						</Link>
					</nav>
				</div>
			</header>

			<main className="mx-auto max-w-5xl px-6 py-12">
				<h1 className="text-4xl font-bold mb-4">Service Reference</h1>
				<p className="text-lg text-muted-foreground mb-12">
					Complete catalog of {allServices.length} companion services across {SERVICE_CATEGORIES.length} categories.
				</p>

				{SERVICE_CATEGORIES.map((cat) => {
					const services = allServices.filter((s) => s.category === cat.id);
					if (services.length === 0) return null;

					return (
						<section key={cat.id} className="mb-12">
							<h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
								<span>{cat.icon}</span>
								{cat.name}
							</h2>

							<div className="grid gap-4">
								{services.map((svc) => (
									<div
										key={svc.id}
										className="p-5 rounded-lg bg-surface border border-border"
									>
										<div className="flex items-start justify-between mb-2">
											<div className="flex items-center gap-2">
												<span className="text-xl">{svc.icon}</span>
												<h3 className="text-lg font-semibold">{svc.name}</h3>
												<span
													className={`text-xs px-2 py-0.5 rounded-full ${
														svc.maturity === "stable"
															? "bg-accent/20 text-accent"
															: svc.maturity === "beta"
																? "bg-yellow-500/20 text-yellow-400"
																: "bg-red-500/20 text-red-400"
													}`}
												>
													{svc.maturity}
												</span>
											</div>
											{svc.minMemoryMB && (
												<span className="text-xs text-muted-foreground">
													~{svc.minMemoryMB}MB RAM
												</span>
											)}
										</div>

										<p className="text-sm text-muted-foreground mb-3">
											{svc.description}
										</p>

										<div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
											<div>
												<span className="text-muted-foreground">Image:</span>{" "}
												<code className="font-mono text-accent">{svc.image}:{svc.imageTag}</code>
											</div>
											{svc.ports.length > 0 && (
												<div>
													<span className="text-muted-foreground">Ports:</span>{" "}
													{svc.ports
														.map((p) => `${p.host}:${p.container}`)
														.join(", ")}
												</div>
											)}
											{svc.requires.length > 0 && (
												<div>
													<span className="text-muted-foreground">Requires:</span>{" "}
													{svc.requires.join(", ")}
												</div>
											)}
											{svc.conflictsWith.length > 0 && (
												<div>
													<span className="text-muted-foreground">Conflicts:</span>{" "}
													{svc.conflictsWith.join(", ")}
												</div>
											)}
										</div>

										{svc.tags.length > 0 && (
											<div className="mt-3 flex flex-wrap gap-1">
												{svc.tags.map((tag) => (
													<span
														key={tag}
														className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
													>
														{tag}
													</span>
												))}
											</div>
										)}

										<div className="mt-3">
											<a
												href={svc.docsUrl}
												target="_blank"
												rel="noopener noreferrer"
												className="text-xs text-primary hover:underline"
											>
												Official docs &rarr;
											</a>
										</div>
									</div>
								))}
							</div>
						</section>
					);
				})}
			</main>
		</div>
	);
}
