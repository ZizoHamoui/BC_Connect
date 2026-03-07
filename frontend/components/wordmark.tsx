import { LatticeMark } from "./lattice-mark"

interface WordmarkProps {
  size?: "nav" | "footer" | "brand"
  variant?: "light" | "dark" | "signal"
  className?: string
}

const sizeConfig = {
  nav: { text: "text-[22px]", svg: 22, gap: "gap-[10px]" },
  footer: { text: "text-[24px]", svg: 22, gap: "gap-[10px]" },
  brand: { text: "text-[32px]", svg: 28, gap: "gap-3" },
}

export function Wordmark({ size = "nav", variant = "light", className }: WordmarkProps) {
  const config = sizeConfig[size]
  const textColor =
    variant === "dark"
      ? "text-white"
      : variant === "signal"
        ? "text-signal"
        : "text-ink-900"

  return (
    <span
      className={`font-display ${config.text} tracking-[-0.01em] flex items-center ${config.gap} ${textColor} ${className ?? ""}`}
    >
      <LatticeMark size={config.svg} variant={variant} />
      {"BC"}
      <span className="font-sans font-light opacity-35">{"·"}</span>
      {"Connect"}
    </span>
  )
}
