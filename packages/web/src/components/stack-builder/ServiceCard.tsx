"use client";

import { cn } from "@/lib/utils";
import { Check, AlertTriangle, Beaker, FlaskConical } from "lucide-react";

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

const maturityConfig: Record<
  string,
  { label: string; className: string; icon: React.ReactNode }
> = {
  stable: {
    label: "Stable",
    className: "bg-accent/10 text-accent border-accent/20",
    icon: <Check className="h-3 w-3" />,
  },
  beta: {
    label: "Beta",
    className: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    icon: <Beaker className="h-3 w-3" />,
  },
  experimental: {
    label: "Experimental",
    className: "bg-red-500/10 text-red-400 border-red-500/20",
    icon: <FlaskConical className="h-3 w-3" />,
  },
};

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

  return (
    <button
      type="button"
      onClick={() => onToggle(id)}
      className={cn(
        "group relative flex w-full flex-col gap-3 rounded-xl border p-4 text-left transition-all",
        selected
          ? "border-primary/50 bg-primary/5 shadow-sm shadow-primary/10"
          : "border-border bg-surface/50 hover:border-muted-foreground/30 hover:bg-surface/80"
      )}
    >
      {/* Dependency indicator */}
      {isDependency && (
        <div className="absolute -top-2 -right-2 flex items-center gap-1 rounded-full border border-border bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
          <AlertTriangle className="h-2.5 w-2.5" />
          auto-added
        </div>
      )}

      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Checkbox */}
          <div
            className={cn(
              "flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors",
              selected
                ? "border-primary bg-primary text-primary-foreground"
                : "border-muted-foreground/30 bg-transparent"
            )}
          >
            {selected && <Check className="h-3.5 w-3.5" />}
          </div>

          {/* Icon + Name */}
          <div className="flex items-center gap-2">
            <span className="text-xl">{icon}</span>
            <span className="font-semibold text-foreground">{name}</span>
          </div>
        </div>

        {/* Maturity badge */}
        <span
          className={cn(
            "inline-flex shrink-0 items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium",
            mat.className
          )}
        >
          {mat.icon}
          {mat.label}
        </span>
      </div>

      {/* Description */}
      <p className="pl-8 text-xs leading-relaxed text-muted-foreground line-clamp-2">
        {description}
      </p>

      {/* RAM estimate */}
      {minMemoryMB != null && (
        <div className="pl-8 text-[10px] text-muted-foreground/70">
          ~{minMemoryMB >= 1024 ? `${(minMemoryMB / 1024).toFixed(1)}GB` : `${minMemoryMB}MB`} RAM
        </div>
      )}
    </button>
  );
}
