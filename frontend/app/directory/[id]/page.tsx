"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { IndustryTag } from "@/components/industry-tag";
import { StatusBadge } from "@/components/status-badge";
import { EditBusinessModal } from "@/components/edit-business-modal";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/lib/auth-context";
import {
  getBusinessById,
  deleteBusinessAdmin,
  getSavedBusinesses,
  saveBusiness,
  removeSavedBusiness,
  toBusinessCard,
  type ApiBusiness,
} from "@/lib/api";
import { sampleBusinesses } from "@/lib/sample-data";
import { toast } from "sonner";
import {
  MapPin,
  ArrowLeft,
  Users,
  Globe,
  Mail,
  Phone,
  Building2,
  Pencil,
  Trash2,
  Calendar,
  TrendingUp,
  DollarSign,
  BarChart3,
  Linkedin,
  Twitter,
  Github,
  Heart,
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
  const { user } = useAuth();
  const id = params.id as string;
  const isAdmin = user?.role === "admin";

  const [business, setBusiness] = useState<ApiBusiness | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUsingFallback, setIsUsingFallback] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaveLoading, setIsSaveLoading] = useState(false);

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

  useEffect(() => {
    if (!user || !business) return;
    getSavedBusinesses()
      .then((saved) => setIsSaved(saved.some((b) => b._id === business._id)))
      .catch(() => {});
  }, [user, business]);

  const handleToggleSave = async () => {
    if (!user) {
      toast("Sign in to save businesses", {
        action: { label: "Sign in", onClick: () => router.push("/auth") },
      });
      return;
    }
    if (!business || !card) return;
    const newSaved = !isSaved;
    setIsSaved(newSaved);
    setIsSaveLoading(true);
    try {
      if (newSaved) {
        await saveBusiness(business._id);
        toast.success(`${card.name} saved`);
      } else {
        await removeSavedBusiness(business._id);
        toast.success(`${card.name} removed from saved`);
      }
    } catch (err) {
      setIsSaved(!newSaved);
      toast.error(err instanceof Error ? err.message : "Failed to update saved.");
    } finally {
      setIsSaveLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!business) return;
    setIsDeleting(true);
    try {
      await deleteBusinessAdmin(business._id);
      toast.success(`${business.name} has been deleted`);
      router.push("/directory");
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to delete business.";
      toast.error(msg);
      setIsDeleting(false);
    }
  };

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
              className="w-full h-[300px] rounded-[var(--r-xl)] overflow-hidden flex items-center justify-center mb-10 relative"
              style={{
                background: `linear-gradient(135deg, ${grad.from}, ${grad.to})`,
              }}
            >
              {business.logoUrl ? (
                <img
                  src={business.logoUrl}
                  alt={`${card.name} logo`}
                  className="max-h-[120px] max-w-[280px] object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    e.currentTarget.nextElementSibling?.removeAttribute("style");
                  }}
                />
              ) : null}
              <svg
                width="80"
                height="80"
                viewBox="0 0 24 24"
                fill="none"
                stroke={grad.icon}
                strokeWidth="1.5"
                opacity="0.2"
                style={business.logoUrl ? { display: "none" } : undefined}
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
            <div className="flex items-start justify-between gap-4 mb-3">
              <h1 className="font-display text-[48px] max-[960px]:text-[32px] leading-[1.05] tracking-[-0.02em] text-foreground">
                {card.name}
              </h1>
              <div className="flex items-center gap-2 shrink-0 pt-2">
                <button
                  onClick={handleToggleSave}
                  disabled={isSaveLoading}
                  aria-label={isSaved ? `Unsave ${card.name}` : `Save ${card.name}`}
                  className={`btn-press focus-ring inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full border transition-all duration-150 disabled:opacity-50 ${
                    isSaved
                      ? "bg-red-50 border-red-200 text-red-500 hover:bg-red-100"
                      : "border-border text-ink-400 hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  <Heart
                    className={`w-4 h-4 transition-all duration-150 ${isSaved ? "fill-red-500 text-red-500" : ""}`}
                  />
                  {isSaved ? "Saved" : "Save"}
                </button>
                {isAdmin && (
                  <>
                    <button
                      onClick={() => setEditOpen(true)}
                      className="btn-press focus-ring inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full border border-border text-foreground hover:bg-muted/50 transition-colors cursor-pointer"
                    >
                      <Pencil className="w-4 h-4" />
                      Edit
                    </button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button className="btn-press focus-ring inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full bg-[#FDF0EE] text-[#B33B2E] hover:bg-[#fbe3df] transition-colors cursor-pointer">
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Business</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete{" "}
                            <span className="font-semibold text-foreground">
                              {card.name}
                            </span>
                            ? This action cannot be undone and will permanently
                            remove the listing from the directory.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel disabled={isDeleting}>
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="bg-[#B33B2E] hover:bg-[#922f24] text-white"
                          >
                            {isDeleting ? (
                              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                              "Delete"
                            )}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </>
                )}
              </div>
            </div>
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
              {business.foundedYear && (
                <div className="flex items-center gap-3 p-4 rounded-[var(--r-lg)] border border-border bg-card">
                  <Calendar className="w-5 h-5 text-ink-300" />
                  <div>
                    <p className="text-xs text-ink-300 font-medium uppercase tracking-wider">
                      Founded
                    </p>
                    <p className="text-sm font-semibold text-foreground">
                      {business.foundedYear}
                    </p>
                  </div>
                </div>
              )}
              {business.stage && (
                <div className="flex items-center gap-3 p-4 rounded-[var(--r-lg)] border border-border bg-card">
                  <TrendingUp className="w-5 h-5 text-ink-300" />
                  <div>
                    <p className="text-xs text-ink-300 font-medium uppercase tracking-wider">
                      Stage
                    </p>
                    <p className="text-sm font-semibold text-foreground">
                      {business.stage}
                    </p>
                  </div>
                </div>
              )}
              {business.fundingRaised && (
                <div className="flex items-center gap-3 p-4 rounded-[var(--r-lg)] border border-border bg-card">
                  <DollarSign className="w-5 h-5 text-ink-300" />
                  <div>
                    <p className="text-xs text-ink-300 font-medium uppercase tracking-wider">
                      Funding Raised
                    </p>
                    <p className="text-sm font-semibold text-foreground">
                      {business.fundingRaised}
                    </p>
                  </div>
                </div>
              )}
              {business.revenueRange && (
                <div className="flex items-center gap-3 p-4 rounded-[var(--r-lg)] border border-border bg-card">
                  <BarChart3 className="w-5 h-5 text-ink-300" />
                  <div>
                    <p className="text-xs text-ink-300 font-medium uppercase tracking-wider">
                      Revenue
                    </p>
                    <p className="text-sm font-semibold text-foreground">
                      {business.revenueRange}
                    </p>
                  </div>
                </div>
              )}
              {business.customerCount != null && business.customerCount > 0 && (
                <div className="flex items-center gap-3 p-4 rounded-[var(--r-lg)] border border-border bg-card">
                  <Users className="w-5 h-5 text-ink-300" />
                  <div>
                    <p className="text-xs text-ink-300 font-medium uppercase tracking-wider">
                      Customers
                    </p>
                    <p className="text-sm font-semibold text-foreground">
                      {business.customerCount.toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Social links */}
            {(business.socialLinks?.linkedin ||
              business.socialLinks?.twitter ||
              business.socialLinks?.github) && (
              <div className="flex items-center gap-3 mb-10">
                {business.socialLinks.linkedin && (
                  <a
                    href={business.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-press focus-ring inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full border border-border text-ink-400 hover:text-foreground hover:bg-muted/50 transition-colors"
                  >
                    <Linkedin className="w-4 h-4" />
                    LinkedIn
                  </a>
                )}
                {business.socialLinks.twitter && (
                  <a
                    href={business.socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-press focus-ring inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full border border-border text-ink-400 hover:text-foreground hover:bg-muted/50 transition-colors"
                  >
                    <Twitter className="w-4 h-4" />
                    Twitter
                  </a>
                )}
                {business.socialLinks.github && (
                  <a
                    href={business.socialLinks.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-press focus-ring inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full border border-border text-ink-400 hover:text-foreground hover:bg-muted/50 transition-colors"
                  >
                    <Github className="w-4 h-4" />
                    GitHub
                  </a>
                )}
              </div>
            )}

            {isUsingFallback && (
              <p className="text-xs text-ink-300">
                Showing sample data — backend unavailable.
              </p>
            )}

            {isAdmin && business && (
              <EditBusinessModal
                open={editOpen}
                onOpenChange={setEditOpen}
                business={business}
                onBusinessUpdated={(updated) => setBusiness(updated)}
              />
            )}
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
