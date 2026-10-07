import { HeroSection } from "@/components/hero-section"
import { BuildingExplorer } from "@/components/building-explorer"
import { Footer } from "@/components/footer"
import { FlowerSection } from "@/components/flower-section"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <HeroSection />
      <BuildingExplorer />
      <FlowerSection />
      <Footer />
    </main>
  )
}
