"use client";

import { useState } from "react";
import { JobCard, type Job } from "./job-card";
import { cn } from "@/lib/utils";
import { Navigation } from "lucide-react";

const ALL_JOBS: Job[] = [
  {
    id: "1",
    title: "Senior ML Engineer",
    company: "Rainforest AI",
    city: "Vancouver",
    region: "Mainland/Southwest",
    type: "Full-time",
    salary: "$140k–$180k",
    industry: "Technology",
    initial: "R",
    gradientFrom: "#EFF2FA",
    gradientTo: "#c9d4ed",
    initialColor: "#3568B2",
    posted: "2 days ago",
    lat: 49.2827,
    lng: -123.1207,
  },
  {
    id: "2",
    title: "Product Designer",
    company: "Tidal Works",
    city: "Victoria",
    region: "Vancouver Island/Coast",
    type: "Full-time",
    salary: "$95k–$120k",
    industry: "Clean Energy",
    initial: "T",
    gradientFrom: "#E6F3EE",
    gradientTo: "#b8d4c6",
    initialColor: "#1B6B4F",
    posted: "4 days ago",
    lat: 48.4284,
    lng: -123.3656,
  },
  {
    id: "3",
    title: "Full-Stack Developer",
    company: "Orca Health",
    city: "Remote",
    region: "BC",
    type: "Remote",
    salary: "$80/hr",
    industry: "Health & Life",
    initial: "O",
    gradientFrom: "#FDF4EB",
    gradientTo: "#edd0ab",
    initialColor: "#C07A28",
    posted: "1 week ago",
    lat: 49.2827,
    lng: -123.1207,
  },
  {
    id: "4",
    title: "Growth Marketer",
    company: "Canopy Studios",
    city: "Burnaby",
    region: "Mainland/Southwest",
    type: "Full-time",
    salary: "$75k–$95k",
    industry: "Media",
    initial: "C",
    gradientFrom: "#F8EEF5",
    gradientTo: "#ddc0d5",
    initialColor: "#9B4D83",
    posted: "3 days ago",
    lat: 49.2488,
    lng: -122.9805,
  },
  {
    id: "5",
    title: "AgriTech Operations Lead",
    company: "Harvest Robotics",
    city: "Kelowna",
    region: "Thompson-Okanagan",
    type: "Full-time",
    salary: "$85k–$110k",
    industry: "Agriculture",
    initial: "H",
    gradientFrom: "#EEF5E6",
    gradientTo: "#c8dbb5",
    initialColor: "#4D7C2A",
    posted: "5 days ago",
    lat: 49.8880,
    lng: -119.4960,
  },
  {
    id: "6",
    title: "Supply Chain Analyst",
    company: "Pacific Ledger",
    city: "Vancouver",
    region: "Mainland/Southwest",
    type: "Contract",
    salary: "$65/hr",
    industry: "Professional Services",
    initial: "P",
    gradientFrom: "#F3F4F6",
    gradientTo: "#d1d5db",
    initialColor: "#4B5162",
    posted: "1 day ago",
    lat: 49.2827,
    lng: -123.1207,
  },
  {
    id: "7",
    title: "Robotics Software Engineer",
    company: "Northern Forge",
    city: "Prince George",
    region: "Nechako",
    type: "Full-time",
    salary: "$110k–$145k",
    industry: "Manufacturing",
    initial: "N",
    gradientFrom: "#FEF8E7",
    gradientTo: "#ecdaab",
    initialColor: "#92700C",
    posted: "6 days ago",
    lat: 53.9171,
    lng: -122.7497,
  },
  {
    id: "8",
    title: "DevOps Engineer",
    company: "GridSync Energy",
    city: "Victoria",
    region: "Vancouver Island/Coast",
    type: "Remote",
    salary: "$120k–$150k",
    industry: "Clean Energy",
    initial: "G",
    gradientFrom: "#E6F3EE",
    gradientTo: "#b8d4c6",
    initialColor: "#1B6B4F",
    posted: "3 days ago",
    lat: 48.4284,
    lng: -123.3656,
  },
];

const ALL_INDUSTRIES = "All";

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function formatDist(km: number) {
  return km < 1 ? `${Math.round(km * 1000)} m away` : `${km.toFixed(0)} km away`;
}

export function JobsSection() {
  const [activeIndustry, setActiveIndustry] = useState(ALL_INDUSTRIES);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [nearbySort, setNearbySort] = useState(false);
  const [locating, setLocating] = useState(false);
  const [locError, setLocError] = useState<string | null>(null);

  const industries = [ALL_INDUSTRIES, ...Array.from(new Set(ALL_JOBS.map((j) => j.industry))).sort()];

  function handleNearMe() {
    if (nearbySort && userLocation) { setNearbySort(false); return; }
    setLocError(null);
    if (!navigator.geolocation) { setLocError("Geolocation not supported."); return; }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setNearbySort(true);
      },
      () => { setLocating(false); setLocError("Location access denied."); },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }

  let displayed = ALL_JOBS.filter(
    (j) => activeIndustry === ALL_INDUSTRIES || j.industry === activeIndustry
  );

  if (nearbySort && userLocation) {
    displayed = [...displayed].sort((a, b) => {
      const dA = a.lat != null && a.lng != null ? haversineKm(userLocation.lat, userLocation.lng, a.lat, a.lng) : Infinity;
      const dB = b.lat != null && b.lng != null ? haversineKm(userLocation.lat, userLocation.lng, b.lat, b.lng) : Infinity;
      return dA - dB;
    });
  }

  return (
    <section id="jobs" className="border-t border-border py-[120px] max-[960px]:py-20">
      <div className="max-w-[1200px] mx-auto px-12 max-[960px]:px-6">
        {/* Header */}
        <div className="flex items-end justify-between gap-6 mb-10 max-[640px]:flex-col max-[640px]:items-start">
          <div>
            <div className="font-mono text-[11px] font-medium tracking-[0.14em] uppercase text-ink-300 mb-4">
              {"04 — Jobs"}
            </div>
            <h2 className="font-display text-[72px] max-[960px]:text-[40px] font-normal leading-[0.95] tracking-[-0.03em] text-foreground mb-4 text-balance">
              Open roles.
            </h2>
            <p className="text-lg font-light text-ink-400 max-w-[480px] leading-relaxed">
              The latest positions from startups across BC — engineering, design, operations, and more.
            </p>
          </div>

          {/* Near Me button */}
          <div className="shrink-0 flex flex-col items-end gap-2">
            <button
              onClick={handleNearMe}
              disabled={locating}
              className={cn(
                "btn-press focus-ring inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-[13px] font-semibold border transition-all duration-150",
                nearbySort
                  ? "bg-[#1B6B4F] text-white border-[#1B6B4F]"
                  : "bg-card text-foreground border-border hover:border-[var(--fog)]"
              )}
            >
              {locating ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin inline-block" />
                  Locating…
                </>
              ) : (
                <>
                  <Navigation className="w-3.5 h-3.5" />
                  {nearbySort ? "Near Me ✓" : "Near Me"}
                </>
              )}
            </button>
            {locError && (
              <p className="text-[11px] text-[#B33B2E] max-w-[180px] text-right">{locError}</p>
            )}
            {nearbySort && (
              <p className="text-[11px] text-ink-300">Sorted by distance from you</p>
            )}
          </div>
        </div>

        {/* Industry filter pills */}
        <div className="flex flex-wrap gap-2 mb-10">
          {industries.map((ind) => (
            <button
              key={ind}
              onClick={() => setActiveIndustry(ind)}
              className={cn(
                "btn-press focus-ring px-4 py-2 rounded-full text-[13px] font-medium border transition-all duration-150",
                activeIndustry === ind
                  ? "bg-foreground text-background border-foreground"
                  : "bg-card text-ink-400 border-border hover:border-ink-200 hover:text-foreground"
              )}
            >
              {ind}
            </button>
          ))}
        </div>

        {/* Job card grid */}
        <div className="grid grid-cols-4 max-[1100px]:grid-cols-3 max-[780px]:grid-cols-2 max-[480px]:grid-cols-1 gap-5">
          {displayed.length === 0 ? (
            <div className="col-span-full py-16 text-center text-ink-300 text-sm">
              No roles in this category right now.
            </div>
          ) : (
            displayed.map((job) => {
              const dist =
                nearbySort && userLocation && job.lat != null && job.lng != null
                  ? formatDist(haversineKm(userLocation.lat, userLocation.lng, job.lat, job.lng))
                  : undefined;
              return <JobCard key={job.id} job={job} distanceLabel={dist} />;
            })
          )}
        </div>

        {/* View all CTA */}
        <div className="flex justify-center mt-12">
          <button className="btn-press focus-ring inline-flex items-center gap-2 font-sans text-[13px] font-medium px-8 py-3 rounded-full border border-border bg-card text-foreground hover:bg-cloud transition-colors">
            View all open roles
            <span className="text-ink-200">→</span>
          </button>
        </div>
      </div>
    </section>
  );
}
