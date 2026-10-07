"use client";

import { useEffect, useState, type ReactNode } from "react";
import { notifyAccepted } from "@/lib/notify";
import { BowShape, HardHat } from "./site-decorations";

const STORAGE_KEY = "proiect-aprobat";

function Confetti() {
  const colors = ["var(--accent)", "var(--rose)", "#ffffff", "#7fb2ff"];
  return (
    <div className="absolute inset-0 pointer-events-none z-50 overflow-visible">
      {[...Array(28)].map((_, i) => (
        <div
          key={i}
          className="absolute animate-confetti"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 30}%`,
            animationDelay: `${Math.random() * 0.5}s`,
          }}
        >
          {i % 4 === 0 ? (
            <HardHat size={22 + Math.random() * 16} />
          ) : (
            <div
              style={{
                width: 8 + Math.random() * 8,
                height: 8 + Math.random() * 8,
                background: colors[i % colors.length],
                borderRadius: i % 3 === 0 ? "50%" : 2,
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// Podul dintre A si D, desenat ca pe plansa
function BridgeDrawing() {
  return (
    <svg viewBox="0 0 400 150" className="w-full h-auto" role="img" aria-label="Schița unui pod între punctele A și D">
      <g stroke="#ffffff" strokeWidth="2" fill="none" strokeLinejoin="round" strokeLinecap="round">
        {/* Maluri si pile */}
        <path d="M10 112h70M320 112h70" />
        <rect x="62" y="62" width="18" height="50" fill="rgba(255,255,255,0.15)" />
        <rect x="320" y="62" width="18" height="50" fill="rgba(255,255,255,0.15)" />
        {/* Tablier si arc */}
        <path d="M40 62h320" />
        <path d="M80 112Q200 20 320 112" />
        <path d="M110 62v25M140 62v7M260 62v7M290 62v25" strokeWidth="1.500" />
        {/* Apa */}
        <path d="M100 128q10-6 20 0t20 0M180 134q10-6 20 0t20 0M260 128q10-6 20 0t20 0" strokeWidth="1.200" opacity="0.6" />
        {/* Cota */}
        <path d="M71 22v24M329 22v24M71 30h258" strokeWidth="1.200" />
        <path d="M67 34l8-8M325 34l8-8" strokeWidth="1.200" />
      </g>
      <BowShape x={200} y={50} />
      <g fill="#ffffff" className="font-hand" textAnchor="middle">
        <text x="200" y="22" fontSize="15">L = o cafea distanță</text>
        <text x="71" y="134" fontSize="18">A</text>
        <text x="329" y="134" fontSize="18">D</text>
      </g>
    </svg>
  );
}

function SpecRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="mb-4 text-left">
      <p className="text-white/60 text-xs font-sans mb-1 uppercase tracking-widest">{label}</p>
      <p className="font-sans text-white leading-relaxed">{children}</p>
    </div>
  );
}

export function BlueprintCard() {
  const [isFlipped, setIsFlipped] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // Daca a aprobat deja, pastram stampila si nu mai trimitem notificarea a doua oara
  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY)) setAccepted(true);
    } catch {}
  }, []);

  const handleAccept = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 2800);
    if (accepted) return;
    setAccepted(true);
    notifyAccepted().then((sent) => {
      if (!sent) return;
      try {
        localStorage.setItem(STORAGE_KEY, new Date().toISOString());
      } catch {}
    });
  };

  return (
    <div className="relative perspective-1000">
      {showConfetti && <Confetti />}

      {/* Flip Card Container */}
      <div
        className={`relative w-full max-w-xl mx-auto transition-transform duration-700 ${isFlipped ? "" : "cursor-pointer"}`}
        onClick={() => !isFlipped && setIsFlipped(true)}
        onKeyDown={(e) => {
          if (!isFlipped && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            setIsFlipped(true);
          }
        }}
        role={isFlipped ? undefined : "button"}
        tabIndex={isFlipped ? undefined : 0}
        style={{ transformStyle: "preserve-3d", transform: isFlipped ? "rotateY(180deg)" : undefined }}
      >
        {/* Front - Plansa */}
        <div
          className={`bg-blueprint rounded-3xl p-3 shadow-2xl backface-hidden ${isFlipped ? "invisible" : ""}`}
        >
          <div className="border-2 border-white/80 rounded-2xl p-5 md:p-7">
            {/* Header */}
            <div className="flex items-center justify-between font-hand text-white text-lg border-b-2 border-dashed border-white/40 pb-3 mb-4">
              <span>Planșa A-01</span>
              <HardHat size={40} />
              <span>Proiect nr. 01/2026</span>
            </div>

            <BridgeDrawing />

            <div className="mt-4 mb-5 text-left">
              <p className="text-white/60 text-xs font-sans mb-1 uppercase tracking-widest">Obiectiv</p>
              <p className="font-serif text-xl md:text-2xl text-white leading-snug">
                O ieșire în oraș cu potențial ridicat de râsete, voie bună și conversații autentice
              </p>
            </div>

            <SpecRow label="Materiale">
              Cafea bună sau o plimbare relaxantă. Cantități conform devizului: nelimitate.
            </SpecRow>
            <SpecRow label="Termen de execuție">Oricând îți face ție plăcere.</SpecRow>
            <SpecRow label="Riscuri identificate">
              Reducerea stresului cotidian și tendința de a zâmbi fără justificare în nota de calcul.
            </SpecRow>

            {/* Cartus */}
            <div className="grid grid-cols-3 border-2 border-white/80 font-hand text-white text-left text-base mt-6">
              <div className="col-span-2 border-b border-r border-white/60 px-3 py-2">
                <span className="block text-xs font-sans uppercase tracking-widest text-white/60">Beneficiar</span>
                <span className="text-xl">Andreea Solomon</span>
              </div>
              <div className="border-b border-white/60 px-3 py-2">
                <span className="block text-xs font-sans uppercase tracking-widest text-white/60">Scara</span>
                <span className="text-xl">1:1</span>
              </div>
              <div className="col-span-2 border-r border-white/60 px-3 py-2">
                <span className="block text-xs font-sans uppercase tracking-widest text-white/60">Proiectant</span>
                <span className="text-xl">ing. Davide</span>
              </div>
              <div className="px-3 py-2">
                <span className="block text-xs font-sans uppercase tracking-widest text-white/60">Faza</span>
                <span className="text-xl">Aviz</span>
              </div>
            </div>

            <p className="text-accent text-base md:text-lg font-sans mt-6 animate-pulse tracking-wide">
              Apasă pe planșă ca să o întorci...
            </p>
          </div>
        </div>

        {/* Back - Invitation */}
        <div
          className={`absolute inset-0 bg-card rounded-3xl p-3 shadow-2xl backface-hidden ${!isFlipped ? "invisible" : ""}`}
          style={{ transform: "rotateY(180deg)" }}
        >
          <div className="relative h-full border-2 border-primary/40 rounded-2xl p-6 md:p-10 flex flex-col items-center justify-center bg-grid-paper">
            <p className="font-hand text-lg text-primary mb-4">Autorizație de construire nr. 01 / 2026</p>
            <div className="mb-4">
              <HardHat size={72} />
            </div>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground mb-6 text-balance">
              O Întrebare Specială
            </h2>
            <p className="font-serif text-xl md:text-2xl text-foreground leading-relaxed mb-4 text-balance">
              Dacă aș avea onoarea și privilegiul să te scot în oraș, mi-ar face mare plăcere!
            </p>
            <p className="font-serif text-2xl md:text-3xl text-primary font-semibold mb-8 text-balance">
              Ce zici, aprobi proiectul?
            </p>

            {accepted ? (
              <div aria-live="polite" className="flex flex-col items-center mt-2">
                <div className="animate-stamp border-4 border-rose text-rose rounded-lg px-6 py-2 font-sans font-bold text-3xl md:text-4xl uppercase tracking-widest">
                  Aprobat
                </div>
                <p className="font-sans text-foreground mt-6 max-w-sm text-balance">
                  Proiectantul a fost anunțat și e cel mai fericit om de pe șantier. Urmează detaliile de execuție!
                </p>
              </div>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleAccept();
                }}
                className="group relative px-8 py-4 bg-primary text-primary-foreground font-sans font-semibold text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
              >
                <span className="relative z-10 flex items-center gap-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M22 11.080V12a10 10 0 1 1-5.930-9.140" />
                    <polyline points="22 4 12 14.010 9 11.010" />
                  </svg>
                  Aprob Proiectul
                </span>
                <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping opacity-0 group-hover:opacity-100" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
