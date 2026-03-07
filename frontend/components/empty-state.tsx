import { Search } from "lucide-react"

interface EmptyStateProps {
  title?: string
  description?: string
  onClearFilters?: () => void
}

export function EmptyState({
  title = "No results found",
  description = "Try adjusting your filters or search terms to discover more startups.",
  onClearFilters,
}: EmptyStateProps) {
  return (
    <div className="text-center py-20 px-12 border border-dashed border-[#E8EAED] rounded-[20px]">
      <Search className="w-11 h-11 text-[#B8BCCA] mx-auto mb-5" strokeWidth={1.5} />
      <h3 className="font-display text-[28px] tracking-[-0.01em] text-[#111218] mb-2.5">
        {title}
      </h3>
      <p className="text-[15px] text-[#6B7080] max-w-[340px] mx-auto leading-[1.6] mb-6">
        {description}
      </p>
      {onClearFilters && (
        <button
          onClick={onClearFilters}
          className="inline-flex items-center justify-center font-sans text-sm font-medium px-[22px] py-[11px] rounded-full bg-white text-[#111218] border border-[#E8EAED] cursor-pointer transition-all duration-[120ms] hover:border-[#D1D5DB] hover:bg-[#FAFBFC]"
        >
          Clear Filters
        </button>
      )}
    </div>
  )
}
