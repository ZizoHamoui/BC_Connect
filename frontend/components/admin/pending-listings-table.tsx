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
import type { ApiBusiness } from "@/lib/api"

interface PendingListingsTableProps {
  businesses: ApiBusiness[]
  onApprove: (id: string) => void
  onReject: (id: string) => void
  onDelete: (id: string) => void
  loadingId?: string | null
}

export function PendingListingsTable({
  businesses,
  onApprove,
  onReject,
  onDelete,
  loadingId,
}: PendingListingsTableProps) {
  if (businesses.length === 0) {
    return (
      <div className="text-center py-12 text-ink-300 text-sm">
        No pending listings to review.
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Business</TableHead>
          <TableHead>Industry</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Submitted</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {businesses.map((biz) => {
          const isLoading = loadingId === biz._id
          return (
            <TableRow key={biz._id}>
              <TableCell className="font-medium">{biz.name}</TableCell>
              <TableCell className="text-ink-400">
                {biz.industryCategory ?? biz.industry ?? "—"}
              </TableCell>
              <TableCell className="text-ink-400">
                {[biz.city, biz.region].filter(Boolean).join(", ") || "—"}
              </TableCell>
              <TableCell className="text-ink-400 text-xs">
                {biz._id
                  ? new Date(
                      parseInt(biz._id.substring(0, 8), 16) * 1000,
                    ).toLocaleDateString()
                  : "—"}
              </TableCell>
              <TableCell>
                <StatusBadge variant="caution">Pending</StatusBadge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => onApprove(biz._id)}
                    disabled={isLoading}
                    className="inline-flex items-center text-xs font-medium px-3 py-1.5 rounded-full bg-[#E6F3EE] text-[#1B6B4F] hover:bg-[#d0e9de] transition-colors disabled:opacity-50"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => onReject(biz._id)}
                    disabled={isLoading}
                    className="inline-flex items-center text-xs font-medium px-3 py-1.5 rounded-full bg-[#FDF0EE] text-[#B33B2E] hover:bg-[#f9ddd9] transition-colors disabled:opacity-50"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => onDelete(biz._id)}
                    disabled={isLoading}
                    className="inline-flex items-center text-xs font-medium px-3 py-1.5 rounded-full border border-border text-ink-400 hover:bg-muted/50 transition-colors disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
