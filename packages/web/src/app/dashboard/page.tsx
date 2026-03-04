"use client";

import JSZip from "jszip";
import {
	ArrowLeft,
	Download,
	LayoutGrid,
	Loader2,
	LogOut,
	Package,
	Plus,
	Star,
	Trash2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
	deleteSavedStack,
	fetchFavorites,
	fetchSavedStacks,
	generateStack,
	type SavedStackResponse,
	toggleFavorite,
} from "@/lib/api-client";
import { signOut, useSession } from "@/lib/auth-client";

export default function DashboardPage() {
	const router = useRouter();
	const { data: session, isPending } = useSession();
	const [stacks, setStacks] = useState<SavedStackResponse[]>([]);
	const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
	const [isLoading, setIsLoading] = useState(true);
	const [downloadingId, setDownloadingId] = useState<string | null>(null);
	const [deletingId, setDeletingId] = useState<string | null>(null);
	const [activeTab, setActiveTab] = useState<"all" | "favorites">("all");

	useEffect(() => {
		if (!isPending && !session) {
			router.push("/sign-in");
		}
	}, [session, isPending, router]);

	useEffect(() => {
		if (session) {
			loadData();
		}
	}, [session]);

	async function loadData() {
		setIsLoading(true);
		try {
			const [stacksData, favData] = await Promise.all([fetchSavedStacks(), fetchFavorites()]);
			setStacks(stacksData);
			setFavoriteIds(new Set(favData.map((f) => f.stackId)));
		} catch (err) {
			console.error("Failed to load data:", err);
		} finally {
			setIsLoading(false);
		}
	}

	async function handleDownload(stack: SavedStackResponse) {
		setDownloadingId(stack.id);
		try {
			const config = stack.config as Record<string, unknown>;
			const { projectName: _pn, services: _sv, ...restConfig } = config;
			const result = await generateStack({
				projectName: stack.name,
				services: stack.services as string[],
				...(restConfig as Omit<Parameters<typeof generateStack>[0], "projectName" | "services">),
			});
			const zip = new JSZip();
			const folder = zip.folder(stack.name);
			if (folder) {
				for (const [path, content] of Object.entries(result.files)) {
					folder.file(path, content);
				}
			}
			const blob = await zip.generateAsync({ type: "blob" });
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = `${stack.name}.zip`;
			a.click();
			URL.revokeObjectURL(url);
		} catch (err) {
			console.error("Download failed:", err);
		} finally {
			setDownloadingId(null);
		}
	}

	async function handleDelete(id: string) {
		setDeletingId(id);
		try {
			await deleteSavedStack(id);
			setStacks((prev) => prev.filter((s) => s.id !== id));
			setFavoriteIds((prev) => {
				const next = new Set(prev);
				next.delete(id);
				return next;
			});
		} catch (err) {
			console.error("Delete failed:", err);
		} finally {
			setDeletingId(null);
		}
	}

	async function handleToggleFavorite(stackId: string) {
		const isFav = favoriteIds.has(stackId);
		try {
			if (isFav) {
				await toggleFavorite(stackId, "remove");
				setFavoriteIds((prev) => {
					const next = new Set(prev);
					next.delete(stackId);
					return next;
				});
			} else {
				await toggleFavorite(stackId, "add");
				setFavoriteIds((prev) => new Set([...prev, stackId]));
			}
		} catch (err) {
			console.error("Favorite toggle failed:", err);
		}
	}

	const displayedStacks =
		activeTab === "favorites" ? stacks.filter((s) => favoriteIds.has(s.id)) : stacks;

	if (isPending) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-background">
				<Loader2 className="h-8 w-8 animate-spin text-primary" />
			</div>
		);
	}

	if (!session) return null;

	return (
		<div className="min-h-screen bg-background text-foreground">
			{/* Header */}
			<header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur-md">
				<div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 md:px-6">
					<div className="flex items-center gap-4">
						<Link
							href="/"
							className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
						>
							<ArrowLeft className="h-4 w-4" />
							Home
						</Link>
						<div className="h-4 w-px bg-border" />
						<span className="text-lg font-bold text-foreground">Dashboard</span>
					</div>
					<div className="flex items-center gap-3">
						<span className="hidden text-sm text-muted-foreground sm:block">
							{session.user.name || session.user.email}
						</span>
						<button
							type="button"
							onClick={async () => {
								await signOut();
								router.push("/");
							}}
							className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
						>
							<LogOut className="h-3.5 w-3.5" />
							Sign out
						</button>
						<Link
							href="/new"
							className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-all hover:bg-primary/90"
						>
							<Plus className="h-3.5 w-3.5" />
							New Stack
						</Link>
					</div>
				</div>
			</header>

			<main className="mx-auto max-w-5xl px-4 py-8 md:px-6">
				{/* Welcome */}
				<div className="mb-8">
					<h1 className="text-2xl font-bold text-foreground">
						Welcome back, {session.user.name?.split(" ")[0] ?? "builder"}
					</h1>
					<p className="mt-1 text-sm text-muted-foreground">Manage your saved OpenClaw stacks</p>
				</div>

				{/* Stats */}
				<div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
					{[
						{
							label: "Total Stacks",
							value: stacks.length,
							icon: <Package className="h-4 w-4" />,
						},
						{
							label: "Favorited",
							value: favoriteIds.size,
							icon: <Star className="h-4 w-4" />,
						},
						{
							label: "Services Used",
							value: stacks.reduce((acc, s) => acc + (s.services as string[]).length, 0),
							icon: <LayoutGrid className="h-4 w-4" />,
						},
					].map((stat) => (
						<div key={stat.label} className="rounded-xl border border-border bg-surface/50 p-4">
							<div className="flex items-center gap-2 text-muted-foreground">
								{stat.icon}
								<span className="text-xs uppercase tracking-wider">{stat.label}</span>
							</div>
							<p className="mt-2 text-2xl font-bold text-foreground">{stat.value}</p>
						</div>
					))}
				</div>

				{/* Tabs */}
				<div className="mb-4 flex gap-1 rounded-lg border border-border bg-surface/30 p-1 w-fit">
					{(["all", "favorites"] as const).map((tab) => (
						<button
							key={tab}
							type="button"
							onClick={() => setActiveTab(tab)}
							className={`rounded-md px-4 py-1.5 text-sm font-medium capitalize transition-all ${
								activeTab === tab
									? "bg-background text-foreground shadow-sm"
									: "text-muted-foreground hover:text-foreground"
							}`}
						>
							{tab === "favorites" ? "⭐ Favorites" : "All Stacks"}
						</button>
					))}
				</div>

				{/* Stacks list */}
				{isLoading ? (
					<div className="flex items-center justify-center py-16">
						<Loader2 className="h-6 w-6 animate-spin text-primary" />
					</div>
				) : displayedStacks.length === 0 ? (
					<div className="rounded-xl border border-border bg-surface/20 py-16 text-center">
						<p className="text-2xl">🦞</p>
						<p className="mt-2 text-sm font-medium text-foreground">
							{activeTab === "favorites" ? "No favorites yet" : "No stacks saved yet"}
						</p>
						<p className="mt-1 text-xs text-muted-foreground">
							{activeTab === "favorites"
								? "Star a stack to add it here"
								: "Build a stack and click Save to store it here"}
						</p>
						{activeTab === "all" && (
							<Link
								href="/new"
								className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
							>
								<Plus className="h-4 w-4" />
								Build your first stack
							</Link>
						)}
					</div>
				) : (
					<div className="space-y-3">
						{displayedStacks.map((stack) => (
							<div
								key={stack.id}
								className="group flex flex-col gap-3 rounded-xl border border-border bg-surface/30 p-5 transition-all hover:border-border/80 hover:bg-surface/50 sm:flex-row sm:items-center sm:justify-between"
							>
								<div className="flex-1 min-w-0">
									<div className="flex items-center gap-2">
										<h3 className="font-semibold text-foreground truncate">{stack.name}</h3>
										{favoriteIds.has(stack.id) && (
											<span className="text-amber-400 text-sm">⭐</span>
										)}
									</div>
									{stack.description && (
										<p className="mt-0.5 text-sm text-muted-foreground truncate">
											{stack.description}
										</p>
									)}
									<div className="mt-1.5 flex items-center gap-3 text-xs text-muted-foreground">
										<span className="font-mono">
											{(stack.services as string[]).length} services
										</span>
										<span>·</span>
										<span>
											{new Date(stack.createdAt).toLocaleDateString("en-US", {
												month: "short",
												day: "numeric",
												year: "numeric",
											})}
										</span>
									</div>
								</div>

								<div className="flex items-center gap-2 shrink-0">
									{/* Favorite toggle */}
									<button
										type="button"
										onClick={() => handleToggleFavorite(stack.id)}
										title={favoriteIds.has(stack.id) ? "Remove favorite" : "Add to favorites"}
										className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-all ${
											favoriteIds.has(stack.id)
												? "border-amber-500/30 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20"
												: "border-border text-muted-foreground hover:border-amber-500/30 hover:bg-amber-500/10 hover:text-amber-400"
										}`}
									>
										<Star
											className="h-3.5 w-3.5"
											fill={favoriteIds.has(stack.id) ? "currentColor" : "none"}
										/>
									</button>

									{/* Download */}
									<button
										type="button"
										onClick={() => handleDownload(stack)}
										disabled={downloadingId === stack.id}
										title="Download ZIP"
										className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-all hover:border-primary/30 hover:bg-primary/10 hover:text-primary disabled:opacity-50"
									>
										{downloadingId === stack.id ? (
											<Loader2 className="h-3.5 w-3.5 animate-spin" />
										) : (
											<Download className="h-3.5 w-3.5" />
										)}
									</button>

									{/* Delete */}
									<button
										type="button"
										onClick={() => handleDelete(stack.id)}
										disabled={deletingId === stack.id}
										title="Delete stack"
										className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-all hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50"
									>
										{deletingId === stack.id ? (
											<Loader2 className="h-3.5 w-3.5 animate-spin" />
										) : (
											<Trash2 className="h-3.5 w-3.5" />
										)}
									</button>
								</div>
							</div>
						))}
					</div>
				)}
			</main>
		</div>
	);
}
