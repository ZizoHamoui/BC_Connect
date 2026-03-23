"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { IndustryTag } from "@/components/industry-tag";
import { StatusBadge } from "@/components/status-badge";
import { getBusinessById, toBusinessCard, type ApiBusiness } from "@/lib/api";
import { sampleBusinesses } from "@/lib/sample-data";
import {
  MapPin,
  ArrowLeft,
  Users,
  Globe,
  Mail,
  Phone,
  Building2,
} from "lucide-react";

const industryGradients: Record<
  string,
  { from: string; to: string; icon: string }
> = {
  Technology: { from: "#EFF2FA", to: "#c9d4ed", icon: "#3568B2" },
  "Technology & Software": { from: "#EFF2FA", to: "#c9d4ed", icon: "#3568B2" },
  "Clean Energy": { from: "#E6F3EE", to: "#b8d4c6", icon: "#1B6B4F" },
  "Green Energy & Cleantech": {
    from: "#E6F3EE",
    to: "#b8d4c6",
    icon: "#1B6B4F",
  },
  "Health & Life": { from: "#FDF4EB", to: "#edd0ab", icon: "#C07A28" },
  "Life Sciences & Health": {
    from: "#FDF4EB",
    to: "#edd0ab",
    icon: "#C07A28",
  },
  Media: { from: "#F8EEF5", to: "#ddc0d5", icon: "#9B4D83" },
  "Digital Media & Creative": {
    from: "#F8EEF5",
    to: "#ddc0d5",
    icon: "#9B4D83",
  },
  Agriculture: { from: "#EEF5E6", to: "#c8dbb5", icon: "#4D7C2A" },
  "Agri-Tech & Food": { from: "#EEF5E6", to: "#c8dbb5", icon: "#4D7C2A" },
  Manufacturing: { from: "#FEF8E7", to: "#ecdaab", icon: "#92700C" },
  "Advanced Manufacturing": {
    from: "#FEF8E7",
    to: "#ecdaab",
    icon: "#92700C",
  },
  "Professional Services": { from: "#F3F4F6", to: "#d1d5db", icon: "#4B5162" },
};

export default function BusinessDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [business, setBusiness] = useState<ApiBusiness | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUsingFallback, setIsUsingFallback] = useState(false);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const data = await getBusinessById(id);
        setBusiness(data);
        setIsUsingFallback(false);
      } catch {
        // Fall back to sample data
        const sample = sampleBusinesses.find((b) => b.id === id);
        if (sample) {
          setBusiness({
            _id: sample.id,
            name: sample.name,
            industryCategory: sample.industry,
            region: sample.region,
            city: sample.city,
            description: sample.description,
            tags: sample.tags,
            employees: sample.employees,
            verificationStatus: sample.verified ? "verified" : "pending",
          });
          setIsUsingFallback(true);
        }
      } finally {
        setIsLoading(false);
      }
    }

    if (id) load();
  }, [id]);

  const card = business ? toBusinessCard(business) : null;
  const grad = card
    ? industryGradients[card.industry] ?? industryGradients["Technology"]
    : industryGradients["Technology"];

  return (
    <main>
      <Navbar />

      <div className="max-w-[1200px] mx-auto px-12 max-[960px]:px-6 py-12">
        {/* Back button */}
        <button
          onClick={() => router.push("/directory")}
          className="btn-press focus-ring inline-flex items-center gap-2 text-sm font-medium text-ink-400 hover:text-foreground transition-colors mb-8 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Directory
        </button>

        {isLoading ? (
          <div className="space-y-6">
            <div className="h-[300px] rounded-[var(--r-xl)] bg-cloud animate-pulse" />
            <div className="h-8 w-1/3 rounded bg-cloud animate-pulse" />
            <div className="h-4 w-2/3 rounded bg-cloud animate-pulse" />
          </div>
        ) : !business || !card ? (
          <div className="text-center py-20">
            <h2 className="font-display text-2xl text-foreground mb-2">
              Business not found
            </h2>
            <p className="text-ink-400">
              This listing may have been removed or doesn&apos;t exist.
            </p>
          </div>
        ) : (
          <div>
            {/* Hero banner */}
            <div
              className="w-full h-[300px] rounded-[var(--r-xl)] overflow-hidden flex items-center justify-center mb-10"
              style={{
                background: `linear-gradient(135deg, ${grad.from}, ${grad.to})`,
              }}
            >
              <svg
                width="80"
                height="80"
                viewBox="0 0 24 24"
                fill="none"
                stroke={grad.icon}
                strokeWidth="1.5"
                opacity="0.2"
              >
                <rect x="2" y="3" width="20" height="14" rx="2" />
                <path d="m8 21 4-4 4 4M2 13l5-4 3 3 4-4 8 6" />
              </svg>
            </div>

            {/* Status badge */}
            {business.verificationStatus &&
              business.verificationStatus !== "verified" && (
                <div className="mb-4">
                  <StatusBadge
                    variant={
                      business.verificationStatus === "pending"
                        ? "caution"
                        : "negative"
                    }
                  >
                    {business.verificationStatus === "pending"
                      ? "Pending Verification"
                      : "Rejected"}
                  </StatusBadge>
                </div>
              )}

            {/* Tags */}
            <div className="flex gap-2 mb-4 flex-wrap">
              <IndustryTag industry={card.industry} />
              {card.tags?.map((tag) => (
                <IndustryTag key={tag} industry={tag} />
              ))}
            </div>

            {/* Name & location */}
            <h1 className="font-display text-[48px] max-[960px]:text-[32px] leading-[1.05] tracking-[-0.02em] text-foreground mb-3">
              {card.name}
            </h1>
            <p className="text-base font-medium text-ink-300 flex items-center gap-1.5 mb-6">
              <MapPin className="w-4 h-4" />
              {card.city}, {card.region}
            </p>

            {/* Description */}
            <p className="text-lg text-ink-500 leading-relaxed max-w-[720px] mb-10">
              {card.description}
            </p>

            {/* Info grid */}
            <div className="grid grid-cols-2 max-[640px]:grid-cols-1 gap-4 mb-10">
              {card.employees && (
                <div className="flex items-center gap-3 p-4 rounded-[var(--r-lg)] border border-border bg-card">
                  <Users className="w-5 h-5 text-ink-300" />
                  <div>
                    <p className="text-xs text-ink-300 font-medium uppercase tracking-wider">
                      Employees
                    </p>
                    <p className="text-sm font-semibold text-foreground">
                      {card.employees}
                    </p>
                  </div>
                </div>
              )}
              {business.address && (
                <div className="flex items-center gap-3 p-4 rounded-[var(--r-lg)] border border-border bg-card">
                  <Building2 className="w-5 h-5 text-ink-300" />
                  <div>
                    <p className="text-xs text-ink-300 font-medium uppercase tracking-wider">
                      Address
                    </p>
                    <p className="text-sm font-semibold text-foreground">
                      {business.address}
                    </p>
                  </div>
                </div>
              )}
              {business.contact?.website && (
                <div className="flex items-center gap-3 p-4 rounded-[var(--r-lg)] border border-border bg-card">
                  <Globe className="w-5 h-5 text-ink-300" />
                  <div>
                    <p className="text-xs text-ink-300 font-medium uppercase tracking-wider">
                      Website
                    </p>
                    <a
                      href={business.contact.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-semibold text-signal hover:underline"
                    >
                      {business.contact.website}
                    </a>
                  </div>
                </div>
              )}
              {business.contact?.email && (
                <div className="flex items-center gap-3 p-4 rounded-[var(--r-lg)] border border-border bg-card">
                  <Mail className="w-5 h-5 text-ink-300" />
                  <div>
                    <p className="text-xs text-ink-300 font-medium uppercase tracking-wider">
                      Email
                    </p>
                    <a
                      href={`mailto:${business.contact.email}`}
                      className="text-sm font-semibold text-signal hover:underline"
                    >
                      {business.contact.email}
                    </a>
                  </div>
                </div>
              )}
              {business.contact?.phone && (
                <div className="flex items-center gap-3 p-4 rounded-[var(--r-lg)] border border-border bg-card">
                  <Phone className="w-5 h-5 text-ink-300" />
                  <div>
                    <p className="text-xs text-ink-300 font-medium uppercase tracking-wider">
                      Phone
                    </p>
                    <p className="text-sm font-semibold text-foreground">
                      {business.contact.phone}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {isUsingFallback && (
              <p className="text-xs text-ink-300">
                Showing sample data — backend unavailable.
              </p>
            )}
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
