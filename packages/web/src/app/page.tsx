"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Boxes, Cpu, Download, Shield, Zap } from "lucide-react";

const features = [
  {
    icon: <Boxes className="h-6 w-6" />,
    title: "23+ Self-Hosted Services",
    description:
      "From n8n to Ollama, vector DBs to monitoring — every service battle-tested and ready.",
  },
  {
    icon: <Zap className="h-6 w-6" />,
    title: "Automatic Dependency Resolution",
    description:
      "Select services, and the resolver figures out what else you need. No more YAML guesswork.",
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: "Production-Ready Output",
    description:
      "Generated docker-compose.yml with health checks, secrets, volumes, and networking built in.",
  },
  {
    icon: <Cpu className="h-6 w-6" />,
    title: "GPU & Platform Aware",
    description:
      "Detects GPU requirements and platform constraints. Warns you before things break.",
  },
  {
    icon: <Download className="h-6 w-6" />,
    title: "One-Click Download",
    description:
      "Get your entire stack as a ready-to-deploy directory with .env files, scripts, and docs.",
  },
  {
    icon: <ArrowRight className="h-6 w-6" />,
    title: "Preset Stacks",
    description:
      "Start from curated presets — Minimal, Creator, Researcher, DevOps, or Full — and customize.",
  },
];

export default function HomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated gradient background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-accent/10 blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-secondary/10 blur-[100px]" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-5 md:px-12">
        <div className="flex items-center gap-2 text-lg font-bold tracking-tight">
          <span className="text-2xl">🦞</span>
          <span className="text-foreground">better-openclaw</span>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/diopisemou/better-openclaw"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            GitHub
          </a>
          <Link
            href="/new"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Build Stack
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="relative z-10 mx-auto max-w-5xl px-6 pt-20 pb-32 text-center md:pt-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-4 py-1.5 text-sm text-muted-foreground backdrop-blur-sm">
            <span className="text-lg">🦞</span>
            Open-source stack generator for OpenClaw
          </div>

          <h1 className="text-4xl font-extrabold leading-tight tracking-tight md:text-6xl lg:text-7xl">
            Build your{" "}
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              OpenClaw superstack
            </span>
            <br />
            in seconds
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
            Pick services. Resolve dependencies. Generate a production-ready
            docker-compose stack — no YAML wrestling required.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/new"
              className="group flex items-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-lg font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30"
            >
              Start Building
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href="https://github.com/diopisemou/better-openclaw"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-xl border border-border bg-surface/60 px-8 py-3.5 text-lg font-semibold text-foreground backdrop-blur-sm transition-colors hover:bg-surface"
            >
              View on GitHub
            </a>
          </div>
        </motion.div>

        {/* CLI preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
          className="mx-auto mt-20 max-w-2xl"
        >
          <div className="overflow-hidden rounded-xl border border-border bg-surface/80 shadow-2xl shadow-black/30 backdrop-blur-sm">
            <div className="flex items-center gap-2 border-b border-border px-4 py-3">
              <div className="h-3 w-3 rounded-full bg-[#FF5F56]" />
              <div className="h-3 w-3 rounded-full bg-[#FFBD2E]" />
              <div className="h-3 w-3 rounded-full bg-[#27C93F]" />
              <span className="ml-2 text-xs text-muted-foreground">
                Terminal
              </span>
            </div>
            <pre className="p-5 text-left font-mono text-sm leading-relaxed">
              <code>
                <span className="text-muted-foreground">$</span>{" "}
                <span className="text-accent">npx</span>{" "}
                <span className="text-foreground">better-openclaw</span>{" "}
                <span className="text-primary">init</span>{" "}
                <span className="text-muted-foreground">my-stack</span>
                {"\n"}
                <span className="text-muted-foreground">{"  "}✓</span>{" "}
                <span className="text-foreground">
                  Selected: n8n, ollama, qdrant, minio, postgresql
                </span>
                {"\n"}
                <span className="text-muted-foreground">{"  "}✓</span>{" "}
                <span className="text-foreground">
                  Auto-added: redis (required by n8n)
                </span>
                {"\n"}
                <span className="text-muted-foreground">{"  "}✓</span>{" "}
                <span className="text-foreground">
                  Generated docker-compose.yml + .env + scripts
                </span>
                {"\n"}
                <span className="text-muted-foreground">{"  "}✓</span>{" "}
                <span className="text-accent">
                  Stack ready! Run: cd my-stack &amp;&amp; docker compose up -d
                </span>
              </code>
            </pre>
          </div>
        </motion.div>

        {/* Feature grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5, ease: "easeOut" }}
          className="mt-32"
        >
          <h2 className="mb-12 text-2xl font-bold tracking-tight md:text-3xl">
            Everything you need to ship faster
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-xl border border-border bg-surface/50 p-6 text-left transition-colors hover:border-primary/30 hover:bg-surface/80"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                  {feature.icon}
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Footer CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.7 }}
          className="mt-32"
        >
          <div className="rounded-2xl border border-border bg-gradient-to-br from-surface/80 to-muted/30 p-10 text-center backdrop-blur-sm">
            <p className="text-4xl">🦞</p>
            <h3 className="mt-4 text-2xl font-bold">
              Ready to build your stack?
            </h3>
            <p className="mt-2 text-muted-foreground">
              No sign-up required. Pick services, download, deploy.
            </p>
            <Link
              href="/new"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Launch Stack Builder
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border px-6 py-8 text-center text-sm text-muted-foreground">
        <p>
          better-openclaw — Open source under MIT.{" "}
          <a
            href="https://github.com/diopisemou/better-openclaw"
            className="text-primary hover:underline"
          >
            View source
          </a>
        </p>
      </footer>
    </div>
  );
}
