import Link from "next/link";

interface NavLink {
	href: string;
	label: string;
}

interface DesktopNavProps {
	links: NavLink[];
}

export function DesktopNav({ links }: DesktopNavProps) {
	return (
		<div className="hidden absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 md:flex items-center gap-6">
			{links.map((link) => (
				<Link
					key={link.href}
					href={link.href}
					className="font-mono text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground"
				>
					{link.label}
				</Link>
			))}
		</div>
	);
}
