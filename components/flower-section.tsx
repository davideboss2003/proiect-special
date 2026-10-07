import { FlowerAnimation } from "./flower-animation";
import { BlueprintCard } from "./blueprint-card";

export function FlowerSection() {
  return (
    <section id="plansa" className="relative py-20 overflow-hidden bg-blueprint-deep">
      {/* Decorative top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      {/* Blueprint Card with Flip Animation */}
      <div className="relative z-10 text-center mb-16 px-4">
        <BlueprintCard />
      </div>

      {/* Section title */}
      <div className="relative z-10 text-center mb-12 px-4">
        <h3 className="font-serif text-3xl md:text-4xl text-primary-foreground mb-4 text-balance">
          Spațiu Verde, Conform Proiectului
        </h3>
        <p className="text-primary-foreground/75 max-w-md mx-auto text-base md:text-lg text-balance">
          Orice construcție frumoasă are și o grădină. Florile astea au înflorit doar pentru tine!
        </p>
      </div>

      {/* Flower animation container */}
      <div className="relative h-[80vh] min-h-[500px] max-h-[700px] overflow-visible">
        <FlowerAnimation />
      </div>

      {/* Closing message */}
      <div className="relative z-10 text-center mt-8 px-4">
        <p className="font-serif text-lg md:text-xl text-primary-foreground/80 italic text-balance">
          Cele mai frumoase lucruri se construiesc în timp, cărămidă cu cărămidă.
        </p>
      </div>

      {/* Decorative bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
