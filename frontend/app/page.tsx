import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { Principles } from "@/components/principles"
import { StatsSection } from "@/components/stats-section"
import { DirectoryPreview } from "@/components/directory-preview"
import { JobsSection } from "@/components/jobs-section"
import { CtaSection } from "@/components/cta-section"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Principles />
      <StatsSection />
      <DirectoryPreview />
      <JobsSection />
      <CtaSection />
      <Footer />
    </main>
  )
}
