import { LatticeMark } from "@/components/lattice-mark"
import { Wordmark } from "@/components/wordmark"
import { GuideSection, SpecRow, ReasonBlock } from "./guide-section"

export function SectionBrand() {
  return (
    <GuideSection
      id="brand"
      title="Brand Mark"
      subtitle="The Lattice Mark represents interconnected nodes in an ecosystem. It rotates on hover via the spring curve to convey a living network."
    >
      {/* Mark variants on backgrounds */}
      <div className="grid grid-cols-3 max-[960px]:grid-cols-1 gap-6 mb-10">
        <div className="flex flex-col items-center justify-center p-12 bg-background border border-border rounded-[var(--r-lg)]">
          <LatticeMark size={64} variant="light" />
          <span className="mt-4 font-mono text-[11px] text-ink-300">Light / Default</span>
        </div>
        <div className="flex flex-col items-center justify-center p-12 bg-ink-900 rounded-[var(--r-lg)]">
          <LatticeMark size={64} variant="dark" />
          <span className="mt-4 font-mono text-[11px] text-ink-200">Dark / Inverse</span>
        </div>
        <div className="flex flex-col items-center justify-center p-12 bg-signal-soft border border-signal-mist rounded-[var(--r-lg)]">
          <LatticeMark size={64} variant="signal" />
          <span className="mt-4 font-mono text-[11px] text-signal">Signal / Brand</span>
        </div>
      </div>

      {/* Wordmark variants */}
      <h3 className="font-display text-[20px] text-foreground mb-6">Wordmark</h3>
      <div className="grid grid-cols-2 max-[960px]:grid-cols-1 gap-6 mb-8">
        <div className="flex items-center justify-center p-10 bg-background border border-border rounded-[var(--r-lg)] lattice-hover cursor-pointer">
          <Wordmark size="brand" variant="light" />
        </div>
        <div className="flex items-center justify-center p-10 bg-ink-900 rounded-[var(--r-lg)] lattice-hover cursor-pointer">
          <Wordmark size="brand" variant="dark" />
        </div>
      </div>

      <p className="text-[13px] text-ink-400 mb-4">
        Hover over either wordmark above to see the lattice rotation. This uses the spring curve
        <code className="font-mono text-[12px] bg-cloud px-1.5 py-0.5 rounded mx-1">
          cubic-bezier(0.34, 1.56, 0.64, 1)
        </code>
        at 450ms for a playful overshoot.
      </p>

      {/* Spec */}
      <div className="max-w-[400px]">
        <SpecRow label="SVG Viewbox" value="0 0 28 28" mono />
        <SpecRow label="Center node" value="r=3 at (14,14)" mono />
        <SpecRow label="Corner nodes" value="r=2.5 at corners" mono />
        <SpecRow label="Stroke width" value="1.2px" mono />
        <SpecRow label="Hover rotation" value="90deg" mono />
        <SpecRow label="Hover curve" value="ease-spring (0.34, 1.56, 0.64, 1)" mono />
        <SpecRow label="Hover duration" value="450ms" mono />
      </div>

      <ReasonBlock>
        The mark is not a logo in the traditional sense. It is a diagram of
        relationships: four outer entities connecting to one center, with
        decreasing opacity representing distance or maturity. The rotation on
        hover reinforces that this is a living network, not a static stamp.
      </ReasonBlock>
    </GuideSection>
  )
}
