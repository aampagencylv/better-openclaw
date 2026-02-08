"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import {
  resolve,
  composeMultiFile,
  getAllServices,
  SERVICE_CATEGORIES,
  type ServiceDefinition,
  type ResolverOutput,
} from "@better-openclaw/core";
import { ServiceGrid } from "@/components/stack-builder/ServiceGrid";
import { PreviewPanel } from "@/components/stack-builder/PreviewPanel";
import { DependencyGraph } from "@/components/stack-builder/DependencyGraph";
import { ArrowLeft, Download, RotateCcw, Loader2, CheckCircle, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import { generateStack } from "@/lib/api-client";
import JSZip from "jszip";

export default function NewStackPage() {
  const [selectedServices, setSelectedServices] = useState<Set<string>>(
    new Set()
  );
  const [projectName, setProjectName] = useState("my-stack");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [downloadComplete, setDownloadComplete] = useState(false);

  // Load all services from core registry
  const allServices: ServiceDefinition[] = useMemo(() => getAllServices(), []);

  // Resolve dependencies in real-time
  const resolverOutput: ResolverOutput | null = useMemo(() => {
    if (selectedServices.size === 0) return null;
    try {
      return resolve({
        services: Array.from(selectedServices),
        skillPacks: [],
        proxy: "none",
        gpu: false,
        platform: "linux/amd64",
        monitoring: false,
      });
    } catch {
      return null;
    }
  }, [selectedServices]);

  // Build a set of all resolved service IDs (including auto-added deps)
  const resolvedServiceIds = useMemo(() => {
    if (!resolverOutput) return new Set<string>();
    return new Set(resolverOutput.services.map((s) => s.definition.id));
  }, [resolverOutput]);

  // Generate docker-compose preview using the multi-file composer
  const composeYaml = useMemo(() => {
    if (!resolverOutput || resolverOutput.services.length === 0) return "";
    try {
      const result = composeMultiFile(resolverOutput, {
        projectName: projectName || "my-stack",
        proxy: "none",
        gpu: false,
        platform: "linux/amd64",
        deployment: "local",
        openclawVersion: "latest",
      });
      // Return the main file YAML as fallback for the composeYaml prop
      return result.files[result.mainFile] ?? "";
    } catch {
      return "# Error generating preview...";
    }
  }, [resolverOutput, projectName]);

  // Toggle a service selection
  const handleToggle = useCallback((id: string) => {
    setSelectedServices((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  // Reset all selections
  const handleReset = useCallback(() => {
    setSelectedServices(new Set());
    setGenerateError(null);
  }, []);

  // Download generated stack as a real ZIP file
  const handleDownload = useCallback(async () => {
    if (selectedServices.size === 0) return;
    setIsGenerating(true);
    setGenerateError(null);
    setDownloadComplete(false);
    try {
      const name = projectName || "my-stack";

      // 1. Call the generation API to get the files map
      const result = await generateStack({
        projectName: name,
        services: Array.from(selectedServices),
        skillPacks: [],
        proxy: "none",
        gpu: false,
        platform: "linux/amd64",
        deployment: "local",
        monitoring: false,
      });

      // 2. Build a real ZIP archive client-side using JSZip
      const zip = new JSZip();
      const folder = zip.folder(name);
      if (folder) {
        for (const [path, content] of Object.entries(result.files)) {
          folder.file(path, content);
        }
      }

      // 3. Generate ZIP blob and trigger browser download
      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${name}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      // 4. Show post-download instructions
      setDownloadComplete(true);
    } catch (err) {
      setGenerateError(
        err instanceof Error ? err.message : "Failed to generate stack"
      );
    } finally {
      setIsGenerating(false);
    }
  }, [selectedServices, projectName]);

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-4 py-3 md:px-6">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Home
            </Link>
            <div className="h-4 w-px bg-border" />
            <div className="flex items-center gap-2">
              <span className="text-lg">🦞</span>
              <h1 className="text-lg font-bold text-foreground">
                Stack Builder
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Project name input */}
            <div className="hidden items-center gap-2 sm:flex">
              <label
                htmlFor="project-name"
                className="text-xs text-muted-foreground"
              >
                Project:
              </label>
              <input
                id="project-name"
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="my-stack"
                className="w-36 rounded-lg border border-border bg-surface px-3 py-1.5 font-mono text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
              />
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset
            </button>

            <button
              type="button"
              onClick={handleDownload}
              disabled={selectedServices.size === 0 || isGenerating}
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-sm font-semibold transition-all",
                selectedServices.size > 0
                  ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm shadow-primary/20"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              )}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  Download Stack
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Error banner */}
      {generateError && (
        <div className="border-b border-red-500/20 bg-red-500/5 px-6 py-3 text-center text-sm text-red-400">
          {generateError}
        </div>
      )}

      {/* Post-download instructions */}
      {downloadComplete && (
        <div className="border-b border-accent/20 bg-accent/5 px-6 py-4">
          <div className="mx-auto max-w-3xl">
            <div className="flex items-start gap-3">
              <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
              <div className="flex-1">
                <p className="font-semibold text-accent">Stack downloaded successfully!</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Extract the ZIP and follow these steps:
                </p>
                <div className="mt-3 space-y-2">
                  {[
                    `cd ${projectName || "my-stack"}`,
                    "cp .env.example .env        # Edit with your API keys",
                    "docker compose up -d        # Start everything",
                    "docker compose logs -f openclaw-gateway   # Watch OpenClaw boot",
                  ].map((cmd) => (
                    <div
                      key={cmd}
                      className="flex items-center gap-2 rounded bg-surface/80 px-3 py-1.5 font-mono text-xs text-foreground"
                    >
                      <span className="text-muted-foreground">$</span>
                      <code className="flex-1">{cmd}</code>
                      <button
                        type="button"
                        onClick={() => navigator.clipboard.writeText(cmd.split("#")[0]?.trim() ?? cmd)}
                        className="text-muted-foreground hover:text-foreground"
                        title="Copy command"
                      >
                        <Copy className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setDownloadComplete(false)}
                  className="mt-3 text-xs text-muted-foreground hover:text-foreground"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main content - two panel layout */}
      <div className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col lg:flex-row">
        {/* Left panel - Service selector */}
        <div className="flex-1 overflow-y-auto border-r border-border p-4 md:p-6">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-foreground">
              Select Services
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Pick the services for your stack. Dependencies are resolved
              automatically.
            </p>
          </div>
          <ServiceGrid
            services={allServices}
            categories={SERVICE_CATEGORIES}
            selectedIds={resolvedServiceIds}
            resolvedServices={resolverOutput?.services ?? []}
            onToggle={handleToggle}
          />
        </div>

        {/* Right panel - Preview */}
        <div className="w-full shrink-0 overflow-y-auto bg-background/50 p-4 md:p-6 lg:w-[520px] xl:w-[580px]">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-foreground">
              Stack Preview
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Live preview of your generated configuration.
            </p>
          </div>
          <PreviewPanel
            composeYaml={composeYaml}
            resolverOutput={resolverOutput}
            projectName={projectName}
            selectedServiceIds={Array.from(selectedServices)}
          />

          {/* Dependency Graph */}
          {resolverOutput && resolverOutput.services.length > 1 && (
            <div className="mt-6">
              <h3 className="mb-3 text-sm font-semibold text-foreground">
                Dependency Graph
              </h3>
              <DependencyGraph resolverOutput={resolverOutput} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
