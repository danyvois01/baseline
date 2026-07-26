"use client";

import { useEffect } from "react";
import { TopNavBar, Footer } from "@/components/layout";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { useTranslation } from "@/providers/locale-provider";

/**
 * Error boundary for the /race route.
 * Catches runtime errors during rendering and displays a user-friendly
 * recovery UI with a retry button.
 */

export default function RaceError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useTranslation();

  useEffect(() => {
    console.error("[/race] Unhandled error:", error);
  }, [error]);

  return (
    <div className="flex flex-col min-h-screen bg-surface-white">
      <TopNavBar />

      <main className="flex-1 pt-28">
        <div className="mx-auto max-w-[1280px] px-6 py-8">
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-error-red-bg mb-6">
              <AlertTriangle className="h-8 w-8 text-error-red" />
            </div>

            <h1 className="text-headline-lg text-foreground mb-3">
              {t.errors.title}
            </h1>
            <p className="text-body-lg text-text-muted max-w-md mb-8">
              {t.errors.raceBody}
            </p>

            <button
              onClick={reset}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:bg-primary/90 hover:scale-105 hover:shadow-ambient cursor-pointer"
            >
              <RefreshCw className="h-4 w-4" />
              {t.errors.tryAgain}
            </button>

            {error.digest && (
              <p className="mt-6 text-body-sm text-text-muted/60">
                {t.errors.errorId}{error.digest}
              </p>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
