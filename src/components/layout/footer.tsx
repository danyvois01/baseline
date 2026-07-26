"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "@/providers/locale-provider";

/**
 * Footer — Branded footer for the Baseline platform.
 * 3-column layout: Logo image (left) | Links (center) | Copyright (right).
 */

export function Footer() {
  const { t } = useTranslation();

  const footerLinks = [
    { label: t.footer.terms, href: "/terms" },
    { label: t.footer.privacy, href: "/privacy" },
    { label: t.footer.support, href: "/support" },
    { label: t.footer.about, href: "/about" },
  ];

  return (
    <footer className="w-full border-t border-border-subtle/40 bg-surface-white mt-auto">
      <div className="mx-auto flex max-w-[1280px] flex-col items-center justify-between gap-4 px-6 py-12 md:flex-row">
        {/* Brand Logo */}
        <Link href="/" className="shrink-0">
          {/* Light/dark logo variants swapped via CSS to avoid a theme flash */}
          <Image
            src="/logo_new_crop.png"
            alt="Baseline Tennis"
            width={160}
            height={40}
            style={{ width: "auto", height: "40px" }}
            className="object-contain opacity-80 hover:opacity-100 transition-opacity dark:hidden"
          />
          <Image
            src="/logo_new_crop_dark.png"
            alt="Baseline Tennis"
            width={160}
            height={40}
            style={{ width: "auto", height: "40px" }}
            className="object-contain opacity-80 hover:opacity-100 transition-opacity hidden dark:block"
          />
        </Link>

        {/* Links */}
        <nav className="flex flex-wrap justify-center items-center gap-6">
          {footerLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-label-md text-text-muted font-medium no-underline hover:text-foreground transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Copyright */}
        <p className="text-body-sm text-text-muted text-center md:text-right">
          {t.footer.copyright}
        </p>
      </div>
    </footer>
  );
}
