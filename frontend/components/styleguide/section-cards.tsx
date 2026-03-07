"use client"

import { BusinessCard } from "@/components/business-card"
import { JobCard } from "@/components/job-card"
import { StatCard } from "@/components/stat-card"
import { EmptyState } from "@/components/empty-state"
import { sampleBusinesses } from "@/lib/sample-data"
import { GuideSection, ReasonBlock } from "./guide-section"

const sampleJob = {
  id: "1",
  title: "Senior ML Engineer",
  company: "Rainforest AI",
  location: "Vancouver, BC",
  type: "Full-time",
  salary: "$130K-$165K",
  industry: "Technology",
  initial: "R",
  gradientFrom: "#EFF2FA",
  gradientTo: "#c9d4ed",
  initialColor: "#3568B2",
}

export function SectionCards() {
  return (
    <GuideSection
      id="cards"
      title="Cards"
      subtitle="Business cards, job cards, stat cards, and empty states. Each card type has its own hover personality but shares the same interaction foundation."
    >
      {/* Business cards */}
      <h3 className="font-display text-[20px] text-foreground mb-3">Business Card</h3>
      <p className="text-[13px] text-ink-400 mb-6 max-w-[560px]">
        The core content unit. Hover triggers four simultaneous effects: (1) image area scales 4%
        inside its overflow-hidden container, (2) border warms from mist to signal-mist,
        (3) a translucent arrow-up-right fades in at top-right, (4) the title shifts to signal-green.
        Card lifts 2px. Duration: 280ms ease-out.
      </p>
      <div className="grid grid-cols-3 max-[960px]:grid-cols-1 gap-6 mb-14">
        {sampleBusinesses.slice(0, 3).map((b) => (
          <BusinessCard key={b.id} business={b} onClick={() => {}} />
        ))}
      </div>

      {/* Job cards */}
      <h3 className="font-display text-[20px] text-foreground mb-3">Job Card</h3>
      <p className="text-[13px] text-ink-400 mb-6 max-w-[560px]">
        Horizontal row layout. Hover: slides 4px right (not up, because it is a list), background warms
        to off-white, border activates to signal-mist. Company logo scales 5%. Arrow slides in from right.
        Duration: 200ms ease-out.
      </p>
      <div className="flex flex-col gap-3 max-w-[700px] mb-14">
        <JobCard job={sampleJob} />
        <JobCard
          job={{
            ...sampleJob,
            id: "2",
            title: "Product Designer",
            company: "Tidal Works",
            industry: "Clean Energy",
            initial: "T",
            gradientFrom: "#E6F3EE",
            gradientTo: "#b8d4c6",
            initialColor: "#1B6B4F",
            salary: "$95K-$120K",
          }}
        />
      </div>

      {/* Stat cards */}
      <h3 className="font-display text-[20px] text-foreground mb-3">Stat Card</h3>
      <p className="text-[13px] text-ink-400 mb-6 max-w-[560px]">
        Large display numbers using Instrument Serif at 48px. Hover: the number shifts to signal-green.
        Cards use the shared card-activate pattern (lift + border warm). Entrance: staggered fade-up at 80ms intervals.
      </p>
      <div className="grid grid-cols-3 max-[960px]:grid-cols-1 gap-6 mb-14">
        <StatCard label="Active Startups" value="2,847" delta={{ type: "up", text: "+12% this quarter" }} index={0} />
        <StatCard label="BC Regions" value="8" index={1} />
        <StatCard label="Open Roles" value="1,203" delta={{ type: "up", text: "+8% this month" }} index={2} />
      </div>

      {/* Empty state */}
      <h3 className="font-display text-[20px] text-foreground mb-3">Empty State</h3>
      <p className="text-[13px] text-ink-400 mb-6 max-w-[560px]">
        Dashed border container with centered search icon. Used when filters return zero results.
        The clear-filters button uses the secondary button pattern.
      </p>
      <div className="max-w-[600px] mb-6">
        <EmptyState onClearFilters={() => {}} />
      </div>

      <ReasonBlock>
        Business cards zoom their image while the card boundary stays fixed:
        this avoids layout shift in the grid while still creating a sense of
        opening up. Job cards move horizontally because lists read left-to-right;
        vertical lift would fight the scan direction. Stat card numbers turning
        green on hover is the only color change, because those numbers are the
        signal.
      </ReasonBlock>
    </GuideSection>
  )
}
