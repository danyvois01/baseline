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
    { label: t.footer.privacy, href: "/privacy" },
    { label: t.footer.about, href: "/about" },
  ];

  return (
    <footer className="w-full border-t border-border-subtle/40 bg-surface-white mt-auto">
      <div className="mx-auto flex max-w-[1280px] flex-col items-center gap-4 px-6 py-12 md:grid md:grid-cols-3 md:items-center">
        {/* Brand Logo */}
        <Link href="/" className="shrink-0 md:justify-self-start">
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
        <nav className="flex flex-wrap justify-center items-center gap-2 md:justify-self-center">
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-label-md text-text-muted font-medium no-underline px-3 py-1.5 rounded-full hover:text-foreground hover:bg-surface-gray/50 transition-colors duration-200"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Copyright */}
        <p className="text-body-sm text-text-muted text-center md:text-right md:justify-self-end">
          {t.footer.copyright}
        </p>
      </div>
    </footer>
  );
}
