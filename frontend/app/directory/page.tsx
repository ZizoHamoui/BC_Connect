"use client";

import { Suspense, useEffect, useState, useMemo, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
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
import { LayoutGrid, Map as MapIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const DirectoryMap = dynamic(
  () => import("@/components/directory-map").then((m) => m.DirectoryMap),
  { ssr: false, loading: () => <div className="w-full h-full bg-cloud animate-pulse rounded-[var(--r-xl)]" /> }
);

const PAGE_SIZE = 50;

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
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "map">(user ? "map" : "grid");
  const [selectedBusinessId, setSelectedBusinessId] = useState<string | null>(null);
  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map());

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

  const fetchBusinesses = useCallback(async (pageNum: number = 1, append: boolean = false) => {
    if (!user) return;
    if (!append) setIsLoading(true);
    else setLoadingMore(true);
    try {
      const params: Parameters<typeof getBusinesses>[0] = { limit: PAGE_SIZE, page: pageNum };
      if (debouncedSearch) params.search = debouncedSearch;
      if (activeIndustry !== "All") params.industry = activeIndustry;
      if (activeRegion !== "All Regions") params.region = activeRegion;

      const data = await getBusinesses(params);
      const mapped = data.map(toBusinessCard);
      setBusinesses((prev) => append ? [...prev, ...mapped] : mapped);
      setHasMore(data.length >= PAGE_SIZE);
      setIsUsingFallback(false);
    } catch {
      if (!append) {
        setBusinesses(sampleBusinesses);
        setIsUsingFallback(true);
        setHasMore(false);
      }
    } finally {
      setIsLoading(false);
      setLoadingMore(false);
    }
  }, [user, debouncedSearch, activeIndustry, activeRegion]);

  // Reset to page 1 when filters/search change
  useEffect(() => {
    setPage(1);
    setHasMore(true);
    fetchBusinesses(1, false);
  }, [fetchBusinesses]);

  const handleViewMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchBusinesses(nextPage, true);
  };

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
