"use client"

import { useRef, useEffect, useState, useCallback } from "react"
import { cn } from "@/lib/utils"

const filterColors: Record<string, { bg: string; text: string }> = {
  All: { bg: "var(--signal-soft)", text: "text-signal" },
  Technology: { bg: "#EFF2FA", text: "text-[#3568B2]" },
  "Clean Energy": { bg: "#E6F3EE", text: "text-[#1B6B4F]" },
  "Health & Life": { bg: "#FDF4EB", text: "text-[#C07A28]" },
  "Health & Wellness": { bg: "#FDF4EB", text: "text-[#C07A28]" },
  Media: { bg: "#F8EEF5", text: "text-[#9B4D83]" },
  Agriculture: { bg: "#EEF5E6", text: "text-[#4D7C2A]" },
  Manufacturing: { bg: "#FEF8E7", text: "text-[#92700C]" },
  "Professional Services": { bg: "#F3F4F6", text: "text-[#4B5162]" },
  "Construction & Industrial": { bg: "#FEF8E7", text: "text-[#92700C]" },
  "Food & Hospitality": { bg: "#EEF5E6", text: "text-[#4D7C2A]" },
}

interface FilterPillsProps {
  filters: string[]
  activeFilter: string
  onFilterChange: (filter: string) => void
  className?: string
}

export function FilterPills({
  filters,
  activeFilter,
  onFilterChange,
  className,
}: FilterPillsProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)
  const [indicator, setIndicator] = useState({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    color: "var(--signal-soft)",
  })

  const updateIndicator = useCallback(() => {
    if (!containerRef.current) return

    const activeEl = containerRef.current.querySelector<HTMLButtonElement>(
      '[data-filter-active="true"]',
    )

    if (!activeEl) return

    const containerRect = containerRef.current.getBoundingClientRect()
    const activeRect = activeEl.getBoundingClientRect()
    const colors = filterColors[activeFilter] ?? filterColors.All

    setIndicator({
      left: activeRect.left - containerRect.left,
      top: activeRect.top - containerRect.top,
      width: activeRect.width,
      height: activeRect.height,
      color: colors.bg,
    })
  }, [activeFilter])

  useEffect(() => {
    setMounted(true)
    const timer = window.setTimeout(updateIndicator, 20)
    return () => window.clearTimeout(timer)
  }, [updateIndicator])

  useEffect(() => {
    updateIndicator()
  }, [updateIndicator, filters])

  useEffect(() => {
    if (!mounted || !containerRef.current) return

    const onResize = () => updateIndicator()
    window.addEventListener("resize", onResize)

    const observer = new ResizeObserver(() => updateIndicator())
    observer.observe(containerRef.current)

    return () => {
      window.removeEventListener("resize", onResize)
      observer.disconnect()
    }
  }, [mounted, updateIndicator])

  return (
    <div
      ref={containerRef}
      className={cn("relative flex flex-wrap items-start gap-2", className)}
    >
      {mounted && indicator.width > 0 && indicator.height > 0 && (
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            left: indicator.left,
            top: indicator.top,
            width: indicator.width,
            height: indicator.height,
            backgroundColor: indicator.color,
            transition:
              "left 280ms cubic-bezier(0.16, 1, 0.3, 1), top 280ms cubic-bezier(0.16, 1, 0.3, 1), width 280ms cubic-bezier(0.16, 1, 0.3, 1), height 280ms cubic-bezier(0.16, 1, 0.3, 1), background-color 280ms ease",
            zIndex: 0,
          }}
        />
      )}

      {filters.map((filter) => {
        const isActive = filter === activeFilter
        const colors = filterColors[filter] ?? filterColors.All

        return (
          <button
            key={filter}
            type="button"
            suppressHydrationWarning
            data-filter-active={isActive}
            onClick={() => onFilterChange(filter)}
            className={cn(
              "relative z-10 font-sans text-sm font-medium px-[22px] py-2.5 rounded-full border cursor-pointer",
              "transition-colors duration-[200ms]",
              "focus-ring",
              isActive
                ? `bg-transparent border-transparent ${colors.text}`
                : "bg-card border-border text-ink-400 hover:border-fog hover:text-foreground",
            )}
          >
            {filter}
          </button>
        )
      })}
    </div>
  )
}
