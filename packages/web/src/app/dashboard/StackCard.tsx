import { Download, Loader2, Pencil, Star, Trash2 } from "lucide-react";
import Link from "next/link";
import type { SavedStackResponse } from "@/lib/api-client";

interface StackCardProps {
	stack: SavedStackResponse;
	isFavorite: boolean;
	isDownloading: boolean;
	isDeleting: boolean;
	onDownload: (stack: SavedStackResponse) => void;
	onDelete: (id: string) => void;
	onToggleFavorite: (id: string) => void;
}

export function StackCard({
	stack,
	isFavorite,
	isDownloading,
	isDeleting,
	onDownload,
	onDelete,
	onToggleFavorite,
}: StackCardProps) {
	return (
		<div className="group flex flex-col gap-3 rounded-xl border border-border bg-surface/30 p-5 transition-all hover:border-border/80 hover:bg-surface/50 sm:flex-row sm:items-center sm:justify-between">
			<div className="flex-1 min-w-0">
				<div className="flex items-center gap-2">
					<h3 className="font-semibold text-foreground truncate">{stack.name}</h3>
					{isFavorite ? <span className="text-amber-400 text-sm">⭐</span> : null}
				</div>
				{stack.description ? (
					<p className="mt-0.5 text-sm text-muted-foreground truncate">{stack.description}</p>
				) : null}
				<div className="mt-1.5 flex items-center gap-3 text-xs text-muted-foreground">
					<span className="font-mono">{(stack.services as string[]).length} services</span>
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
				<Link
					href={`/new?load=${stack.id}`}
					title="Edit in Builder"
					className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-all hover:border-accent/30 hover:bg-accent/10 hover:text-accent"
				>
					<Pencil className="h-3.5 w-3.5" />
				</Link>

				<button
					type="button"
					onClick={() => onToggleFavorite(stack.id)}
					title={isFavorite ? "Remove favorite" : "Add to favorites"}
					aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
					className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-all ${
						isFavorite
							? "border-amber-500/30 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20"
							: "border-border text-muted-foreground hover:border-amber-500/30 hover:bg-amber-500/10 hover:text-amber-400"
					}`}
				>
					<Star className="h-3.5 w-3.5" fill={isFavorite ? "currentColor" : "none"} />
				</button>

				<button
					type="button"
					onClick={() => onDownload(stack)}
					disabled={isDownloading}
					title="Download ZIP"
					aria-label="Download stack as ZIP"
					className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-all hover:border-primary/30 hover:bg-primary/10 hover:text-primary disabled:opacity-50"
				>
					{isDownloading ? (
						<Loader2 className="h-3.5 w-3.5 animate-spin" />
					) : (
						<Download className="h-3.5 w-3.5" />
					)}
				</button>

				<button
					type="button"
					onClick={() => onDelete(stack.id)}
					disabled={isDeleting}
					title="Delete stack"
					aria-label="Delete stack"
					className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-all hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50"
				>
					{isDeleting ? (
						<Loader2 className="h-3.5 w-3.5 animate-spin" />
					) : (
						<Trash2 className="h-3.5 w-3.5" />
					)}
				</button>
			</div>
		</div>
	);
}
