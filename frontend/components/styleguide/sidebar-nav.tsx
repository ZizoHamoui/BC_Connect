"use client"

import { cn } from "@/lib/utils"

const sections = [
  { id: "philosophy", label: "Philosophy" },
  { id: "brand", label: "Brand Mark" },
  { id: "colors", label: "Colors" },
  { id: "typography", label: "Typography" },
  { id: "spacing", label: "Spacing & Radius" },
  { id: "motion", label: "Motion" },
  { id: "buttons", label: "Buttons" },
  { id: "inputs", label: "Inputs" },
  { id: "tags-badges", label: "Tags & Badges" },
  { id: "cards", label: "Cards" },
  { id: "navigation", label: "Navigation" },
  { id: "interactions", label: "Interactions" },
]

interface SidebarNavProps {
  activeSection: string
}

export function SidebarNav({ activeSection }: SidebarNavProps) {
  return (
    <nav className="sticky top-24 w-[200px] shrink-0 max-[1060px]:hidden">
      <div className="text-[11px] font-mono font-medium uppercase tracking-[0.1em] text-ink-300 mb-4">
        Contents
      </div>
      <ul className="flex flex-col gap-0.5">
        {sections.map((s) => (
          <li key={s.id}>
            <a
              href={`#${s.id}`}
              className={cn(
                "block text-[13px] font-medium py-1.5 px-3 rounded-[var(--r-sm)] transition-all duration-150",
                activeSection === s.id
                  ? "text-signal bg-signal-soft"
                  : "text-ink-400 hover:text-foreground hover:bg-off-white"
              )}
            >
              {s.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export { sections }
