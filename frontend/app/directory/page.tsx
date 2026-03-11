"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { BusinessCard } from "@/components/business-card";
import { FilterPills } from "@/components/filter-pills";
import { SearchBar } from "@/components/search-bar";
import { EmptyState } from "@/components/empty-state";
import { getBusinesses, toBusinessCard } from "@/lib/api";
import { sampleBusinesses } from "@/lib/sample-data";
import type { Business } from "@/components/business-card";

const PAGE_SIZE = 200;

function uniqueSorted(values: string[]) {
  return Array.from(new Set(values.filter(Boolean))).sort((a, b) =>
    a.localeCompare(b),
  );
}

export default function DirectoryPage() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUsingFallback, setIsUsingFallback] = useState(false);
  const [search, setSearch] = useState("");
  const [activeIndustry, setActiveIndustry] = useState("All");
  const [activeRegion, setActiveRegion] = useState("All Regions");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchBusinesses = useCallback(async () => {
    setIsLoading(true);

    try {
      const allBusinesses: Business[] = [];
      let page = 1;

      for (;;) {
        const params: Parameters<typeof getBusinesses>[0] = {
          limit: PAGE_SIZE,
          page,
        };

        if (debouncedSearch) params.search = debouncedSearch;
        if (activeIndustry !== "All") params.industry = activeIndustry;
        if (activeRegion !== "All Regions") params.region = activeRegion;

        const batch = await getBusinesses(params);
        const mappedBatch = batch.map(toBusinessCard);
        allBusinesses.push(...mappedBatch);

        if (mappedBatch.length < PAGE_SIZE) {
          break;
        }

        page += 1;
      }

      setBusinesses(allBusinesses);
      setIsUsingFallback(false);
    } catch {
      setBusinesses(sampleBusinesses);
      setIsUsingFallback(true);
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch, activeIndustry, activeRegion]);

  useEffect(() => {
    fetchBusinesses();
  }, [fetchBusinesses]);

  const displayedBusinesses = useMemo(() => {
    if (!isUsingFallback) return businesses;

    return businesses.filter((business) => {
      const matchesIndustry =
        activeIndustry === "All" || business.industry === activeIndustry;
      const matchesRegion =
        activeRegion === "All Regions" || business.region === activeRegion;
      const matchesSearch =
        !debouncedSearch ||
        business.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        business.description
          .toLowerCase()
          .includes(debouncedSearch.toLowerCase());

      return matchesIndustry && matchesRegion && matchesSearch;
    });
  }, [
    businesses,
    isUsingFallback,
    activeIndustry,
    activeRegion,
    debouncedSearch,
  ]);

  const availableIndustries = useMemo(() => {
    const source = isUsingFallback ? sampleBusinesses : businesses;
    return ["All", ...uniqueSorted(source.map((business) => business.industry))];
  }, [businesses, isUsingFallback]);

  const availableRegions = useMemo(() => {
    const source = isUsingFallback ? sampleBusinesses : businesses;
    return [
      "All Regions",
      ...uniqueSorted(source.map((business) => business.region)),
    ];
  }, [businesses, isUsingFallback]);

  useEffect(() => {
    if (!availableIndustries.includes(activeIndustry)) {
      setActiveIndustry("All");
    }
  }, [activeIndustry, availableIndustries]);

  useEffect(() => {
    if (!availableRegions.includes(activeRegion)) {
      setActiveRegion("All Regions");
    }
  }, [activeRegion, availableRegions]);

  const resultLabel = `${displayedBusinesses.length} result${
    displayedBusinesses.length === 1 ? "" : "s"
  }`;

  return (
    <main>
      <Navbar />

      <div className="max-w-[1200px] mx-auto px-12 max-[960px]:px-6 py-20">
        <section className="mb-12 rounded-[32px] border border-border bg-[linear-gradient(180deg,#FFFFFF_0%,#F6F7F3_100%)] px-8 py-10 max-[960px]:px-6">
          <div className="grid grid-cols-[minmax(0,1fr)_260px] gap-8 max-[960px]:grid-cols-1">
            <div>
              <div className="font-mono text-[11px] font-medium tracking-[0.14em] uppercase text-ink-300 mb-4">
                Full Directory
              </div>
              <h1 className="font-display text-[64px] max-[960px]:text-[40px] font-normal leading-[0.94] tracking-[-0.035em] text-foreground mb-5 text-balance">
                Every BC startup, one screen.
              </h1>
              <p className="text-lg font-light text-ink-400 max-w-[620px] leading-relaxed">
                Browse the entire network with live search, region filters, and
                industry sorting. The page now loads the directory in batches so
                records appear reliably even with a large dataset.
              </p>
            </div>

            <div className="rounded-[24px] border border-border bg-card px-6 py-6 self-start">
              <div className="font-mono text-[11px] font-medium tracking-[0.12em] uppercase text-ink-300 mb-3">
                Network Snapshot
              </div>
              <div className="font-display text-[44px] leading-none tracking-[-0.04em] text-foreground mb-2">
                {isLoading ? "..." : displayedBusinesses.length}
              </div>
              <p className="text-sm text-ink-400 leading-relaxed">
                {isUsingFallback
                  ? "Fallback sample records are showing because the backend is unavailable."
                  : "Live database records after your active filters are applied."}
              </p>
            </div>
          </div>
        </section>

        <div className="flex items-center gap-4 mb-8 max-[640px]:flex-col max-[640px]:items-stretch">
          <SearchBar
            placeholder="Search startups, industries, descriptions..."
            value={search}
            onChange={setSearch}
            className="flex-1"
          />
          <Link
            href="/list"
            className="btn-press focus-ring inline-flex items-center justify-center font-sans text-[13px] font-medium px-5 py-3 rounded-full bg-foreground text-background hover:bg-ink-700 shrink-0"
          >
            + List Your Startup
          </Link>
        </div>

        <FilterPills
          filters={availableRegions}
          activeFilter={activeRegion}
          onFilterChange={setActiveRegion}
          className="mb-4"
        />

        <FilterPills
          filters={availableIndustries}
          activeFilter={activeIndustry}
          onFilterChange={setActiveIndustry}
          className="mb-8"
        />

        <div className="flex items-center justify-between gap-4 mb-8 max-[640px]:flex-col max-[640px]:items-start">
          <p className="text-xs text-ink-300">
            {isLoading
              ? "Loading startups..."
              : isUsingFallback
                ? `Showing fallback sample data. ${resultLabel}.`
                : `${resultLabel} from the live database.`}
          </p>

          {!isLoading && (
            <p className="font-mono text-[11px] tracking-[0.12em] uppercase text-ink-300">
              {activeRegion} / {activeIndustry}
            </p>
          )}
        </div>

        {!isLoading && displayedBusinesses.length === 0 ? (
          <EmptyState
            title="No startups found"
            description="Try adjusting your search or filters."
          />
        ) : (
          <div className="grid grid-cols-3 max-[960px]:grid-cols-2 max-[640px]:grid-cols-1 gap-6">
            {isLoading
              ? Array.from({ length: 9 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-56 rounded-[var(--r-xl)] bg-cloud animate-pulse"
                  />
                ))
              : displayedBusinesses.map((business) => (
                  <BusinessCard key={business.id} business={business} />
                ))}
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
