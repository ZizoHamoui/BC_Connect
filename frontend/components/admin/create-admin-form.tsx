"use client"

import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"
import { Search, ChevronDown } from "lucide-react"
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table"
import { getMembers, updateUserRoles } from "@/lib/api"
import type { MemberUser } from "@/lib/api"

interface MemberRoleTableProps {
  onRolesUpdated: () => void
}

export function MemberRoleTable({ onRolesUpdated }: MemberRoleTableProps) {
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [users, setUsers] = useState<MemberUser[]>([])
  const [roleOverrides, setRoleOverrides] = useState<
    Record<string, "member" | "admin">
  >({})
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300)
    return () => clearTimeout(timer)
  }, [search])

  const fetchUsers = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await getMembers(debouncedSearch || undefined)
      setUsers(data)
      setRoleOverrides({})
    } catch {
      toast.error("Failed to load users.")
    } finally {
      setIsLoading(false)
    }
  }, [debouncedSearch])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  function handleRoleChange(userId: string, originalRole: string, newRole: "member" | "admin") {
    setRoleOverrides((prev) => {
      const next = { ...prev }
      if (newRole === originalRole) {
        delete next[userId]
      } else {
        next[userId] = newRole
      }
      return next
    })
  }

  const pendingChanges = Object.keys(roleOverrides).length

  async function handleSave() {
    if (pendingChanges === 0) return

    const changes = Object.entries(roleOverrides).map(([userId, role]) => ({
      userId,
      role,
    }))

    setIsSaving(true)
    try {
      await updateUserRoles(changes)
      toast.success("Changes saved.")
      setRoleOverrides({})
      await fetchUsers()
      onRolesUpdated()
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to save changes.",
      )
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-300" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by username or email…"
          className="w-full pl-10 pr-4 py-2.5 rounded-[var(--r-md)] border border-border bg-background text-sm text-foreground placeholder:text-ink-300 focus:outline-none focus:ring-2 focus:ring-signal/30 focus:border-signal transition-all"
        />
      </div>

      {/* Scrollable table */}
      <div className="border border-border rounded-[var(--r-lg)] overflow-hidden max-h-[420px] overflow-y-auto">
        {isLoading ? (
          <div className="text-center py-12 text-ink-300 text-sm">
            Loading users…
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-12 text-ink-300 text-sm">
            No users found.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Username</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => {
                const currentRole = roleOverrides[user._id] ?? user.role
                const isChanged = user._id in roleOverrides

                return (
                  <TableRow
                    key={user._id}
                    className={isChanged ? "bg-[#FEF8E7]/50" : undefined}
                  >
                    <TableCell className="font-medium">
                      {user.username}
                    </TableCell>
                    <TableCell className="text-ink-400">
                      {user.email || "—"}
                    </TableCell>
                    <TableCell>
                      <div className="relative inline-flex items-center">
                        <select
                          value={currentRole}
                          onChange={(e) =>
                            handleRoleChange(
                              user._id,
                              user.role,
                              e.target.value as "member" | "admin",
                            )
                          }
                          className={`pl-2.5 pr-7 py-1.5 rounded-[var(--r-sm)] border text-xs font-medium transition-all focus:outline-none focus:ring-2 focus:ring-signal/30 appearance-none cursor-pointer ${
                            currentRole === "admin"
                              ? "border-[#3568B2]/30 bg-[#EBF2FC] text-[#3568B2]"
                              : "border-border bg-background text-ink-400"
                          }`}
                        >
                          <option value="member">Member</option>
                          <option value="admin">Admin</option>
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-2 w-3 h-3 text-ink-300" />
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Save button */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={pendingChanges === 0 || isSaving}
          className="btn-press focus-ring inline-flex items-center justify-center font-sans text-[13px] font-medium px-5 py-3 rounded-full bg-foreground text-background hover:bg-ink-700 disabled:opacity-50 transition-colors"
        >
          {isSaving ? "Saving…" : "Save Changes"}
        </button>
        {pendingChanges > 0 && (
          <span className="text-xs text-ink-300">
            {pendingChanges} unsaved change{pendingChanges !== 1 ? "s" : ""}
          </span>
        )}
      </div>
    </div>
  )
}
