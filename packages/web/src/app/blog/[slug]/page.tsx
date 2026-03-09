import { ArrowLeft, Calendar, Clock, Tag } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer } from "@/components/footer";
import { blogPosts } from "@/lib/blogPosts";

interface BlogPostPageProps {
	params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
	return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
	const { slug } = await params;
	const post = blogPosts.find((p) => p.slug === slug);
	if (!post) return {};

	return {
		title: post.title,
		description: post.description,
		openGraph: {
			title: `${post.title} | better-openclaw Blog`,
			description: post.description,
			type: "article",
			url: `https://better-openclaw.dev/blog/${post.slug}`,
			publishedTime: post.date,
		},
		twitter: {
			card: "summary_large_image",
			title: post.title,
			description: post.description,
		},
		alternates: {
			canonical: `https://better-openclaw.dev/blog/${post.slug}`,
		},
	};
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
	const { slug } = await params;
	const post = blogPosts.find((p) => p.slug === slug);

	if (!post) notFound();

	const relatedPosts = blogPosts
		.filter((p) => p.slug !== post.slug && p.category === post.category)
		.slice(0, 3);

	const articleJsonLd = {
		"@context": "https://schema.org",
		"@type": "BlogPosting",
		headline: post.title,
		description: post.description,
		datePublished: post.date,
		author: {
			"@type": "Organization",
			name: "better-openclaw",
			url: "https://better-openclaw.dev",
		},
		publisher: {
			"@type": "Organization",
			name: "better-openclaw",
			url: "https://better-openclaw.dev",
		},
		url: `https://better-openclaw.dev/blog/${post.slug}`,
		keywords: post.tags.join(", "),
	};

	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
			/>

			{/* ─── Article Header ──────────────────────────────────── */}
			<article className="relative">
				<div className="border-b border-border/50 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(163,135,95,0.1),transparent)]">
					<div className="mx-auto max-w-3xl px-6 py-12 sm:py-16">
						{/* Back link */}
						<Link
							href="/blog"
							className="mb-8 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground"
						>
							<ArrowLeft className="h-3 w-3" />
							Back to Blog
						</Link>

						{/* Category + Meta */}
						<div className="mt-4 flex flex-wrap items-center gap-3">
							<span className="inline-flex items-center rounded-sm bg-primary/10 px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-widest text-primary">
								{post.category}
							</span>
							<span className="flex items-center gap-1 text-xs text-muted-foreground">
								<Calendar className="h-3 w-3" />
								{new Date(post.date).toLocaleDateString("en-US", {
									month: "long",
									day: "numeric",
									year: "numeric",
								})}
							</span>
							<span className="flex items-center gap-1 text-xs text-muted-foreground">
								<Clock className="h-3 w-3" />
								{post.readTime}
							</span>
						</div>

						{/* Title */}
						<h1 className="mt-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
							{post.title}
						</h1>

						{/* Description */}
						<p className="mt-4 text-lg leading-relaxed text-muted-foreground">{post.description}</p>

						{/* Tags */}
						<div className="mt-6 flex flex-wrap gap-2">
							{post.tags.map((tag) => (
								<span
									key={tag}
									className="inline-flex items-center gap-1 rounded-sm border border-border/50 bg-secondary/50 px-2 py-0.5 text-xs text-muted-foreground"
								>
									<Tag className="h-2.5 w-2.5" />
									{tag}
								</span>
							))}
						</div>
					</div>
				</div>

				{/* ─── Article Body ──────────────────────────────────── */}
				<div className="mx-auto max-w-3xl px-6 py-10 sm:py-14">
					<div
						className="prose prose-slate dark:prose-invert max-w-none [&_pre]:bg-surface [&_pre]:border [&_pre]:border-border [&_pre]:rounded-lg [&_pre]:p-4 [&_pre]:overflow-x-auto [&_code]:font-mono [&_code]:text-sm [&_code]:bg-secondary/50 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:border [&_code]:border-border/50 [&_a]:text-primary [&_a]:no-underline hover:[&_a]:underline [&_h2]:text-foreground [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:border-l-2 [&_h2]:border-primary/50 [&_h2]:pl-4 [&_h3]:text-foreground [&_h3]:text-lg [&_h3]:font-semibold [&_p]:text-muted-foreground [&_p]:leading-relaxed [&_p]:mb-4 [&_li]:text-muted-foreground [&_strong]:text-foreground [&_blockquote]:border-primary/50 [&_blockquote]:text-muted-foreground"
						dangerouslySetInnerHTML={{ __html: post.content }}
					/>
				</div>
			</article>

			{/* ─── Clawexa Cloud CTA ──────────────────────────────── */}
			<div className="mx-auto max-w-3xl px-6 py-6 border-t border-border/30">
				<p className="font-mono text-xs text-muted-foreground/70">
					Skip the infrastructure setup? Deploy your stack on{" "}
					<a
						href="https://clawexa.net"
						className="text-primary/80 transition-colors hover:text-primary hover:underline"
						target="_blank"
						rel="noopener noreferrer"
					>
						Clawexa Cloud
					</a>{" "}
					&mdash; the hosted version of better-openclaw.
				</p>
			</div>

			{/* ─── Related Posts ────────────────────────────────────── */}
			{relatedPosts.length > 0 && (
				<section className="border-t border-border/50 bg-surface/30">
					<div className="mx-auto max-w-3xl px-6 py-12 sm:py-16">
						<h2 className="mb-8 font-mono text-sm uppercase tracking-widest text-muted-foreground">
							Related Articles
						</h2>
						<div className="grid gap-4 sm:grid-cols-3">
							{relatedPosts.map((related) => (
								<Link
									key={related.slug}
									href={`/blog/${related.slug}`}
									className="group rounded-lg border border-border/50 bg-background p-5 transition-all duration-300 hover:border-primary/40 hover:shadow-[0_0_20px_rgba(163,135,95,0.08)]"
								>
									<span className="inline-flex items-center rounded-sm bg-primary/10 px-2 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-widest text-primary">
										{related.category}
									</span>
									<h3 className="mt-3 text-sm font-semibold leading-snug text-foreground group-hover:text-primary transition-colors">
										{related.title}
									</h3>
									<p className="mt-1.5 text-xs text-muted-foreground line-clamp-2">
										{related.description}
									</p>
								</Link>
							))}
						</div>
					</div>
				</section>
			)}

			<Footer />
		</>
	);
}
