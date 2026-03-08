import { JobCard, type Job } from "./job-card"

const sampleJobs: Job[] = [
  {
    id: "1",
    title: "Senior ML Engineer",
    company: "Rainforest AI",
    location: "Vancouver, BC",
    type: "Full-time",
    salary: "$140k\u2013$180k",
    industry: "Technology",
    initial: "R",
    gradientFrom: "#E6F3EE",
    gradientTo: "#D0E8DD",
    initialColor: "#1B6B4F",
  },
  {
    id: "2",
    title: "Product Designer",
    company: "Tidal Works",
    location: "Victoria, BC",
    type: "Full-time",
    salary: "$95k\u2013$120k",
    industry: "Clean Energy",
    initial: "T",
    gradientFrom: "#FDF4EB",
    gradientTo: "#f5e0c8",
    initialColor: "#C07A28",
  },
  {
    id: "3",
    title: "Full-Stack Developer",
    company: "Orca Health",
    location: "Remote (BC)",
    type: "Contract",
    salary: "$80/hr",
    industry: "Health & Life",
    initial: "O",
    gradientFrom: "#F8EEF5",
    gradientTo: "#ebd6e5",
    initialColor: "#7B5EA7",
  },
]

export function JobsSection() {
  return (
    <section className="border-t border-border py-[120px] max-[960px]:py-20">
      <div className="max-w-[1200px] mx-auto px-12 max-[960px]:px-6">
        <div className="font-mono text-[11px] font-medium tracking-[0.14em] uppercase text-ink-300 mb-4">
          {"04 \u2014 Jobs"}
        </div>
        <h2 className="font-display text-[72px] max-[960px]:text-[40px] font-normal leading-[0.95] tracking-[-0.03em] text-foreground mb-6 text-balance">
          Open roles.
        </h2>
        <p className="text-lg font-light text-ink-400 max-w-[560px] leading-relaxed mb-20">
          {
            "The latest positions from startups across BC. Engineering, design, operations, and more."
          }
        </p>

        <div className="flex flex-col gap-3">
          {sampleJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </div>
    </section>
  )
}
