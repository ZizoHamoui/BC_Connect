"use client"

import { useState } from "react"
import { GuideSection, ReasonBlock, SpecRow } from "./guide-section"

export function SectionMotion() {
  const [activeDemo, setActiveDemo] = useState<string | null>(null)

  const curves = [
    {
      id: "ease-out",
      name: "Ease Out",
      css: "cubic-bezier(0.16, 1, 0.3, 1)",
      usage: "All standard UI transitions: hover, focus, border activation, pill slide",
      desc: "Fast start, soft landing. The element responds immediately and then settles. Used for 90% of interactions.",
    },
    {
      id: "ease-spring",
      name: "Ease Spring",
      css: "cubic-bezier(0.34, 1.56, 0.64, 1)",
      usage: "Reserved (visual demo only)",
      desc: "Overshoots the target and bounces back. Defined in the system but deliberately unused in production components. Kept as a reference curve.",
    },
    {
      id: "linear",
      name: "Linear / ease",
      css: "linear or ease",
      usage: "Color fades, opacity shifts",
      desc: "Simple linear for things that should feel instant: background-color, text-color transitions.",
    },
  ]

  const durations = [
    { label: "100-150ms", usage: "Button active, color swaps, opacity dims", class: "Fast" },
    { label: "200ms", usage: "Nav underline, focus ring, icon fade-in, row highlight", class: "Standard" },
    { label: "280ms", usage: "Card border/shadow, pill slide", class: "Considered" },
    { label: "350ms", usage: "Principle top-bar reveal", class: "Slow" },
    { label: "500ms", usage: "Entrance fade-in animation", class: "Entrance" },
  ]

  return (
    <GuideSection
      id="motion"
      title="Motion"
      subtitle="Three easing curves and six duration tiers. Motion is not decoration, it communicates the weight and importance of the change."
    >
      {/* Live curve demos */}
      <h3 className="font-display text-[20px] text-foreground mb-6">Easing Curves</h3>
      <div className="flex flex-col gap-5 mb-14">
        {curves.map((c) => (
          <div
            key={c.id}
            className="flex max-[960px]:flex-col gap-6 p-6 border border-border rounded-[var(--r-lg)] group cursor-pointer"
            onMouseEnter={() => setActiveDemo(c.id)}
            onMouseLeave={() => setActiveDemo(null)}
          >
            {/* Animated box */}
            <div className="w-[200px] max-[960px]:w-full h-12 bg-cloud rounded-[var(--r-md)] relative overflow-hidden shrink-0">
              <div
                className="absolute top-1 bottom-1 left-1 w-10 rounded-[var(--r-sm)] bg-signal"
                style={{
                  transform: activeDemo === c.id ? "translateX(148px)" : "translateX(0)",
                  transition: `transform ${c.id === "ease-spring" ? "450ms" : c.id === "ease-out" ? "280ms" : "200ms"} ${c.css}`,
                }}
              />
            </div>

            {/* Details */}
            <div className="flex-1">
              <div className="flex items-baseline gap-3 mb-1">
                <span className="font-sans text-[15px] font-semibold text-foreground">{c.name}</span>
                <code className="font-mono text-[11px] text-ink-300 bg-cloud px-2 py-0.5 rounded">{c.css}</code>
              </div>
              <p className="text-[13px] text-ink-400 leading-relaxed mb-1">{c.desc}</p>
              <p className="text-[12px] text-ink-300">
                {"Used for: "}{c.usage}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Duration tiers */}
      <h3 className="font-display text-[20px] text-foreground mb-6">Duration Tiers</h3>
      <div className="border border-border rounded-[var(--r-lg)] overflow-hidden mb-6">
        <div className="grid grid-cols-[80px_1fr_1fr] gap-0 bg-cloud px-6 py-3 border-b border-border">
          <span className="font-mono text-[11px] font-semibold text-ink-400 uppercase tracking-wider">Time</span>
          <span className="font-mono text-[11px] font-semibold text-ink-400 uppercase tracking-wider">Class</span>
          <span className="font-mono text-[11px] font-semibold text-ink-400 uppercase tracking-wider">Usage</span>
        </div>
        {durations.map((d, i) => (
          <div
            key={d.label}
            className={`grid grid-cols-[80px_1fr_1fr] gap-0 px-6 py-3.5 ${i !== durations.length - 1 ? "border-b border-border" : ""}`}
          >
            <span className="font-mono text-[13px] font-medium text-signal">{d.label}</span>
            <span className="font-sans text-[13px] font-medium text-foreground">{d.class}</span>
            <span className="text-[13px] text-ink-400">{d.usage}</span>
          </div>
        ))}
      </div>

      <ReasonBlock>
        Motion speed communicates weight. A button color shift at 150ms says &quot;immediate.&quot;
        A card border warmth at 280ms says &quot;considered.&quot; No animation exceeds
        500ms because after that, things feel sluggish rather than deliberate.
        All interactions use color, opacity, and border, never position or scale.
      </ReasonBlock>
    </GuideSection>
  )
}
