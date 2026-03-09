"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

export function CtaSection() {
  const { user } = useAuth()
  return (
    <section className="border-t border-border py-[120px] max-[960px]:py-20">
      <div className="max-w-[1200px] mx-auto px-12 max-[960px]:px-6">
        <div className="relative overflow-hidden rounded-[var(--r-xl)] bg-foreground px-16 py-20 max-[960px]:px-8 max-[960px]:py-12 text-center">
          {/* Lattice dot-grid on dark */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.06]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)",
              backgroundSize: "24px 24px",
            }}
          />
          <div className="relative z-10">
            <h2 className="font-display text-[56px] max-[960px]:text-[36px] font-normal leading-[1.0] tracking-[-0.025em] text-background mb-6 text-balance">
              Put your startup
              <br />
              <em className="italic text-[#4EE0B8]">on the map.</em>
            </h2>
            <p className="text-[18px] font-light text-ink-300 max-w-[460px] mx-auto leading-relaxed mb-10">
              {
                "Join thousands of BC startups already listed. Get discovered by investors, talent, and collaborators."
              }
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <Link
                href={user ? "/directory?list=true" : "/auth"}
                className="btn-press focus-ring inline-flex items-center justify-center gap-2 font-sans text-base font-medium px-9 py-4 rounded-full bg-signal text-background hover:bg-signal-hover shadow-[var(--shadow-sm)]"
              >
                {user ? "List Your Startup" : "Sign In to Get Started"}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href={user ? "/directory" : "/auth"}
                className="ghost-glow focus-ring inline-flex items-center justify-center font-sans text-base font-medium px-9 py-4 rounded-full bg-transparent text-ink-300 border border-ink-700"
              >
                Browse Directory
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
