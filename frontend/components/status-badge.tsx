const badgeStyles = {
  positive: "bg-[#E6F3EE] text-[#1B6B4F]",
  caution: "bg-[#FEF8E7] text-[#92700C]",
  negative: "bg-[#FDF0EE] text-[#B33B2E]",
  info: "bg-[#EBF2FC] text-[#3568B2]",
}

interface StatusBadgeProps {
  variant: keyof typeof badgeStyles
  children: React.ReactNode
  className?: string
}

export function StatusBadge({ variant, children, className }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center text-xs font-medium px-2.5 py-[3px] rounded-full ${badgeStyles[variant]} ${className ?? ""}`}
    >
      {children}
    </span>
  )
}
