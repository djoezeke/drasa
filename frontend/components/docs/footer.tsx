import { Github, Twitter, BookOpen, Mail } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t bg-muted/20 py-12 px-4 md:px-8">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand Section */}
        <div className="md:col-span-2 flex flex-col gap-3">
          <Link
            href="/docs"
            className="flex items-center gap-2 font-bold text-lg w-fit"
          >
            <BookOpen className="size-5 text-primary" />
            <span>Drasa Docs</span>
          </Link>
          <p className="text-sm text-muted-foreground max-w-xs">
            Official documentation for the Drasa Learning Management System.
            Guides, API references, and release notes.
          </p>
          <div className="flex gap-3 mt-1">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="GitHub"
            >
              <Github size={18} />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Twitter"
            >
              <Twitter size={18} />
            </a>
            <a
              href="mailto:support@drasa.io"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Email"
            >
              <Mail size={18} />
            </a>
          </div>
        </div>

        {/* Documentation Links */}
        <div className="flex flex-col gap-2">
          <span className="font-semibold text-sm mb-1">Documentation</span>
          <Link
            href="/docs"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Getting Started
          </Link>
          <Link
            href="/docs/v2/release-notes"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Release Notes
          </Link>
          <Link
            href="/docs/v2/versioning"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Versioning
          </Link>
          <Link
            href="/docs/v1"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            v1 (Legacy)
          </Link>
        </div>

        {/* Company Links */}
        <div className="flex flex-col gap-2">
          <span className="font-semibold text-sm mb-1">Company</span>
          <Link
            href="/dashboard"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Dashboard
          </Link>
          <a
            href="/privacy"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Privacy Policy
          </a>
          <a
            href="/terms"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Terms of Service
          </a>
        </div>
      </div>

      <div className="container mx-auto mt-10 pt-6 border-t flex flex-col md:flex-row items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Drasa LMS. All rights reserved.
        </p>
        <p className="text-xs text-muted-foreground">
          Built with{" "}
          <a
            href="https://fumadocs.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-foreground transition-colors"
          >
            Fumadocs
          </a>
        </p>
      </div>
    </footer>
  );
}
