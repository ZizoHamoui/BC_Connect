import { GuideSection, ReasonBlock } from "./guide-section"

export function SectionInteractions() {
  const interactions = [
    {
      component: "Business Card",
      hover: "Border warms to signal-mist, shadow softens, arrow icon fades in at top-right",
      active: "n/a (cards are links, not toggle)",
      focus: "focus-ring: 2px white + 4px signal",
      curve: "280ms ease-out",
    },
    {
      component: "Job Card",
      hover: "Background warms to off-white, border warms to signal-mist, arrow fades in",
      active: "n/a",
      focus: "focus-ring",
      curve: "200ms ease-out",
    },
    {
      component: "Stat Card",
      hover: "Number turns signal-green, border warms to signal-mist",
      active: "n/a",
      focus: "focus-ring",
      curve: "280ms ease-out, color 300ms",
    },
    {
      component: "Nav Link",
      hover: "1.5px underline expands center-out in signal-green, text darkens to foreground",
      active: "Underline stays at 100% width",
      focus: "focus-ring",
      curve: "220ms ease-out",
    },
    {
      component: "Filter Pill",
      hover: "Background tints to industry color, border tightens",
      active: "Background fills to industry color, text to white, sliding indicator",
      focus: "focus-ring",
      curve: "280ms ease-out (pill slide)",
    },
    {
      component: "Search Bar",
      hover: "No change (rest is already inviting)",
      active: "bg: white, border: fog, icon: signal, shadow-sm",
      focus: "Same as active (focus-within triggers the state)",
      curve: "200ms ease",
    },
    {
      component: "Primary Button",
      hover: "Background shifts ink-900 to ink-700, no movement",
      active: "Opacity dims to 0.85",
      focus: "focus-ring",
      curve: "150ms ease",
    },
    {
      component: "Ghost Button",
      hover: "Border glows to rgba(78,224,184,0.4), box-shadow 20px signal glow",
      active: "Opacity dims to 0.85",
      focus: "focus-ring",
      curve: "200ms ease",
    },
    {
      component: "Principle Card",
      hover: "2px signal top-bar expands left-to-right, number opacity increases",
      active: "n/a",
      focus: "n/a (display only)",
      curve: "350ms ease-out",
    },
    {
      component: "Lattice Mark",
      hover: "Rotates 90° with spring overshoot, opacity softens to 0.85",
      active: "n/a",
      focus: "n/a",
      curve: "450ms ease-spring",
    },
    {
      component: "Avatar",
      hover: "2px signal-mist ring materializes, 4px outer glow",
      active: "n/a",
      focus: "focus-ring",
      curve: "200ms ease",
    },
  ]

  return (
    <GuideSection
      id="interactions"
      title="Interaction Reference"
      subtitle="A comprehensive lookup table for every interactive element in the system. Each row specifies hover, active, focus states, and the exact timing curve."
    >
      <div className="border border-border rounded-[var(--r-lg)] overflow-hidden overflow-x-auto mb-10">
        <div className="min-w-[800px]">
          {/* Header */}
          <div className="grid grid-cols-[140px_1fr_1fr_140px_130px] gap-0 bg-cloud px-6 py-3 border-b border-border">
            <span className="font-mono text-[10px] font-semibold text-ink-400 uppercase tracking-wider">Component</span>
            <span className="font-mono text-[10px] font-semibold text-ink-400 uppercase tracking-wider">Hover</span>
            <span className="font-mono text-[10px] font-semibold text-ink-400 uppercase tracking-wider">Active/Selected</span>
            <span className="font-mono text-[10px] font-semibold text-ink-400 uppercase tracking-wider">Focus</span>
            <span className="font-mono text-[10px] font-semibold text-ink-400 uppercase tracking-wider">Timing</span>
          </div>

          {/* Rows */}
          {interactions.map((row, i) => (
            <div
              key={row.component}
              className={`grid grid-cols-[140px_1fr_1fr_140px_130px] gap-0 px-6 py-3.5 ${i < interactions.length - 1 ? "border-b border-border" : ""} hover:bg-off-white transition-colors duration-150`}
            >
              <span className="font-sans text-[12px] font-semibold text-foreground">{row.component}</span>
              <span className="text-[11px] text-ink-400 leading-relaxed pr-4">{row.hover}</span>
              <span className="text-[11px] text-ink-400 leading-relaxed pr-4">{row.active}</span>
              <span className="text-[11px] text-ink-400 leading-relaxed pr-4">{row.focus}</span>
              <span className="font-mono text-[11px] text-signal">{row.curve}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Design decisions */}
      <h3 className="font-display text-[20px] text-foreground mb-5">Key Design Decisions</h3>
      <div className="flex flex-col gap-4 mb-6">
        {[
          {
            q: "Why center-out underlines instead of background fills?",
            a: "Background fills create visual blocks that compete with the CTA button and search bar. Underlines are lighter, more editorial, and take zero layout space.",
          },
          {
            q: "Why no transforms (scale, translate) on hover?",
            a: "Transforms cause layout shift in grids and lists. They also feel performative rather than informative. Color shifts (border, background, text) communicate state change without moving content around. The user's eye doesn't need to track repositioned elements.",
          },
          {
            q: "Why color/opacity instead of movement for buttons?",
            a: "A button's position should be stable and predictable. Color shift on hover says 'this is ready.' Opacity dim on active says 'this was pressed.' No element needs to float, bounce, or slide to communicate that.",
          },
          {
            q: "Why do filter pills use industry colors?",
            a: "When you select 'Technology', the pill tints blue. When you select 'Clean Energy', it tints green. This creates a semantic link between the filter control and the cards it reveals. Generic black/white pills would break that connection.",
          },
          {
            q: "Why 280ms for cards but 150ms for buttons?",
            a: "Buttons should feel immediate (they are tools). Cards should feel considered (they represent content worth exploring). Speed communicates weight.",
          },
        ].map((item) => (
          <div key={item.q} className="p-5 border border-border rounded-[var(--r-md)]">
            <div className="font-sans text-[14px] font-semibold text-foreground mb-2">{item.q}</div>
            <div className="text-[13px] text-ink-400 leading-relaxed">{item.a}</div>
          </div>
        ))}
      </div>

      <ReasonBlock>
        Every interaction in this system answers the question: &quot;What is the user
        learning from this change?&quot; A border warmth says &quot;this is interactive.&quot;
        A color shift says &quot;this is activating.&quot; An arrow fade-in says &quot;this
        leads somewhere.&quot; If a hover effect cannot answer that question, it does not exist.
      </ReasonBlock>
    </GuideSection>
  )
}
