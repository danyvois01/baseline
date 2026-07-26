import type { Metadata } from "next";
import { TopNavBar, Footer } from "@/components/layout";
import { PrivacyContent } from "./privacy-content";

/**
 * Privacy Policy — /privacy page.
 * Static long-form legal page describing data processing (GDPR).
 */

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Baseline handles your data: no accounts, no tracking cookies, only technical hosting logs and local browser preferences.",
  alternates: {
    canonical: "/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-surface-white">
      <TopNavBar />

      <main className="flex-1 pt-28">
        <div className="mx-auto max-w-[720px] px-6 py-8">
          <PrivacyContent />
        </div>
      </main>

      <Footer />
    </div>
  );
}
