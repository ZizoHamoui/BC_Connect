import { IndustryTag } from "@/components/industry-tag"
import { StatusBadge } from "@/components/status-badge"
import { BcAvatar } from "@/components/bc-avatar"
import { GuideSection, ReasonBlock } from "./guide-section"

export function SectionTags() {
  return (
    <GuideSection
      id="tags-badges"
      title="Tags, Badges & Avatars"
      subtitle="Categorical color-coding for industry tags, semantic badges for status, and initial-based avatars for identity."
    >
      {/* Industry tags */}
      <h3 className="font-display text-[20px] text-foreground mb-5">Industry Tags</h3>
      <p className="text-[13px] text-ink-400 mb-6 max-w-[520px]">
        Pill-shaped tags with industry-specific background/text pairs. Font size: 12px (xs),
        Medium weight, px-3 py-1, full border-radius. No hover animation: they are labels, not actions.
      </p>
      <div className="flex flex-wrap gap-3 mb-14">
        <IndustryTag industry="Technology" />
        <IndustryTag industry="Clean Energy" />
        <IndustryTag industry="Health & Life" />
        <IndustryTag industry="Media" />
        <IndustryTag industry="Agriculture" />
        <IndustryTag industry="Manufacturing" />
        <IndustryTag industry="Professional Services" />
      </div>

      {/* Status badges */}
      <h3 className="font-display text-[20px] text-foreground mb-5">Status Badges</h3>
      <p className="text-[13px] text-ink-400 mb-6 max-w-[520px]">
        Four semantic states: positive (verified, active), caution (pending), negative (closed), info (new).
        Smaller than tags: px-2.5 py-[3px]. Used for dynamic status, not categorization.
      </p>
      <div className="flex flex-wrap gap-3 mb-14">
        <StatusBadge variant="positive">Verified</StatusBadge>
        <StatusBadge variant="positive">Active</StatusBadge>
        <StatusBadge variant="caution">Pending Review</StatusBadge>
        <StatusBadge variant="negative">Closed</StatusBadge>
        <StatusBadge variant="info">New Listing</StatusBadge>
      </div>

      {/* Avatars */}
      <h3 className="font-display text-[20px] text-foreground mb-5">Avatars</h3>
      <p className="text-[13px] text-ink-400 mb-6 max-w-[520px]">
        Initial-based avatars on signal-soft background. Three sizes. On hover: a 2px signal-mist ring
        materializes with a subtle 4px green outer glow. Transition: 200ms ease.
      </p>
      <div className="flex items-center gap-5 mb-6">
        <div className="text-center">
          <BcAvatar initials="KR" size="sm" />
          <div className="font-mono text-[10px] text-ink-300 mt-2">sm (28px)</div>
        </div>
        <div className="text-center">
          <BcAvatar initials="KR" size="md" />
          <div className="font-mono text-[10px] text-ink-300 mt-2">md (36px)</div>
        </div>
        <div className="text-center">
          <BcAvatar initials="KR" size="lg" />
          <div className="font-mono text-[10px] text-ink-300 mt-2">lg (48px)</div>
        </div>
        <div className="text-center">
          <BcAvatar initials="AW" size="md" />
          <div className="font-mono text-[10px] text-ink-300 mt-2">md</div>
        </div>
        <div className="text-center">
          <BcAvatar initials="TC" size="md" />
          <div className="font-mono text-[10px] text-ink-300 mt-2">md</div>
        </div>
      </div>

      <ReasonBlock>
        Tags use color to differentiate, not to decorate. The palette was chosen
        so all six industry colors pass WCAG AA on their respective backgrounds.
        Badges stay smaller than tags because status is metadata, not identity.
        Avatars ring on hover because it echoes the lattice node connectivity.
      </ReasonBlock>
    </GuideSection>
  )
}
