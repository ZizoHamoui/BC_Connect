interface LatticeMarkProps {
  size?: number
  variant?: "light" | "dark" | "signal"
  className?: string
}

export function LatticeMark({ size = 28, variant = "light", className }: LatticeMarkProps) {
  const color = variant === "dark" ? "#4EE0B8" : "#1B6B4F"

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 28 28"
      fill="none"
      className={`lattice-mark ${className ?? ""}`}
      aria-hidden="true"
    >
      <circle cx="4" cy="4" r="2.5" fill={color} />
      <circle cx="24" cy="4" r="2.5" fill={color} opacity="0.5" />
      <circle cx="4" cy="24" r="2.5" fill={color} opacity="0.5" />
      <circle cx="24" cy="24" r="2.5" fill={color} opacity="0.3" />
      <circle cx="14" cy="14" r="3" fill={color} />
      {/* Diagonals — corners to center */}
      <line x1="4" y1="4" x2="14" y2="14" stroke={color} strokeWidth="1.2" opacity="0.5" />
      <line x1="24" y1="4" x2="14" y2="14" stroke={color} strokeWidth="1.2" opacity="0.35" />
      <line x1="4" y1="24" x2="14" y2="14" stroke={color} strokeWidth="1.2" opacity="0.35" />
      <line x1="24" y1="24" x2="14" y2="14" stroke={color} strokeWidth="1.2" opacity="0.2" />
      {/* Edges — corner to corner */}
      <line x1="4" y1="4" x2="24" y2="4" stroke={color} strokeWidth="1.2" opacity="0.35" />
      <line x1="24" y1="4" x2="24" y2="24" stroke={color} strokeWidth="1.2" opacity="0.25" />
      <line x1="24" y1="24" x2="4" y2="24" stroke={color} strokeWidth="1.2" opacity="0.25" />
      <line x1="4" y1="24" x2="4" y2="4" stroke={color} strokeWidth="1.2" opacity="0.35" />
    </svg>
  )
}
