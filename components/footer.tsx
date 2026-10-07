import Link from "next/link";
import { Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background/50">
      <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-white">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="font-semibold text-sm">Sociora</span>
            <span className="text-xs text-muted-foreground">— AI Social Content Studio</span>
          </div>

          <p className="text-xs text-muted-foreground text-center md:text-right">
            Designed for modern creators and marketers. Built for college project demonstration.
          </p>

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <Link href="/dashboard" className="hover:text-foreground transition-colors">
              Dashboard
            </Link>
            <Link href="/campaigns/new" className="hover:text-foreground transition-colors">
              New Campaign
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
