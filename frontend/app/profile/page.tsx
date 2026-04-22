"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
  updateProfile,
  type BusinessRecommendation,
} from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import {
  Bookmark,
  Sparkles,
  User,
  MapPin,
  Building2,
  ChevronRight,
  Star,
  Pencil,
  Check,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface RecommendationCard extends BusinessRecommendation {
  card: Business;
}

function toRecommendationCards(
  recommendations: BusinessRecommendation[]
): RecommendationCard[] {
  return recommendations.map((item) => ({
    ...item,
    card: toBusinessCard(item.business),
  }));
}

function ScoreDots({ score }: { score: number }) {
  const pct = Math.min(Math.max(score, 0), 100);
  const filled = Math.round((pct / 100) * 5);
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "w-2 h-2 rounded-full transition-colors",
            i < filled ? "bg-[#1B6B4F]" : "bg-border"
          )}
        />
      ))}
      <span className="ml-1.5 text-[11px] font-semibold text-[#1B6B4F]">
        {pct}%
      </span>
    </div>
  );
}

function RoleChip({ role }: { role: string }) {
  const map: Record<string, { label: string; bg: string; color: string }> = {
    admin: { label: "Admin", bg: "rgba(53,104,178,0.1)", color: "#3568B2" },
    member: { label: "Member", bg: "rgba(27,107,79,0.1)", color: "#1B6B4F" },
    visitor: { label: "Visitor", bg: "rgba(75,81,98,0.1)", color: "#4B5162" },
  };
  const s = map[role] ?? map.visitor;
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold"
      style={{ background: s.bg, color: s.color }}
    >
      {s.label}
    </span>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [savedBusinesses, setSavedBusinesses] = useState<Business[]>([]);
  const [recommendations, setRecommendations] = useState<RecommendationCard[]>([]);
  const [removingIds, setRemovingIds] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<"saved" | "recommendations">("saved");

  // Edit username
  const [editingName, setEditingName] = useState(false);
  const [draftName, setDraftName] = useState("");
  const [savingName, setSavingName] = useState(false);

  const canManageSaved =
    user && (user.role === "member" || user.role === "admin");

  const loadProfileData = useCallback(async () => {
    if (!canManageSaved) {
      setSavedBusinesses([]);
      setRecommendations([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const [saved, recResponse] = await Promise.all([
        getSavedBusinesses(),
        getRecommendations(),
      ]);
      setSavedBusinesses(saved.map(toBusinessCard));
      setRecommendations(toRecommendationCards(recResponse.recommendations));
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

  const handleUnsave = useCallback(async (business: Business) => {
    const id = business.id;
    setRemovingIds((p) => new Set([...p, id]));
    try {
      await removeSavedBusiness(id);
      setSavedBusinesses((p) => p.filter((b) => b.id !== id));
      const recResponse = await getRecommendations();
      setRecommendations(toRecommendationCards(recResponse.recommendations));
      toast.success("Removed from saved.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Unable to unsave.");
    } finally {
      setRemovingIds((p) => { const n = new Set(p); n.delete(id); return n; });
    }
  }, []);

  const handleSaveName = useCallback(async () => {
    if (!draftName.trim()) return;
    setSavingName(true);
    try {
      await updateProfile({ username: draftName.trim() });
      toast.success("Username updated.");
      setEditingName(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not update username.");
    } finally {
      setSavingName(false);
    }
  }, [draftName]);

  // ── Loading skeleton ──────────────────────────────────────────────────────
  if (loading) {
    return (
      <main>
        <Navbar />
        <div className="max-w-[1200px] mx-auto px-12 max-[960px]:px-6 py-24">
          <div className="h-48 rounded-[32px] bg-cloud animate-pulse mb-8" />
          <div className="grid grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-56 rounded-[var(--r-xl)] bg-cloud animate-pulse" />
            ))}
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  // ── Not signed in ─────────────────────────────────────────────────────────
  if (!user) {
    return (
      <main>
        <Navbar />
        <div className="max-w-[700px] mx-auto px-12 max-[960px]:px-6 py-40 text-center">
          <div className="w-16 h-16 rounded-full bg-cloud flex items-center justify-center mx-auto mb-6">
            <User className="w-7 h-7 text-ink-200" />
          </div>
          <h1 className="font-display text-[44px] leading-[1] tracking-[-0.03em] text-foreground mb-4">
            Sign in to view your profile
          </h1>
          <p className="text-lg text-ink-400 font-light mb-8 leading-relaxed">
            Create an account to save businesses and get personalised AI recommendations.
          </p>
          <Link
            href="/auth"
            className="btn-press focus-ring inline-flex items-center justify-center font-sans text-[14px] font-semibold px-8 py-3.5 rounded-full bg-foreground text-background hover:bg-ink-700 transition-colors"
          >
            Sign in or Register
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  const initials = user.username
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <main>
      <Navbar />

      <div className="max-w-[1200px] mx-auto px-12 max-[960px]:px-6 py-16">

        {/* ── Hero profile card ─────────────────────────────────────────────── */}
        <section
          className="mb-10 rounded-[32px] border border-border overflow-hidden"
          style={{ background: "linear-gradient(160deg, #FFFFFF 0%, #F6F7F3 100%)" }}
        >
          {/* Top coloured band */}
          <div
            className="h-28 w-full relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #EFF2FA 0%, #E6F3EE 60%, #F6F7F3 100%)",
            }}
          >
            {/* subtle grid */}
            <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 800 112" preserveAspectRatio="xMidYMid slice">
              {[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15].map(i => (
                <line key={`v${i}`} x1={i * 53} y1="0" x2={i * 53} y2="112" stroke="#3568B2" strokeWidth="0.5" strokeDasharray="3 5"/>
              ))}
              {[0,1,2,3].map(i => (
                <line key={`h${i}`} x1="0" y1={i * 37} x2="800" y2={i * 37} stroke="#1B6B4F" strokeWidth="0.5" strokeDasharray="3 5"/>
              ))}
            </svg>
          </div>

          <div className="relative px-8 pb-8 max-[640px]:px-5">
            {/* Avatar row */}
            <div className="flex items-end gap-5 -mt-10 mb-6">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#3568B2] to-[#1B6B4F] flex items-center justify-center shrink-0 border-4 border-white shadow-md">
                <span className="font-display text-[28px] text-white leading-none">{initials}</span>
              </div>
              <div className="pb-1">
                <RoleChip role={user.role} />
              </div>
            </div>

            <div className="flex items-start justify-between gap-6 max-[640px]:flex-col">
              <div>
                {/* Editable name */}
                {editingName ? (
                  <div className="flex items-center gap-2 mb-1">
                    <input
                      autoFocus
                      value={draftName}
                      onChange={(e) => setDraftName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSaveName();
                        if (e.key === "Escape") setEditingName(false);
                      }}
                      className="font-display text-[32px] leading-[1] tracking-[-0.02em] text-foreground bg-transparent border-b-2 border-[#3568B2] outline-none w-60"
                    />
                    <button
                      onClick={handleSaveName}
                      disabled={savingName}
                      className="w-7 h-7 rounded-full bg-[#1B6B4F] flex items-center justify-center hover:bg-[#145a3e] transition-colors"
                    >
                      <Check className="w-3.5 h-3.5 text-white" />
                    </button>
                    <button
                      onClick={() => setEditingName(false)}
                      className="w-7 h-7 rounded-full bg-cloud flex items-center justify-center hover:bg-border transition-colors"
                    >
                      <X className="w-3.5 h-3.5 text-ink-300" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 mb-1 group/name">
                    <h1 className="font-display text-[36px] max-[640px]:text-[28px] leading-[1] tracking-[-0.02em] text-foreground">
                      {user.username}
                    </h1>
                    <button
                      onClick={() => { setDraftName(user.username); setEditingName(true); }}
                      className="w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover/name:opacity-100 transition-opacity hover:bg-cloud"
                      aria-label="Edit username"
                    >
                      <Pencil className="w-3 h-3 text-ink-300" />
                    </button>
                  </div>
                )}
                <p className="text-[13px] text-ink-300">{user.role} account</p>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-6 shrink-0 max-[640px]:gap-4">
                <div className="text-center">
                  <div className="font-display text-[32px] leading-none tracking-[-0.03em] text-foreground">
                    {isLoading ? "—" : savedBusinesses.length}
                  </div>
                  <div className="text-[11px] font-medium text-ink-300 mt-0.5">Saved</div>
                </div>
                <div className="w-px h-8 bg-border" />
                <div className="text-center">
                  <div className="font-display text-[32px] leading-none tracking-[-0.03em] text-foreground">
                    {isLoading ? "—" : recommendations.length}
                  </div>
                  <div className="text-[11px] font-medium text-ink-300 mt-0.5">Recommendations</div>
                </div>
                <div className="w-px h-8 bg-border" />
                <Link
                  href="/directory"
                  className="btn-press focus-ring inline-flex items-center gap-1.5 font-sans text-[13px] font-medium px-4 py-2 rounded-full bg-foreground text-background hover:bg-ink-700 transition-colors"
                >
                  Browse Directory
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── Visitor gate ──────────────────────────────────────────────────── */}
        {!canManageSaved ? (
          <div className="rounded-[var(--r-xl)] border border-border bg-card px-8 py-12 text-center">
            <Building2 className="w-8 h-8 text-ink-200 mx-auto mb-4" />
            <h2 className="font-display text-[28px] tracking-[-0.02em] text-foreground mb-2">
              Member account required
            </h2>
            <p className="text-sm text-ink-400 max-w-sm mx-auto">
              Only member and admin accounts can save businesses and receive AI recommendations.
            </p>
          </div>
        ) : (
          <>
            {/* ── Tab bar ───────────────────────────────────────────────────── */}
            <div className="flex items-center gap-1 mb-8 border-b border-border">
              {(["saved", "recommendations"] as const).map((tab) => {
                const icons = { saved: Bookmark, recommendations: Sparkles };
                const labels = { saved: `Saved (${savedBusinesses.length})`, recommendations: "AI Recommendations" };
                const Icon = icons[tab];
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      "btn-press focus-ring inline-flex items-center gap-2 px-5 py-3 text-[13px] font-semibold border-b-2 transition-all -mb-px",
                      activeTab === tab
                        ? "border-foreground text-foreground"
                        : "border-transparent text-ink-300 hover:text-ink-400"
                    )}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {labels[tab]}
                  </button>
                );
              })}
            </div>

            {/* ── Saved tab ─────────────────────────────────────────────────── */}
            {activeTab === "saved" && (
              <>
                {isLoading ? (
                  <div className="grid grid-cols-3 max-[960px]:grid-cols-2 max-[640px]:grid-cols-1 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i} className="h-56 rounded-[var(--r-xl)] bg-cloud animate-pulse" />
                    ))}
                  </div>
                ) : savedBusinesses.length === 0 ? (
                  <div className="py-20 text-center">
                    <div className="w-14 h-14 rounded-2xl bg-cloud flex items-center justify-center mx-auto mb-5">
                      <Bookmark className="w-6 h-6 text-ink-200" />
                    </div>
                    <h3 className="font-display text-[26px] tracking-[-0.02em] text-foreground mb-2">
                      Nothing saved yet
                    </h3>
                    <p className="text-sm text-ink-400 max-w-xs mx-auto mb-8">
                      Browse the directory and click the bookmark icon on any business card to save it here.
                    </p>
                    <Link
                      href="/directory"
                      className="btn-press focus-ring inline-flex items-center gap-2 font-sans text-[13px] font-semibold px-6 py-3 rounded-full bg-foreground text-background hover:bg-ink-700 transition-colors"
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      Open Directory
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 max-[960px]:grid-cols-2 max-[640px]:grid-cols-1 gap-6">
                    {savedBusinesses.map((biz) => (
                      <BusinessCard
                        key={biz.id}
                        business={biz}
                        onClick={() => router.push(`/directory/${biz.id}`)}
                        showSaveButton
                        isSaved
                        isSaveLoading={removingIds.has(biz.id)}
                        onToggleSave={handleUnsave}
                      />
                    ))}
                  </div>
                )}
              </>
            )}

            {/* ── Recommendations tab ───────────────────────────────────────── */}
            {activeTab === "recommendations" && (
              <>
                {isLoading ? (
                  <div className="grid grid-cols-3 max-[960px]:grid-cols-2 max-[640px]:grid-cols-1 gap-6">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-72 rounded-[var(--r-xl)] bg-cloud animate-pulse" />
                    ))}
                  </div>
                ) : recommendations.length === 0 ? (
                  <div className="py-20 text-center">
                    <div className="w-14 h-14 rounded-2xl bg-cloud flex items-center justify-center mx-auto mb-5">
                      <Sparkles className="w-6 h-6 text-ink-200" />
                    </div>
                    <h3 className="font-display text-[26px] tracking-[-0.02em] text-foreground mb-2">
                      Save a few businesses first
                    </h3>
                    <p className="text-sm text-ink-400 max-w-xs mx-auto mb-8">
                      Once you save 3+ businesses, the AI engine will suggest your next three relevant matches from the BC network.
                    </p>
                    <button
                      onClick={() => setActiveTab("saved")}
                      className="btn-press focus-ring inline-flex items-center gap-2 font-sans text-[13px] font-semibold px-6 py-3 rounded-full border border-border bg-card text-foreground hover:bg-cloud transition-colors"
                    >
                      <Bookmark className="w-3.5 h-3.5" />
                      View Saved
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-2 mb-6">
                      <Star className="w-4 h-4 text-[#1B6B4F]" />
                      <p className="text-[13px] text-ink-400">
                        Based on your {savedBusinesses.length} saved businesses
                      </p>
                    </div>
                    <div className="grid grid-cols-3 max-[960px]:grid-cols-2 max-[640px]:grid-cols-1 gap-6">
                      {recommendations.map((item) => (
                        <div
                          key={item.card.id}
                          className="rounded-[var(--r-xl)] border border-border bg-card overflow-hidden"
                        >
                          <BusinessCard
                            business={item.card}
                            onClick={() => router.push(`/directory/${item.card.id}`)}
                          />
                          <div className="px-5 py-4 border-t border-border bg-[linear-gradient(180deg,#F9FAF8_0%,#FFFFFF_100%)]">
                            <div className="flex items-center justify-between mb-2">
                              <p className="font-mono text-[10px] tracking-[0.12em] uppercase text-ink-300">
                                Match score
                              </p>
                              <ScoreDots score={item.score} />
                            </div>
                            <p className="text-[12px] text-ink-400 leading-relaxed line-clamp-2">
                              {item.reasons.join(" ")}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </>
            )}
          </>
        )}
      </div>

      <Footer />
    </main>
  );
}
