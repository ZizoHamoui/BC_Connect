"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BusinessCard } from "./business-card";
import { FilterPills } from "./filter-pills";
import { sampleBusinesses, industries } from "@/lib/sample-data";
import { getBusinesses, toBusinessCard } from "@/lib/api";

export function DirectoryPreview() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [businesses, setBusinesses] = useState(sampleBusinesses);
  const [isLoading, setIsLoading] = useState(true);
  const [isUsingFallback, setIsUsingFallback] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadBusinesses() {
      try {
        const apiBusinesses = await getBusinesses({ limit: 50 });

        if (!isMounted) return;

        setBusinesses(apiBusinesses.map(toBusinessCard));
        setIsUsingFallback(false);
      } catch (error) {
        console.error("Failed to load businesses from API:", error);

        if (!isMounted) return;

        setBusinesses(sampleBusinesses);
        setIsUsingFallback(true);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadBusinesses();

    return () => {
      isMounted = false;
    };
  }, []);

  const filtered = useMemo(() => {
    if (activeFilter === "All") {
      return businesses.slice(0, 6);
    }

    return businesses.filter((b) => b.industry === activeFilter).slice(0, 6);
  }, [activeFilter, businesses]);

  return (
    <section
      id="directory"
      className="border-t border-border py-[120px] max-[960px]:py-20"
    >
      <div className="max-w-[1200px] mx-auto px-12 max-[960px]:px-6">
        <div className="font-mono text-[11px] font-medium tracking-[0.14em] uppercase text-ink-300 mb-4">
          {"03 \u2014 Directory"}
        </div>
        <h2 className="font-display text-[72px] max-[960px]:text-[40px] font-normal leading-[0.95] tracking-[-0.03em] text-foreground mb-6 text-balance">
          Featured startups.
        </h2>
        <p className="text-lg font-light text-ink-400 max-w-[560px] leading-relaxed mb-12">
          {
            "A curated selection from across British Columbia. Filter by industry to find what you're looking for."
          }
        </p>

        <p className="text-xs text-ink-300 mb-8">
          {isLoading
            ? "Loading businesses from backend API..."
            : isUsingFallback
              ? "Backend unavailable, showing fallback sample data."
              : "Connected to live backend data."}
        </p>

        <FilterPills
          filters={industries}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          className="mb-12"
        />

        <div className="grid grid-cols-3 max-[960px]:grid-cols-1 gap-6 mb-16">
          {filtered.map((biz) => (
            <BusinessCard key={biz.id} business={biz} />
          ))}
        </div>

        {filtered.length > 0 && (
          <div className="text-center">
            <Link
              href="/#directory"
              className="btn-press focus-ring group inline-flex items-center justify-center gap-2 font-sans text-sm font-medium px-[22px] py-[11px] rounded-full bg-card text-foreground border border-border hover:border-fog hover:bg-off-white"
            >
              View All Startups
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
