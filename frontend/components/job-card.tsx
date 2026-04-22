"use client";

import { useState, useEffect } from "react";
import { IndustryTag } from "./industry-tag";
import { cn } from "@/lib/utils";
import { MapPin, Clock, DollarSign, Navigation, ArrowUpRight } from "lucide-react";

export interface Job {
  id: string;
  title: string;
  company: string;
  city: string;
  region: string;
  type: "Full-time" | "Part-time" | "Contract" | "Remote";
  salary: string;
  industry: string;
  initial: string;
  gradientFrom: string;
  gradientTo: string;
  initialColor: string;
  posted?: string;
  lat?: number;
  lng?: number;
}

interface JobCardProps {
  job: Job;
  distanceLabel?: string;
}

// ─── Inline industry illustration (same as business-card) ──────────────────
function JobIllustration({ industry, color }: { industry: string; color: string }) {
  const norm = industry.toLowerCase();

  if (norm.includes("tech") || norm.includes("software")) {
    return (
      <svg viewBox="0 0 200 120" fill="none" className="absolute inset-0 w-full h-full" style={{ opacity: 0.45 }}>
        <line x1="33" y1="0" x2="33" y2="120" stroke={color} strokeWidth="0.5" strokeDasharray="3 3"/>
        <line x1="66" y1="0" x2="66" y2="120" stroke={color} strokeWidth="0.5" strokeDasharray="3 3"/>
        <line x1="100" y1="0" x2="100" y2="120" stroke={color} strokeWidth="0.5" strokeDasharray="3 3"/>
        <line x1="133" y1="0" x2="133" y2="120" stroke={color} strokeWidth="0.5" strokeDasharray="3 3"/>
        <line x1="166" y1="0" x2="166" y2="120" stroke={color} strokeWidth="0.5" strokeDasharray="3 3"/>
        <line x1="0" y1="30" x2="200" y2="30" stroke={color} strokeWidth="0.5" strokeDasharray="3 3"/>
        <line x1="0" y1="60" x2="200" y2="60" stroke={color} strokeWidth="0.5" strokeDasharray="3 3"/>
        <line x1="0" y1="90" x2="200" y2="90" stroke={color} strokeWidth="0.5" strokeDasharray="3 3"/>
        <circle cx="66" cy="30" r="5" fill={color} opacity="0.9"/>
        <circle cx="100" cy="60" r="8" fill={color}/>
        <circle cx="133" cy="30" r="5" fill={color} opacity="0.8"/>
        <circle cx="66" cy="90" r="4" fill={color} opacity="0.6"/>
        <circle cx="133" cy="90" r="4" fill={color} opacity="0.6"/>
        <line x1="66" y1="30" x2="100" y2="60" stroke={color} strokeWidth="1.5"/>
        <line x1="133" y1="30" x2="100" y2="60" stroke={color} strokeWidth="1.5"/>
        <line x1="100" y1="60" x2="66" y2="90" stroke={color} strokeWidth="1"/>
        <line x1="100" y1="60" x2="133" y2="90" stroke={color} strokeWidth="1"/>
        <text x="84" y="67" fontFamily="monospace" fontSize="13" fill={color} fontWeight="700">{"<>"}</text>
      </svg>
    );
  }
  if (norm.includes("clean energy") || norm.includes("green") || norm.includes("cleantech")) {
    return (
      <svg viewBox="0 0 200 120" fill="none" className="absolute inset-0 w-full h-full" style={{ opacity: 0.45 }}>
        <ellipse cx="50" cy="115" rx="65" ry="30" fill={color} opacity="0.15"/>
        <ellipse cx="160" cy="120" rx="55" ry="25" fill={color} opacity="0.1"/>
        <circle cx="158" cy="28" r="15" fill={color} opacity="0.3"/>
        <line x1="158" y1="6" x2="158" y2="1" stroke={color} strokeWidth="2" strokeLinecap="round"/>
        <line x1="158" y1="50" x2="158" y2="55" stroke={color} strokeWidth="2" strokeLinecap="round"/>
        <line x1="136" y1="28" x2="131" y2="28" stroke={color} strokeWidth="2" strokeLinecap="round"/>
        <line x1="180" y1="28" x2="185" y2="28" stroke={color} strokeWidth="2" strokeLinecap="round"/>
        <rect x="62" y="55" width="3" height="56" fill={color} opacity="0.6"/>
        <path d="M63.5 55 Q57 38 49 28" stroke={color} strokeWidth="3.5" strokeLinecap="round" fill="none" opacity="0.9"/>
        <path d="M63.5 55 Q76 40 84 32" stroke={color} strokeWidth="3.5" strokeLinecap="round" fill="none" opacity="0.9"/>
        <path d="M63.5 55 Q54 57 46 65" stroke={color} strokeWidth="3.5" strokeLinecap="round" fill="none" opacity="0.9"/>
        <circle cx="63.5" cy="55" r="4.5" fill={color}/>
      </svg>
    );
  }
  if (norm.includes("health") || norm.includes("life") || norm.includes("sciences")) {
    return (
      <svg viewBox="0 0 200 120" fill="none" className="absolute inset-0 w-full h-full" style={{ opacity: 0.45 }}>
        <path d="M65 5 C82 22 118 22 135 40 C118 58 82 58 65 75 C82 92 118 92 135 110" stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        <path d="M135 5 C118 22 82 22 65 40 C82 58 118 58 135 75 C118 92 82 92 65 110" stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.5"/>
        <line x1="76" y1="20" x2="124" y2="20" stroke={color} strokeWidth="1.5" opacity="0.7"/>
        <line x1="70" y1="40" x2="130" y2="40" stroke={color} strokeWidth="1.5" opacity="0.7"/>
        <line x1="76" y1="60" x2="124" y2="60" stroke={color} strokeWidth="1.5" opacity="0.7"/>
        <line x1="70" y1="80" x2="130" y2="80" stroke={color} strokeWidth="1.5" opacity="0.7"/>
        <rect x="18" y="44" width="7" height="20" rx="2" fill={color} opacity="0.8"/>
        <rect x="13" y="49" width="17" height="7" rx="2" fill={color} opacity="0.8"/>
      </svg>
    );
  }
  if (norm.includes("media") || norm.includes("creative") || norm.includes("digital")) {
    return (
      <svg viewBox="0 0 200 120" fill="none" className="absolute inset-0 w-full h-full" style={{ opacity: 0.45 }}>
        <rect x="45" y="28" width="110" height="70" rx="8" stroke={color} strokeWidth="2" fill={color} fillOpacity="0.08"/>
        <circle cx="100" cy="63" r="22" stroke={color} strokeWidth="2"/>
        <circle cx="100" cy="63" r="13" stroke={color} strokeWidth="1.5" opacity="0.6"/>
        <circle cx="100" cy="63" r="5" fill={color} opacity="0.6"/>
        <rect x="83" y="19" width="22" height="12" rx="3" stroke={color} strokeWidth="1.5"/>
        <rect x="0" y="97" width="200" height="23" fill={color} fillOpacity="0.1"/>
        {[0,1,2,3,4,5,6].map(i => (
          <rect key={i} x={5 + i * 28} y={100} width="14" height="17" rx="2" stroke={color} strokeWidth="1" fill="none" opacity="0.5"/>
        ))}
        <circle cx="163" cy="24" r="11" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="1.5"/>
        <path d="M160 19 L170 24 L160 29 Z" fill={color} opacity="0.8"/>
      </svg>
    );
  }
  if (norm.includes("agri") || norm.includes("food")) {
    return (
      <svg viewBox="0 0 200 120" fill="none" className="absolute inset-0 w-full h-full" style={{ opacity: 0.45 }}>
        {[25,50,75,100,125,150,175].map((x, i) => (
          <g key={i}>
            <line x1={x} y1="100" x2={x} y2="38" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
            <ellipse cx={x} cy={33} rx="4" ry="11" fill={color} opacity="0.7" transform={`rotate(${i % 2 === 0 ? -6 : 6} ${x} 33)`}/>
            <ellipse cx={x - 6} cy={55} rx="3.5" ry="7" fill={color} opacity="0.4" transform={`rotate(-18 ${x - 6} 55)`}/>
            <ellipse cx={x + 6} cy={58} rx="3.5" ry="7" fill={color} opacity="0.4" transform={`rotate(18 ${x + 6} 58)`}/>
          </g>
        ))}
        <circle cx="170" cy="22" r="12" fill={color} opacity="0.2"/>
        <ellipse cx="120" cy="115" rx="160" ry="12" fill={color} opacity="0.1"/>
      </svg>
    );
  }
  if (norm.includes("manufactur")) {
    return (
      <svg viewBox="0 0 200 120" fill="none" className="absolute inset-0 w-full h-full" style={{ opacity: 0.45 }}>
        <circle cx="78" cy="63" r="30" stroke={color} strokeWidth="2.5" opacity="0.4"/>
        <circle cx="78" cy="63" r="12" stroke={color} strokeWidth="2" fill={color} fillOpacity="0.1"/>
        <circle cx="78" cy="63" r="4.5" fill={color} opacity="0.7"/>
        {[0,30,60,90,120,150,180,210,240,270,300,330].map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          return <line key={i} x1={78 + 30 * Math.cos(rad)} y1={63 + 30 * Math.sin(rad)} x2={78 + 38 * Math.cos(rad)} y2={63 + 38 * Math.sin(rad)} stroke={color} strokeWidth="6" strokeLinecap="round" opacity="0.7"/>;
        })}
        <circle cx="137" cy="40" r="19" stroke={color} strokeWidth="2" opacity="0.5"/>
        <circle cx="137" cy="40" r="8" stroke={color} strokeWidth="1.5" fill={color} fillOpacity="0.1"/>
        {[0,45,90,135,180,225,270,315].map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          return <line key={i} x1={137 + 19 * Math.cos(rad)} y1={40 + 19 * Math.sin(rad)} x2={137 + 25 * Math.cos(rad)} y2={40 + 25 * Math.sin(rad)} stroke={color} strokeWidth="5" strokeLinecap="round" opacity="0.6"/>;
        })}
      </svg>
    );
  }
  // Professional Services
  return (
    <svg viewBox="0 0 200 120" fill="none" className="absolute inset-0 w-full h-full" style={{ opacity: 0.45 }}>
      <rect x="55" y="45" width="90" height="60" rx="7" stroke={color} strokeWidth="2.5" fill={color} fillOpacity="0.06"/>
      <path d="M75 45 L75 35 Q75 28 82 28 L118 28 Q125 28 125 35 L125 45" stroke={color} strokeWidth="2.5" fill="none"/>
      <line x1="55" y1="74" x2="145" y2="74" stroke={color} strokeWidth="2"/>
      <rect x="87" y="68" width="26" height="12" rx="3" fill={color} opacity="0.3" stroke={color} strokeWidth="1.5"/>
      <circle cx="22" cy="22" r="7" fill={color} opacity="0.4"/>
      <circle cx="44" cy="36" r="4" fill={color} opacity="0.3"/>
      <circle cx="16" cy="40" r="4" fill={color} opacity="0.3"/>
      <line x1="22" y1="22" x2="44" y2="36" stroke={color} strokeWidth="1.5" opacity="0.4"/>
      <line x1="22" y1="22" x2="16" y2="40" stroke={color} strokeWidth="1.5" opacity="0.4"/>
      <circle cx="178" cy="22" r="7" fill={color} opacity="0.4"/>
      <circle cx="156" cy="36" r="4" fill={color} opacity="0.3"/>
      <circle cx="184" cy="42" r="4" fill={color} opacity="0.3"/>
      <line x1="178" y1="22" x2="156" y2="36" stroke={color} strokeWidth="1.5" opacity="0.4"/>
      <line x1="178" y1="22" x2="184" y2="42" stroke={color} strokeWidth="1.5" opacity="0.4"/>
    </svg>
  );
}

// ─── Job Card ──────────────────────────────────────────────────────────────
export function JobCard({ job, distanceLabel }: JobCardProps) {
  const typeColors: Record<string, { bg: string; text: string }> = {
    "Full-time":  { bg: "rgba(27,107,79,0.1)",  text: "#1B6B4F" },
    "Contract":   { bg: "rgba(53,104,178,0.1)", text: "#3568B2" },
    "Remote":     { bg: "rgba(155,77,131,0.1)", text: "#9B4D83" },
    "Part-time":  { bg: "rgba(192,122,40,0.1)", text: "#C07A28" },
  };
  const typeStyle = typeColors[job.type] ?? typeColors["Full-time"];

  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-[var(--r-xl)] border border-border bg-card cursor-pointer",
        "card-activate focus-ring",
      )}
      role="button"
      tabIndex={0}
      aria-label={`${job.title} at ${job.company}`}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") e.currentTarget.click(); }}
    >
      {/* Illustration header */}
      <div
        className="relative h-[130px] overflow-hidden flex items-center justify-center"
        style={{ background: `linear-gradient(135deg, ${job.gradientFrom}, ${job.gradientTo})` }}
      >
        <JobIllustration industry={job.industry} color={job.initialColor} />

        {/* Type badge */}
        <span
          className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[11px] font-semibold backdrop-blur-sm"
          style={{ background: typeStyle.bg, color: typeStyle.text, border: `1px solid ${typeStyle.text}22` }}
        >
          {job.type}
        </span>

        {/* Distance badge (when Near Me active) */}
        {distanceLabel && (
          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-semibold backdrop-blur-sm"
            style={{ background: "rgba(27,107,79,0.12)", color: "#1B6B4F", border: "1px solid rgba(27,107,79,0.2)" }}>
            {distanceLabel}
          </span>
        )}

        {/* Arrow on hover */}
        <div className="absolute bottom-3 right-3 w-7 h-7 rounded-full bg-white/80 flex items-center justify-center opacity-0 translate-y-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-y-0 shadow-sm">
          <ArrowUpRight className="w-3.5 h-3.5" style={{ color: job.initialColor }} />
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-2 p-5">
        <div>
          <h3 className="font-semibold text-[15px] text-foreground leading-snug tracking-[-0.01em]">
            {job.title}
          </h3>
          <p className="text-[13px] font-semibold mt-0.5" style={{ color: job.initialColor }}>
            {job.company}
          </p>
        </div>

        <div className="flex flex-col gap-1.5 mt-1">
          <div className="flex items-center gap-1.5 text-[12px] text-ink-300">
            <MapPin className="w-3 h-3 shrink-0" />
            <span>{job.city}, {job.region}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[12px] text-ink-300">
            <DollarSign className="w-3 h-3 shrink-0" />
            <span>{job.salary}</span>
          </div>
          {job.posted && (
            <div className="flex items-center gap-1.5 text-[12px] text-ink-300">
              <Clock className="w-3 h-3 shrink-0" />
              <span>{job.posted}</span>
            </div>
          )}
        </div>

        <div className="mt-2 pt-3 border-t border-border">
          <IndustryTag industry={job.industry} />
        </div>
      </div>
    </article>
  );
}
