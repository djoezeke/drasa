import { Github, BookOpen, ExternalLink } from "lucide-react";
import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-3 px-4 md:px-8">
      <div className="container mx-auto flex items-center justify-between">
        {/* Brand */}
        <Link
          href="/docs"
          className="flex items-center gap-2 font-bold text-lg hover:opacity-80 transition-opacity"
        >
          <BookOpen className="size-5 text-primary" />
          <span>Drasa Docs</span>
        </Link>

        {/* Nav Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link
            href="/docs"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Documentation
          </Link>
          <Link
            href="/docs/v2/release-notes"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Release Notes
          </Link>
          <Link
            href="/dashboard"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Dashboard
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="GitHub"
          >
            <Github size={20} />
          </a>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <ExternalLink size={14} />
            Go to App
          </Link>
        </div>
      </div>
    </header>
  );
}
