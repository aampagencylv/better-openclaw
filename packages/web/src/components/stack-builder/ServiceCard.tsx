"use client";

import { CheckSquare, Link2, Square } from "lucide-react";
import { cn } from "@/lib/utils";

interface ServiceCardProps {
	id: string;
	name: string;
	description: string;
	icon: string;
	maturity: string;
	minMemoryMB?: number;
	selected: boolean;
	addedBy?: string;
	onToggle: (id: string) => void;
}

const maturityConfig: Record<string, { label: string; dotColor: string; textClass: string }> = {
	stable: {
		label: "Stable",
		dotColor: "bg-emerald-500",
		textClass: "text-emerald-600 dark:text-emerald-400",
	},
	beta: {
		label: "Beta",
		dotColor: "bg-yellow-500",
		textClass: "text-yellow-600 dark:text-yellow-400",
	},
	experimental: {
		label: "Experimental",
		dotColor: "bg-red-500",
		textClass: "text-red-600 dark:text-red-400",
	},
};

/** Max memory for scaling the bar (8 GB) */
const MAX_MEMORY_MB = 8192;

export function ServiceCard({
	id,
	name,
	description,
	icon,
	maturity,
	minMemoryMB,
	selected,
	addedBy,
	onToggle,
}: ServiceCardProps) {
	const mat = maturityConfig[maturity] ?? maturityConfig.stable;
	const isDependency = addedBy && addedBy !== "user";

	const memPercent = minMemoryMB
		? Math.max(8, Math.min(100, (minMemoryMB / MAX_MEMORY_MB) * 100))
		: 0;

	return (
		<button
			type="button"
			onClick={() => onToggle(id)}
			className={cn(
				"group relative flex w-full flex-col gap-2.5 rounded-xl border p-4 text-left transition-all duration-200",
				selected
					? "border-primary/50 bg-primary/5 shadow-sm shadow-primary/10 ring-1 ring-primary/20"
					: "border-border bg-surface/50 hover:border-muted-foreground/30 hover:bg-surface/80 hover:shadow-sm",
			)}
		>
			{/* Auto-added badge */}
			{isDependency && (
				<div className="absolute -top-2.5 -right-2 flex items-center gap-1 rounded-full border border-border bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground shadow-sm">
					<Link2 className="h-2.5 w-2.5" />
					auto-added
				</div>
			)}

			<div className="flex items-start justify-between gap-3">
				<div className="flex items-center gap-3">
					{/* Checkbox icon */}
					<div className="shrink-0 transition-transform duration-150 group-hover:scale-110">
						{selected ? (
							<CheckSquare className="h-5 w-5 text-primary" />
						) : (
							<Square className="h-5 w-5 text-muted-foreground/40 transition-colors group-hover:text-muted-foreground/70" />
						)}
					</div>

					{/* Icon + Name */}
					<div className="flex items-center gap-2">
						<span className="text-xl leading-none">{icon}</span>
						<span className="font-semibold text-foreground">{name}</span>
					</div>
				</div>

				{/* Maturity badge: dot + text */}
				<span className="inline-flex shrink-0 items-center gap-1.5 text-[10px] font-medium">
					<span className={cn("inline-block h-1.5 w-1.5 rounded-full", mat.dotColor)} />
					<span className={mat.textClass}>{mat.label}</span>
				</span>
			</div>

			{/* Description */}
			<p className="pl-8 text-xs leading-relaxed text-muted-foreground line-clamp-2">
				{description}
			</p>

			{/* Memory indicator bar + label */}
			{minMemoryMB != null && (
				<div className="flex items-center gap-2 pl-8">
					<div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted">
						<div
							className={cn(
								"h-full rounded-full transition-all duration-300",
								memPercent > 70
									? "bg-red-500/70"
									: memPercent > 40
										? "bg-yellow-500/70"
										: "bg-emerald-500/70",
							)}
							style={{ width: `${memPercent}%` }}
						/>
					</div>
					<span className="text-[10px] text-muted-foreground/70">
						{minMemoryMB >= 1024 ? `${(minMemoryMB / 1024).toFixed(1)} GB` : `${minMemoryMB} MB`}
					</span>
				</div>
			)}
		</button>
	);
}
