import { IndustryTag } from "./industry-tag";
import { StatusBadge } from "./status-badge";
import { ArrowUpRight, Bookmark, BookmarkCheck, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Industry Illustrations ────────────────────────────────────────────────
function IndustryIllustration({ industry, color }: { industry: string; color: string }) {
  const norm = industry.toLowerCase();

  if (norm.includes("tech") || norm.includes("software")) {
    return (
      <svg viewBox="0 0 240 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full" style={{ opacity: 0.55 }}>
        <line x1="40" y1="0" x2="40" y2="160" stroke={color} strokeWidth="0.5" strokeDasharray="4 4"/>
        <line x1="80" y1="0" x2="80" y2="160" stroke={color} strokeWidth="0.5" strokeDasharray="4 4"/>
        <line x1="120" y1="0" x2="120" y2="160" stroke={color} strokeWidth="0.5" strokeDasharray="4 4"/>
        <line x1="160" y1="0" x2="160" y2="160" stroke={color} strokeWidth="0.5" strokeDasharray="4 4"/>
        <line x1="200" y1="0" x2="200" y2="160" stroke={color} strokeWidth="0.5" strokeDasharray="4 4"/>
        <line x1="0" y1="40" x2="240" y2="40" stroke={color} strokeWidth="0.5" strokeDasharray="4 4"/>
        <line x1="0" y1="80" x2="240" y2="80" stroke={color} strokeWidth="0.5" strokeDasharray="4 4"/>
        <line x1="0" y1="120" x2="240" y2="120" stroke={color} strokeWidth="0.5" strokeDasharray="4 4"/>
        <circle cx="40" cy="40" r="5" fill={color} opacity="0.8"/>
        <circle cx="120" cy="40" r="5" fill={color} opacity="0.8"/>
        <circle cx="200" cy="40" r="5" fill={color} opacity="0.8"/>
        <circle cx="80" cy="80" r="7" fill={color}/>
        <circle cx="160" cy="80" r="5" fill={color} opacity="0.8"/>
        <circle cx="40" cy="120" r="5" fill={color} opacity="0.6"/>
        <circle cx="120" cy="120" r="5" fill={color} opacity="0.6"/>
        <circle cx="200" cy="120" r="5" fill={color} opacity="0.6"/>
        <line x1="40" y1="40" x2="80" y2="80" stroke={color} strokeWidth="1.5"/>
        <line x1="120" y1="40" x2="80" y2="80" stroke={color} strokeWidth="1.5"/>
        <line x1="80" y1="80" x2="160" y2="80" stroke={color} strokeWidth="1.5"/>
        <line x1="160" y1="80" x2="200" y2="40" stroke={color} strokeWidth="1"/>
        <line x1="80" y1="80" x2="40" y2="120" stroke={color} strokeWidth="1"/>
        <line x1="80" y1="80" x2="120" y2="120" stroke={color} strokeWidth="1"/>
        <text x="96" y="88" fontFamily="monospace" fontSize="18" fill={color} fontWeight="700">{"<>"}</text>
      </svg>
    );
  }

  if (norm.includes("clean energy") || norm.includes("green") || norm.includes("cleantech")) {
    return (
      <svg viewBox="0 0 240 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full" style={{ opacity: 0.55 }}>
        <ellipse cx="60" cy="155" rx="80" ry="40" fill={color} opacity="0.15"/>
        <ellipse cx="190" cy="160" rx="70" ry="35" fill={color} opacity="0.1"/>
        <circle cx="190" cy="38" r="18" fill={color} opacity="0.3"/>
        <line x1="190" y1="8" x2="190" y2="2" stroke={color} strokeWidth="2" strokeLinecap="round"/>
        <line x1="190" y1="68" x2="190" y2="74" stroke={color} strokeWidth="2" strokeLinecap="round"/>
        <line x1="160" y1="38" x2="154" y2="38" stroke={color} strokeWidth="2" strokeLinecap="round"/>
        <line x1="220" y1="38" x2="226" y2="38" stroke={color} strokeWidth="2" strokeLinecap="round"/>
        <rect x="78" y="70" width="4" height="75" fill={color} opacity="0.6"/>
        <path d="M80 70 Q72 48 62 36" stroke={color} strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.9"/>
        <path d="M80 70 Q95 52 104 42" stroke={color} strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.9"/>
        <path d="M80 70 Q68 72 58 82" stroke={color} strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.9"/>
        <circle cx="80" cy="70" r="5" fill={color}/>
        <rect x="148" y="95" width="3" height="50" fill={color} opacity="0.4"/>
        <path d="M149.5 95 Q144 80 138 73" stroke={color} strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.6"/>
        <path d="M149.5 95 Q159 82 165 76" stroke={color} strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.6"/>
        <path d="M149.5 95 Q141 97 135 104" stroke={color} strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.6"/>
        <circle cx="149.5" cy="95" r="3.5" fill={color} opacity="0.7"/>
      </svg>
    );
  }

  if (norm.includes("health") || norm.includes("life") || norm.includes("sciences")) {
    return (
      <svg viewBox="0 0 240 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full" style={{ opacity: 0.55 }}>
        <path d="M80 10 C100 30 140 30 160 50 C140 70 100 70 80 90 C100 110 140 110 160 130 C140 150 100 150 80 170" stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        <path d="M160 10 C140 30 100 30 80 50 C100 70 140 70 160 90 C140 110 100 110 80 130 C100 150 140 150 160 170" stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.6"/>
        <line x1="95" y1="27" x2="145" y2="27" stroke={color} strokeWidth="1.5" opacity="0.7"/>
        <line x1="88" y1="52" x2="152" y2="52" stroke={color} strokeWidth="1.5" opacity="0.7"/>
        <line x1="95" y1="77" x2="145" y2="77" stroke={color} strokeWidth="1.5" opacity="0.7"/>
        <line x1="88" y1="102" x2="152" y2="102" stroke={color} strokeWidth="1.5" opacity="0.7"/>
        <line x1="95" y1="127" x2="145" y2="127" stroke={color} strokeWidth="1.5" opacity="0.7"/>
        <circle cx="95" cy="27" r="3" fill={color}/>
        <circle cx="145" cy="27" r="3" fill={color}/>
        <circle cx="88" cy="52" r="3" fill={color} opacity="0.7"/>
        <circle cx="152" cy="52" r="3" fill={color} opacity="0.7"/>
        <circle cx="95" cy="77" r="3" fill={color}/>
        <circle cx="145" cy="77" r="3" fill={color}/>
        <rect x="26" y="60" width="8" height="24" rx="2" fill={color} opacity="0.8"/>
        <rect x="20" y="66" width="20" height="8" rx="2" fill={color} opacity="0.8"/>
        <rect x="193" y="85" width="6" height="18" rx="1.5" fill={color} opacity="0.5"/>
        <rect x="188" y="90" width="16" height="6" rx="1.5" fill={color} opacity="0.5"/>
      </svg>
    );
  }

  if (norm.includes("media") || norm.includes("creative") || norm.includes("digital")) {
    return (
      <svg viewBox="0 0 240 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full" style={{ opacity: 0.55 }}>
        <rect x="60" y="45" width="120" height="80" rx="10" stroke={color} strokeWidth="2.5" fill={color} fillOpacity="0.08"/>
        <circle cx="120" cy="85" r="28" stroke={color} strokeWidth="2"/>
        <circle cx="120" cy="85" r="18" stroke={color} strokeWidth="2" opacity="0.6"/>
        <circle cx="120" cy="85" r="8" fill={color} opacity="0.5"/>
        <rect x="100" y="35" width="28" height="14" rx="4" stroke={color} strokeWidth="2"/>
        <rect x="148" y="50" width="20" height="12" rx="3" stroke={color} strokeWidth="1.5" opacity="0.6"/>
        <rect x="0" y="130" width="240" height="30" fill={color} fillOpacity="0.12"/>
        {[0,1,2,3,4,5,6,7].map(i => (
          <rect key={i} x={8 + i * 30} y={134} width="16" height="22" rx="2" stroke={color} strokeWidth="1.5" fill="none" opacity="0.5"/>
        ))}
        <circle cx="185" cy="38" r="14" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="1.5"/>
        <path d="M181 32 L193 38 L181 44 Z" fill={color} opacity="0.8"/>
      </svg>
    );
  }

  if (norm.includes("agri") || norm.includes("food")) {
    return (
      <svg viewBox="0 0 240 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full" style={{ opacity: 0.55 }}>
        {[0,1,2,3,4].map(i => (
          <ellipse key={i} cx="120" cy={148 + i * 12} rx={200 - i * 20} ry="8" fill={color} opacity={0.08 + i * 0.03}/>
        ))}
        {[30,60,90,120,150,180,210].map((x, i) => (
          <g key={i}>
            <line x1={x} y1="130" x2={x} y2="50" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
            <ellipse cx={x} cy={45} rx="5" ry="14" fill={color} opacity="0.7" transform={`rotate(${i % 2 === 0 ? -8 : 8} ${x} 45)`}/>
            <ellipse cx={x - 7} cy={70} rx="4" ry="9" fill={color} opacity="0.4" transform={`rotate(-20 ${x - 7} 70)`}/>
            <ellipse cx={x + 7} cy={75} rx="4" ry="9" fill={color} opacity="0.4" transform={`rotate(20 ${x + 7} 75)`}/>
          </g>
        ))}
        <circle cx="200" cy="28" r="14" fill={color} opacity="0.25"/>
        <path d="M28 28 Q48 8 68 28 Q48 48 28 28Z" fill={color} opacity="0.5"/>
        <line x1="28" y1="28" x2="68" y2="28" stroke={color} strokeWidth="1" opacity="0.7"/>
      </svg>
    );
  }

  if (norm.includes("manufactur")) {
    return (
      <svg viewBox="0 0 240 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full" style={{ opacity: 0.55 }}>
        <circle cx="95" cy="85" r="38" stroke={color} strokeWidth="2.5" opacity="0.4"/>
        <circle cx="95" cy="85" r="16" stroke={color} strokeWidth="2" fill={color} fillOpacity="0.1"/>
        <circle cx="95" cy="85" r="6" fill={color} opacity="0.7"/>
        {[0,30,60,90,120,150,180,210,240,270,300,330].map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          return <line key={i} x1={95 + 38 * Math.cos(rad)} y1={85 + 38 * Math.sin(rad)} x2={95 + 48 * Math.cos(rad)} y2={85 + 48 * Math.sin(rad)} stroke={color} strokeWidth="7" strokeLinecap="round" opacity="0.7"/>;
        })}
        <circle cx="165" cy="55" r="24" stroke={color} strokeWidth="2" opacity="0.5"/>
        <circle cx="165" cy="55" r="10" stroke={color} strokeWidth="2" fill={color} fillOpacity="0.1"/>
        <circle cx="165" cy="55" r="4" fill={color} opacity="0.7"/>
        {[0,45,90,135,180,225,270,315].map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          return <line key={i} x1={165 + 24 * Math.cos(rad)} y1={55 + 24 * Math.sin(rad)} x2={165 + 31 * Math.cos(rad)} y2={55 + 31 * Math.sin(rad)} stroke={color} strokeWidth="6" strokeLinecap="round" opacity="0.6"/>;
        })}
        <path d="M20 140 L20 100 L50 116 L50 100 L80 116 L80 100 L110 120 L110 140 Z" stroke={color} strokeWidth="1.5" fill={color} fillOpacity="0.06" opacity="0.5"/>
      </svg>
    );
  }

  // Professional Services — briefcase + network
  return (
    <svg viewBox="0 0 240 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full" style={{ opacity: 0.55 }}>
      <rect x="70" y="65" width="100" height="72" rx="8" stroke={color} strokeWidth="2.5" fill={color} fillOpacity="0.06"/>
      <path d="M95 65 L95 52 Q95 44 103 44 L137 44 Q145 44 145 52 L145 65" stroke={color} strokeWidth="2.5" fill="none"/>
      <line x1="70" y1="101" x2="170" y2="101" stroke={color} strokeWidth="2"/>
      <rect x="108" y="93" width="24" height="16" rx="4" fill={color} opacity="0.3" stroke={color} strokeWidth="1.5"/>
      <circle cx="30" cy="30" r="8" fill={color} opacity="0.4"/>
      <circle cx="55" cy="48" r="5" fill={color} opacity="0.3"/>
      <circle cx="22" cy="52" r="5" fill={color} opacity="0.3"/>
      <line x1="30" y1="30" x2="55" y2="48" stroke={color} strokeWidth="1.5" opacity="0.4"/>
      <line x1="30" y1="30" x2="22" y2="52" stroke={color} strokeWidth="1.5" opacity="0.4"/>
      <circle cx="210" cy="30" r="8" fill={color} opacity="0.4"/>
      <circle cx="188" cy="48" r="5" fill={color} opacity="0.3"/>
      <circle cx="220" cy="52" r="5" fill={color} opacity="0.3"/>
      <line x1="210" y1="30" x2="188" y2="48" stroke={color} strokeWidth="1.5" opacity="0.4"/>
      <line x1="210" y1="30" x2="220" y2="52" stroke={color} strokeWidth="1.5" opacity="0.4"/>
      <rect x="24" y="120" width="12" height="24" rx="2" fill={color} opacity="0.35"/>
      <rect x="40" y="110" width="12" height="34" rx="2" fill={color} opacity="0.45"/>
      <rect x="56" y="115" width="12" height="29" rx="2" fill={color} opacity="0.4"/>
      <rect x="172" y="118" width="12" height="26" rx="2" fill={color} opacity="0.35"/>
      <rect x="188" y="108" width="12" height="36" rx="2" fill={color} opacity="0.45"/>
      <rect x="204" y="113" width="12" height="31" rx="2" fill={color} opacity="0.4"/>
    </svg>
  );
}

export interface Business {
  id: string
  name: string
  industry: string
  region: string
  city: string
  description: string
  tags?: string[]
  employees?: number
  verified?: boolean
  verificationStatus?: "pending" | "verified" | "rejected"
  lat?: number
  lng?: number
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
          className="card-image-inner w-full h-full flex items-center justify-center relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${grad.from}, ${grad.to})`,
          }}
        >
          <IndustryIllustration industry={business.industry} color={grad.icon} />
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
