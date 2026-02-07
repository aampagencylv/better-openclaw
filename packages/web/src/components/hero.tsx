
"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Terminal } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-32">
      {/* Background gradients */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background/0 to-background/0 opacity-40" />
      
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-8">
          
          {/* Left: Content */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col justify-center"
          >
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              v1.0 is now available
            </div>
            
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl mb-6">
              Roll your own <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-500">
                Agent Superstack
              </span>
            </h1>
            
            <p className="text-lg text-muted-foreground mb-8 max-w-lg leading-relaxed">
              Define your infrastructure as code, resolve dependencies instantly, and deploy production-ready OpenClaw agents in seconds.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link href="/new">
                <Button variant="lobster" size="lg" className="h-12 px-8 text-base shadow-xl shadow-primary/20">
                  Start Building
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <a href="https://github.com/diopisemou/better-openclaw" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="lg" className="h-12 px-8 text-base border-white/10 bg-white/5 hover:bg-white/10 text-white">
                  Documentation
                </Button>
              </a>
            </div>
            
            <div className="mt-10 flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-8 w-8 rounded-full bg-slate-800 border-2 border-background flex items-center justify-center text-xs font-medium text-white">
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <p>Trusted by 500+ developers</p>
            </div>
          </motion.div>
          
          {/* Right: Terminal / Command Center */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative lg:mt-0"
          >
            <div className="relative rounded-xl border border-white/10 bg-[#0F1117] shadow-2xl shadow-black/50 overflow-hidden">
              <div className="flex items-center justify-between border-b border-white/5 bg-[#151720] px-4 py-3">
                <div className="flex gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500/80" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                  <div className="h-3 w-3 rounded-full bg-green-500/80" />
                </div>
                <div className="text-xs font-medium text-muted-foreground font-mono">
                  openclaw-cli — bash
                </div>
                <div className="w-12" /> 
              </div>
              
              <div className="p-6 font-mono text-sm leading-relaxed overflow-hidden">
                <div className="flex gap-2">
                  <span className="text-green-500">➜</span>
                  <span className="text-blue-400">~</span>
                  <span className="text-white">npx better-openclaw init my-stack</span>
                </div>
                
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-white">
                    <span className="text-primary">?</span>
                    <span className="font-bold">Select services:</span>
                  </div>
                  
                  <div className="pl-4 text-muted-foreground space-y-1">
                    <div className="flex items-center gap-2 text-white">
                      <span className="text-green-500">●</span> n8n
                    </div>
                    <div className="flex items-center gap-2 text-white">
                      <span className="text-green-500">●</span> ollama
                    </div>
                    <div className="flex items-center gap-2 text-white">
                      <span className="text-green-500">●</span> qdrant
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">○</span> flowise
                    </div>
                  </div>
                  
                  <div className="mt-4 text-emerald-400 font-bold">
                    [SUCCESS] Stack generated successfully!
                  </div>
                  <div className="mt-2 text-muted-foreground">
                    Created <span className="text-white">docker-compose.yml</span><br/>
                    Created <span className="text-white">.env</span><br/>
                    Created <span className="text-white">README.md</span>
                  </div>
                  
                  <div className="mt-4 flex gap-2 animate-pulse">
                    <span className="text-green-500">➜</span>
                    <span className="text-blue-400">~</span>
                    <span className="text-white">docker compose up -d<span className="w-2 h-4 bg-white/50 inline-block ml-1 align-middle" /></span>
                  </div>
                </div>
              </div>
              
              {/* Blur effect at bottom */}
              <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0F1117] to-transparent pointer-events-none" />
            </div>
            
            {/* Floating badges */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute -right-4 top-10 rounded-lg border border-white/10 bg-[#1A1D26]/90 p-3 shadow-xl backdrop-blur-md"
            >
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded bg-blue-500/20 text-blue-500 flex items-center justify-center font-bold">
                  <Terminal className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Services</div>
                  <div className="text-sm font-bold text-white">23+ Ready</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
