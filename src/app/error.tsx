"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { useTranslation } from "@/providers/locale-provider";

/**
 * Global root error boundary.
 * Catches unhandled errors at the application root level that aren't
 * caught by route-specific error.tsx files.
 */

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useTranslation();

  useEffect(() => {
    console.error("[global] Unhandled application error:", error);
  }, [error]);

  return (
    <div className="flex flex-col min-h-screen bg-surface-white">
      <main className="flex-1 flex items-center justify-center px-6">
        <div className="flex flex-col items-center text-center max-w-lg">
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-error-red-bg mb-8">
            <AlertTriangle className="h-10 w-10 text-error-red" />
          </div>

          <h1 className="text-headline-lg text-foreground mb-3">
            {t.errors.title}
          </h1>
          <p className="text-body-lg text-text-muted mb-10">
            {t.errors.genericBody}
          </p>

          <div className="flex items-center gap-4">
            <button
              onClick={reset}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:bg-primary/90 hover:scale-105 hover:shadow-ambient cursor-pointer"
            >
              <RefreshCw className="h-4 w-4" />
              {t.errors.tryAgain}
            </button>

            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-border-subtle bg-surface-white px-6 py-3 text-sm font-semibold text-foreground transition-all duration-300 hover:bg-surface-hover hover:shadow-ambient"
            >
              <Home className="h-4 w-4" />
              {t.errors.homepage}
            </Link>
          </div>

          {error.digest && (
            <p className="mt-8 text-body-sm text-text-muted/60">
              {t.errors.errorId}{error.digest}
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
