/**
 * Footer — Branded footer for the Baseline platform.
 * 3-column layout: Brand text (left) | Links (center) | Copyright (right).
 * Uses surface-container-low background and primary color hover on links.
 */

const FOOTER_LINKS = [
  { label: "Terms of Service", href: "/terms" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Contact Support", href: "/support" },
  { label: "About Us", href: "/about" },
] as const;

export function Footer() {
  return (
    <footer className="w-full border-t border-border-subtle bg-surface-container-low mt-auto">
      <div className="mx-auto flex max-w-[1280px] flex-col items-center justify-between gap-4 px-6 py-12 md:flex-row">
        {/* Brand */}
        <div className="text-headline-sm font-bold text-primary-olive opacity-80 hover:opacity-100 transition-opacity">
          Baseline
        </div>

        {/* Links */}
        <nav className="flex flex-wrap justify-center items-center gap-6">
          {FOOTER_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-label-md text-on-surface-variant underline hover:text-primary-olive transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Copyright */}
        <p className="text-body-sm text-on-surface-variant text-center md:text-right">
          © 2026 Baseline Tennis. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
