"use client";

import Link from "next/link";
import { useState } from "react";
import { Github, Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

const navLinks = [
	{ href: "/new", label: "Builder" },
	{ href: "/docs", label: "Docs" },
	{ href: "/api-docs", label: "API" },
	{ href: "/showcase", label: "Showcase" },
];

export function Navbar() {
	const [mobileOpen, setMobileOpen] = useState(false);

	return (
		<nav className="fixed top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
			<div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
				{/* Logo */}
				<Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
					<span className="text-2xl" aria-hidden>
						🦞
					</span>
					<span className="text-lg font-bold tracking-tight">better-openclaw</span>
				</Link>

				{/* Desktop nav */}
				<div className="hidden md:flex items-center gap-1">
					{navLinks.map((link) => (
						<Link
							key={link.href}
							href={link.href}
							className="rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-muted/50"
						>
							{link.label}
						</Link>
					))}
				</div>

				{/* Right side */}
				<div className="flex items-center gap-2">
					<ThemeToggle />
					<a
						href="https://github.com/diopisemou/better-openclaw"
						target="_blank"
						rel="noopener noreferrer"
						className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface text-muted-foreground transition-all hover:text-foreground hover:border-primary/30"
						aria-label="GitHub"
					>
						<Github className="h-4 w-4" />
					</a>
					<Link
						href="/new"
						className="hidden sm:inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm shadow-primary/20 transition-all hover:bg-primary/90 hover:shadow-md hover:shadow-primary/25"
					>
						Start Building
					</Link>

					{/* Mobile menu toggle */}
					<button
						type="button"
						className="flex md:hidden h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground"
						onClick={() => setMobileOpen(!mobileOpen)}
						aria-label="Toggle menu"
					>
						{mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
					</button>
				</div>
			</div>

			{/* Mobile nav */}
			{mobileOpen && (
				<div className="border-t border-border bg-background/95 backdrop-blur-xl md:hidden">
					<div className="space-y-1 px-4 py-3">
						{navLinks.map((link) => (
							<Link
								key={link.href}
								href={link.href}
								className="block rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-muted/50"
								onClick={() => setMobileOpen(false)}
							>
								{link.label}
							</Link>
						))}
						<Link
							href="/new"
							className="mt-2 block rounded-lg bg-primary px-3 py-2 text-center text-sm font-semibold text-primary-foreground"
							onClick={() => setMobileOpen(false)}
						>
							Start Building
						</Link>
					</div>
				</div>
			)}
		</nav>
	);
}
