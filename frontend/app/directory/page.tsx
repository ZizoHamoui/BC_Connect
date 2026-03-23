"use client";

import { Suspense, useEffect, useState, useMemo, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { BusinessCard } from "@/components/business-card";
import type { Business } from "@/components/business-card";
import { FilterPills } from "@/components/filter-pills";
import { SearchBar } from "@/components/search-bar";
import { EmptyState } from "@/components/empty-state";
import {
  getBusinesses,
  getBusinessFilterOptions,
  getSavedBusinesses,
  removeSavedBusiness,
  saveBusiness,
  toBusinessCard,
} from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { sampleBusinesses } from "@/lib/sample-data";
import { AddBusinessModal } from "@/components/add-business-modal";
import { getBusinesses, toBusinessCard } from "@/lib/api";
import { sampleBusinesses, industries, regions } from "@/lib/sample-data";
import type { Business } from "@/components/business-card";
import { LayoutGrid, Map as MapIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const DirectoryMap = dynamic(
  () => import("@/components/directory-map").then((m) => m.DirectoryMap),
  { ssr: false, loading: () => <div className="w-full h-full bg-cloud animate-pulse rounded-[var(--r-xl)]" /> }
);

const PAGE_SIZE = 50;

const PAGE_SIZE = 50;
const ALL_INDUSTRIES = "All";
const ALL_REGIONS = "All Regions";

function normalizeValue(value: string) {
  return value.trim().toLowerCase();
}

function uniqueSorted(values: string[]) {
  return Array.from(new Set(values.filter(Boolean))).sort((a, b) =>
    a.localeCompare(b),
  );
}

export default function DirectoryPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isUsingFallback, setIsUsingFallback] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [nextPage, setNextPage] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [activeIndustry, setActiveIndustry] = useState(ALL_INDUSTRIES);
  const [activeRegion, setActiveRegion] = useState(ALL_REGIONS);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [availableIndustries, setAvailableIndustries] = useState<string[]>([
    ALL_INDUSTRIES,
  ]);
  const [availableRegions, setAvailableRegions] = useState<string[]>([
    ALL_REGIONS,
  ]);
  const [savedBusinessIds, setSavedBusinessIds] = useState<Set<string>>(
    new Set(),
  );
  const [savingBusinessIds, setSavingBusinessIds] = useState<Set<string>>(
    new Set(),
  );

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(timer);
  }, [search]);

  const buildRequestParams = useCallback(
    (page: number) => {
      const params = {
        withMeta: true as const,
        limit: PAGE_SIZE,
        page,
      };

      const filters: {
        search?: string;
        industry?: string;
        region?: string;
      } = {};

      if (debouncedSearch) filters.search = debouncedSearch;
      if (activeIndustry !== ALL_INDUSTRIES) filters.industry = activeIndustry;
      if (activeRegion !== ALL_REGIONS) filters.region = activeRegion;

      return {
        ...params,
        ...filters,
      };
    },
    [debouncedSearch, activeIndustry, activeRegion],
  );

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setIsLoadingMore(false);

    async function loadFirstPage() {
      try {
        const businessResponse = await getBusinesses(buildRequestParams(1));

        if (!isMounted) return;

        const firstPage = businessResponse.items.map(toBusinessCard);
        setBusinesses(firstPage);
        setHasMore(businessResponse.pagination.hasMore);
        setNextPage(businessResponse.pagination.nextPage);
        setIsUsingFallback(false);

        try {
          const options = await getBusinessFilterOptions(debouncedSearch);
          if (!isMounted) return;

          setAvailableIndustries([
            ALL_INDUSTRIES,
            ...uniqueSorted(options.industries),
          ]);
          setAvailableRegions([ALL_REGIONS, ...uniqueSorted(options.regions)]);
        } catch {
          setAvailableIndustries([
            ALL_INDUSTRIES,
            ...uniqueSorted(firstPage.map((business) => business.industry)),
          ]);
          setAvailableRegions([
            ALL_REGIONS,
            ...uniqueSorted(firstPage.map((business) => business.region)),
          ]);
        }
      } catch {
        if (!isMounted) return;

        setBusinesses(sampleBusinesses);
        setIsUsingFallback(true);
        setHasMore(false);
        setNextPage(null);
        setAvailableIndustries([
          ALL_INDUSTRIES,
          ...uniqueSorted(sampleBusinesses.map((business) => business.industry)),
        ]);
        setAvailableRegions([
          ALL_REGIONS,
          ...uniqueSorted(sampleBusinesses.map((business) => business.region)),
        ]);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadFirstPage();

    return () => {
      isMounted = false;
    };
  }, [buildRequestParams, debouncedSearch]);

  const loadMoreBusinesses = useCallback(async () => {
    if (isUsingFallback || isLoading || isLoadingMore || !hasMore || !nextPage) {
      return;
    }

    setIsLoadingMore(true);

    try {
      const response = await getBusinesses(buildRequestParams(nextPage));
      const mappedPage = response.items.map(toBusinessCard);

      setBusinesses((previous) => [...previous, ...mappedPage]);
      setHasMore(response.pagination.hasMore);
      setNextPage(response.pagination.nextPage);
    } catch {
      setHasMore(false);
      setNextPage(null);
      toast.error("Unable to load more businesses right now.");
    } finally {
      setIsLoadingMore(false);
    }
  }, [
    buildRequestParams,
    hasMore,
    isLoading,
    isLoadingMore,
    isUsingFallback,
    nextPage,
  ]);

  // Reset to page 1 when filters/search change
  useEffect(() => {
    let isMounted = true;

    async function loadSavedBusinesses() {
      if (!user || (user.role !== "member" && user.role !== "admin")) {
        setSavedBusinessIds(new Set());
        return;
      }

      try {
        const saved = await getSavedBusinesses();
        if (!isMounted) return;
        setSavedBusinessIds(new Set(saved.map((business) => business._id)));
      } catch {
        if (!isMounted) return;
        setSavedBusinessIds(new Set());
      }
    }

    loadSavedBusinesses();

    return () => {
      isMounted = false;
    };
  }, [user]);

  const handleSaveToggle = useCallback(
    async (business: Business) => {
      if (!user) {
        toast.error("Sign in to save businesses.");
        router.push("/auth");
        return;
      }

      if (user.role !== "member" && user.role !== "admin") {
        toast.error("Only members can save businesses.");
        return;
      }

      const businessId = business.id;
      const isCurrentlySaved = savedBusinessIds.has(businessId);

      setSavingBusinessIds((previous) => {
        const next = new Set(previous);
        next.add(businessId);
        return next;
      });

      try {
        if (isCurrentlySaved) {
          await removeSavedBusiness(businessId);
          setSavedBusinessIds((previous) => {
            const next = new Set(previous);
            next.delete(businessId);
            return next;
          });
          toast.success("Removed from saved businesses.");
        } else {
          await saveBusiness(businessId);
          setSavedBusinessIds((previous) => {
            const next = new Set(previous);
            next.add(businessId);
            return next;
          });
          toast.success("Saved to your profile.");
        }
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Unable to update saved businesses.";
        toast.error(message);
      } finally {
        setSavingBusinessIds((previous) => {
          const next = new Set(previous);
          next.delete(businessId);
          return next;
        });
      }
    },
    [router, savedBusinessIds, user],
  );

  const handleViewMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchBusinesses(nextPage, true);
  };

  const displayedBusinesses = useMemo(() => {
    if (!isUsingFallback) return businesses;

    const normalizedIndustry = normalizeValue(activeIndustry);
    const normalizedRegion = normalizeValue(activeRegion);
    const normalizedSearch = normalizeValue(debouncedSearch);

    return businesses.filter((business) => {
      const matchesIndustry =
        activeIndustry === ALL_INDUSTRIES ||
        normalizeValue(business.industry) === normalizedIndustry;
      const matchesRegion =
        activeRegion === ALL_REGIONS ||
        normalizeValue(business.region) === normalizedRegion;
      const matchesSearch =
        !normalizedSearch ||
        normalizeValue(business.name).includes(normalizedSearch) ||
        business.description
          .toLowerCase()
          .includes(normalizedSearch);

      return matchesIndustry && matchesRegion && matchesSearch;
    });
  }, [
    businesses,
    isUsingFallback,
    activeIndustry,
    activeRegion,
    debouncedSearch,
  ]);

  useEffect(() => {
    if (
      activeIndustry !== ALL_INDUSTRIES &&
      availableIndustries.length > 1 &&
      !availableIndustries.includes(activeIndustry)
    ) {
      setActiveIndustry(ALL_INDUSTRIES);
    }
  }, [activeIndustry, availableIndustries]);

  useEffect(() => {
    if (
      activeRegion !== ALL_REGIONS &&
      availableRegions.length > 1 &&
      !availableRegions.includes(activeRegion)
    ) {
      setActiveRegion(ALL_REGIONS);
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
                industry sorting. Use View More to load the next 50 businesses.
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
                  : "Live database records currently loaded after your filters are applied."}
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
            {user?.role === "admin" ? "+ Add a Listing" : "+ List Your Startup"}
          </button>

          {/* View mode toggle — only for logged-in users */}
          {user && (
            <div className="flex items-center rounded-full border border-border bg-card p-0.5">
              <button
                onClick={() => setViewMode("grid")}
                className={cn(
                  "btn-press focus-ring inline-flex items-center justify-center p-2 rounded-full transition-colors cursor-pointer",
                  viewMode === "grid" ? "bg-foreground text-background" : "text-ink-300 hover:text-foreground"
                )}
                aria-label="Grid view"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("map")}
                className={cn(
                  "btn-press focus-ring inline-flex items-center justify-center p-2 rounded-full transition-colors cursor-pointer",
                  viewMode === "map" ? "bg-foreground text-background" : "text-ink-300 hover:text-foreground"
                )}
                aria-label="Map view"
              >
                <MapIcon className="w-4 h-4" />
              </button>
            </div>
          )}
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
                : `${resultLabel} currently loaded from the live database.`}
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
        ) : viewMode === "map" && user ? (
          /* ─── Hybrid Map/List View ─── */
          <div className="flex gap-6 max-[960px]:flex-col" style={{ height: "70vh" }}>
            {/* Card list — left 1/3 */}
            <div className="w-1/3 max-[960px]:w-full max-[960px]:h-[40vh] overflow-y-auto space-y-4 pr-2 custom-scrollbar">
              {isLoading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-32 rounded-[var(--r-xl)] bg-cloud animate-pulse" />
                  ))
                : displayedBusinesses.map((biz) => (
                    <div
                      key={biz.id}
                      ref={(el) => { if (el) cardRefs.current.set(biz.id, el); }}
                      className={cn(
                        "transition-all duration-200 rounded-[var(--r-xl)]",
                        selectedBusinessId === biz.id && "ring-2 ring-[#3568B2] ring-offset-2"
                      )}
                    >
                      <BusinessCard
                        business={biz}
                        onClick={() => router.push(`/directory/${biz.id}`)}
                      />
                    </div>
                  ))}

              {/* View More in list */}
              {!isLoading && hasMore && !isUsingFallback && displayedBusinesses.length > 0 && (
                <div className="flex justify-center py-4">
                  <button
                    onClick={handleViewMore}
                    disabled={loadingMore}
                    className="btn-press focus-ring inline-flex items-center justify-center font-sans text-[13px] font-medium px-6 py-2 rounded-full border border-border bg-card text-foreground hover:bg-cloud transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {loadingMore ? "Loading…" : "View More"}
                  </button>
                </div>
              )}
            </div>

            {/* Map — right 2/3 */}
            <div className="w-2/3 max-[960px]:w-full max-[960px]:h-[50vh] sticky top-20">
              <DirectoryMap
                businesses={displayedBusinesses}
                selectedId={selectedBusinessId}
                onPinClick={(id) => {
                  setSelectedBusinessId(id);
                  const el = cardRefs.current.get(id);
                  if (el) {
                    el.scrollIntoView({ behavior: "smooth", block: "center" });
                  }
                }}
              />
            </div>
          </div>
        ) : (
          /* ─── Standard Grid View ─── */
          <>
            <div className="grid grid-cols-3 max-[960px]:grid-cols-2 max-[640px]:grid-cols-1 gap-6">
              {isLoading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-56 rounded-[var(--r-xl)] bg-cloud animate-pulse"
                    />
                  ))
                : displayedBusinesses.map((biz) => (
                    <BusinessCard key={biz.id} business={biz} onClick={() => router.push(`/directory/${biz.id}`)} />
                  ))}
            </div>

            {/* View More */}
            {!isLoading && hasMore && !isUsingFallback && displayedBusinesses.length > 0 && (
              <div className="flex justify-center mt-10">
                <button
                  onClick={handleViewMore}
                  disabled={loadingMore}
                  className="btn-press focus-ring inline-flex items-center justify-center font-sans text-[13px] font-medium px-8 py-3 rounded-full border border-border bg-card text-foreground hover:bg-cloud transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loadingMore ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Loading…
                    </>
                  ) : (
                    "View More"
                  )}
                </button>
              </div>
            )}
          </>
        )}

        {!isLoading && !isUsingFallback && hasMore && (
          <div className="flex justify-center mt-10">
            <button
              type="button"
              onClick={loadMoreBusinesses}
              disabled={isLoadingMore}
              className="btn-press focus-ring inline-flex items-center justify-center font-sans text-[13px] font-medium px-5 py-3 rounded-full bg-foreground text-background hover:bg-ink-700 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoadingMore ? "Loading..." : "View More (50)"}
            </button>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
