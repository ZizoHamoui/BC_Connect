import { LatticeMark } from "@/components/lattice-mark"
import { GuideSection, ReasonBlock } from "./guide-section"

export function SectionPhilosophy() {
  const laws = [
    {
      number: "01",
      title: "Earn Your Pixel",
      desc: "Every visual element must justify its presence. If it does not inform, orient, or delight, it is noise. We default to removal.",
    },
    {
      number: "02",
      title: "Ground Before Signal",
      desc: "Establish spatial clarity with neutral ground before introducing any color or emphasis. The white space is not empty; it is structure.",
    },
    {
      number: "03",
      title: "Connect, Don\u2019t Decorate",
      desc: "Ornament that exists only for aesthetics is disallowed. Every line, dot, and gradient should visualize a real relationship between entities.",
    },
  ]

  return (
    <GuideSection
      id="philosophy"
      title="Design Philosophy"
      subtitle="Three laws govern every decision in the BC Connect design system. They exist to keep the interface honest."
    >
      <div className="grid grid-cols-3 max-[960px]:grid-cols-1 gap-6 mb-10">
        {laws.map((law) => (
          <div
            key={law.number}
            className="principle-bar p-8 border border-border rounded-[var(--r-lg)] bg-card"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="font-mono text-xs text-signal tracking-wider">
                {law.number}
              </span>
              <div className="flex-1 h-px bg-mist" />
            </div>
            <h3 className="font-display text-[22px] tracking-[-0.01em] text-foreground mb-3">
              {law.title}
            </h3>
            <p className="text-[13px] text-ink-400 leading-[1.65]">
              {law.desc}
            </p>
          </div>
        ))}
      </div>

      <ReasonBlock>
        These laws emerged from observing that most startup directories become
        visual noise. BC Connect inverts that: restraint creates trust. Every
        design decision is evaluated against these three rules.
      </ReasonBlock>
    </GuideSection>
  )
}
