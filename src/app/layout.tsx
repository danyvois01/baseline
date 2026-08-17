import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import { LocaleProvider } from "@/providers/locale-provider";
import { SITE_NAME, SITE_URL } from "@/lib/site";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    // The browser tab shows the brand alone: the descriptive title was long
    // enough to be truncated there. Search engines and social cards still get
    // the full wording via the description and the Open Graph title below.
    default: "Baseline",
    template: "%s | Baseline",
  },
  description:
    "Live ATP Tennis Rankings: real-time point projections, official standings & Race to Turin.",
  applicationName: SITE_NAME,
  keywords: [
    "ATP rankings",
    "live tennis rankings",
    "race to Turin",
    "classifica ATP",
    "ATP finals",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "it_IT",
    url: SITE_URL,
    title: "Baseline | Live ATP Tennis Rankings",
    description:
      "Live ATP Tennis Rankings: real-time point projections, official standings & Race to Turin.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Baseline | Live ATP Tennis Rankings",
    description:
      "Live ATP Tennis Rankings: real-time point projections, official standings & Race to Turin.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

/** JSON-LD WebSite schema — helps search engines display the site name. */
const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="it"
      className={`${outfit.variable} ${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background" suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <LocaleProvider>
            {children}
          </LocaleProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
