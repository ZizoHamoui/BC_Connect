"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { SearchBar } from "./search-bar"
import { useAuth } from "@/lib/auth-context"

export function Hero() {
  const { user } = useAuth()
  return (
    <section className="relative overflow-hidden">
      {/* Lattice dot-grid background */}
      <div className="absolute inset-0 pointer-events-none lattice-bg opacity-60" />

      <div className="relative z-10 max-w-[1200px] mx-auto px-12 max-[960px]:px-6 pt-40 pb-[120px] max-[960px]:pt-24 max-[960px]:pb-20 text-center">
        {/* Hero pill - stagger 0 */}
        <div
          className="animate-fade-up inline-flex items-center gap-2 font-mono text-[11px] font-medium tracking-[0.1em] uppercase text-signal bg-signal-soft px-4 py-1.5 rounded-full mb-12"
          style={{ animationDelay: "0ms" }}
        >
          <span className="w-1.5 h-1.5 bg-signal rounded-full animate-pulse" />
          {"BC's Startup Ecosystem"}
        </div>

        {/* Hero title - stagger 1 */}
        <h1
          className="animate-fade-up font-display text-[96px] max-[960px]:text-[56px] font-normal leading-[0.95] tracking-[-0.03em] text-foreground mb-8 text-balance"
          style={{ animationDelay: "80ms" }}
        >
          BC Connect.
          <br />
          <em className="italic text-signal">Open Ground.</em>
        </h1>

        {/* Hero subtitle - stagger 2 */}
        <p
          className="animate-fade-up text-[20px] font-light text-ink-400 leading-relaxed max-w-[520px] mx-auto mb-12"
          style={{ animationDelay: "160ms" }}
        >
          Discover, locate, and connect with startups across British Columbia.
          One directory for the entire ecosystem.
        </p>

        {/* Search bar - stagger 3 */}
        <div
          className="animate-fade-up flex justify-center mb-12"
          style={{ animationDelay: "240ms" }}
        >
          <SearchBar placeholder="Search startups, industries, regions..." className="w-full max-w-[480px]" />
        </div>

        {/* CTA buttons - stagger 4 */}
        <div
          className="animate-fade-up flex justify-center gap-4 flex-wrap"
          style={{ animationDelay: "320ms" }}
        >
          <Link
            href={user ? "/directory" : "/auth"}
            className="btn-press focus-ring inline-flex items-center justify-center gap-2 font-sans text-base font-medium px-9 py-4 rounded-full bg-foreground text-background hover:bg-ink-700 shadow-[var(--shadow-sm)]"
          >
            Explore Directory
            <ArrowRight className="w-4 h-4" />
          </Link>
          {user && (
            <Link
              href="/directory?list=true"
              className="btn-press focus-ring inline-flex items-center justify-center font-sans text-base font-medium px-9 py-4 rounded-full bg-signal text-background hover:bg-signal-hover shadow-[var(--shadow-xs)]"
            >
              List Your Startup
            </Link>
          )}
        </div>

        {/* Hero meta - stagger 5 */}
        <div
          className="animate-fade-up flex justify-center gap-8 mt-16 font-mono text-xs text-ink-300"
          style={{ animationDelay: "450ms" }}
        >
          <span>2,847 Startups</span>
          <span className="text-fog">|</span>
          <span>8 Regions</span>
          <span className="text-fog">|</span>
          <span>7 Industries</span>
        </div>
      </div>
    </section>
  )
}
