"use client";

import { Loader2, Plus } from "lucide-react";
import Link from "next/link";
import { DashboardHeader } from "./DashboardHeader";
import { DashboardStats } from "./DashboardStats";
import { DashboardTabs } from "./DashboardTabs";
import { PasskeyManager } from "./PasskeyManager";
import { StackCard } from "./StackCard";
import { useDashboard } from "./useDashboard";

export default function DashboardPage() {
	const {
		session,
		isPending,
		stacks,
		favoriteIds,
		isLoading,
		downloadingId,
		deletingId,
		activeTab,
		setActiveTab,
		displayedStacks,
		handleDownload,
		handleDelete,
		handleToggleFavorite,
		handleSignOut,
	} = useDashboard();

	if (isPending) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-background">
				<Loader2 className="h-8 w-8 animate-spin text-primary" />
			</div>
		);
	}

	if (!session) return null;

	const totalServices = stacks.reduce((acc, s) => acc + (s.services as string[]).length, 0);

	return (
		<div className="min-h-screen bg-background text-foreground">
			<DashboardHeader
				userName={session.user.name}
				userEmail={session.user.email}
				onSignOut={handleSignOut}
			/>

			<main className="mx-auto max-w-5xl px-4 py-8 md:px-6">
				{/* Welcome */}
				<div className="mb-8">
					<h1 className="text-2xl font-bold text-foreground">
						Welcome back, {session.user.name?.split(" ")[0] ?? "builder"}
					</h1>
					<p className="mt-1 text-sm text-muted-foreground">Manage your saved OpenClaw stacks</p>
				</div>

				<DashboardStats
					totalStacks={stacks.length}
					favoritedCount={favoriteIds.size}
					totalServices={totalServices}
				/>

				<PasskeyManager />

				<DashboardTabs activeTab={activeTab} onTabChange={setActiveTab} />

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
						{activeTab === "all" ? (
							<Link
								href="/new"
								className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
							>
								<Plus className="h-4 w-4" />
								Build your first stack
							</Link>
						) : null}
					</div>
				) : (
					<div className="space-y-3">
						{displayedStacks.map((stack) => (
							<StackCard
								key={stack.id}
								stack={stack}
								isFavorite={favoriteIds.has(stack.id)}
								isDownloading={downloadingId === stack.id}
								isDeleting={deletingId === stack.id}
								onDownload={handleDownload}
								onDelete={handleDelete}
								onToggleFavorite={handleToggleFavorite}
							/>
						))}
					</div>
				)}
			</main>
		</div>
	);
}
