import { Check, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

interface MarketplaceSkillCardProps {
	id: string;
	name: string;
	description?: string;
	stars?: number;
	author?: string;
	isSelected: boolean;
	onToggle: (id: string, name: string, emoji: string, source: "curated" | "marketplace") => void;
}

export function MarketplaceSkillCard({
	id,
	name,
	description,
	stars,
	author,
	isSelected,
	onToggle,
}: MarketplaceSkillCardProps) {
	return (
		<button
			type="button"
			onClick={() => onToggle(id, name, "🌐", "marketplace")}
			className={cn(
				"group flex items-start gap-3 rounded-lg border p-3 text-left transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 focus-visible:ring-offset-background",
				isSelected
					? "border-blue-500/40 bg-blue-500/5 ring-1 ring-blue-500/20"
					: "border-border bg-surface/30 hover:border-muted-foreground/30 hover:bg-surface/60",
			)}
		>
			{/* Checkbox */}
			<div
				className={cn(
					"mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors",
					isSelected
						? "border-blue-500 bg-blue-500 text-foreground"
						: "border-muted-foreground/30 group-hover:border-muted-foreground/50",
				)}
			>
				{isSelected && <Check className="h-3.5 w-3.5" />}
			</div>

			{/* Content */}
			<div className="min-w-0 flex-1">
				<div className="flex items-center gap-2">
					<span className="truncate text-sm font-medium text-foreground">{name}</span>
					{stars != null && <span className="shrink-0 text-[10px] text-yellow-500">★ {stars}</span>}
				</div>
				{description && (
					<p className="mt-0.5 text-xs leading-relaxed text-muted-foreground line-clamp-2">
						{description}
					</p>
				)}
				{author && <p className="mt-1 text-[10px] text-muted-foreground/60">by {author}</p>}
			</div>

			{/* Marketplace badge */}
			<span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-blue-500/10 px-1.5 py-0.5 text-[9px] font-semibold text-blue-400">
				<Globe className="h-2.5 w-2.5" />
				Marketplace
			</span>
		</button>
	);
}
