import Image from "next/image";
import Link from "next/link";
import { TopNavBar, Footer } from "@/components/layout";
import { ArrowRight, Zap, Trophy, TrendingUp, Sparkles } from "lucide-react";

/**
 * Homepage — Baseline Tennis landing page.
 * Introductory sections: Hero, Play, Solder, To Baseline Tennis, Random.
 */
export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-surface-white">
      {/* Navigation */}
      <TopNavBar />

      {/* Main Content */}
      <main className="flex-1">
        {/* ── Hero Section ── */}
        <section className="relative overflow-hidden bg-deep-navy">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-baseline-lime blur-3xl" />
            <div className="absolute bottom-1/4 left-1/3 w-72 h-72 rounded-full bg-baseline-lime blur-3xl" />
          </div>
          <div className="relative mx-auto max-w-[1280px] px-6 py-24 md:py-32">
            <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/15 px-4 py-1.5 mb-8">
                <div className="w-2 h-2 rounded-full bg-baseline-lime live-pulse" />
                <span className="text-label-md text-baseline-lime font-medium tracking-wide uppercase">
                  Live Tracking Active
                </span>
              </div>
              <h1 className="text-display text-white mb-6">
                The Future of
                <br />
                <span className="text-baseline-lime">Tennis Rankings</span>
              </h1>
              <p className="text-body-lg text-white/70 mb-10 max-w-xl">
                Real-time ATP rankings, live point projections, and Race to Turin
                standings — all in one premium platform.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <Link
                  href="/live"
                  className="inline-flex items-center gap-2 rounded-full bg-baseline-lime px-8 py-3.5 text-sm font-bold text-deep-navy transition-all duration-200 hover:brightness-110 hover:scale-[1.02]"
                >
                  <Zap className="h-4 w-4" />
                  Live Rankings
                </Link>
                <Link
                  href="/official"
                  className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/5 px-8 py-3.5 text-sm font-medium text-white transition-all duration-200 hover:bg-white/10"
                >
                  Official Standings
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── Section: Play ── */}
        <section className="bg-surface-gray">
          <div className="mx-auto max-w-[1280px] px-6 py-20">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-baseline-lime/15 px-4 py-1.5 mb-6">
                  <Zap className="h-3.5 w-3.5 text-primary-olive" />
                  <span className="text-label-md text-primary-olive font-bold uppercase tracking-wider">
                    Play
                  </span>
                </div>
                <h2 className="text-headline-lg text-deep-navy mb-4">
                  Every Point. Every Match.
                  <br />
                  <span className="text-primary-olive">Every Moment.</span>
                </h2>
                <p className="text-body-lg text-text-muted mb-8 max-w-md">
                  Follow live matches as they unfold. Watch rankings shift in real-time
                  as players battle on court — from Grand Slams to ATP 250s.
                </p>
                <Link
                  href="/live"
                  className="inline-flex items-center gap-2 rounded-full bg-deep-navy px-6 py-3 text-sm font-medium text-white transition-all duration-200 hover:bg-deep-navy/90"
                >
                  Watch Live
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Grand Slams", value: "4", sub: "Per Season" },
                  { label: "ATP Masters", value: "9", sub: "1000-Level" },
                  { label: "Live Matches", value: "50+", sub: "Tracked Daily" },
                  { label: "Players", value: "500+", sub: "Ranked" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-2xl bg-white border border-border-subtle p-6 shadow-ambient transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
                  >
                    <p className="text-label-md text-text-muted mb-2 uppercase tracking-wider">
                      {stat.label}
                    </p>
                    <p className="text-headline-lg text-deep-navy">{stat.value}</p>
                    <p className="text-body-sm text-text-secondary mt-1">{stat.sub}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Section: Solder ── */}
        <section className="bg-surface-white">
          <div className="mx-auto max-w-[1280px] px-6 py-20">
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 rounded-full bg-baseline-lime/15 px-4 py-1.5 mb-6">
                <Trophy className="h-3.5 w-3.5 text-primary-olive" />
                <span className="text-label-md text-primary-olive font-bold uppercase tracking-wider">
                  Solder
                </span>
              </div>
              <h2 className="text-headline-lg text-deep-navy mb-4">
                Rankings That Matter
              </h2>
              <p className="text-body-lg text-text-muted max-w-2xl mx-auto">
                Three distinct ranking views built for every type of tennis fan — from
                casual followers to data-driven analysts.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  title: "Official Rankings",
                  desc: "Weekly ATP standings verified after each tournament cycle. The definitive seeding reference.",
                  href: "/official",
                  icon: Trophy,
                  accent: "bg-baseline-lime/10 text-primary-olive",
                },
                {
                  title: "Live Rankings",
                  desc: "Real-time point projections that update as matches complete. See ranking shifts before they're official.",
                  href: "/live",
                  icon: Zap,
                  accent: "bg-success-green-bg text-success-green-text",
                },
                {
                  title: "Race to Turin",
                  desc: "Calendar-year standings for ATP Finals qualification. Track who's in and who's fighting for a spot.",
                  href: "/race",
                  icon: TrendingUp,
                  accent: "bg-error-red-bg text-error-red-text",
                },
              ].map((card) => (
                <Link
                  key={card.href}
                  href={card.href}
                  className="group rounded-2xl bg-surface-gray border border-border-subtle p-8 transition-all duration-200 hover:shadow-ambient hover:-translate-y-1"
                >
                  <div
                    className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${card.accent} mb-6`}
                  >
                    <card.icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-headline-sm text-deep-navy mb-3">
                    {card.title}
                  </h3>
                  <p className="text-body-md text-text-muted mb-6">{card.desc}</p>
                  <span className="inline-flex items-center gap-1.5 text-label-lg text-primary-olive group-hover:gap-2.5 transition-all duration-200">
                    Explore
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── Section: To Baseline Tennis ── */}
        <section className="bg-deep-navy">
          <div className="mx-auto max-w-[1280px] px-6 py-20">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/15 px-4 py-1.5 mb-6">
                  <Sparkles className="h-3.5 w-3.5 text-baseline-lime" />
                  <span className="text-label-md text-baseline-lime font-medium uppercase tracking-wider">
                    To Baseline Tennis
                  </span>
                </div>
                <h2 className="text-headline-lg text-white mb-4">
                  Built by Fans.
                  <br />
                  <span className="text-baseline-lime">For Fans.</span>
                </h2>
                <p className="text-body-lg text-white/70 mb-8 max-w-lg">
                  Baseline Tennis was born from a passion for the sport and a frustration
                  with outdated ranking platforms. We bring you a modern, data-rich
                  experience that respects your time and intelligence.
                </p>
                <div className="flex flex-wrap gap-3">
                  {["Real-time Data", "Premium Design", "Open Source", "Community Driven"].map(
                    (tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-white/10 border border-white/15 px-4 py-2 text-label-md text-white/80"
                      >
                        {tag}
                      </span>
                    )
                  )}
                </div>
              </div>
              <div className="flex-1 flex justify-center">
                <div className="relative w-80 h-80">
                  <div className="absolute inset-0 rounded-3xl bg-baseline-lime/20 blur-2xl" />
                  <div className="relative w-full h-full rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <Image
                      src="/icon.png"
                      alt="Baseline Tennis Logo"
                      width={160}
                      height={160}
                      className="object-contain opacity-80"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Section: Random ── */}
        <section className="bg-surface-gray">
          <div className="mx-auto max-w-[1280px] px-6 py-20">
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 rounded-full bg-baseline-lime/15 px-4 py-1.5 mb-6">
                <Sparkles className="h-3.5 w-3.5 text-primary-olive" />
                <span className="text-label-md text-primary-olive font-bold uppercase tracking-wider">
                  Random
                </span>
              </div>
              <h2 className="text-headline-lg text-deep-navy mb-4">
                Did You Know?
              </h2>
              <p className="text-body-lg text-text-muted max-w-2xl mx-auto">
                Interesting facts and stats from the world of professional tennis.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  stat: "2,000+",
                  label: "Ranking Points",
                  desc: "Awarded to a Grand Slam singles champion",
                },
                {
                  stat: "52",
                  label: "Weeks at #1",
                  desc: "Minimum to enter the legends conversation",
                },
                {
                  stat: "8",
                  label: "Spots in Turin",
                  desc: "The elite season-ending championship field",
                },
                {
                  stat: "1973",
                  label: "Year ATP Began",
                  desc: "When computer rankings first started",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl bg-white border border-border-subtle p-6 text-center shadow-ambient transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
                >
                  <p className="text-headline-lg text-baseline-lime mb-1 font-heading">
                    {item.stat}
                  </p>
                  <p className="text-label-lg text-deep-navy mb-2">{item.label}</p>
                  <p className="text-body-sm text-text-muted">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA Banner ── */}
        <section className="bg-surface-white">
          <div className="mx-auto max-w-[1280px] px-6 py-20">
            <div className="rounded-3xl bg-deep-navy p-12 md:p-16 text-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-1/4 w-80 h-80 rounded-full bg-baseline-lime blur-3xl" />
              </div>
              <div className="relative">
                <h2 className="text-headline-lg text-white mb-4">
                  Ready to Explore?
                </h2>
                <p className="text-body-lg text-white/70 mb-8 max-w-md mx-auto">
                  Dive into the live rankings and see where your favourite players stand
                  right now.
                </p>
                <Link
                  href="/live"
                  className="inline-flex items-center gap-2 rounded-full bg-baseline-lime px-8 py-3.5 text-sm font-bold text-deep-navy transition-all duration-200 hover:brightness-110 hover:scale-[1.02]"
                >
                  <Zap className="h-4 w-4" />
                  Go to Live Rankings
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
