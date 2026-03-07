"use client";

import { motion } from "framer-motion";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Footer } from "@/components/footer";
import { blogCategories, blogPosts } from "@/lib/blogPosts";

export default function BlogPage() {
	const [activeCategory, setActiveCategory] = useState<string>("All");

	const filteredPosts =
		activeCategory === "All"
			? blogPosts
			: blogPosts.filter((post) => post.category === activeCategory);

	return (
		<>
			{/* ─── Hero ────────────────────────────────────────────── */}
			<section className="relative overflow-hidden border-b border-border/50">
				{/* Background */}
				<div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(163,135,95,0.15),transparent)]" />
				<div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-size-[32px_32px]" />

				<div className="relative mx-auto max-w-5xl px-6 py-20 text-center sm:py-28">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
					>
						<div className="mb-4 inline-flex items-center rounded-sm border border-border bg-secondary/50 px-3 py-1">
							<span className="mr-2 h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(163,135,95,0.6)]" />
							<span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
								[ TRANSMISSION: BLOG ]
							</span>
						</div>
					</motion.div>

					<motion.h1
						className="mt-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.1 }}
					>
						Insights & <span className="text-gradient">Tutorials</span>
					</motion.h1>

					<motion.p
						className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.2 }}
					>
						Deep dives into self-hosting AI agents, Docker Compose best practices, homelab
						infrastructure, and DevOps automation.
					</motion.p>
				</div>
			</section>

			{/* ─── Category Filters ────────────────────────────────── */}
			<section className="sticky top-16 z-20 border-b border-border/50 bg-background/80 backdrop-blur-md">
				<div className="mx-auto flex max-w-5xl items-center gap-2 overflow-x-auto px-6 py-3 scrollbar-none">
					{blogCategories.map((cat) => (
						<button
							key={cat}
							type="button"
							onClick={() => setActiveCategory(cat)}
							className={`shrink-0 rounded-sm border px-4 py-1.5 font-mono text-xs uppercase tracking-widest transition-all duration-200 ${
								activeCategory === cat
									? "border-primary/50 bg-primary/10 text-primary shadow-[0_0_12px_rgba(163,135,95,0.2)]"
									: "border-border/50 text-muted-foreground hover:border-border hover:text-foreground"
							}`}
						>
							{cat}
						</button>
					))}
				</div>
			</section>

			{/* ─── Posts Grid ──────────────────────────────────────── */}
			<section className="mx-auto max-w-5xl px-6 py-12 sm:py-16">
				<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{filteredPosts.map((post, i) => (
						<motion.article
							key={post.slug}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.4, delay: i * 0.05 }}
						>
							<Link
								href={`/blog/${post.slug}`}
								className="group flex h-full flex-col rounded-lg border border-border/50 bg-surface/50 p-6 transition-all duration-300 hover:border-primary/40 hover:shadow-[0_0_30px_rgba(163,135,95,0.1)] hover:bg-surface"
							>
								{/* Category badge */}
								<div className="mb-4 flex items-center gap-3">
									<span className="inline-flex items-center rounded-sm bg-primary/10 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-widest text-primary">
										{post.category}
									</span>
								</div>

								{/* Title */}
								<h2 className="text-lg font-semibold leading-snug text-foreground group-hover:text-primary transition-colors duration-200">
									{post.title}
								</h2>

								{/* Description */}
								<p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground line-clamp-3">
									{post.description}
								</p>

								{/* Meta */}
								<div className="mt-4 flex items-center gap-4 border-t border-border/50 pt-4 text-xs text-muted-foreground">
									<span className="flex items-center gap-1">
										<Calendar className="h-3 w-3" />
										{new Date(post.date).toLocaleDateString("en-US", {
											month: "short",
											day: "numeric",
											year: "numeric",
										})}
									</span>
									<span className="flex items-center gap-1">
										<Clock className="h-3 w-3" />
										{post.readTime}
									</span>
								</div>

								{/* Read more */}
								<div className="mt-3 flex items-center gap-1 font-mono text-xs uppercase tracking-widest text-primary opacity-0 transition-opacity duration-200 group-hover:opacity-100">
									Read Article
									<ArrowRight className="h-3 w-3" />
								</div>
							</Link>
						</motion.article>
					))}
				</div>

				{filteredPosts.length === 0 && (
					<div className="py-20 text-center">
						<p className="text-muted-foreground">No posts found in this category.</p>
					</div>
				)}
			</section>

			<Footer />
		</>
	);
}
