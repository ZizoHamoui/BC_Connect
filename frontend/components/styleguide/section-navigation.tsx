import { GuideSection, ReasonBlock } from "./guide-section"

export function SectionNavigation() {
  return (
    <GuideSection
      id="navigation"
      title="Navigation"
      subtitle="The navbar uses Radix NavigationMenu primitives for accessibility and Radix Tooltip for descriptive hints. Links use a center-out underline."
    >
      <div className="border border-border rounded-[var(--r-lg)] overflow-hidden mb-10">
        {/* Visual reference - the actual navbar is always visible at the top */}
        <div className="bg-off-white p-8">
          <p className="text-[13px] text-ink-400 mb-4">
            The live navbar is always visible above. Hover over the nav links to see the center-out underline effect.
          </p>

          {/* Underline demo in isolation */}
          <div className="flex gap-6 py-4">
            {["Active Link", "Hover Me", "Another Link"].map((label, i) => (
              <span
                key={label}
                data-active={i === 0}
                className="nav-underline relative inline-flex items-center text-sm font-medium px-1 py-2 cursor-pointer text-foreground"
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Spec table */}
      <h3 className="font-display text-[20px] text-foreground mb-5">Underline Behavior</h3>
      <div className="border border-border rounded-[var(--r-lg)] overflow-hidden mb-10">
        <div className="grid grid-cols-[140px_1fr] gap-0 bg-cloud px-6 py-3 border-b border-border">
          <span className="font-mono text-[11px] font-semibold text-ink-400 uppercase tracking-wider">Property</span>
          <span className="font-mono text-[11px] font-semibold text-ink-400 uppercase tracking-wider">Value</span>
        </div>
        {[
          { prop: "Element", val: "::after pseudo-element" },
          { prop: "Position", val: "bottom: -2px, centered via left: 50% -> left: 0" },
          { prop: "Width", val: "0% at rest, 100% on hover/active" },
          { prop: "Height", val: "1.5px" },
          { prop: "Color", val: "var(--signal) #1B6B4F" },
          { prop: "Duration", val: "220ms ease-out" },
          { prop: "Direction", val: "Expands from center outward" },
        ].map((row, i) => (
          <div key={row.prop} className={`grid grid-cols-[140px_1fr] gap-0 px-6 py-3 ${i < 6 ? "border-b border-border" : ""}`}>
            <span className="font-mono text-[13px] font-medium text-signal">{row.prop}</span>
            <span className="text-[13px] text-ink-400">{row.val}</span>
          </div>
        ))}
      </div>

      {/* Radix components used */}
      <h3 className="font-display text-[20px] text-foreground mb-5">Radix Primitives Used</h3>
      <div className="grid grid-cols-2 max-[960px]:grid-cols-1 gap-4 mb-6">
        {[
          {
            name: "NavigationMenu",
            pkg: "@radix-ui/react-navigation-menu",
            why: "Provides keyboard navigation, roving tab index, and ARIA attributes for the nav link group.",
          },
          {
            name: "Tooltip",
            pkg: "@radix-ui/react-tooltip",
            why: "Shows descriptive text on hover/focus with 8px offset. Accessible by default with role=\"tooltip\" and aria-describedby.",
          },
        ].map((radix) => (
          <div key={radix.name} className="p-6 border border-border rounded-[var(--r-lg)]">
            <div className="font-sans text-[15px] font-semibold text-foreground mb-1">{radix.name}</div>
            <code className="font-mono text-[11px] text-ink-300 bg-cloud px-2 py-0.5 rounded">{radix.pkg}</code>
            <p className="text-[13px] text-ink-400 leading-relaxed mt-3">{radix.why}</p>
          </div>
        ))}
      </div>

      <ReasonBlock>
        Center-out underlines were chosen over background-fill hovers because
        they are lighter weight. With only four nav items, a filled background
        creates visual blocks that compete with the search bar and CTA button.
        The underline is informational: it says &quot;you are here&quot; or &quot;you could go
        here&quot; without consuming layout space. This matches Anthropic, Linear, and
        other restrained product interfaces.
      </ReasonBlock>
    </GuideSection>
  )
}
