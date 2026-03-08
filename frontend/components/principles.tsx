import { cn } from "@/lib/utils"

const principles = [
  {
    num: "01",
    title: "Centralized Discovery",
    desc: "One source of truth for every startup in British Columbia. No more navigating fragmented directories and outdated listings.",
  },
  {
    num: "02",
    title: "Visual + Data",
    desc: "Browse businesses on an interactive map or as filterable cards. Switch views instantly, search by industry, region, or keyword.",
  },
  {
    num: "03",
    title: "Built for Connection",
    desc: "Save startups, get personalized recommendations, and build your own network across BC's innovation ecosystem.",
  },
]

export function Principles() {
  return (
    <section className="border-t border-border py-[120px] max-[960px]:py-20">
      <div className="max-w-[1200px] mx-auto px-12 max-[960px]:px-6">
        <div className="font-mono text-[11px] font-medium tracking-[0.14em] uppercase text-ink-300 mb-4">
          {"01 \u2014 Why BC Connect"}
        </div>
        <h2 className="font-display text-[72px] max-[960px]:text-[40px] font-normal leading-[0.95] tracking-[-0.03em] text-foreground mb-6 text-balance">
          One ecosystem.
          <br />
          <span className="text-ink-400">One place.</span>
        </h2>
        <p className="text-lg font-light text-ink-400 max-w-[560px] leading-relaxed mb-20">
          {
            "BC Connect brings every startup, every industry, and every region into a single, searchable platform."
          }
        </p>

        <div className="grid grid-cols-3 max-[960px]:grid-cols-1 gap-6">
          {principles.map((p, i) => (
            <article
              key={p.num}
              className={cn(
                "group principle-bar py-11 px-9 border border-border rounded-[var(--r-lg)] bg-card",
                "card-activate animate-fade-up"
              )}
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="font-display text-[56px] text-signal opacity-15 leading-none mb-6 transition-opacity duration-300 group-hover:opacity-30">
                {p.num}
              </div>
              <h3 className="font-display text-[26px] font-normal leading-[1.15] tracking-[-0.01em] text-foreground mb-3">
                {p.title}
              </h3>
              <p className="text-[15px] text-ink-500 leading-relaxed">{p.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
