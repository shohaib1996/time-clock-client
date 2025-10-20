"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AnimatedThemeToggler } from "../ui/animated-theme-toggler";

export default function Navbar() {
  return (
    <nav className="w-full border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold font-outfit select-none">
          <span className="bg-gradient-to-r from-violet-600 to-blue-500 bg-clip-text text-transparent">
            SteveClock
          </span>
        </Link>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          <div>
            <AnimatedThemeToggler />
          </div>

          {/* Login Button */}
          <Link href="/login">
            <Button
              className="rounded-xl px-5 font-medium hover:scale-[1.02] transition-transform"
              variant="default"
            >
              Login
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
