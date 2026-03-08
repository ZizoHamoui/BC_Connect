import { GuideSection, ReasonBlock } from "./guide-section"

interface SwatchProps {
  name: string
  hex: string
  token: string
  textDark?: boolean
}

function Swatch({ name, hex, token, textDark = false }: SwatchProps) {
  return (
    <div className="group">
      <div
        className="w-full h-20 rounded-[var(--r-md)] border border-border mb-3 transition-[border-color] duration-200 group-hover:border-fog"
        style={{ backgroundColor: hex }}
      />
      <div className={`text-[13px] font-semibold ${textDark ? "text-foreground" : "text-foreground"}`}>
        {name}
      </div>
      <div className="font-mono text-[11px] text-ink-300">{hex}</div>
      <div className="font-mono text-[11px] text-ink-200">{token}</div>
    </div>
  )
}

export function SectionColors() {
  return (
    <GuideSection
      id="colors"
      title="Color System"
      subtitle="32 tokens organized into Ground, Ink, Signal, Semantic, Data, and Industry layers. Ground occupies 80% of any screen."
    >
      {/* Ground */}
      <h3 className="font-display text-[20px] text-foreground mb-5">Ground Colors</h3>
      <p className="text-[13px] text-ink-400 mb-6 max-w-[520px]">
        The base layer. These five neutrals form the spatial canvas that everything rests on.
        White is the default surface. Off-white is secondary. Cloud fills inputs at rest. Mist is borders. Fog is dividers.
      </p>
      <div className="grid grid-cols-5 max-[960px]:grid-cols-3 gap-4 mb-14">
        <Swatch name="White" hex="#FFFFFF" token="--white" />
        <Swatch name="Off-White" hex="#FAFBFC" token="--off-white" />
        <Swatch name="Cloud" hex="#F3F4F6" token="--cloud" />
        <Swatch name="Mist" hex="#E8EAED" token="--mist" />
        <Swatch name="Fog" hex="#D1D5DB" token="--fog" />
      </div>

      {/* Ink */}
      <h3 className="font-display text-[20px] text-foreground mb-5">Ink Colors</h3>
      <p className="text-[13px] text-ink-400 mb-6 max-w-[520px]">
        Text and icon hierarchy. Ink-900 is the only truly dark value and is reserved for headings, active states, and primary actions.
      </p>
      <div className="grid grid-cols-6 max-[960px]:grid-cols-3 gap-4 mb-14">
        <Swatch name="Ink 900" hex="#111218" token="--ink-900" />
        <Swatch name="Ink 700" hex="#2C2F36" token="--ink-700" />
        <Swatch name="Ink 500" hex="#4B5162" token="--ink-500" />
        <Swatch name="Ink 400" hex="#6B7080" token="--ink-400" />
        <Swatch name="Ink 300" hex="#8B90A0" token="--ink-300" />
        <Swatch name="Ink 200" hex="#B8BCCA" token="--ink-200" />
      </div>

      {/* Signal */}
      <h3 className="font-display text-[20px] text-foreground mb-5">Signal (Brand)</h3>
      <p className="text-[13px] text-ink-400 mb-6 max-w-[520px]">
        Signal Green is the single brand accent. It enters the composition only when something
        meaningful is happening: an active state, a hover, a verified badge, a link. It is never
        decorative.
      </p>
      <div className="grid grid-cols-4 max-[960px]:grid-cols-2 gap-4 mb-14">
        <Swatch name="Signal" hex="#1B6B4F" token="--signal" />
        <Swatch name="Signal Hover" hex="#155A42" token="--signal-hover" />
        <Swatch name="Signal Soft" hex="#E6F3EE" token="--signal-soft" />
        <Swatch name="Signal Mist" hex="#D0E8DD" token="--signal-mist" />
      </div>

      {/* Semantic */}
      <h3 className="font-display text-[20px] text-foreground mb-5">Semantic Colors</h3>
      <p className="text-[13px] text-ink-400 mb-6 max-w-[520px]">
        Four semantic pairs for system feedback. Each has a foreground and background token. Signal Green doubles as Positive.
      </p>
      <div className="grid grid-cols-4 max-[960px]:grid-cols-2 gap-5 mb-14">
        {[
          { label: "Positive", fg: "#1B6B4F", bg: "#E6F3EE" },
          { label: "Caution", fg: "#92700C", bg: "#FEF8E7" },
          { label: "Negative", fg: "#B33B2E", bg: "#FDF0EE" },
          { label: "Info", fg: "#3568B2", bg: "#EBF2FC" },
        ].map((s) => (
          <div key={s.label}>
            <div
              className="flex items-center justify-center h-16 rounded-[var(--r-md)] text-[13px] font-semibold mb-2"
              style={{ backgroundColor: s.bg, color: s.fg }}
            >
              {s.label}
            </div>
            <div className="font-mono text-[11px] text-ink-300">{s.fg} / {s.bg}</div>
          </div>
        ))}
      </div>

      {/* Industry */}
      <h3 className="font-display text-[20px] text-foreground mb-5">Industry Tag Colors</h3>
      <p className="text-[13px] text-ink-400 mb-6 max-w-[520px]">
        Six industry-specific pairs used exclusively for tag components. They provide just enough color to differentiate categories without creating visual chaos.
      </p>
      <div className="grid grid-cols-3 max-[960px]:grid-cols-2 gap-4 mb-6">
        {[
          { label: "Technology", bg: "#EFF2FA", fg: "#3568B2" },
          { label: "Clean Energy", bg: "#E6F3EE", fg: "#1B6B4F" },
          { label: "Health & Life", bg: "#FDF4EB", fg: "#C07A28" },
          { label: "Media", bg: "#F8EEF5", fg: "#9B4D83" },
          { label: "Agriculture", bg: "#EEF5E6", fg: "#4D7C2A" },
          { label: "Manufacturing", bg: "#FEF8E7", fg: "#92700C" },
        ].map((tag) => (
          <div
            key={tag.label}
            className="flex items-center gap-3 p-4 rounded-[var(--r-md)] border border-border"
          >
            <span
              className="inline-flex items-center text-xs font-medium px-3 py-1 rounded-full"
              style={{ backgroundColor: tag.bg, color: tag.fg }}
            >
              {tag.label}
            </span>
            <span className="font-mono text-[10px] text-ink-300">{tag.fg}</span>
          </div>
        ))}
      </div>

      <ReasonBlock>
        The color system is deliberately austere. Eighty percent of any screen
        is Ground (white/off-white/cloud). Signal Green enters only on
        interaction or meaning. This is how we keep the directory feeling calm
        even at 2,800+ entries.
      </ReasonBlock>
    </GuideSection>
  )
}
