"use client";

/**
 * TopNavBar — Persistent top navigation bar for the Baseline platform.
 * Features: Brand logo (left), nav links centered (absolute), search + sign-in (right).
 * Active state is determined by current route via usePathname().
 * Now features a floating glassmorphic design that reacts to scroll.
 */

import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/providers/locale-provider";
import { SettingsPill } from "./settings-pill";

export function TopNavBar() {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const { t } = useTranslation();

  /** Navigation items configuration for Homepage */
  const homeNavItems = [
    { label: t.nav.home.ranking, href: "#ranking" },
    { label: t.nav.home.tournaments, href: "#pyramid" },
    { label: t.nav.home.season, href: "#timeline" },
    { label: t.nav.home.scoring, href: "#scoring" },
    { label: t.nav.home.glossary, href: "#glossary" },
  ];

  /** Navigation items configuration for Rankings App */
  const appNavItems = [
    { label: t.nav.app.official, href: "/official" },
    { label: t.nav.app.live, href: "/live" },
    { label: t.nav.app.race, href: "/race" },
  ];

  const isHome = pathname === "/";
  const currentNavItems = isHome ? homeNavItems : appNavItems;

  // Animation values based on scroll
  const navWidth = useTransform(scrollY, [0, 100], ["100%", "90%"]);
  const navY = useTransform(scrollY, [0, 100], [0, 16]);
  const navRadius = useTransform(scrollY, [0, 100], ["0px", "9999px"]);
  const shadowOpacity = useTransform(scrollY, [0, 100], [0, 0.08]);
  const navPadding = useTransform(scrollY, [0, 100], ["1.5rem", "0.75rem"]); // px-6 to px-3 ish

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const targetId = href.replace("#", "");
      const elem = document.getElementById(targetId);
      if (elem) {
        // Usa lo stesso comportamento del bottone Scopri (niente offset, block: start)
        // Le sezioni hanno già il padding (pt-20) per gestire l'header
        elem.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isHome) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <motion.header
      style={{
        width: navWidth,
        y: navY,
        borderRadius: navRadius,
      }}
      className="fixed left-0 right-0 mx-auto z-50 bg-surface-white/80 backdrop-blur-xl border border-border-subtle overflow-hidden"
    >
      <motion.div 
        style={{ boxShadow: `0px 12px 48px rgba(0,0,0,${shadowOpacity})` }}
        className="absolute inset-0 pointer-events-none" 
      />
      
      <motion.div 
        style={{ paddingLeft: navPadding, paddingRight: navPadding }}
        className="relative flex h-20 items-center justify-between"
      >
        {/* Left: Logo */}
        <Link href="/" onClick={handleLogoClick} className="flex items-center gap-2 shrink-0 z-10">
          {/* Light/dark logo variants swapped via CSS to avoid a theme flash */}
          <Image
            src="/logo_new_crop.png"
            alt="Baseline — ATP & WTA Rankings"
            width={200}
            height={48}
            style={{ width: "auto", height: "48px" }}
            className="object-contain dark:hidden"
            priority
          />
          <Image
            src="/logo_new_crop_dark.png"
            alt="Baseline — ATP & WTA Rankings"
            width={200}
            height={48}
            style={{ width: "auto", height: "48px" }}
            className="object-contain hidden dark:block"
            priority
          />
        </Link>

        {/* Center: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
          {currentNavItems.map((item) => {
            const isActive = !isHome && pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={(e) => handleScroll(e, item.href)}
                className={cn(
                  "relative rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300",
                  isActive
                    ? "text-deep-navy"
                    : "text-foreground/70 hover:text-foreground hover:bg-surface-gray/50"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-nav-pill"
                    className="absolute inset-0 rounded-full bg-baseline-lime"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-3 z-10 shrink-0">
          <SettingsPill />
          {isHome ? (
            <Link
              href="/official"
              className="rounded-full bg-primary px-4 md:px-6 py-2 md:py-2.5 text-xs md:text-sm font-semibold text-primary-foreground transition-all duration-300 hover:bg-primary/90 hover:scale-105 hover:shadow-ambient cursor-pointer whitespace-nowrap"
            >
              <span className="sm:hidden">{t.nav.goToRankingsShort}</span>
              <span className="hidden sm:inline">{t.nav.goToRankings}</span>
            </Link>
          ) : (
            <Link
              href="/"
              className="rounded-full bg-primary px-4 md:px-6 py-2 md:py-2.5 text-xs md:text-sm font-semibold text-primary-foreground transition-all duration-300 hover:bg-primary/90 hover:scale-105 hover:shadow-ambient cursor-pointer whitespace-nowrap"
            >
              {t.nav.backToHome}
            </Link>
          )}
        </div>
      </motion.div>
    </motion.header>
  );
}
