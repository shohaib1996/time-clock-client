"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AnimatedThemeToggler } from "../ui/animated-theme-toggler";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { LogOut, LayoutDashboard } from "lucide-react";
import useUser from "@/hooks/use-user";

export default function Navbar() {
  const user = useUser();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
    : "US";

  return (
    <nav className="w-full border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-bold font-outfit select-none text-foreground"
        >
          SteveClock
        </Link>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          <AnimatedThemeToggler />

          {user ? (
            <Popover open={isOpen} onOpenChange={setIsOpen}>
              <PopoverTrigger asChild>
                <button className="w-9 h-9 flex items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold hover:opacity-90 transition">
                  {initials}
                </button>
              </PopoverTrigger>
              <PopoverContent
                align="end"
                className="w-60 p-4 shadow-lg border rounded-xl"
              >
                <div className="space-y-3">
                  {/* User Info */}
                  <div>
                    <h4 className="font-semibold">{user?.name || "User"}</h4>
                    <p className="text-sm text-muted-foreground">
                      {user?.email || "user@email.com"}
                    </p>
                  </div>

                  {/* Dashboard Button */}
                  <Button
                    variant="outline"
                    className="w-full flex items-center justify-center gap-2"
                    onClick={() =>
                      (window.location.href =
                        user?.role === "admin" ? "/admin" : "/employee")
                    }
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Button>

                  {/* Logout */}
                  <Button
                    variant="destructive"
                    className="w-full flex items-center justify-center gap-2"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          ) : (
            <Link href="/login">
              <Button
                className="rounded-xl px-5 font-medium hover:scale-[1.02] transition-transform"
                variant="default"
              >
                Login
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
