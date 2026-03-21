import { IndustryTag } from "./industry-tag";
import { StatusBadge } from "./status-badge";
import { ArrowUpRight, Bookmark, BookmarkCheck, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Business {
  id: string;
  name: string;
  industry: string;
  region: string;
  city: string;
  description: string;
  tags?: string[];
  employees?: number;
  verified?: boolean;
  verificationStatus?: "pending" | "verified" | "rejected";
}

const industryGradients: Record<string, { from: string; to: string; icon: string }> = {
  Technology: { from: "#EFF2FA", to: "#c9d4ed", icon: "#3568B2" },
  "Technology & Software": { from: "#EFF2FA", to: "#c9d4ed", icon: "#3568B2" },
  "Clean Energy": { from: "#E6F3EE", to: "#b8d4c6", icon: "#1B6B4F" },
  "Green Energy & Cleantech": { from: "#E6F3EE", to: "#b8d4c6", icon: "#1B6B4F" },
  "Health & Life": { from: "#FDF4EB", to: "#edd0ab", icon: "#C07A28" },
  "Life Sciences & Health": { from: "#FDF4EB", to: "#edd0ab", icon: "#C07A28" },
  Media: { from: "#F8EEF5", to: "#ddc0d5", icon: "#9B4D83" },
  "Digital Media & Creative": { from: "#F8EEF5", to: "#ddc0d5", icon: "#9B4D83" },
  Agriculture: { from: "#EEF5E6", to: "#c8dbb5", icon: "#4D7C2A" },
  "Agri-Tech & Food": { from: "#EEF5E6", to: "#c8dbb5", icon: "#4D7C2A" },
  Manufacturing: { from: "#FEF8E7", to: "#ecdaab", icon: "#92700C" },
  "Advanced Manufacturing": { from: "#FEF8E7", to: "#ecdaab", icon: "#92700C" },
  "Professional Services": { from: "#F3F4F6", to: "#d1d5db", icon: "#4B5162" },
};

interface BusinessCardProps {
  business: Business;
  onClick?: () => void;
  isSaved?: boolean;
  onToggleSave?: (business: Business) => void;
  isSaveLoading?: boolean;
  showSaveButton?: boolean;
  saveDisabled?: boolean;
}

export function BusinessCard({
  business,
  onClick,
  isSaved = false,
  onToggleSave,
  isSaveLoading = false,
  showSaveButton = false,
  saveDisabled = false,
}: BusinessCardProps) {
  const grad = industryGradients[business.industry] ?? industryGradients.Technology;
  const isInteractive = Boolean(onClick);

  return (
    <article
      onClick={onClick}
      className={cn(
        "group border border-border rounded-[var(--r-xl)] overflow-hidden bg-card",
        "card-activate card-image-zoom focus-ring",
        isInteractive ? "cursor-pointer" : "cursor-default",
      )}
      role={isInteractive ? "button" : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      aria-label={`View ${business.name}`}
      onKeyDown={(e) => {
        if (!isInteractive) return;
        if (e.key === "Enter" || e.key === " ") onClick?.();
      }}
    >
      <div className="w-full h-[200px] overflow-hidden relative">
        <div
          className="card-image-inner w-full h-full flex items-center justify-center"
          style={{
            background: `linear-gradient(135deg, ${grad.from}, ${grad.to})`,
          }}
        >
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke={grad.icon}
            strokeWidth="1.5"
            opacity="0.25"
          >
            <rect x="2" y="3" width="20" height="14" rx="2" />
            <path d="m8 21 4-4 4 4M2 13l5-4 3 3 4-4 8 6" />
          </svg>
        </div>

        <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center opacity-0 transition-opacity duration-[280ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-100">
          <ArrowUpRight className="w-3.5 h-3.5 text-foreground" />
        </div>

        {showSaveButton && onToggleSave && (
          <button
            type="button"
            disabled={isSaveLoading || saveDisabled}
            onClick={(event) => {
              event.stopPropagation();
              onToggleSave(business);
            }}
            className={cn(
              "absolute top-4 left-4 w-8 h-8 rounded-full bg-background/85 backdrop-blur-sm border border-border",
              "flex items-center justify-center transition-colors",
              "focus-ring",
              isSaveLoading || saveDisabled
                ? "cursor-not-allowed opacity-60"
                : "hover:bg-background",
            )}
            aria-label={isSaved ? `Unsave ${business.name}` : `Save ${business.name}`}
          >
            {isSaved ? (
              <BookmarkCheck className="w-4 h-4 text-signal" />
            ) : (
              <Bookmark className="w-4 h-4 text-ink-300" />
            )}
          </button>
        )}

        {business.verificationStatus && business.verificationStatus !== "verified" && (
          <div className="absolute top-4 left-14">
            <StatusBadge
              variant={business.verificationStatus === "pending" ? "caution" : "negative"}
            >
              {business.verificationStatus === "pending" ? "Pending" : "Rejected"}
            </StatusBadge>
          </div>
        )}
      </div>

      <div className="px-6 pt-6 pb-7">
        <div className="flex gap-2 mb-3">
          <IndustryTag industry={business.industry} />
          {business.tags?.slice(0, 1).map((tag) => (
            <IndustryTag key={tag} industry={tag} />
          ))}
        </div>
        <h3 className="font-display text-[24px] leading-[1.15] tracking-[-0.01em] text-foreground mb-1.5">
          {business.name}
        </h3>
        <p className="text-[13px] font-medium text-ink-300 mb-3 flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          {business.city}, {business.region}
        </p>
        <p className="text-sm text-ink-500 leading-relaxed line-clamp-2">
          {business.description}
        </p>
      </div>
    </article>
  );
}
