import { IconBell, IconLayoutSidebar, IconMenu2 } from "@tabler/icons-react";
import SignOut from "./Signout";

interface HeaderProps {
	onOpenAgents: () => void;
	onOpenLiveFeed: () => void;
}

export default function Header({ onOpenAgents, onOpenLiveFeed }: HeaderProps) {
	return (
		<header
			className="flex items-center justify-between px-6 border-b border-border bg-card"
			style={{ gridArea: "header" }}
		>
			<div className="flex items-center gap-3">
				{/* Mobile drawer toggles */}
				<button
					className="md:hidden p-2 hover:bg-accent rounded-lg"
					onClick={onOpenAgents}
					aria-label="Open agents sidebar"
				>
					<IconMenu2 size={20} />
				</button>
				<span className="text-2xl">🎯</span>
				<div>
					<h1 className="text-lg font-semibold text-foreground leading-tight">Mission Control</h1>
					<p className="text-xs text-muted-foreground">Better OpenClaw • Agent Dashboard</p>
				</div>
			</div>

			<div className="flex items-center gap-4">
				<button
					className="md:hidden p-2 hover:bg-accent rounded-lg"
					onClick={onOpenLiveFeed}
					aria-label="Open live feed"
				>
					<IconLayoutSidebar size={20} />
				</button>
				<button className="relative p-2 hover:bg-accent rounded-lg" aria-label="Notifications">
					<IconBell size={20} />
				</button>
				<SignOut />
			</div>
		</header>
	);
}
