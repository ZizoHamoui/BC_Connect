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
  if (size === "nav") {
    return (
      <div className="flex items-center gap-2">
        <svg className="transition-transform duration-700 group-hover:rotate-180" width="32" height="32" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="8.33333" cy="8.33333" r="4.33333" fill="#19694D"/>
          <circle cx="24.2222" cy="22.7778" r="5.77778" fill="#19694D"/>
          <rect x="11.0446" y="8.6862" width="39.9836" height="3.33527" rx="1.66764" transform="rotate(45 11.0446 8.6862)" fill="#19694D" fillOpacity="0.4"/>
          <rect x="25.7604" y="19.1789" width="15.2996" height="3.33527" rx="1.66764" transform="rotate(-45 25.7604 19.1789)" fill="#19694D" fillOpacity="0.8"/>
          <rect x="9.48482" y="35.3608" width="15.7523" height="3.33527" rx="1.66764" transform="rotate(-45 9.48482 35.3608)" fill="#19694D" fillOpacity="0.8"/>
          <path d="M35.7778 8.33333C35.7778 5.9401 37.7179 4 40.1111 4C42.5043 4 44.4444 5.9401 44.4444 8.33333C44.4444 10.7266 42.5043 12.6667 40.1111 12.6667C37.7179 12.6667 35.7778 10.7266 35.7778 8.33333Z" fill="#478771"/>
          <path d="M4 38.6667C4 36.2734 5.9401 34.3333 8.33333 34.3333C10.7266 34.3333 12.6667 36.2734 12.6667 38.6667C12.6667 41.0599 10.7266 43 8.33333 43C5.9401 43 4 41.0599 4 38.6667Z" fill="#75A594"/>
          <path d="M35.7778 38.6667C35.7778 36.2734 37.7179 34.3333 40.1111 34.3333C42.5043 34.3333 44.4444 36.2734 44.4444 38.6667C44.4444 41.0599 42.5043 43 40.1111 43C37.7179 43 35.7778 41.0599 35.7778 38.6667Z" fill="#A3C3B8"/>
          <circle cx="24.2222" cy="22.7778" r="5.77778" fill="url(#paint0_radial_nav)"/>
          <defs>
            <radialGradient id="paint0_radial_nav" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(24.2222 22.7778) rotate(90) scale(5.77778)">
              <stop offset="0.788462" stopColor="#19694D"/>
              <stop offset="1" stopColor="#31CF98"/>
            </radialGradient>
          </defs>
        </svg>
        <span className="font-semibold text-[15px] tracking-tight text-foreground">BC Connect</span>
      </div>
    );
  }

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
