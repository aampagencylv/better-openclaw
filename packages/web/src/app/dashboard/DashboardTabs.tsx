interface DashboardTabsProps {
	activeTab: "all" | "favorites";
	onTabChange: (tab: "all" | "favorites") => void;
}

const TABS = [
	{ id: "all" as const, label: "All Stacks" },
	{ id: "favorites" as const, label: "⭐ Favorites" },
];

export function DashboardTabs({ activeTab, onTabChange }: DashboardTabsProps) {
	return (
		<div
			className="mb-4 flex gap-1 rounded-lg border border-border bg-surface/30 p-1 w-fit"
			role="tablist"
		>
			{TABS.map((tab) => (
				<button
					id={`dashboard-tab-${tab.id}`}
					title={`dashboard-tab-${tab.id}`}
					key={tab.id}
					type="button"
					role="tab"
					onClick={() => onTabChange(tab.id)}
					className={`rounded-md px-4 py-1.5 text-sm font-medium capitalize transition-all ${
						activeTab === tab.id
							? "bg-background text-foreground shadow-sm"
							: "text-muted-foreground hover:text-foreground"
					}`}
				>
					{tab.label}
				</button>
			))}
		</div>
	);
}
