"use client"

import { Search } from "lucide-react"
import { cn } from "@/lib/utils"

interface SearchBarProps {
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  variant?: "default" | "nav"
  className?: string
}

export function SearchBar({
  placeholder = "Search startups, people, industries...",
  value,
  onChange,
  variant = "default",
  className,
}: SearchBarProps) {
  const isNav = variant === "nav"

  return (
    <div
      className={cn(
        "group flex items-center bg-cloud border border-transparent rounded-[var(--r-lg)] focus-ring",
        "focus-within:bg-background focus-within:border-fog focus-within:shadow-[var(--shadow-sm)]",
        isNav
          ? "gap-2 px-3.5 py-2 w-[220px] search-expand"
          : "gap-3 px-5 py-3.5 max-w-[480px] transition-all duration-200",
        className
      )}
    >
      <Search
        className={cn(
          "shrink-0 text-ink-300 transition-colors duration-200 group-focus-within:text-signal",
          isNav ? "w-3.5 h-3.5" : "w-4 h-4"
        )}
        strokeWidth={2}
      />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className={cn(
          "border-none bg-transparent font-sans text-foreground outline-none w-full placeholder:text-ink-200",
          isNav ? "text-[13px]" : "text-[15px]"
        )}
      />
    </div>
  )
}
