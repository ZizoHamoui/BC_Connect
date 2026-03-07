import { GuideSection, SpecRow, ReasonBlock } from "./guide-section"

export function SectionTypography() {
  const scale = [
    { name: "Display XL", sample: "Open Ground", className: "font-display text-[96px] leading-[0.95] tracking-[-0.03em]", spec: "96px / Instrument Serif / Regular / 0.95 lh / -0.03em" },
    { name: "Display L", sample: "BC Connect", className: "font-display text-[64px] leading-[1.0] tracking-[-0.025em]", spec: "64px / Instrument Serif / Regular / 1.0 lh / -0.025em" },
    { name: "Display M", sample: "Startup Directory", className: "font-display text-[48px] leading-[1.05] tracking-[-0.02em]", spec: "48px / Instrument Serif / Regular / 1.05 lh / -0.02em" },
    { name: "Display S", sample: "Business Cards", className: "font-display text-[36px] leading-[1.1] tracking-[-0.015em]", spec: "36px / Instrument Serif / Regular / 1.1 lh / -0.015em" },
    { name: "Heading L", sample: "Section Heading", className: "font-display text-[28px] leading-[1.15] tracking-[-0.01em]", spec: "28px / Instrument Serif / Regular / 1.15 lh / -0.01em" },
    { name: "Heading M", sample: "Card Title", className: "font-display text-[24px] leading-[1.15] tracking-[-0.01em]", spec: "24px / Instrument Serif / Regular / 1.15 lh / -0.01em" },
    { name: "Heading S", sample: "Subsection Title", className: "font-display text-[20px] leading-[1.2] tracking-[-0.01em]", spec: "20px / Instrument Serif / Regular / 1.2 lh / -0.01em" },
    { name: "Body L", sample: "Discover startups across British Columbia.", className: "font-sans text-[20px] font-light leading-[1.6] text-ink-400", spec: "20px / DM Sans / Light 300 / 1.6 lh" },
    { name: "Body M", sample: "This is the standard body text used for descriptions.", className: "font-sans text-[15px] font-normal leading-[1.6] text-ink-500", spec: "15px / DM Sans / Regular 400 / 1.6 lh" },
    { name: "Body S", sample: "Secondary body text and metadata fields.", className: "font-sans text-[14px] font-normal leading-[1.6] text-ink-400", spec: "14px / DM Sans / Regular 400 / 1.6 lh" },
    { name: "Caption", sample: "Vancouver, BC  |  12 employees", className: "font-sans text-[13px] font-medium leading-[1.4] text-ink-300", spec: "13px / DM Sans / Medium 500 / 1.4 lh" },
    { name: "Overline", sample: "ACTIVE STARTUPS", className: "font-sans text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-300", spec: "11px / DM Sans / Semibold 600 / 0.1em tracking / uppercase" },
    { name: "Mono M", sample: "2,847", className: "font-mono text-[15px] font-normal text-ink-500", spec: "15px / DM Mono / Regular 400" },
    { name: "Mono S", sample: "--signal: #1B6B4F", className: "font-mono text-[13px] font-normal text-ink-400", spec: "13px / DM Mono / Regular 400" },
  ]

  return (
    <GuideSection
      id="typography"
      title="Typography"
      subtitle="Three fonts, each with a clear job. Instrument Serif for display headings, DM Sans for everything else, DM Mono for data and code."
    >
      {/* Font showcase */}
      <div className="grid grid-cols-3 max-[960px]:grid-cols-1 gap-6 mb-14">
        <div className="p-8 border border-border rounded-[var(--r-lg)]">
          <div className="font-display text-[40px] text-foreground mb-3">Instrument Serif</div>
          <div className="text-[13px] text-ink-400 mb-4">Display / Headings</div>
          <div className="font-mono text-[11px] text-ink-300 leading-[1.8]">
            Weight: 400 Regular
            <br />
            Style: Normal + Italic
            <br />
            Role: Section titles, card names, hero
            <br />
            Class: font-display
          </div>
        </div>
        <div className="p-8 border border-border rounded-[var(--r-lg)]">
          <div className="font-sans text-[40px] font-light text-foreground mb-3">DM Sans</div>
          <div className="text-[13px] text-ink-400 mb-4">Body / UI / Buttons</div>
          <div className="font-mono text-[11px] text-ink-300 leading-[1.8]">
            Weights: 300, 400, 500, 600, 700
            <br />
            Role: Body, labels, navigation, buttons
            <br />
            Class: font-sans
          </div>
        </div>
        <div className="p-8 border border-border rounded-[var(--r-lg)]">
          <div className="font-mono text-[36px] text-foreground mb-3">DM Mono</div>
          <div className="text-[13px] text-ink-400 mb-4">Data / Code / Metadata</div>
          <div className="font-mono text-[11px] text-ink-300 leading-[1.8]">
            Weights: 300, 400, 500
            <br />
            Role: Stats, tokens, version labels
            <br />
            Class: font-mono
          </div>
        </div>
      </div>

      {/* Full type scale */}
      <h3 className="font-display text-[20px] text-foreground mb-6">Type Scale (14 levels)</h3>
      <div className="flex flex-col gap-0 border border-border rounded-[var(--r-lg)] overflow-hidden">
        {scale.map((level, i) => (
          <div
            key={level.name}
            className={`flex max-[960px]:flex-col gap-4 p-6 items-baseline ${i !== scale.length - 1 ? "border-b border-border" : ""}`}
          >
            <div className="w-[120px] shrink-0">
              <div className="font-mono text-[11px] text-signal font-medium">{level.name}</div>
            </div>
            <div className="flex-1 min-w-0 overflow-hidden">
              <div className={`${level.className} truncate`}>{level.sample}</div>
            </div>
            <div className="shrink-0 max-w-[280px]">
              <div className="font-mono text-[10px] text-ink-300 leading-relaxed">
                {level.spec}
              </div>
            </div>
          </div>
        ))}
      </div>

      <ReasonBlock>
        Instrument Serif gives warmth and editorial authority at display sizes.
        DM Sans handles readability at small sizes with a geometric clarity.
        DM Mono signals "data" to the eye, making stat cards and tokens
        instantly distinguishable from prose. Three fonts, never more.
      </ReasonBlock>
    </GuideSection>
  )
}
