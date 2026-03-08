import { StatCard } from "./stat-card"

const stats = [
  { label: "Startups Listed", value: "2,847", delta: { type: "up" as const, text: "12% this month" } },
  { label: "Active Jobs", value: "634", delta: { type: "up" as const, text: "8% this month" } },
  { label: "Events This Week", value: "18", delta: { type: "down" as const, text: "3%" } },
  { label: "Regions Covered", value: "8", delta: { type: "neutral" as const, text: "all BC" } },
]

export function StatsSection() {
  return (
    <section className="border-t border-border py-[120px] max-[960px]:py-20">
      <div className="max-w-[1200px] mx-auto px-12 max-[960px]:px-6">
        <div className="font-mono text-[11px] font-medium tracking-[0.14em] uppercase text-ink-300 mb-4">
          {"02 \u2014 The Ecosystem"}
        </div>
        <h2 className="font-display text-[72px] max-[960px]:text-[40px] font-normal leading-[0.95] tracking-[-0.03em] text-foreground mb-6 text-balance">
          Growing fast.
        </h2>
        <p className="text-lg font-light text-ink-400 max-w-[560px] leading-relaxed mb-20">
          {
            "British Columbia's startup ecosystem is one of the most dynamic in North America. Here's a snapshot."
          }
        </p>

        <div className="grid grid-cols-4 max-[960px]:grid-cols-2 gap-6">
          {stats.map((stat, i) => (
            <StatCard key={stat.label} {...stat} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
