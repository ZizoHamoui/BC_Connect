"use client"

import { useState } from "react"
import { SearchBar } from "@/components/search-bar"
import { FilterPills } from "@/components/filter-pills"
import { GuideSection, ReasonBlock } from "./guide-section"

export function SectionInputs() {
  const [activeFilter, setActiveFilter] = useState("All")

  return (
    <GuideSection
      id="inputs"
      title="Inputs & Filters"
      subtitle="Search bars and filter pills are the primary control surfaces. They transition from neutral ground to active white on focus."
    >
      {/* Search bar states */}
      <h3 className="font-display text-[20px] text-foreground mb-5">Search Bar</h3>
      <p className="text-[13px] text-ink-400 mb-6 max-w-[520px]">
        At rest: cloud background, no border, icon in ink-300.
        On focus: white background, fog border appears, icon turns signal-green, shadow-sm materializes.
        The nav variant also widens from 220px to 280px on focus.
      </p>

      <div className="flex flex-col gap-6 mb-14">
        <div>
          <span className="font-mono text-[11px] text-ink-300 uppercase tracking-wider mb-3 block">
            Default (page level)
          </span>
          <SearchBar placeholder="Search startups, industries, regions..." />
        </div>
        <div>
          <span className="font-mono text-[11px] text-ink-300 uppercase tracking-wider mb-3 block">
            Nav variant (compact, expands on focus)
          </span>
          <SearchBar variant="nav" placeholder="Search..." />
        </div>
      </div>

      {/* Filter pills */}
      <h3 className="font-display text-[20px] text-foreground mb-5">Filter Pills</h3>
      <p className="text-[13px] text-ink-400 mb-6 max-w-[520px]">
        The active pill gets a sliding ink-900 background indicator that animates via CSS
        transitions. The indicator measures the active button{"'"}s position with refs and
        slides to match. Inactive pills warm to off-white on hover.
      </p>

      <div className="mb-10">
        <FilterPills
          filters={["All", "Technology", "Clean Energy", "Health & Life", "Media", "Agriculture"]}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />
      </div>

      {/* Input spec */}
      <h3 className="font-display text-[20px] text-foreground mb-5">State Transitions</h3>
      <div className="border border-border rounded-[var(--r-lg)] overflow-hidden mb-6">
        <div className="grid grid-cols-[100px_1fr_1fr] gap-0 bg-cloud px-6 py-3 border-b border-border">
          <span className="font-mono text-[11px] font-semibold text-ink-400 uppercase tracking-wider">State</span>
          <span className="font-mono text-[11px] font-semibold text-ink-400 uppercase tracking-wider">Search Bar</span>
          <span className="font-mono text-[11px] font-semibold text-ink-400 uppercase tracking-wider">Filter Pill</span>
        </div>
        {[
          { state: "Rest", search: "bg: cloud, border: none, icon: ink-300", pill: "bg: white, border: mist, text: ink-500" },
          { state: "Hover", search: "(same as rest, no hover change)", pill: "bg: off-white, border: fog, text: foreground" },
          { state: "Focus", search: "bg: white, border: fog, icon: signal, shadow-sm", pill: "focus-ring (2+4px)" },
          { state: "Active", search: "n/a", pill: "bg: ink-900 (sliding), text: white" },
        ].map((row, i) => (
          <div key={row.state} className={`grid grid-cols-[100px_1fr_1fr] gap-0 px-6 py-3.5 ${i < 3 ? "border-b border-border" : ""}`}>
            <span className="font-mono text-[13px] font-medium text-signal">{row.state}</span>
            <span className="text-[12px] text-ink-400">{row.search}</span>
            <span className="text-[12px] text-ink-400">{row.pill}</span>
          </div>
        ))}
      </div>

      <ReasonBlock>
        The search bar uses a cloud-to-white transition rather than a
        border-appear because it matches the &quot;ground before signal&quot; principle:
        the resting state blends into the page, focus elevates it. The sliding pill
        indicator gives spatial continuity, your eye follows the dark pill moving
        to the new position rather than two elements snapping independently.
      </ReasonBlock>
    </GuideSection>
  )
}
