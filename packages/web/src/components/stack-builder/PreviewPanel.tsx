"use client";

import type { ResolverOutput } from "@better-openclaw/core";
import { cn } from "@/lib/utils";
import { Box, Cpu, HardDrive, AlertTriangle } from "lucide-react";
import { CommandOutput } from "./CommandOutput";

interface PreviewPanelProps {
  composeYaml: string;
  resolverOutput: ResolverOutput | null;
  projectName: string;
  selectedServiceIds: string[];
}

export function PreviewPanel({
  composeYaml,
  resolverOutput,
  projectName,
  selectedServiceIds,
}: PreviewPanelProps) {
  const serviceCount = resolverOutput?.services.length ?? 0;
  const estimatedMemoryMB = resolverOutput?.estimatedMemoryMB ?? 0;
  const warnings = resolverOutput?.warnings ?? [];
  const errors = resolverOutput?.errors ?? [];
  const addedDeps = resolverOutput?.addedDependencies ?? [];

  const memoryDisplay =
    estimatedMemoryMB >= 1024
      ? `${(estimatedMemoryMB / 1024).toFixed(1)} GB`
      : `${estimatedMemoryMB} MB`;

  // Build CLI command
  const cliCommand = selectedServiceIds.length > 0
    ? `npx better-openclaw init ${projectName || "my-stack"} --services ${selectedServiceIds.join(",")}`
    : `npx better-openclaw init ${projectName || "my-stack"}`;

  return (
    <div className="flex h-full flex-col gap-4">
      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-lg border border-border bg-surface/60 p-3 text-center">
          <div className="flex items-center justify-center gap-1.5 text-muted-foreground">
            <Box className="h-3.5 w-3.5" />
            <span className="text-[10px] uppercase tracking-wider">Services</span>
          </div>
          <p className="mt-1 text-2xl font-bold text-foreground">{serviceCount}</p>
        </div>
        <div className="rounded-lg border border-border bg-surface/60 p-3 text-center">
          <div className="flex items-center justify-center gap-1.5 text-muted-foreground">
            <Cpu className="h-3.5 w-3.5" />
            <span className="text-[10px] uppercase tracking-wider">Skills</span>
          </div>
          <p className="mt-1 text-2xl font-bold text-foreground">
            {resolverOutput?.services.reduce(
              (acc, s) => acc + (s.definition.skills?.length ?? 0),
              0
            ) ?? 0}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-surface/60 p-3 text-center">
          <div className="flex items-center justify-center gap-1.5 text-muted-foreground">
            <HardDrive className="h-3.5 w-3.5" />
            <span className="text-[10px] uppercase tracking-wider">RAM</span>
          </div>
          <p className={cn(
            "mt-1 text-2xl font-bold",
            estimatedMemoryMB > 8192 ? "text-red-400" : estimatedMemoryMB > 4096 ? "text-yellow-400" : "text-foreground"
          )}>
            {memoryDisplay}
          </p>
        </div>
      </div>

      {/* Auto-added dependencies */}
      {addedDeps.length > 0 && (
        <div className="rounded-lg border border-accent/20 bg-accent/5 p-3">
          <p className="mb-1 text-xs font-semibold text-accent">Auto-added dependencies</p>
          <ul className="space-y-0.5">
            {addedDeps.map((dep, i) => (
              <li key={`${dep.service}-${i}`} className="text-xs text-muted-foreground">
                <span className="font-medium text-foreground">{dep.service}</span>
                {" — "}
                {dep.reason}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Warnings */}
      {warnings.length > 0 && (
        <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-3">
          <p className="mb-1 flex items-center gap-1 text-xs font-semibold text-yellow-400">
            <AlertTriangle className="h-3 w-3" />
            Warnings
          </p>
          <ul className="space-y-0.5">
            {warnings.map((w, i) => (
              <li key={`warning-${i}`} className="text-xs text-muted-foreground">
                {w.message}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Errors */}
      {errors.length > 0 && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-3">
          <p className="mb-1 text-xs font-semibold text-red-400">Errors</p>
          <ul className="space-y-0.5">
            {errors.map((e, i) => (
              <li key={`error-${i}`} className="text-xs text-muted-foreground">
                {e.message}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Docker Compose Preview */}
      <div className="flex-1 overflow-hidden rounded-xl border border-border bg-[#0D1117]">
        <div className="flex items-center justify-between border-b border-border px-4 py-2">
          <span className="text-xs font-medium text-muted-foreground">
            docker-compose.yml
          </span>
          <span className="text-[10px] text-muted-foreground/50">preview</span>
        </div>
        <div className="max-h-[400px] overflow-auto p-4">
          <pre className="font-mono text-xs leading-relaxed text-foreground/80 whitespace-pre">
            {composeYaml || "# Select services to preview your stack..."}
          </pre>
        </div>
      </div>

      {/* CLI Command */}
      <CommandOutput command={cliCommand} />
    </div>
  );
}
