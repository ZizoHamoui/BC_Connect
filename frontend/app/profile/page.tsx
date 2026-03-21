"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { BusinessCard } from "@/components/business-card";
import { EmptyState } from "@/components/empty-state";
import type { Business } from "@/components/business-card";
import {
  getRecommendations,
  getSavedBusinesses,
  removeSavedBusiness,
  toBusinessCard,
  type BusinessRecommendation,
} from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

interface RecommendationCard extends BusinessRecommendation {
  card: Business;
}

function toRecommendationCards(
  recommendations: BusinessRecommendation[],
): RecommendationCard[] {
  return recommendations.map((item) => ({
    ...item,
    card: toBusinessCard(item.business),
  }));
}

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [savedBusinesses, setSavedBusinesses] = useState<Business[]>([]);
  const [recommendations, setRecommendations] = useState<RecommendationCard[]>(
    [],
  );
  const [removingIds, setRemovingIds] = useState<Set<string>>(new Set());

  const canManageSaved = user && (user.role === "member" || user.role === "admin");

  const loadProfileData = useCallback(async () => {
    if (!canManageSaved) {
      setSavedBusinesses([]);
      setRecommendations([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    try {
      const [saved, recommendationResponse] = await Promise.all([
        getSavedBusinesses(),
        getRecommendations(),
      ]);

      setSavedBusinesses(saved.map(toBusinessCard));
      setRecommendations(
        toRecommendationCards(recommendationResponse.recommendations),
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to load your profile.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, [canManageSaved]);

  useEffect(() => {
    if (loading) return;
    loadProfileData();
  }, [loadProfileData, loading]);

  const handleUnsave = useCallback(
    async (business: Business) => {
      const businessId = business.id;

      setRemovingIds((previous) => {
        const next = new Set(previous);
        next.add(businessId);
        return next;
      });

      try {
        await removeSavedBusiness(businessId);
        setSavedBusinesses((previous) =>
          previous.filter((item) => item.id !== businessId),
        );

        const recommendationResponse = await getRecommendations();
        setRecommendations(
          toRecommendationCards(recommendationResponse.recommendations),
        );
        toast.success("Removed from your saved businesses.");
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Unable to remove saved business.";
        toast.error(message);
      } finally {
        setRemovingIds((previous) => {
          const next = new Set(previous);
          next.delete(businessId);
          return next;
        });
      }
    },
    [],
  );

  return (
    <main>
      <Navbar />

      <div className="max-w-[1200px] mx-auto px-12 max-[960px]:px-6 py-20">
        <section className="mb-12 rounded-[32px] border border-border bg-[linear-gradient(180deg,#FFFFFF_0%,#F6F7F3_100%)] px-8 py-10 max-[960px]:px-6">
          <div className="font-mono text-[11px] font-medium tracking-[0.14em] uppercase text-ink-300 mb-4">
            Member Profile
          </div>
          <h1 className="font-display text-[64px] max-[960px]:text-[40px] font-normal leading-[0.94] tracking-[-0.035em] text-foreground mb-4 text-balance">
            Saved businesses and recommendations.
          </h1>
          <p className="text-lg font-light text-ink-400 max-w-[620px] leading-relaxed">
            Save companies from the directory and get 3 AI-ranked suggestions
            tailored to your saved profile.
          </p>
        </section>

        {loading || isLoading ? (
          <div className="grid grid-cols-3 max-[960px]:grid-cols-2 max-[640px]:grid-cols-1 gap-6 mb-14">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-56 rounded-[var(--r-xl)] bg-cloud animate-pulse"
              />
            ))}
          </div>
        ) : !user ? (
          <EmptyState
            title="Sign in to view your profile"
            description="Create an account to save businesses and receive personalized recommendations."
          />
        ) : !canManageSaved ? (
          <EmptyState
            title="Member account required"
            description="Only member accounts can save businesses and receive recommendations."
          />
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-[38px] leading-[1.05] tracking-[-0.02em] text-foreground">
                Saved businesses
              </h2>
              <p className="text-sm text-ink-300">
                {savedBusinesses.length} saved
              </p>
            </div>

            {savedBusinesses.length === 0 ? (
              <div className="mb-14">
                <EmptyState
                  title="No saved businesses yet"
                  description="Visit the directory and use the bookmark icon to save businesses to your profile."
                />
                <div className="mt-6 text-center">
                  <Link
                    href="/directory"
                    className="btn-press focus-ring inline-flex items-center justify-center font-sans text-[13px] font-medium px-5 py-3 rounded-full bg-foreground text-background hover:bg-ink-700"
                  >
                    Browse Directory
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-3 max-[960px]:grid-cols-2 max-[640px]:grid-cols-1 gap-6 mb-14">
                {savedBusinesses.map((business) => (
                  <BusinessCard
                    key={business.id}
                    business={business}
                    showSaveButton
                    isSaved
                    isSaveLoading={removingIds.has(business.id)}
                    onToggleSave={handleUnsave}
                  />
                ))}
              </div>
            )}

            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-[38px] leading-[1.05] tracking-[-0.02em] text-foreground">
                AI recommendations
              </h2>
              <p className="text-sm text-ink-300">Top 3 matches</p>
            </div>

            {recommendations.length === 0 ? (
              <EmptyState
                title="No recommendations yet"
                description="Save a few businesses and the recommendation engine will suggest the next three relevant matches."
              />
            ) : (
              <div className="grid grid-cols-3 max-[960px]:grid-cols-2 max-[640px]:grid-cols-1 gap-6">
                {recommendations.map((item) => (
                  <div
                    key={item.card.id}
                    className="rounded-[var(--r-xl)] border border-border bg-card p-4"
                  >
                    <BusinessCard business={item.card} />
                    <div className="mt-4 px-2">
                      <p className="font-mono text-[11px] tracking-[0.12em] uppercase text-ink-300 mb-2">
                        Recommendation score: {item.score}
                      </p>
                      <p className="text-sm text-ink-400 leading-relaxed">
                        {item.reasons.join(" ")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <Footer />
    </main>
  );
}
