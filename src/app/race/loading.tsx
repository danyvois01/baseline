import { TopNavBar, Footer } from "@/components/layout";

/**
 * Loading skeleton for the /race route.
 * Mirrors the RaceTable layout: summary cards + 7-column grid rows.
 */

function SkeletonRow() {
  return (
    <div className="grid grid-cols-[50px_80px_1fr_1.2fr_120px_100px_160px] items-center px-6 py-4 border-b border-border-subtle/60">
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
      <div className="flex items-center gap-2">
        <div className="h-2.5 w-2.5 rounded-full bg-surface-gray animate-pulse" />
        <div className="h-4 w-28 rounded-full bg-surface-gray animate-pulse" />
      </div>
      <div className="flex justify-end">
        <div className="h-5 w-16 rounded-full bg-surface-gray animate-pulse" />
      </div>
      <div className="flex justify-center">
        <div className="h-5 w-12 rounded-full bg-surface-gray animate-pulse" />
      </div>
      <div className="flex justify-center">
        <div className="h-5 w-20 rounded-full bg-surface-gray animate-pulse" />
      </div>
    </div>
  );
}

export default function RaceLoading() {
  return (
    <div className="flex flex-col min-h-screen bg-surface-white">
      <TopNavBar />

      <main className="flex-1 pt-28">
        <div className="mx-auto max-w-[1280px] px-6 py-8">
          {/* Header skeleton */}
          <div className="mb-6">
            <div className="h-8 w-52 rounded-full bg-surface-gray animate-pulse mb-2" />
            <div className="h-5 w-[28rem] rounded-full bg-surface-gray animate-pulse" />
          </div>

          {/* Summary cards skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="rounded-xl border border-border-subtle bg-surface-white p-4 px-5">
              <div className="h-4 w-32 rounded bg-surface-gray animate-pulse mb-3" />
              <div className="h-7 w-16 rounded bg-surface-gray animate-pulse mb-2" />
              <div className="h-3 w-48 rounded bg-surface-gray animate-pulse" />
            </div>
            <div className="rounded-xl border border-border-subtle bg-surface-white p-4 px-5">
              <div className="h-4 w-36 rounded bg-surface-gray animate-pulse mb-3" />
              <div className="h-7 w-20 rounded bg-surface-gray animate-pulse mb-2" />
              <div className="h-3 w-56 rounded bg-surface-gray animate-pulse" />
            </div>
          </div>

          {/* Table skeleton */}
          <div className="w-full bg-surface-white rounded-3xl shadow-ambient border border-border-subtle overflow-hidden">
            {/* Widget header */}
            <div className="flex items-center justify-between p-4 md:px-6 border-b border-border-subtle bg-surface-white">
              <div className="h-6 w-40 rounded-full bg-surface-gray animate-pulse" />
              <div className="flex items-center gap-3">
                <div className="h-10 w-48 rounded-full bg-surface-gray animate-pulse" />
                <div className="h-10 w-24 rounded-full bg-surface-gray animate-pulse" />
              </div>
            </div>

            {/* Column header row */}
            <div className="grid grid-cols-[50px_80px_1fr_1.2fr_120px_100px_160px] items-center px-6 py-4 border-b border-border-subtle bg-surface-gray/30">
              <div className="h-3 w-4 rounded bg-surface-gray animate-pulse mx-auto" />
              <div className="h-3 w-10 rounded bg-surface-gray animate-pulse mx-auto" />
              <div className="h-3 w-12 rounded bg-surface-gray animate-pulse" />
              <div className="h-3 w-16 rounded bg-surface-gray animate-pulse" />
              <div className="h-3 w-12 rounded bg-surface-gray animate-pulse ml-auto" />
              <div className="h-3 w-6 rounded bg-surface-gray animate-pulse mx-auto" />
              <div className="h-3 w-14 rounded bg-surface-gray animate-pulse mx-auto" />
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
