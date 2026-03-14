"use client"

import { cn } from "@/lib/utils"

const filterColors: Record<string, { bg: string; text: string; border: string }> = {
  "All":              { bg: "bg-signal-soft", text: "text-signal", border: "border-signal-mist" },
  "All Regions":      { bg: "bg-signal-soft", text: "text-signal", border: "border-signal-mist" },
  "Technology":       { bg: "bg-[#EFF2FA]", text: "text-[#3568B2]", border: "border-[#c9d4ed]" },
  "Clean Energy":     { bg: "bg-[#E6F3EE]", text: "text-[#1B6B4F]", border: "border-[#D0E8DD]" },
  "Health & Life":    { bg: "bg-[#FDF4EB]", text: "text-[#C07A28]", border: "border-[#edd0ab]" },
  "Media":            { bg: "bg-[#F8EEF5]", text: "text-[#9B4D83]", border: "border-[#ddc0d5]" },
  "Agriculture":      { bg: "bg-[#EEF5E6]", text: "text-[#4D7C2A]", border: "border-[#c8dbb5]" },
  "Manufacturing":    { bg: "bg-[#FEF8E7]", text: "text-[#92700C]", border: "border-[#ecdaab]" },
}

interface FilterPillsProps {
  filters: string[]
  activeFilter: string
  onFilterChange: (filter: string) => void
  className?: string
}

export function FilterPills({ filters, activeFilter, onFilterChange, className }: FilterPillsProps) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {filters.map((filter) => {
        const isActive = filter === activeFilter
        const colors = filterColors[filter] ?? filterColors["All"]
        return (
          <button
            key={filter}
            onClick={() => onFilterChange(filter)}
            className={cn(
              "font-sans text-sm font-medium px-[22px] py-2.5 rounded-full border cursor-pointer",
              "transition-colors duration-[200ms]",
              "focus-ring",
              isActive
                ? `${colors.bg} ${colors.border} ${colors.text}`
                : "bg-card border-border text-ink-400 hover:border-fog hover:text-foreground"
            )}
          >
            {filter}
          </button>
        )
      })}
    </div>
  )
}
