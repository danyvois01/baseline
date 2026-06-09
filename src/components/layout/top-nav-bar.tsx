"use client";

/**
 * TopNavBar — Persistent top navigation bar for the Baseline platform.
 * Features: Brand logo (left), nav links centered (absolute), search + sign-in (right).
 * Active state is determined by current route via usePathname().
 */

import { useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

/** Navigation items configuration */
const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Official Ranking", href: "/official" },
  { label: "Live Ranking", href: "/live" },
  { label: "Race to Turin", href: "/race" },
] as const;

export function TopNavBar() {
  const [searchValue, setSearchValue] = useState("");
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-border-subtle">
      <div className="relative mx-auto flex h-20 max-w-[1280px] items-center justify-between px-6">
        {/* Left: Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Image
            src="/logo_new_crop.png"
            alt="Baseline — ATP & WTA Rankings"
            width={200}
            height={48}
            style={{ width: "auto", height: "48px" }}
            className="object-contain"
            priority
          />
        </Link>

        {/* Center: Navigation Links (absolute center) */}
        <nav className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-baseline-lime text-deep-navy"
                    : "text-deep-navy hover:bg-surface-gray"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right: Search + Sign In */}
        <div className="flex items-center gap-3">
          {/* Search Input */}
          <div className="relative hidden sm:block">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted pointer-events-none" />
            <input
              type="text"
              placeholder="Search players..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="h-10 w-[220px] rounded-full border border-border-subtle bg-white pl-10 pr-4 text-sm text-deep-navy placeholder:text-text-muted outline-none transition-all duration-200 focus:border-baseline-lime focus:ring-2 focus:ring-baseline-lime/30"
            />
          </div>

          {/* Sign In Button */}
          <button className="rounded-full border border-deep-navy bg-transparent px-5 py-2 text-sm font-medium text-deep-navy transition-all duration-200 hover:bg-deep-navy hover:text-white cursor-pointer">
            Sign In
          </button>
        </div>
      </div>
    </header>
  );
}
