const tagStyles: Record<string, { bg: string; text: string }> = {
  "Technology": { bg: "bg-[#EFF2FA]", text: "text-[#3568B2]" },
  "Technology & Software": { bg: "bg-[#EFF2FA]", text: "text-[#3568B2]" },
  "Clean Energy": { bg: "bg-[#E6F3EE]", text: "text-[#1B6B4F]" },
  "Green Energy & Cleantech": { bg: "bg-[#E6F3EE]", text: "text-[#1B6B4F]" },
  "Health & Life": { bg: "bg-[#FDF4EB]", text: "text-[#C07A28]" },
  "Life Sciences & Health": { bg: "bg-[#FDF4EB]", text: "text-[#C07A28]" },
  "Media": { bg: "bg-[#F8EEF5]", text: "text-[#9B4D83]" },
  "Digital Media & Creative": { bg: "bg-[#F8EEF5]", text: "text-[#9B4D83]" },
  "Agriculture": { bg: "bg-[#EEF5E6]", text: "text-[#4D7C2A]" },
  "Agri-Tech & Food": { bg: "bg-[#EEF5E6]", text: "text-[#4D7C2A]" },
  "Manufacturing": { bg: "bg-[#FEF8E7]", text: "text-[#92700C]" },
  "Advanced Manufacturing": { bg: "bg-[#FEF8E7]", text: "text-[#92700C]" },
  "Professional Services": { bg: "bg-[#F3F4F6]", text: "text-[#4B5162]" },
}

interface IndustryTagProps {
  industry: string
  className?: string
}

export function IndustryTag({ industry, className }: IndustryTagProps) {
  const style = tagStyles[industry] ?? { bg: "bg-[#F3F4F6]", text: "text-[#4B5162]" }

  return (
    <span
      className={`inline-flex items-center text-xs font-medium px-3 py-1 rounded-full ${style.bg} ${style.text} ${className ?? ""}`}
    >
      {industry}
    </span>
  )
}
