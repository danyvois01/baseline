"use client";

/**
 * TopNavBar — Persistent top navigation bar for the Baseline platform.
 * Features: Brand logo (left), nav links centered (absolute).
 * Active state is determined by current route via usePathname().
 */

import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

/** Navigation items configuration */
const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Official Ranking", href: "/official" },
  { label: "Live Ranking", href: "/live" },
  { label: "Race to Turin", href: "/race" },
] as const;

export function TopNavBar() {
  const pathname = usePathname();

  return (
    <header className="w-full bg-white border-b border-border-subtle">
      <div className="relative mx-auto flex h-20 max-w-[1280px] items-center px-6">
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
      </div>
    </header>
  );
}
