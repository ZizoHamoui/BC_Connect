"use client"

import { cn } from "@/lib/utils"

interface StatCardProps {
  label: string
  value: string
  delta?: { type: "up" | "down" | "neutral"; text: string }
  index?: number
}

export function StatCard({ label, value, delta, index = 0 }: StatCardProps) {
  const deltaColor =
    delta?.type === "up"
      ? "text-signal"
      : delta?.type === "down"
        ? "text-[#B33B2E]"
        : "text-ink-300"

  const deltaPrefix =
    delta?.type === "up" ? "\u2191 " : delta?.type === "down" ? "\u2193 " : "\u2014 "

  return (
    <div
      className={cn(
        "group p-8 border border-border rounded-[var(--r-lg)] bg-card",
        "card-activate animate-fade-up"
      )}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="text-[13px] font-medium text-ink-400 uppercase tracking-[0.04em] mb-2">
        {label}
      </div>
      <div className="font-display text-[48px] text-foreground leading-none tracking-[-0.02em] mb-1.5 transition-colors duration-300 group-hover:text-signal">
        {value}
      </div>
      {delta && (
        <div className={cn("font-mono text-xs", deltaColor)}>
          {deltaPrefix}
          {delta.text}
        </div>
      )}
    </div>
  )
}
