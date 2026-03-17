"use client"

import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table"
import { StatusBadge } from "@/components/status-badge"
import type { AdminActionEntry } from "@/lib/api"

interface ActionHistoryTableProps {
  actions: AdminActionEntry[]
  isLoading: boolean
}

const actionBadge: Record<
  string,
  { variant: "positive" | "negative" | "caution"; label: string }
> = {
  approved: { variant: "positive", label: "Approved" },
  rejected: { variant: "negative", label: "Rejected" },
  deleted: { variant: "caution", label: "Deleted" },
}

export function ActionHistoryTable({
  actions,
  isLoading,
}: ActionHistoryTableProps) {
  if (isLoading) {
    return (
      <div className="text-center py-12 text-ink-300 text-sm">
        Loading history…
      </div>
    )
  }

  if (actions.length === 0) {
    return (
      <div className="text-center py-12 text-ink-300 text-sm">
        No past actions yet.
      </div>
    )
  }

  return (
    <div className="max-h-[420px] overflow-y-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Business</TableHead>
            <TableHead>Industry</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Action</TableHead>
            <TableHead>By</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {actions.map((entry) => {
            const badge = actionBadge[entry.action] ?? actionBadge.deleted

            return (
              <TableRow key={entry._id}>
                <TableCell className="font-medium">
                  {entry.businessName}
                </TableCell>
                <TableCell className="text-ink-400">
                  {entry.businessIndustry || "—"}
                </TableCell>
                <TableCell className="text-ink-400">
                  {[entry.businessCity, entry.businessRegion]
                    .filter(Boolean)
                    .join(", ") || "—"}
                </TableCell>
                <TableCell>
                  <StatusBadge variant={badge.variant}>
                    {badge.label}
                  </StatusBadge>
                </TableCell>
                <TableCell className="text-ink-400">
                  {entry.performedBy?.username || "—"}
                </TableCell>
                <TableCell className="text-ink-400 text-xs">
                  {new Date(entry.createdAt).toLocaleDateString()}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
