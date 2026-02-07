
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";

export function Navbar() {
  return (
    <nav className="fixed top-0 z-50 w-full border-b border-white/5 bg-background/60 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
            <span className="text-2xl">🦞</span>
            <span className="text-xl font-bold tracking-tight text-white">better-openclaw</span>
          </Link>
        </div>
        
        <div className="hidden md:flex items-center gap-6">
          <Link href="#features" className="text-sm font-medium text-muted-foreground transition-colors hover:text-white">
            Features
          </Link>
          <Link href="#presets" className="text-sm font-medium text-muted-foreground transition-colors hover:text-white">
            Presets
          </Link>
          <a href="https://github.com/diopisemou/better-openclaw" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-muted-foreground transition-colors hover:text-white">
            Docs
          </a>
        </div>

        <div className="flex items-center gap-4">
          <a href="https://github.com/diopisemou/better-openclaw" target="_blank" rel="noopener noreferrer" aria-label="GitHub Repository">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-white">
              <Github className="h-5 w-5" />
            </Button>
          </a>
          <Link href="/new">
            <Button variant="lobster" className="font-semibold">
              Start Building
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
