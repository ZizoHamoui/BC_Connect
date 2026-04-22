import Link from "next/link"
import { Wordmark } from "./wordmark"

export function Footer() {
  return (
    <footer className="border-t border-border py-20 text-center">
      <Link href="/" className="lattice-hover inline-flex items-center justify-center mb-2">
        <Wordmark size="footer" />
      </Link>
      <p className="font-mono text-[11px] text-ink-300 tracking-[0.08em]">
        {"BC's Startup Ecosystem Directory \u2014 Open Ground \u2014 2026"}
      </p>
    </footer>
  )
}
