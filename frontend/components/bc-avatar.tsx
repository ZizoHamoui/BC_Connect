import { cn } from "@/lib/utils"

interface BcAvatarProps {
  initials: string
  size?: "sm" | "md" | "lg"
  className?: string
}

const sizeMap = {
  sm: "w-7 h-7 text-[11px]",
  md: "w-9 h-9 text-sm",
  lg: "w-12 h-12 text-lg",
}

export function BcAvatar({ initials, size = "md", className }: BcAvatarProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full bg-signal-soft text-signal font-semibold",
        "ring-2 ring-transparent transition-all duration-200 hover:ring-signal-mist hover:shadow-[0_0_0_4px_rgba(27,107,79,0.06)]",
        sizeMap[size],
        className
      )}
    >
      {initials}
    </span>
  )
}
