"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { updateBusiness, type ApiBusiness } from "@/lib/api"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { ArrowRight } from "lucide-react"

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

interface EditBusinessModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  business: ApiBusiness
  onBusinessUpdated: (business: ApiBusiness) => void
}

export function EditBusinessModal({
  open,
  onOpenChange,
  business,
  onBusinessUpdated,
}: EditBusinessModalProps) {
  const [isLoading, setIsLoading] = useState(false)

  const [name, setName] = useState("")
  const [city, setCity] = useState("")
  const [address, setAddress] = useState("")
  const [industry, setIndustry] = useState("")
  const [region, setRegion] = useState("")
  const [description, setDescription] = useState("")
  const [employees, setEmployees] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [website, setWebsite] = useState("")
  const [foundedYear, setFoundedYear] = useState("")
  const [stage, setStage] = useState("")
  const [fundingRaised, setFundingRaised] = useState("")
  const [revenueRange, setRevenueRange] = useState("")
  const [customerCount, setCustomerCount] = useState("")
  const [logoUrl, setLogoUrl] = useState("")
  const [linkedin, setLinkedin] = useState("")
  const [twitter, setTwitter] = useState("")
  const [github, setGithub] = useState("")

  useEffect(() => {
    if (open && business) {
      setName(business.name || "")
      setCity(business.city || "")
      setAddress(business.address || "")
      setIndustry(business.industryCategory || business.industry || "")
      setRegion(business.region || "")
      setDescription(business.description || "")
      setEmployees(business.employees != null ? String(business.employees) : "")
      setEmail(business.contact?.email || "")
      setPhone(business.contact?.phone || "")
      setWebsite(business.contact?.website || "")
      setFoundedYear(business.foundedYear != null ? String(business.foundedYear) : "")
      setStage(business.stage || "")
      setFundingRaised(business.fundingRaised || "")
      setRevenueRange(business.revenueRange || "")
      setCustomerCount(business.customerCount != null ? String(business.customerCount) : "")
      setLogoUrl(business.logoUrl || "")
      setLinkedin(business.socialLinks?.linkedin || "")
      setTwitter(business.socialLinks?.twitter || "")
      setGithub(business.socialLinks?.github || "")
    }
  }, [open, business])

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const result = await updateBusiness(business._id, {
        name,
        industry,
        region,
        city,
        address: address || undefined,
        description,
        employees: employees ? Number(employees) : undefined,
        contact: {
          email: email || undefined,
          phone: phone || undefined,
          website: website || undefined,
        },
        foundedYear: foundedYear ? Number(foundedYear) : undefined,
        stage: (stage || undefined) as ApiBusiness["stage"],
        fundingRaised: fundingRaised || undefined,
        revenueRange: (revenueRange || undefined) as ApiBusiness["revenueRange"],
        customerCount: customerCount ? Number(customerCount) : undefined,
        logoUrl: logoUrl || undefined,
        socialLinks: {
          linkedin: linkedin || undefined,
          twitter: twitter || undefined,
          github: github || undefined,
        },
      })
      toast.success("Business updated successfully")
      onBusinessUpdated(result)
      onOpenChange(false)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update business."
      toast.error(msg)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px] p-0 overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="px-8 pt-8 pb-2">
          <DialogHeader>
            <DialogTitle className="font-display text-[28px] leading-[1.1] tracking-[-0.02em] text-foreground font-normal">
              Edit Business
            </DialogTitle>
            <DialogDescription className="text-[15px] text-[var(--ink-400)] leading-relaxed mt-1">
              Update the details for this listing.
            </DialogDescription>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="px-8 pb-8 pt-2 space-y-5">
          <div>
            <label
              htmlFor="edit-biz-name"
              className="block text-[14px] font-medium text-foreground mb-2.5"
            >
              Business Name
            </label>
            <input
              id="edit-biz-name"
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
                htmlFor="edit-biz-category"
                className="block text-[14px] font-medium text-foreground mb-2.5"
              >
                Category
              </label>
              <select
                id="edit-biz-category"
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
                htmlFor="edit-biz-region"
                className="block text-[14px] font-medium text-foreground mb-2.5"
              >
                Region
                <span className="text-[var(--ink-300)] font-normal ml-1">
                  (optional)
                </span>
              </label>
              <select
                id="edit-biz-region"
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
                htmlFor="edit-biz-city"
                className="block text-[14px] font-medium text-foreground mb-2.5"
              >
                City
              </label>
              <input
                id="edit-biz-city"
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
                htmlFor="edit-biz-address"
                className="block text-[14px] font-medium text-foreground mb-2.5"
              >
                Address
                <span className="text-[var(--ink-300)] font-normal ml-1">
                  (optional)
                </span>
              </label>
              <input
                id="edit-biz-address"
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
              htmlFor="edit-biz-description"
              className="block text-[14px] font-medium text-foreground mb-2.5"
            >
              Description
              <span className="text-[var(--ink-300)] font-normal ml-1">
                (optional)
              </span>
            </label>
            <textarea
              id="edit-biz-description"
              placeholder="Briefly describe what this business does..."
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={cn(inputClass, "resize-none")}
            />
          </div>

          <div>
            <label
              htmlFor="edit-biz-employees"
              className="block text-[14px] font-medium text-foreground mb-2.5"
            >
              Employees
              <span className="text-[var(--ink-300)] font-normal ml-1">
                (optional)
              </span>
            </label>
            <input
              id="edit-biz-employees"
              type="number"
              min="0"
              placeholder="e.g. 50"
              value={employees}
              onChange={(e) => setEmployees(e.target.value)}
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="edit-biz-email"
                className="block text-[14px] font-medium text-foreground mb-2.5"
              >
                Email
                <span className="text-[var(--ink-300)] font-normal ml-1">
                  (optional)
                </span>
              </label>
              <input
                id="edit-biz-email"
                type="email"
                placeholder="contact@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label
                htmlFor="edit-biz-phone"
                className="block text-[14px] font-medium text-foreground mb-2.5"
              >
                Phone
                <span className="text-[var(--ink-300)] font-normal ml-1">
                  (optional)
                </span>
              </label>
              <input
                id="edit-biz-phone"
                type="tel"
                placeholder="(604) 555-0123"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="edit-biz-website"
              className="block text-[14px] font-medium text-foreground mb-2.5"
            >
              Website
              <span className="text-[var(--ink-300)] font-normal ml-1">
                (optional)
              </span>
            </label>
            <input
              id="edit-biz-website"
              type="url"
              placeholder="https://example.com"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className={inputClass}
            />
          </div>

          {/* Enrichment fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="edit-biz-founded"
                className="block text-[14px] font-medium text-foreground mb-2.5"
              >
                Founded Year
                <span className="text-[var(--ink-300)] font-normal ml-1">
                  (optional)
                </span>
              </label>
              <input
                id="edit-biz-founded"
                type="number"
                min="1800"
                max={new Date().getFullYear()}
                placeholder="e.g. 2020"
                value={foundedYear}
                onChange={(e) => setFoundedYear(e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label
                htmlFor="edit-biz-stage"
                className="block text-[14px] font-medium text-foreground mb-2.5"
              >
                Stage
                <span className="text-[var(--ink-300)] font-normal ml-1">
                  (optional)
                </span>
              </label>
              <select
                id="edit-biz-stage"
                value={stage}
                onChange={(e) => setStage(e.target.value)}
                className={selectClass}
              >
                <option value="">Select stage</option>
                {["Pre-Seed", "Seed", "Series A", "Series B+", "Growth", "Established"].map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="edit-biz-funding"
                className="block text-[14px] font-medium text-foreground mb-2.5"
              >
                Funding Raised
                <span className="text-[var(--ink-300)] font-normal ml-1">
                  (optional)
                </span>
              </label>
              <input
                id="edit-biz-funding"
                type="text"
                placeholder='e.g. $2.5M'
                value={fundingRaised}
                onChange={(e) => setFundingRaised(e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label
                htmlFor="edit-biz-revenue"
                className="block text-[14px] font-medium text-foreground mb-2.5"
              >
                Revenue Range
                <span className="text-[var(--ink-300)] font-normal ml-1">
                  (optional)
                </span>
              </label>
              <select
                id="edit-biz-revenue"
                value={revenueRange}
                onChange={(e) => setRevenueRange(e.target.value)}
                className={selectClass}
              >
                <option value="">Select range</option>
                {["Pre-Revenue", "<$1M", "$1M-$5M", "$5M-$10M", "$10M+"].map((r) => (
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
                htmlFor="edit-biz-customers"
                className="block text-[14px] font-medium text-foreground mb-2.5"
              >
                Customers
                <span className="text-[var(--ink-300)] font-normal ml-1">
                  (optional)
                </span>
              </label>
              <input
                id="edit-biz-customers"
                type="number"
                min="0"
                placeholder="e.g. 150"
                value={customerCount}
                onChange={(e) => setCustomerCount(e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label
                htmlFor="edit-biz-logo"
                className="block text-[14px] font-medium text-foreground mb-2.5"
              >
                Logo URL
                <span className="text-[var(--ink-300)] font-normal ml-1">
                  (optional)
                </span>
              </label>
              <input
                id="edit-biz-logo"
                type="url"
                placeholder="https://example.com/logo.png"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className="block text-[14px] font-medium text-foreground mb-2.5">
              Social Links
              <span className="text-[var(--ink-300)] font-normal ml-1">
                (optional)
              </span>
            </label>
            <div className="space-y-3">
              <input
                type="url"
                placeholder="LinkedIn URL"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                className={inputClass}
              />
              <input
                type="url"
                placeholder="Twitter / X URL"
                value={twitter}
                onChange={(e) => setTwitter(e.target.value)}
                className={inputClass}
              />
              <input
                type="url"
                placeholder="GitHub URL"
                value={github}
                onChange={(e) => setGithub(e.target.value)}
                className={inputClass}
              />
            </div>
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
                Save Changes
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
