interface GuideSectionProps {
  id: string
  title: string
  subtitle: string
  children: React.ReactNode
}

export function GuideSection({ id, title, subtitle, children }: GuideSectionProps) {
  return (
    <section id={id} className="scroll-mt-24 mb-24">
      <div className="border-b border-border pb-6 mb-10">
        <h2 className="font-display text-[36px] tracking-[-0.02em] text-foreground leading-tight">
          {title}
        </h2>
        <p className="text-[15px] text-ink-400 leading-relaxed mt-2 max-w-[560px]">
          {subtitle}
        </p>
      </div>
      {children}
    </section>
  )
}

interface SpecRowProps {
  label: string
  value: string
  mono?: boolean
}

export function SpecRow({ label, value, mono }: SpecRowProps) {
  return (
    <div className="flex items-baseline justify-between py-2.5 border-b border-dashed border-mist">
      <span className="text-[13px] font-medium text-ink-500">{label}</span>
      <span className={`text-[13px] ${mono ? "font-mono" : "font-medium"} text-foreground`}>
        {value}
      </span>
    </div>
  )
}

interface ReasonBlockProps {
  children: React.ReactNode
}

export function ReasonBlock({ children }: ReasonBlockProps) {
  return (
    <div className="flex gap-3 mt-6 p-4 bg-off-white rounded-[var(--r-md)] border border-border">
      <div className="w-1 shrink-0 rounded-full bg-signal" />
      <p className="text-[13px] text-ink-500 leading-relaxed italic">
        {children}
      </p>
    </div>
  )
}
