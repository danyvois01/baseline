"use client";

import Link from "next/link";
import { TopNavBar, Footer } from "@/components/layout";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "@/providers/locale-provider";

/**
 * Global 404 Not Found page.
 * Displayed when a user navigates to a route that doesn't exist.
 * Client component so the copy follows the selected locale.
 */

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col min-h-screen bg-surface-white">
      <TopNavBar />

      <main className="flex-1 pt-28">
        <div className="mx-auto max-w-[1280px] px-6 py-8">
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="relative mb-8">
              <span className="text-[120px] md:text-[180px] font-heading font-extrabold text-surface-gray leading-none select-none">
                404
              </span>
              <span className="absolute inset-0 flex items-center justify-center text-[120px] md:text-[180px] font-heading font-extrabold text-foreground/5 leading-none select-none blur-sm">
                404
              </span>
            </div>

            <h1 className="text-headline-lg text-foreground mb-3">
              {t.notFound.title}
            </h1>
            <p className="text-body-lg text-text-muted max-w-md mb-10">
              {t.notFound.body}
            </p>

            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:bg-primary/90 hover:scale-105 hover:shadow-ambient"
            >
              <ArrowLeft className="h-4 w-4" />
              {t.notFound.backHome}
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
