"use client"

import { useRef, useEffect, useState, useCallback } from "react"
import { cn } from "@/lib/utils"

/**
 * Industry-color mapping for active filter pills.
 * When a filter is active, its pill tints to match the industry's tag color.
 * This creates a direct visual relationship: the pill you select matches
 * the cards it reveals. "All" uses the signal green (brand neutral).
 */
const filterColors: Record<string, { bg: string; text: string; border: string }> = {
  "All":              { bg: "bg-signal-soft", text: "text-signal", border: "border-signal-mist" },
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
  const containerRef = useRef<HTMLDivElement>(null)
  const [indicator, setIndicator] = useState({ left: 0, width: 0 })
  const [indicatorColor, setIndicatorColor] = useState("")
  const [mounted, setMounted] = useState(false)

  const updateIndicator = useCallback(() => {
    if (!containerRef.current) return
    const activeEl = containerRef.current.querySelector<HTMLButtonElement>(
      `[data-filter-active="true"]`
    )
    if (activeEl) {
      const containerRect = containerRef.current.getBoundingClientRect()
      const activeRect = activeEl.getBoundingClientRect()
      setIndicator({
        left: activeRect.left - containerRect.left,
        width: activeRect.width,
      })
    }
  }, [])

  useEffect(() => {
    setMounted(true)
    const timer = setTimeout(updateIndicator, 20)
    return () => clearTimeout(timer)
  }, [updateIndicator])

  useEffect(() => {
    updateIndicator()
    // Resolve the active filter's background color for the sliding indicator
    const colors = filterColors[activeFilter]
    if (colors) {
      // Extract hex from bg class or fall back to CSS var
      const match = colors.bg.match(/#[A-Fa-f0-9]+/)
      setIndicatorColor(match ? match[0] : "var(--signal-soft)")
    } else {
      setIndicatorColor("var(--signal-soft)")
    }
  }, [activeFilter, updateIndicator])

  return (
    <div
      ref={containerRef}
      className={cn("relative flex flex-wrap gap-2", className)}
    >
      {/* Sliding background indicator — color matches the active industry */}
      {mounted && indicator.width > 0 && (
        <div
          className="absolute top-0 h-full rounded-full pointer-events-none"
          style={{
            left: indicator.left,
            width: indicator.width,
            backgroundColor: indicatorColor,
            transition: "left 280ms cubic-bezier(0.16, 1, 0.3, 1), width 280ms cubic-bezier(0.16, 1, 0.3, 1), background-color 280ms ease",
            zIndex: 0,
          }}
        />
      )}

      {filters.map((filter) => {
        const isActive = filter === activeFilter
        const colors = filterColors[filter] ?? filterColors["All"]
        return (
          <button
            key={filter}
            data-filter-active={isActive}
            onClick={() => onFilterChange(filter)}
            className={cn(
              "relative z-10 font-sans text-sm font-medium px-[22px] py-2.5 rounded-full border cursor-pointer",
              "transition-colors duration-[200ms]",
              "focus-ring",
              isActive
                ? `bg-transparent border-transparent ${colors.text}`
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
