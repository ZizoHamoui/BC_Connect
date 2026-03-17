"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { useAuth } from "@/lib/auth-context"
import { createBusiness, toBusinessCard } from "@/lib/api"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import type { Business } from "@/components/business-card"

const categoryOptions = [
  "Technology",
  "Clean Energy",
  "Health & Life",
  "Media",
  "Agriculture",
  "Manufacturing",
  "Professional Services",
]

const regionOptions = [
  "Mainland/Southwest",
  "Vancouver Island/Coast",
  "Thompson-Okanagan",
  "Cariboo",
  "Nechako",
  "North Coast",
  "Kootenay",
  "Northeast",
]

interface AddBusinessModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onBusinessAdded: (business: Business) => void
}

export function AddBusinessModal({
  open,
  onOpenChange,
  onBusinessAdded,
}: AddBusinessModalProps) {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  const [name, setName] = useState("")
  const [city, setCity] = useState("")
  const [address, setAddress] = useState("")
  const [industry, setIndustry] = useState("")
  const [region, setRegion] = useState("")
  const [description, setDescription] = useState("")

  const inputClass = cn(
    "w-full px-4 py-3.5 bg-white border border-[var(--mist)] rounded-[var(--r-md)]",
    "text-[15px] text-foreground placeholder:text-[var(--ink-200)]",
    "transition-all duration-200",
    "hover:border-[var(--fog)]",
    "focus:outline-none focus:border-[var(--signal)] focus:ring-4 focus:ring-[var(--signal-soft)]",
  )

  const selectClass = cn(
    inputClass,
    "appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%236B7080%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:16px] bg-[right_16px_center] bg-no-repeat pr-10",
  )

  const resetForm = () => {
    setName("")
    setCity("")
    setAddress("")
    setIndustry("")
    setRegion("")
    setDescription("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const isAdmin = user?.role === "admin"
      const result = await createBusiness({
        name,
        industry,
        region,
        city,
        address: address || undefined,
        description,
        ...(isAdmin ? { verificationStatus: "verified" } : {}),
      })
      toast.success(
        isAdmin
          ? `${result.name} has been listed!`
          : "Listing Added. Pending Approval",
      )
      const cardData = toBusinessCard(result)
      onBusinessAdded(cardData)
      resetForm()
      onOpenChange(false)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to add business."
      toast.error(msg)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px] p-0 overflow-hidden">
        <div className="px-8 pt-8 pb-2">
          <DialogHeader>
            <DialogTitle className="font-display text-[28px] leading-[1.1] tracking-[-0.02em] text-foreground font-normal">
              List Your Startup
            </DialogTitle>
            <DialogDescription className="text-[15px] text-[var(--ink-400)] leading-relaxed mt-1">
              Add your business to BC Connect&apos;s directory.
            </DialogDescription>
          </DialogHeader>
        </div>

        {!user ? (
          <div className="px-8 pb-8 pt-4">
            <p className="text-[15px] text-[var(--ink-500)] mb-6">
              You need to be signed in to list a business.
            </p>
            <Link
              href="/auth"
              className={cn(
                "w-full flex items-center justify-center gap-2.5 py-4 px-6",
                "bg-[var(--ink-900)] hover:bg-[var(--ink-700)] text-white",
                "text-[15px] font-medium rounded-[var(--r-md)]",
                "transition-colors duration-150 btn-press",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--signal)] focus-visible:ring-offset-2",
              )}
            >
              Sign In
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-8 pb-8 pt-2 space-y-5">
            <div>
              <label
                htmlFor="biz-name"
                className="block text-[14px] font-medium text-foreground mb-2.5"
              >
                Business Name
              </label>
              <input
                id="biz-name"
                type="text"
                placeholder="e.g. Rainforest AI"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClass}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="biz-category"
                  className="block text-[14px] font-medium text-foreground mb-2.5"
                >
                  Category
                </label>
                <select
                  id="biz-category"
                  required
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className={selectClass}
                >
                  <option value="" disabled>
                    Select category
                  </option>
                  {categoryOptions.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="biz-region"
                  className="block text-[14px] font-medium text-foreground mb-2.5"
                >
                  Region
                </label>
                <select
                  id="biz-region"
                  required
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className={selectClass}
                >
                  <option value="" disabled>
                    Select region
                  </option>
                  {regionOptions.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="biz-city"
                  className="block text-[14px] font-medium text-foreground mb-2.5"
                >
                  City
                </label>
                <input
                  id="biz-city"
                  type="text"
                  placeholder="e.g. Vancouver"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <label
                  htmlFor="biz-address"
                  className="block text-[14px] font-medium text-foreground mb-2.5"
                >
                  Address
                  <span className="text-[var(--ink-300)] font-normal ml-1">
                    (optional)
                  </span>
                </label>
                <input
                  id="biz-address"
                  type="text"
                  placeholder="e.g. 123 Main St"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="biz-description"
                className="block text-[14px] font-medium text-foreground mb-2.5"
              >
                Description
              </label>
              <textarea
                id="biz-description"
                placeholder="Briefly describe what your business does..."
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={cn(inputClass, "resize-none")}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={cn(
                "w-full flex items-center justify-center gap-2.5 py-4 px-6 mt-2",
                "bg-[var(--ink-900)] hover:bg-[var(--ink-700)] text-white",
                "text-[15px] font-medium rounded-[var(--r-md)]",
                "transition-colors duration-150 btn-press",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--signal)] focus-visible:ring-offset-2",
              )}
            >
              {isLoading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  List Business
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
