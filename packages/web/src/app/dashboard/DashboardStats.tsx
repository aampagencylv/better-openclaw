import { LayoutGrid, Package, Star } from "lucide-react";

interface DashboardStatsProps {
	totalStacks: number;
	favoritedCount: number;
	totalServices: number;
}

const STAT_ICONS = {
	"Total Stacks": <Package className="h-4 w-4" />,
	Favorited: <Star className="h-4 w-4" />,
	"Services Used": <LayoutGrid className="h-4 w-4" />,
} as const;

export function DashboardStats({
	totalStacks,
	favoritedCount,
	totalServices,
}: DashboardStatsProps) {
	const stats = [
		{ label: "Total Stacks" as const, value: totalStacks },
		{ label: "Favorited" as const, value: favoritedCount },
		{ label: "Services Used" as const, value: totalServices },
	];

	return (
		<div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
			{stats.map((stat) => (
				<div key={stat.label} className="rounded-xl border border-border bg-surface/50 p-4">
					<div className="flex items-center gap-2 text-muted-foreground">
						{STAT_ICONS[stat.label]}
						<span className="text-xs uppercase tracking-wider">{stat.label}</span>
					</div>
					<p className="mt-2 text-2xl font-bold text-foreground">{stat.value}</p>
				</div>
			))}
		</div>
	);
}
