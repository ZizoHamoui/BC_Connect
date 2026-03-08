import { GuideSection, ReasonBlock } from "./guide-section"

export function SectionSpacing() {
  const spacingTokens = [
    { name: "space-0", value: "0px" },
    { name: "space-1", value: "4px" },
    { name: "space-2", value: "8px" },
    { name: "space-3", value: "12px" },
    { name: "space-4", value: "16px" },
    { name: "space-5", value: "20px" },
    { name: "space-6", value: "24px" },
    { name: "space-8", value: "32px" },
    { name: "space-10", value: "40px" },
    { name: "space-12", value: "48px" },
    { name: "space-16", value: "64px" },
    { name: "space-20", value: "80px" },
    { name: "space-24", value: "96px" },
    { name: "space-32", value: "128px" },
  ]

  const radii = [
    { name: "r-sm", value: "6px", usage: "Pills, small tags, inline elements" },
    { name: "r-md", value: "10px", usage: "Inputs, dropdowns, small cards" },
    { name: "r-lg", value: "16px", usage: "Cards, sections, medium containers" },
    { name: "r-xl", value: "20px", usage: "Business cards, hero search, large cards" },
    { name: "r-pill", value: "999px", usage: "Buttons, filter pills, badges" },
  ]

  const shadows = [
    { name: "shadow-xs", value: "0 1px 2px rgba(0,0,0,0.04)", usage: "Buttons at rest" },
    { name: "shadow-sm", value: "0 1px 3px rgba(0,0,0,0.06), ...", usage: "Cards at rest" },
    { name: "shadow-md", value: "0 4px 12px rgba(0,0,0,0.06), ...", usage: "Cards on hover, dropdowns" },
    { name: "shadow-lg", value: "0 12px 32px rgba(0,0,0,0.08), ...", usage: "Modals, popovers" },
  ]

  return (
    <GuideSection
      id="spacing"
      title="Spacing, Radius & Shadow"
      subtitle="A 4px base grid keeps everything aligned. Border radii increase with container size. Shadows are deliberately subtle."
    >
      {/* Spacing visual */}
      <h3 className="font-display text-[20px] text-foreground mb-6">4px Grid (14 tokens)</h3>
      <div className="flex flex-col gap-2 mb-14">
        {spacingTokens.map((t) => {
          const px = parseInt(t.value)
          return (
            <div key={t.name} className="flex items-center gap-4">
              <span className="w-[80px] font-mono text-[11px] text-ink-400 shrink-0 text-right">{t.name}</span>
              <div
                className="h-4 rounded-sm bg-signal/20 border border-signal/30 transition-all duration-200"
                style={{ width: Math.max(px, 2) }}
              />
              <span className="font-mono text-[11px] text-ink-300">{t.value}</span>
            </div>
          )
        })}
      </div>

      {/* Radius visual */}
      <h3 className="font-display text-[20px] text-foreground mb-6">Border Radius</h3>
      <div className="grid grid-cols-5 max-[960px]:grid-cols-3 gap-5 mb-14">
        {radii.map((r) => (
          <div key={r.name} className="flex flex-col items-center text-center">
            <div
              className="w-20 h-20 bg-cloud border border-mist mb-3"
              style={{ borderRadius: r.value }}
            />
            <span className="font-mono text-[12px] text-foreground font-medium">{r.name}</span>
            <span className="font-mono text-[10px] text-ink-300">{r.value}</span>
            <span className="text-[11px] text-ink-400 mt-1 leading-tight">{r.usage}</span>
          </div>
        ))}
      </div>

      {/* Shadows */}
      <h3 className="font-display text-[20px] text-foreground mb-6">Shadows</h3>
      <div className="grid grid-cols-4 max-[960px]:grid-cols-2 gap-6 mb-6">
        {shadows.map((s) => (
          <div key={s.name} className="flex flex-col items-center text-center">
            <div
              className="w-full h-24 bg-background rounded-[var(--r-lg)] mb-3"
              style={{ boxShadow: s.name === "shadow-xs" ? "0 1px 2px rgba(0,0,0,0.04)" : s.name === "shadow-sm" ? "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)" : s.name === "shadow-md" ? "0 4px 12px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)" : "0 12px 32px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)" }}
            />
            <span className="font-mono text-[12px] text-foreground font-medium">{s.name}</span>
            <span className="text-[11px] text-ink-400 mt-1">{s.usage}</span>
          </div>
        ))}
      </div>

      <ReasonBlock>
        The 4px grid removes guesswork. Every margin, padding, and gap snaps to
        a multiple of 4. Radii scale with container size: a badge is 6px, a
        card is 20px. Shadows are barely visible because we trust layout
        structure and borders over drop-shadow depth.
      </ReasonBlock>
    </GuideSection>
  )
}
