"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { toast } from "sonner"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { StatCard } from "@/components/stat-card"
import { PendingListingsTable } from "@/components/admin/pending-listings-table"
import { ActionHistoryTable } from "@/components/admin/action-history-table"
import { MemberRoleTable } from "@/components/admin/create-admin-form"
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table"
import {
  getAdminStats,
  getPendingBusinesses,
  getAdminUsers,
  getActionHistory,
  updateBusinessStatus,
  deleteBusinessAdmin,
} from "@/lib/api"
import type { AdminStats, AdminUser, ApiBusiness, AdminActionEntry } from "@/lib/api"

export default function AdminPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()

  const [stats, setStats] = useState<AdminStats | null>(null)
  const [pending, setPending] = useState<ApiBusiness[]>([])
  const [admins, setAdmins] = useState<AdminUser[]>([])
  const [history, setHistory] = useState<AdminActionEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "admin")) {
      router.replace("/")
    }
  }, [user, authLoading, router])

  const fetchData = useCallback(async () => {
    setIsLoading(true)
    try {
      const [statsData, pendingData, adminsData, historyData] = await Promise.all([
        getAdminStats(),
        getPendingBusinesses(),
        getAdminUsers(),
        getActionHistory(),
      ])
      setStats(statsData)
      setPending(pendingData)
      setAdmins(adminsData)
      setHistory(historyData)
    } catch (err) {
      toast.error("Failed to load admin data.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (user?.role === "admin") {
      fetchData()
    }
  }, [user, fetchData])

  async function refreshHistory() {
    try {
      const data = await getActionHistory()
      setHistory(data)
    } catch {
      // silent — history refresh is non-critical
    }
  }

  async function handleApprove(id: string) {
    setActionLoadingId(id)
    try {
      await updateBusinessStatus(id, "verified")
      setPending((prev) => prev.filter((b) => b._id !== id))
      setStats((prev) =>
        prev ? { ...prev, totalBusinesses: prev.totalBusinesses } : prev,
      )
      toast.success("Listing approved.")
      refreshHistory()
    } catch {
      toast.error("Failed to approve listing.")
    } finally {
      setActionLoadingId(null)
    }
  }

  async function handleReject(id: string) {
    setActionLoadingId(id)
    try {
      await updateBusinessStatus(id, "rejected")
      setPending((prev) => prev.filter((b) => b._id !== id))
      toast.success("Listing rejected.")
      refreshHistory()
    } catch {
      toast.error("Failed to reject listing.")
    } finally {
      setActionLoadingId(null)
    }
  }

  async function handleDelete(id: string) {
    setActionLoadingId(id)
    try {
      await deleteBusinessAdmin(id)
      setPending((prev) => prev.filter((b) => b._id !== id))
      setStats((prev) =>
        prev
          ? {
              ...prev,
              totalBusinesses: prev.totalBusinesses - 1,
            }
          : prev,
      )
      toast.success("Business deleted.")
      refreshHistory()
    } catch {
      toast.error("Failed to delete business.")
    } finally {
      setActionLoadingId(null)
    }
  }

  if (authLoading || !user || user.role !== "admin") {
    return null
  }

  const deltaType =
    stats && stats.monthOverMonthChange > 0
      ? "up"
      : stats && stats.monthOverMonthChange < 0
        ? "down"
        : "neutral"

  return (
    <main>
      <Navbar />

      <div className="max-w-[1200px] mx-auto px-12 max-[960px]:px-6 py-20">
        {/* Header */}
        <div className="mb-12">
          <div className="font-mono text-[11px] font-medium tracking-[0.14em] uppercase text-ink-300 mb-4">
            Admin Dashboard
          </div>
          <h1 className="font-display text-[56px] max-[960px]:text-[36px] font-normal leading-[0.95] tracking-[-0.03em] text-foreground mb-4">
            Overview.
          </h1>
        </div>

        {/* Stats */}
        {isLoading ? (
          <div className="grid grid-cols-3 max-[960px]:grid-cols-1 gap-6 mb-16">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-32 rounded-[var(--r-lg)] bg-cloud animate-pulse"
              />
            ))}
          </div>
        ) : stats ? (
          <div className="grid grid-cols-3 max-[960px]:grid-cols-1 gap-6 mb-16">
            <StatCard
              label="New This Month"
              value={String(stats.businessesThisMonth)}
              index={0}
            />
            <StatCard
              label="Total Businesses"
              value={String(stats.totalBusinesses)}
              delta={{
                type: deltaType,
                text: `${Math.abs(stats.monthOverMonthChange)}% vs last month`,
              }}
              index={1}
            />
            <StatCard
              label="Total Members"
              value={String(stats.totalMembers)}
              index={2}
            />
          </div>
        ) : null}

        {/* Pending Listings */}
        <section className="mb-16">
          <h2 className="font-display text-[28px] tracking-[-0.02em] text-foreground mb-6">
            Pending Listings
            {pending.length > 0 && (
              <span className="ml-3 text-base font-mono text-ink-300">
                ({pending.length})
              </span>
            )}
          </h2>
          <div className="border border-border rounded-[var(--r-lg)] overflow-hidden">
            <PendingListingsTable
              businesses={pending}
              onApprove={handleApprove}
              onReject={handleReject}
              onDelete={handleDelete}
              loadingId={actionLoadingId}
            />
          </div>
        </section>

        {/* Past Actions */}
        <section className="mb-16">
          <h2 className="font-display text-[28px] tracking-[-0.02em] text-foreground mb-6">
            Past Actions
            {history.length > 0 && (
              <span className="ml-3 text-base font-mono text-ink-300">
                ({history.length})
              </span>
            )}
          </h2>
          <div className="border border-border rounded-[var(--r-lg)] overflow-hidden">
            <ActionHistoryTable actions={history} isLoading={isLoading} />
          </div>
        </section>

        {/* Admin Users */}
        <section className="mb-16">
          <h2 className="font-display text-[28px] tracking-[-0.02em] text-foreground mb-6">
            Admin Users
            <span className="ml-3 text-base font-mono text-ink-300">
              ({admins.length})
            </span>
          </h2>
          <div className="border border-border rounded-[var(--r-lg)] overflow-hidden">
            {admins.length === 0 ? (
              <div className="text-center py-12 text-ink-300 text-sm">
                No admin users found.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Username</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Joined</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {admins.map((admin) => (
                    <TableRow key={admin._id}>
                      <TableCell className="font-medium">
                        {admin.username}
                      </TableCell>
                      <TableCell className="text-ink-400">
                        {admin.email || "—"}
                      </TableCell>
                      <TableCell className="text-ink-400 text-xs">
                        {new Date(admin.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </section>

        {/* Member Management */}
        <section className="mb-16">
          <h2 className="font-display text-[28px] tracking-[-0.02em] text-foreground mb-6">
            Members
          </h2>
          <MemberRoleTable onRolesUpdated={fetchData} />
        </section>
      </div>

      <Footer />
    </main>
  )
}
