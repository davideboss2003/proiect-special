import type { CSSProperties } from "react"
import { DimensionLine, DrawingCompass, HardHat, Ruler, SetSquare } from "./site-decorations"

export function HeroSection() {
  return (
    <header className="relative overflow-hidden py-16 md:py-24 bg-grid-paper">
      {/* Background decorations */}
      <div className="absolute top-10 left-6 md:left-16 opacity-40 animate-tool-float" style={{ "--tilt": "-12deg" } as CSSProperties}>
        <SetSquare size={110} />
      </div>
      <div className="absolute bottom-8 right-6 md:right-20 opacity-40 animate-tool-float" style={{ "--tilt": "10deg", animationDelay: "1.5s" } as CSSProperties}>
        <DrawingCompass size={100} />
      </div>
      <div className="absolute top-16 right-4 md:right-1/4 opacity-50 animate-tool-float" style={{ "--tilt": "-24deg", animationDelay: "3s" } as CSSProperties}>
        <Ruler size={150} />
      </div>

      <div className="container mx-auto px-6 text-center relative z-10">
        <div className="flex justify-center mb-6">
          <HardHat size={96} />
        </div>

        <p className="text-muted-foreground font-sans uppercase tracking-[0.3em] text-xs md:text-sm mb-6 text-balance">
          Dedicat viitoarei doamne inginer Andreea Solomon
        </p>

        <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-semibold text-foreground mb-4 text-balance">
          Proiect Special
        </h1>

        <DimensionLine label="proiect nr. 01 / 2026 · scara 1:1" className="max-w-md mx-auto text-primary mb-8" />

        <p className="font-sans text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Un proiect făcut cu rigla, echerul și mult drag, pentru cineva care în curând va ști să ridice
          orice de la fundație până la acoperiș.
        </p>
      </div>
    </header>
  )
}
