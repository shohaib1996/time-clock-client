"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t border-border bg-background/80 backdrop-blur-sm mt-10">
      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
        {/* Left: Logo + Text */}
        <div className="flex items-center gap-2">
          <span className="text-base font-semibold bg-gradient-to-r from-violet-600 to-blue-500 bg-clip-text text-transparent">
            SteveClock
          </span>
          <span>© {new Date().getFullYear()} All rights reserved.</span>
        </div>

        {/* Right: Links */}
        <div className="flex items-center gap-4">
          <Link href="/" className="hover:text-foreground transition-colors">
            Privacy
          </Link>
          <Link href="/" className="hover:text-foreground transition-colors">
            Terms
          </Link>
          <Link href="/" className="hover:text-foreground transition-colors">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}
