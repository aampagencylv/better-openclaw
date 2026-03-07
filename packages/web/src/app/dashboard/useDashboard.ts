"use client";

import JSZip from "jszip";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
	deleteSavedStack,
	fetchFavorites,
	fetchSavedStacks,
	generateStack,
	type SavedStackResponse,
	toggleFavorite,
} from "@/lib/api-client";
import { signOut, useSession } from "@/lib/auth-client";

export function useDashboard() {
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

	const loadData = useCallback(async () => {
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
	}, []);

	useEffect(() => {
		if (session) {
			loadData();
		}
	}, [session, loadData]);

	const handleDownload = useCallback(async (stack: SavedStackResponse) => {
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
	}, []);

	const handleDelete = useCallback(async (id: string) => {
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
	}, []);

	const handleToggleFavorite = useCallback(
		async (stackId: string) => {
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
		},
		[favoriteIds],
	);

	const handleSignOut = useCallback(async () => {
		await signOut();
		router.push("/");
	}, [router]);

	const displayedStacks = useMemo(
		() => (activeTab === "favorites" ? stacks.filter((s) => favoriteIds.has(s.id)) : stacks),
		[activeTab, stacks, favoriteIds],
	);

	return {
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
	};
}
