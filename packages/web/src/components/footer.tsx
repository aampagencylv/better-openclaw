
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-background py-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🦞</span>
            <p className="text-sm text-muted-foreground">
              Built with ❤️ by <a href="https://bidew.io" className="text-primary hover:underline">Bachir @ bidew.io</a>
            </p>
          </div>
          
          <div className="flex gap-8">
            <a href="https://github.com/diopisemou/better-openclaw" className="text-sm text-muted-foreground hover:text-white transition-colors">
              GitHub
            </a>
            <a href="https://github.com/openclaw" className="text-sm text-muted-foreground hover:text-white transition-colors">
              OpenClaw
            </a>
            <a href="/license" className="text-sm text-muted-foreground hover:text-white transition-colors">
              License
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
