"use client";

import { Fingerprint, Loader2, Monitor, Smartphone, Trash2, Usb } from "lucide-react";
import type { Passkey } from "./usePasskeys";

interface PasskeyCardProps {
	passkey: Passkey;
	isDeleting: boolean;
	onDelete: (id: string) => void;
}

function getDeviceIcon(passkey: Passkey) {
	const name = (passkey.name ?? "").toLowerCase();
	const type = (passkey.deviceType ?? "").toLowerCase();

	if (
		type === "platform" ||
		name.includes("face") ||
		name.includes("touch") ||
		name.includes("windows")
	) {
		return <Monitor className="h-4 w-4" />;
	}
	if (
		name.includes("phone") ||
		name.includes("mobile") ||
		name.includes("android") ||
		name.includes("iphone")
	) {
		return <Smartphone className="h-4 w-4" />;
	}
	if (type === "cross-platform" || name.includes("yubikey") || name.includes("security key")) {
		return <Usb className="h-4 w-4" />;
	}
	return <Fingerprint className="h-4 w-4" />;
}

function getTypeBadge(passkey: Passkey) {
	const type = (passkey.deviceType ?? "").toLowerCase();
	if (type === "platform") {
		return { label: "Platform", className: "bg-blue-500/10 text-blue-400 border-blue-500/20" };
	}
	if (type === "cross-platform") {
		return {
			label: "Security Key",
			className: "bg-purple-500/10 text-purple-400 border-purple-500/20",
		};
	}
	return { label: "Passkey", className: "bg-primary/10 text-primary border-primary/20" };
}

export function PasskeyCard({ passkey, isDeleting, onDelete }: PasskeyCardProps) {
	const badge = getTypeBadge(passkey);

	return (
		<div className="group flex items-center gap-4 rounded-xl border border-border bg-surface/30 p-4 transition-all hover:border-border/80 hover:bg-surface/50">
			{/* Icon */}
			<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-surface/50 text-muted-foreground">
				{getDeviceIcon(passkey)}
			</div>

			{/* Info */}
			<div className="flex-1 min-w-0">
				<div className="flex items-center gap-2">
					<h4 className="font-medium text-foreground truncate">
						{passkey.name ?? "Unnamed passkey"}
					</h4>
					<span
						className={`inline-flex items-center rounded-md border px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider ${badge.className}`}
					>
						{badge.label}
					</span>
				</div>
				<div className="mt-0.5 flex items-center gap-3 text-xs text-muted-foreground">
					<span>
						Added{" "}
						{new Date(passkey.createdAt).toLocaleDateString("en-US", {
							month: "short",
							day: "numeric",
							year: "numeric",
						})}
					</span>
					<span className="font-mono text-[10px] text-muted-foreground/60">
						{passkey.id.slice(0, 8)}…
					</span>
				</div>
			</div>

			{/* Delete */}
			<button
				type="button"
				title="Delete passkey"
				onClick={() => onDelete(passkey.id)}
				disabled={isDeleting}
				className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border text-muted-foreground opacity-0 transition-all group-hover:opacity-100 hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50 focus-visible:opacity-100 focus-visible:ring-1 focus-visible:ring-red-500/30"
				aria-label={`Delete passkey: ${passkey.name ?? "unnamed"}`}
			>
				{isDeleting ? (
					<Loader2 className="h-3.5 w-3.5 animate-spin" />
				) : (
					<Trash2 className="h-3.5 w-3.5" />
				)}
			</button>
		</div>
	);
}
