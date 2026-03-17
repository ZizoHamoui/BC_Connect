"use client";

import { Suspense, useEffect, useState, useMemo, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { BusinessCard } from "@/components/business-card";
import { FilterPills } from "@/components/filter-pills";
import { SearchBar } from "@/components/search-bar";
import { EmptyState } from "@/components/empty-state";
import { AddBusinessModal } from "@/components/add-business-modal";
import { getBusinesses, toBusinessCard } from "@/lib/api";
import { sampleBusinesses, industries, regions } from "@/lib/sample-data";
import type { Business } from "@/components/business-card";

export default function DirectoryPage() {
  return (
    <Suspense>
      <DirectoryContent />
    </Suspense>
  );
}

function DirectoryContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUsingFallback, setIsUsingFallback] = useState(false);
  const [search, setSearch] = useState("");
  const [activeIndustry, setActiveIndustry] = useState("All");
  const [activeRegion, setActiveRegion] = useState("All Regions");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/auth");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (searchParams.get("list") === "true") {
      setModalOpen(true);
    }
  }, [searchParams]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchBusinesses = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const params: Parameters<typeof getBusinesses>[0] = { limit: 200 };
      if (debouncedSearch) params.search = debouncedSearch;
      if (activeIndustry !== "All") params.industry = activeIndustry;
      if (activeRegion !== "All Regions") params.region = activeRegion;

      const data = await getBusinesses(params);
      setBusinesses(data.map(toBusinessCard));
      setIsUsingFallback(false);
    } catch {
      setBusinesses(sampleBusinesses);
      setIsUsingFallback(true);
    } finally {
      setIsLoading(false);
    }
  }, [user, debouncedSearch, activeIndustry, activeRegion]);

  useEffect(() => {
    fetchBusinesses();
  }, [fetchBusinesses]);

  const displayedBusinesses = useMemo(() => {
    if (!isUsingFallback) return businesses;
    return businesses.filter((b) => {
      const matchesIndustry =
        activeIndustry === "All" || b.industry === activeIndustry;
      const matchesRegion =
        activeRegion === "All Regions" || b.region === activeRegion;
      const matchesSearch =
        !debouncedSearch ||
        b.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        b.description.toLowerCase().includes(debouncedSearch.toLowerCase());
      return matchesIndustry && matchesRegion && matchesSearch;
    });
  }, [
    businesses,
    isUsingFallback,
    activeIndustry,
    activeRegion,
    debouncedSearch,
  ]);

  if (authLoading || !user) {
    return null;
  }

  return (
    <main>
      <Navbar />

      <div className="max-w-[1200px] mx-auto px-12 max-[960px]:px-6 py-20">
        <div className="mb-12">
          <div className="font-mono text-[11px] font-medium tracking-[0.14em] uppercase text-ink-300 mb-4">
            Directory
          </div>
          <h1 className="font-display text-[56px] max-[960px]:text-[36px] font-normal leading-[0.95] tracking-[-0.03em] text-foreground mb-4">
            BC Startups.
          </h1>
          <p className="text-lg font-light text-ink-400 max-w-[560px] leading-relaxed">
            Browse the full directory of startups across British Columbia.
          </p>
        </div>

        <div className="flex items-center gap-4 mb-8 max-[640px]:flex-col max-[640px]:items-stretch">
          <SearchBar
            placeholder="Search startups, industries, descriptions…"
            value={search}
            onChange={setSearch}
            className="flex-1"
          />
          <button
            onClick={() => setModalOpen(true)}
            className="btn-press focus-ring inline-flex items-center justify-center font-sans text-[13px] font-medium px-5 py-3 rounded-full bg-foreground text-background hover:bg-ink-700 shrink-0 cursor-pointer"
          >
            {user?.role === "admin" ? "+ Add a Listing" : "+ List Your Startup"}
          </button>
        </div>

        <FilterPills
          filters={regions}
          activeFilter={activeRegion}
          onFilterChange={setActiveRegion}
          className="mb-4"
        />

        <FilterPills
          filters={industries}
          activeFilter={activeIndustry}
          onFilterChange={setActiveIndustry}
          className="mb-8"
        />

        <p className="text-xs text-ink-300 mb-8">
          {isLoading
            ? "Loading…"
            : isUsingFallback
              ? `Showing fallback sample data (backend unavailable). ${displayedBusinesses.length} result${displayedBusinesses.length !== 1 ? "s" : ""}.`
              : `${displayedBusinesses.length} result${displayedBusinesses.length !== 1 ? "s" : ""} — live data.`}
        </p>

        {!isLoading && displayedBusinesses.length === 0 ? (
          <EmptyState
            title="No startups found"
            description="Try adjusting your search or filters."
          />
        ) : (
          <div className="grid grid-cols-3 max-[960px]:grid-cols-2 max-[640px]:grid-cols-1 gap-6">
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-56 rounded-[var(--r-xl)] bg-cloud animate-pulse"
                  />
                ))
              : displayedBusinesses.map((biz) => (
                  <BusinessCard key={biz.id} business={biz} />
                ))}
          </div>
        )}
      </div>

      <Footer />

      <AddBusinessModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onBusinessAdded={(newBiz) =>
          setBusinesses((prev) => [newBiz, ...prev])
        }
      />
    </main>
  );
}
