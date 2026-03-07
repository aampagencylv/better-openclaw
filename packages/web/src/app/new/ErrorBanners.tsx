"use client";

import { AlertTriangle } from "lucide-react";

interface ErrorBannersProps {
	generateError: string | null;
	resolverError: string | null;
}

export function ErrorBanners({ generateError, resolverError }: ErrorBannersProps) {
	return (
		<>
			{generateError ? (
				<div
					className="border-b border-red-500/20 bg-red-500/5 px-6 py-3 text-center text-sm text-red-400"
					role="alert"
					aria-live="polite"
				>
					{generateError}
				</div>
			) : null}
			{resolverError ? (
				<div
					className="flex items-center justify-center gap-2 border-b border-amber-500/20 bg-amber-500/5 px-6 py-3 text-center text-sm text-amber-400"
					role="alert"
					aria-live="polite"
				>
					<AlertTriangle className="h-4 w-4 shrink-0" aria-hidden="true" />
					{resolverError}
				</div>
			) : null}
		</>
	);
}
