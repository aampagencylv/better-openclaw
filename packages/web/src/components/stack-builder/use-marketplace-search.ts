import { useCallback, useRef, useState } from "react";

export interface MarketplaceSkill {
	id: string;
	name: string;
	description: string;
	stars?: number;
	author?: string;
}

export function useMarketplaceSearch() {
	const [mpQuery, setMpQuery] = useState("");
	const [mpResults, setMpResults] = useState<MarketplaceSkill[]>([]);
	const [mpLoading, setMpLoading] = useState(false);
	const [mpError, setMpError] = useState<string | null>(null);
	const [mpSearchMode, setMpSearchMode] = useState<"keyword" | "ai">("keyword");
	const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const searchMarketplace = useCallback(async (q: string, mode: "keyword" | "ai") => {
		if (!q.trim()) {
			setMpResults([]);
			return;
		}
		setMpLoading(true);
		setMpError(null);
		try {
			const res = await fetch(
				`/api/skills-search?q=${encodeURIComponent(q)}&mode=${mode}&limit=30`,
			);
			const data = await res.json();
			if (data.success === false) {
				setMpError(data.error?.message ?? "Search failed");
				setMpResults([]);
			} else {
				setMpResults(data.data?.skills ?? []);
			}
		} catch {
			setMpError("Failed to connect to SkillsMP");
			setMpResults([]);
		} finally {
			setMpLoading(false);
		}
	}, []);

	const handleMpQueryChange = useCallback(
		(value: string) => {
			setMpQuery(value);
			if (debounceRef.current) clearTimeout(debounceRef.current);
			debounceRef.current = setTimeout(() => searchMarketplace(value, mpSearchMode), 400);
		},
		[searchMarketplace, mpSearchMode],
	);

	const handleMpSearchModeChange = useCallback(
		(mode: "keyword" | "ai") => {
			setMpSearchMode(mode);
			if (mpQuery) {
				if (debounceRef.current) clearTimeout(debounceRef.current);
				searchMarketplace(mpQuery, mode);
			}
		},
		[mpQuery, searchMarketplace],
	);

	const clearMarketplaceSearch = useCallback(() => {
		setMpQuery("");
		setMpResults([]);
	}, []);

	return {
		mpQuery,
		mpResults,
		mpLoading,
		mpError,
		mpSearchMode,
		handleMpQueryChange,
		handleMpSearchModeChange,
		clearMarketplaceSearch,
	};
}
