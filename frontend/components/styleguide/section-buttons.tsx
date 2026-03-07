import { ArrowRight } from "lucide-react"
import { GuideSection, ReasonBlock } from "./guide-section"

export function SectionButtons() {
  return (
    <GuideSection
      id="buttons"
      title="Buttons"
      subtitle="Four variants (Primary, Signal, Secondary, Ghost) across three sizes. Every button uses btn-press for color shift on hover and opacity dim on active."
    >
      {/* Primary */}
      <h3 className="font-display text-[20px] text-foreground mb-5">Primary (Ink)</h3>
      <p className="text-[13px] text-ink-400 mb-6 max-w-[480px]">
        Dark background, white text. The strongest action on the page. Hover shifts background
        from ink-900 to ink-700. Active dims opacity to 0.85.
      </p>
      <div className="flex flex-wrap items-center gap-4 mb-10">
        <button className="btn-press focus-ring inline-flex items-center justify-center font-sans text-sm font-medium px-[18px] py-[7px] rounded-full bg-foreground text-background hover:bg-ink-700 shadow-[var(--shadow-xs)]">
          Small
        </button>
        <button className="btn-press focus-ring inline-flex items-center justify-center gap-2 font-sans text-[15px] font-medium px-[22px] py-[11px] rounded-full bg-foreground text-background hover:bg-ink-700 shadow-[var(--shadow-xs)]">
          Medium
          <ArrowRight className="w-4 h-4" />
        </button>
        <button className="btn-press focus-ring inline-flex items-center justify-center gap-2 font-sans text-base font-medium px-9 py-4 rounded-full bg-foreground text-background hover:bg-ink-700 shadow-[var(--shadow-sm)]">
          Large Button
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Signal */}
      <h3 className="font-display text-[20px] text-foreground mb-5">Signal (Brand)</h3>
      <p className="text-[13px] text-ink-400 mb-6 max-w-[480px]">
        Signal green background. Used for the primary brand action: "List Your Startup." Hover darkens to signal-hover.
      </p>
      <div className="flex flex-wrap items-center gap-4 mb-10">
        <button className="btn-press focus-ring inline-flex items-center justify-center font-sans text-sm font-medium px-[18px] py-[7px] rounded-full bg-signal text-background hover:bg-signal-hover shadow-[var(--shadow-xs)]">
          Small
        </button>
        <button className="btn-press focus-ring inline-flex items-center justify-center font-sans text-[15px] font-medium px-[22px] py-[11px] rounded-full bg-signal text-background hover:bg-signal-hover shadow-[var(--shadow-xs)]">
          Medium
        </button>
        <button className="btn-press focus-ring inline-flex items-center justify-center font-sans text-base font-medium px-9 py-4 rounded-full bg-signal text-background hover:bg-signal-hover shadow-[var(--shadow-sm)]">
          List Your Startup
        </button>
      </div>

      {/* Secondary */}
      <h3 className="font-display text-[20px] text-foreground mb-5">Secondary (Outline)</h3>
      <p className="text-[13px] text-ink-400 mb-6 max-w-[480px]">
        White background with border. Hover warms background to off-white and tightens the border to fog. Lowest visual weight.
      </p>
      <div className="flex flex-wrap items-center gap-4 mb-10">
        <button className="btn-press focus-ring inline-flex items-center justify-center font-sans text-sm font-medium px-[18px] py-[7px] rounded-full bg-card text-foreground border border-border hover:border-fog hover:bg-off-white">
          Small
        </button>
        <button className="btn-press focus-ring inline-flex items-center justify-center font-sans text-[15px] font-medium px-[22px] py-[11px] rounded-full bg-card text-foreground border border-border hover:border-fog hover:bg-off-white">
          Medium
        </button>
        <button className="btn-press focus-ring inline-flex items-center justify-center font-sans text-base font-medium px-9 py-4 rounded-full bg-card text-foreground border border-border hover:border-fog hover:bg-off-white">
          Clear Filters
        </button>
      </div>

      {/* Ghost (dark bg) */}
      <h3 className="font-display text-[20px] text-foreground mb-5">Ghost (Dark Background)</h3>
      <p className="text-[13px] text-ink-400 mb-6 max-w-[480px]">
        Transparent with a white/translucent border. Used on dark CTA sections. Hover glows the border toward signal-green with a subtle box-shadow.
      </p>
      <div className="flex flex-wrap items-center gap-4 p-8 bg-ink-900 rounded-[var(--r-lg)] mb-10">
        <button className="btn-press ghost-glow focus-ring inline-flex items-center justify-center font-sans text-sm font-medium px-[18px] py-[7px] rounded-full bg-transparent text-white/80 border border-white/15">
          Small Ghost
        </button>
        <button className="btn-press ghost-glow focus-ring inline-flex items-center justify-center font-sans text-base font-medium px-9 py-4 rounded-full bg-transparent text-white/80 border border-white/15">
          Browse Directory
        </button>
      </div>

      {/* Interaction spec */}
      <h3 className="font-display text-[20px] text-foreground mb-5">Interaction Spec</h3>
      <div className="border border-border rounded-[var(--r-lg)] overflow-hidden mb-6">
        <div className="grid grid-cols-[120px_1fr] gap-0 bg-cloud px-6 py-3 border-b border-border">
          <span className="font-mono text-[11px] font-semibold text-ink-400 uppercase tracking-wider">State</span>
          <span className="font-mono text-[11px] font-semibold text-ink-400 uppercase tracking-wider">Behavior</span>
        </div>
        {[
          { state: "Hover", behavior: "Background color shift (ink-900 to ink-700), no movement" },
          { state: "Active", behavior: "Opacity dims to 0.85, providing tactile feedback without movement" },
          { state: "Focus", behavior: "2px white ring + 4px signal ring (focus-ring class)" },
          { state: "Disabled", behavior: "opacity: 0.5, pointer-events: none, no hover effect" },
        ].map((row, i) => (
          <div key={row.state} className={`grid grid-cols-[120px_1fr] gap-0 px-6 py-3.5 ${i < 3 ? "border-b border-border" : ""}`}>
            <span className="font-mono text-[13px] font-medium text-signal">{row.state}</span>
            <span className="text-[13px] text-ink-400">{row.behavior}</span>
          </div>
        ))}
      </div>

      <ReasonBlock>
        No transforms on buttons. Hover communicates through color shift alone,
        active communicates through a subtle opacity dim. This keeps buttons
        anchored in the layout grid. Movement is reserved for content that is
        being revealed, not for the controls themselves.
      </ReasonBlock>
    </GuideSection>
  )
}
