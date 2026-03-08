import { IndustryTag } from "./industry-tag"
import { ArrowUpRight } from "lucide-react"
import { cn } from "@/lib/utils"

export interface Job {
  id: string
  title: string
  company: string
  location: string
  type: string
  salary: string
  industry: string
  initial: string
  gradientFrom: string
  gradientTo: string
  initialColor: string
}

interface JobCardProps {
  job: Job
}

export function JobCard({ job }: JobCardProps) {
  return (
    <article
      className={cn(
        "group flex gap-5 p-6 border border-border rounded-[var(--r-lg)] cursor-pointer bg-card",
        "row-highlight focus-ring"
      )}
      role="button"
      tabIndex={0}
    >
      {/* Logo */}
      <div
        className="w-14 h-14 rounded-[var(--r-md)] shrink-0 flex items-center justify-center border border-border"
        style={{
          background: `linear-gradient(135deg, ${job.gradientFrom}, ${job.gradientTo})`,
        }}
      >
        <span
          className="font-display text-[20px]"
          style={{ color: job.initialColor }}
        >
          {job.initial}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="text-base font-semibold text-foreground tracking-[-0.01em] mb-0.5">
          {job.title}
        </div>
        <div className="text-[15px] font-semibold text-signal mb-2">
          {job.company}
        </div>
        <div className="flex gap-4 text-[13px] text-ink-300">
          <span>{job.location}</span>
          <span>{"·"}</span>
          <span>{job.type}</span>
          <span>{"·"}</span>
          <span>{job.salary}</span>
        </div>
      </div>

      {/* Tag + arrow */}
      <div className="shrink-0 flex flex-col items-end justify-between">
        <IndustryTag industry={job.industry} />
        <ArrowUpRight className="w-4 h-4 text-ink-200 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-hover:text-signal" />
      </div>
    </article>
  )
}
