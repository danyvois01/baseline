"use client";

/**
 * Theme provider component for dark/light mode support.
 * Wraps the app with next-themes ThemeProvider.
 * Must be a Client Component since it uses React context.
 */

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
