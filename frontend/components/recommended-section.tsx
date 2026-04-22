"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BusinessCard } from "@/components/business-card";
import { getBusinesses, toBusinessCard } from "@/lib/api";
import { sampleBusinesses } from "@/lib/sample-data";
import type { Business } from "@/components/business-card";
import { Sparkles } from "lucide-react";

export function RecommendedSection() {
  const router = useRouter();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const data = await getBusinesses({ limit: 3 });
        setBusinesses(data.map(toBusinessCard));
      } catch {
        setBusinesses(sampleBusinesses.slice(0, 3));
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  return (
    <section className="border-t border-border">
      <div className="max-w-[1200px] mx-auto px-12 max-[960px]:px-6 py-20">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-signal" />
          <span className="font-mono text-[11px] font-medium tracking-[0.14em] uppercase text-signal">
            Recommended for You
          </span>
        </div>
        <h2 className="font-display text-[36px] max-[960px]:text-[28px] font-normal leading-[1.05] tracking-[-0.02em] text-foreground mb-2">
          Discover Businesses
        </h2>
        <p className="text-sm text-ink-400 mb-10">
          Based on your saved businesses
        </p>

        <div className="grid grid-cols-3 max-[960px]:grid-cols-2 max-[640px]:grid-cols-1 gap-6">
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-56 rounded-[var(--r-xl)] bg-cloud animate-pulse"
                />
              ))
            : businesses.map((biz) => (
                <BusinessCard
                  key={biz.id}
                  business={biz}
                  onClick={() => router.push(`/directory/${biz.id}`)}
                />
              ))}
        </div>
      </div>
    </section>
  );
}
