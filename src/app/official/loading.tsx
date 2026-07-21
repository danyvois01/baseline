import { TopNavBar, Footer } from "@/components/layout";

/**
 * Loading skeleton for the /official route.
 * Mirrors the OfficialTable layout: page header + 5-column grid rows.
 */

function SkeletonRow() {
  return (
    <div className="grid grid-cols-[50px_80px_1fr_120px_160px] items-center px-6 py-4 border-b border-border-subtle/60">
      <div className="flex justify-center">
        <div className="h-6 w-6 rounded-full bg-surface-gray animate-pulse" />
      </div>
      <div className="flex justify-center">
        <div className="h-5 w-12 rounded-full bg-surface-gray animate-pulse" />
      </div>
      <div className="flex flex-col gap-1.5">
        <div className="h-4 w-36 rounded-full bg-surface-gray animate-pulse" />
        <div className="h-3 w-20 rounded-full bg-surface-gray animate-pulse" />
      </div>
      <div className="flex justify-end">
        <div className="h-5 w-16 rounded-full bg-surface-gray animate-pulse" />
      </div>
      <div className="flex flex-col items-end gap-1 pr-2">
        <div className="h-4 w-14 rounded-full bg-surface-gray animate-pulse" />
        <div className="h-4 w-10 rounded-full bg-surface-gray animate-pulse" />
      </div>
    </div>
  );
}

export default function OfficialLoading() {
  return (
    <div className="flex flex-col min-h-screen bg-surface-white">
      <TopNavBar />

      <main className="flex-1 pt-28">
        <div className="mx-auto max-w-[1280px] px-6 py-8">
          {/* Header skeleton */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
            <div className="flex flex-col gap-2">
              <div className="h-8 w-72 rounded-full bg-surface-gray animate-pulse" />
              <div className="h-5 w-80 rounded-full bg-surface-gray animate-pulse" />
            </div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-48 rounded-full bg-surface-gray animate-pulse" />
              <div className="h-10 w-24 rounded-full bg-surface-gray animate-pulse" />
            </div>
          </div>

          {/* Table skeleton */}
          <div className="w-full bg-white rounded-3xl shadow-ambient border border-border-subtle overflow-hidden">
            {/* Header row */}
            <div className="grid grid-cols-[50px_80px_1fr_120px_160px] items-center px-6 py-4 border-b border-border-subtle bg-surface-gray/30">
              <div className="h-3 w-4 rounded bg-surface-gray animate-pulse mx-auto" />
              <div className="h-3 w-10 rounded bg-surface-gray animate-pulse mx-auto" />
              <div className="h-3 w-12 rounded bg-surface-gray animate-pulse" />
              <div className="h-3 w-12 rounded bg-surface-gray animate-pulse ml-auto" />
              <div className="h-3 w-16 rounded bg-surface-gray animate-pulse ml-auto pr-2" />
            </div>

            {/* Skeleton rows */}
            {Array.from({ length: 10 }).map((_, i) => (
              <SkeletonRow key={i} />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
