import { Check, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface CuratedSkillCardProps {
	id: string;
	name: string;
	emoji: string;
	services: string[];
	isSelected: boolean;
	onToggle: (id: string, name: string, emoji: string, source: "curated" | "marketplace") => void;
}

export function CuratedSkillCard({
	id,
	name,
	emoji,
	services,
	isSelected,
	onToggle,
}: CuratedSkillCardProps) {
	return (
		<button
			type="button"
			onClick={() => onToggle(id, name, emoji, "curated")}
			className={cn(
				"group flex items-center gap-3 rounded-lg border p-3 text-left transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 focus-visible:ring-offset-background",
				isSelected
					? "border-emerald-500/40 bg-emerald-500/5 ring-1 ring-emerald-500/20"
					: "border-border bg-surface/30 hover:border-muted-foreground/30 hover:bg-surface/60",
			)}
		>
			{/* Checkbox */}
			<div
				className={cn(
					"flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors",
					isSelected
						? "border-emerald-500 bg-emerald-500 text-foreground"
						: "border-muted-foreground/30 group-hover:border-muted-foreground/50",
				)}
			>
				{isSelected && <Check className="h-3.5 w-3.5" />}
			</div>

			{/* Emoji + Name */}
			<div className="min-w-0 flex-1">
				<div className="flex items-center gap-1.5">
					<span className="text-base leading-none">{emoji}</span>
					<span className="truncate text-sm font-medium text-foreground">{name}</span>
				</div>
				{services.length > 0 && (
					<p className="mt-0.5 truncate text-[10px] text-muted-foreground">
						Requires: {services.join(", ")}
					</p>
				)}
			</div>

			{/* Curated badge */}
			<span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-semibold text-emerald-500">
				<ShieldCheck className="h-2.5 w-2.5" />
				Curated
			</span>
		</button>
	);
}
