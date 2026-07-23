"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

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
            Something went wrong
          </h1>
          <p className="text-body-lg text-text-muted mb-10">
            An unexpected error occurred. Our team has been notified. You can
            try again or head back to the homepage.
          </p>

          <div className="flex items-center gap-4">
            <button
              onClick={reset}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:bg-primary/90 hover:scale-105 hover:shadow-ambient cursor-pointer"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </button>

            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-border-subtle bg-surface-white px-6 py-3 text-sm font-semibold text-foreground transition-all duration-300 hover:bg-surface-hover hover:shadow-ambient"
            >
              <Home className="h-4 w-4" />
              Homepage
            </Link>
          </div>

          {error.digest && (
            <p className="mt-8 text-body-sm text-text-muted/60">
              Error ID: {error.digest}
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
