"use client"

import { useEffect, useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { SidebarNav, sections } from "@/components/styleguide/sidebar-nav"
import { SectionPhilosophy } from "@/components/styleguide/section-philosophy"
import { SectionBrand } from "@/components/styleguide/section-brand"
import { SectionColors } from "@/components/styleguide/section-colors"
import { SectionTypography } from "@/components/styleguide/section-typography"
import { SectionSpacing } from "@/components/styleguide/section-spacing"
import { SectionMotion } from "@/components/styleguide/section-motion"
import { SectionButtons } from "@/components/styleguide/section-buttons"
import { SectionInputs } from "@/components/styleguide/section-inputs"
import { SectionTags } from "@/components/styleguide/section-tags"
import { SectionCards } from "@/components/styleguide/section-cards"
import { SectionNavigation } from "@/components/styleguide/section-navigation"
import { SectionInteractions } from "@/components/styleguide/section-interactions"
import { Wordmark } from "@/components/wordmark"

export default function StyleGuidePage() {
  const [activeSection, setActiveSection] = useState("philosophy")

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        }
      },
      { rootMargin: "-20% 0px -60% 0px" }
    )

    sections.forEach((s) => {
      const el = document.getElementById(s.id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <main>
      <Navbar />

      {/* Header */}
      <section className="border-b border-border">
        <div className="max-w-[1200px] mx-auto px-12 max-[960px]:px-6 pt-20 pb-16">
          <div className="flex items-center gap-3 mb-6">
            <span className="font-mono text-[11px] font-medium tracking-[0.1em] uppercase text-signal bg-signal-soft px-3 py-1 rounded-full">
              v3.1
            </span>
            <span className="font-mono text-[11px] text-ink-300 tracking-wider uppercase">
              Open Ground
            </span>
          </div>
          <h1 className="font-display text-[64px] max-[960px]:text-[40px] leading-[1.0] tracking-[-0.025em] text-foreground mb-5 text-balance">
            Design System
            <br />
            <span className="text-ink-300">Style Guide</span>
          </h1>
          <p className="text-[18px] font-light text-ink-400 leading-relaxed max-w-[560px]">
            A complete reference for every visual decision, component, and
            interaction pattern in BC Connect. Built on restraint, grounded in
            reason.
          </p>
        </div>
      </section>

      {/* Body with sidebar */}
      <div className="max-w-[1200px] mx-auto px-12 max-[960px]:px-6 py-16">
        <div className="flex gap-16">
          <SidebarNav activeSection={activeSection} />

          <div className="flex-1 min-w-0">
            <SectionPhilosophy />
            <SectionBrand />
            <SectionColors />
            <SectionTypography />
            <SectionSpacing />
            <SectionMotion />
            <SectionButtons />
            <SectionInputs />
            <SectionTags />
            <SectionCards />
            <SectionNavigation />
            <SectionInteractions />
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
