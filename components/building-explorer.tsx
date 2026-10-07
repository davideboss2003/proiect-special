"use client"

import dynamic from "next/dynamic"
import { useEffect, useState } from "react"
import { BuildingDrawing } from "./building-drawing"
import { DrawingCompass, SetSquare } from "./site-decorations"

interface Stage {
  id: string
  name: string
  tech: string
  funFact: string
  note: string
}

const stages: Stage[] = [
  {
    id: "foundation",
    name: "Fundația",
    tech: "Fundația transmite încărcările construcției către terenul de fundare. Tipul ei (izolată sub stâlpi, continuă sub ziduri sau radier general) se alege după studiul geotehnic, iar talpa se coboară sub adâncimea de îngheț, pe un strat de beton de egalizare.",
    funFact: "Turnul din Pisa a început să se încline încă din timpul construcției, din cauza terenului moale de sub fundație. Lucrările de stabilizare încheiate în 2001 l-au îndreptat cu aproximativ 45 cm.",
    note: "La fel e și cu oamenii: ce contează cu adevărat nu se vede din prima.",
  },
  {
    id: "columns",
    name: "Stâlpii",
    tech: "Stâlpii din beton armat preiau încărcările de la grinzi și le duc la fundații, lucrând în principal la compresiune. Armătura longitudinală duce eforturile, iar etrierii o țin strânsă și se îndesesc spre noduri, acolo unde contează cel mai mult la cutremur.",
    funFact: "Betonul și oțelul au aproape același coeficient de dilatare termică. De aceea pot lucra împreună zeci de ani fără să se desprindă unul de altul când se schimbă temperatura.",
    note: "Beton și oțel, cea mai reușită echipă din construcții. Sună a parteneriat bun.",
  },
  {
    id: "slabs",
    name: "Grinzile și planșeele",
    tech: "Grinzile lucrează la încovoiere: fibra de jos se întinde, cea de sus se comprimă. De aceea armătura de rezistență stă jos în câmp și sus pe reazeme. Planșeul leagă totul într-o șaibă rigidă, care împarte forțele orizontale între stâlpi.",
    funFact: "Clasa betonului se stabilește pe probe încercate la 28 de zile, dar betonul continuă să se întărească ani întregi. Cupola Panteonului din Roma, din beton nearmat, stă în picioare de aproape 1900 de ani.",
    note: "Lucrurile bune nu se grăbesc. Devin mai solide cu fiecare zi.",
  },
  {
    id: "walls",
    name: "Pereții și ferestrele",
    tech: "La o structură în cadre, pereții de închidere sunt zidărie de umplutură: nu duc clădirea, doar o închid și o izolează. Deasupra fiecărui gol de ușă sau de fereastră stă un buiandrug, care preia zidăria de deasupra și o descarcă pe margini.",
    funFact: "La un geam termopan izolează mai ales stratul de aer sau de argon dintre foi, nu sticla. Gazul stă pe loc și conduce căldura mult mai prost decât sticla.",
    note: "Un zâmbet face cam același lucru ca o fereastră: lasă lumina să intre.",
  },
  {
    id: "roof",
    name: "Acoperișul",
    tech: "Șarpanta e scheletul acoperișului: căpriorii reazemă pe pane și pe cosoroabă, iar panele pe popi. Se dimensionează la încărcările din zăpadă și vânt, iar panta se alege după învelitoare, astfel încât apa să nu băltească.",
    funFact: "Un metru cub de zăpadă proaspătă cântărește în jur de 100 kg, iar unul de zăpadă udă poate trece de 400 kg. De aceea încărcarea din zăpadă diferă de la o zonă la alta a țării.",
    note: "Sunt și oameni lângă care te simți exact așa: la adăpost.",
  },
  {
    id: "flag",
    name: "Vârful",
    tech: "Odată ajunsă structura la cota finală, urmează instalațiile și finisajele, iar la sfârșit recepția la terminarea lucrărilor, cu proces-verbal semnat de comisie.",
    funFact: "Când se termină șarpanta, meseriașii pun în vârf un brăduț sau o ramură verde, ca să poarte noroc casei. Obiceiul e vechi și se ține în multe țări; nemții îi spun Richtfest.",
    note: "Eu am pus altceva în vârf. Mai lipsește o singură semnătură: a ta.",
  },
]

const House3D = dynamic(() => import("./house-3d"), { ssr: false })

function hasWebGL() {
  try {
    const canvas = document.createElement("canvas")
    return !!(canvas.getContext("webgl2") || canvas.getContext("webgl"))
  } catch {
    return false
  }
}

export function BuildingExplorer() {
  // Cate etape sunt construite si care e afisata in panou
  const [built, setBuilt] = useState(0)
  const [selected, setSelected] = useState(0)

  // Macheta 3D are nevoie de WebGL; fara el ramane schita 2D
  const [use3D, setUse3D] = useState(false)
  useEffect(() => setUse3D(hasWebGL()), [])

  const finished = built === stages.length
  const stage = built > 0 ? stages[selected] : null
  const next = stages[built]

  const buildNext = () => {
    if (finished) return
    setSelected(built)
    setBuilt(built + 1)
  }

  return (
    <section className="py-12 md:py-20 relative">
      {/* Decorative tools */}
      <div className="absolute top-20 left-5 opacity-20 rotate-[-15deg]">
        <SetSquare size={60} />
      </div>
      <div className="absolute bottom-20 right-5 opacity-20 rotate-[15deg]">
        <DrawingCompass size={60} />
      </div>

      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground mb-4">
            Poți construi
          </h2>
          <p className="font-sans text-muted-foreground max-w-lg mx-auto">
            Șantierul e al tău. Apasă pe buton și ridică o casă, etapă cu etapă, de la fundație până în vârf.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start max-w-5xl mx-auto">
          {/* Plansa cu schita */}
          <div className="bg-blueprint rounded-3xl p-4 md:p-6 shadow-2xl border-4 border-white/80 outline outline-2 outline-blueprint">
            {use3D ? (
              <>
                <div className="-mx-4 -mt-4 md:-mx-6 md:-mt-6 mb-3 overflow-hidden rounded-t-[1.25rem] aspect-[4/5] sm:aspect-square cursor-grab active:cursor-grabbing">
                  <House3D built={built} onContextLost={() => setUse3D(false)} />
                </div>
                <p className="text-center text-white/60 font-hand text-base">Trage de machetă ca să o rotești</p>
              </>
            ) : (
              <BuildingDrawing built={built} />
            )}
            <div className="mt-2 flex items-center gap-3 text-white font-hand text-lg">
              <span className="whitespace-nowrap">Stadiu fizic: {Math.round((built / stages.length) * 100)}%</span>
              <div className="h-2 flex-1 rounded-full bg-white/20 overflow-hidden">
                <div
                  className="h-full rounded-full bg-accent transition-all duration-700"
                  style={{ width: `${(built / stages.length) * 100}%` }}
                />
              </div>
            </div>
            <div className="mt-5 mb-2 text-center">
              {finished ? (
                <a
                  href="#plansa"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-rose text-white font-sans font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  Mergi la semnătură
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.500" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M12 5v14M5 12l7 7 7-7" />
                  </svg>
                </a>
              ) : (
                <button
                  onClick={buildNext}
                  className="px-6 py-3 bg-accent text-accent-foreground font-sans font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
                >
                  {built === 0 ? "Începe lucrările" : "Construiește"}: {next.name}
                </button>
              )}
            </div>
          </div>

          {/* Info Panel */}
          <div className="bg-card rounded-3xl p-6 md:p-8 border-2 border-primary/20 shadow-xl lg:sticky lg:top-8">
            <div className="flex flex-wrap gap-2 mb-6">
              {stages.map((s, i) => (
                <button
                  key={s.id}
                  disabled={i >= built}
                  onClick={() => setSelected(i)}
                  aria-pressed={stage?.id === s.id}
                  className={`px-3 py-1 rounded-full text-sm font-sans border transition-colors ${
                    stage?.id === s.id
                      ? "bg-primary text-primary-foreground border-primary"
                      : i < built
                        ? "bg-secondary text-secondary-foreground border-transparent hover:border-primary/40 cursor-pointer"
                        : "bg-transparent text-muted-foreground/60 border-dashed border-border"
                  }`}
                >
                  {i + 1}. {s.name}
                </button>
              ))}
            </div>

            {stage ? (
              <div key={stage.id} className="min-h-[220px]">
                <p className="text-muted-foreground text-sm font-sans uppercase tracking-wide mb-1">
                  Etapa {selected + 1} din {stages.length}
                </p>
                <h3 className="font-serif text-3xl font-semibold text-foreground mb-4">{stage.name}</h3>
                <p className="font-sans text-foreground leading-relaxed mb-5">{stage.tech}</p>
                <div className="bg-accent/15 border border-accent/50 rounded-2xl px-4 py-3 mb-5">
                  <p className="font-sans text-xs font-semibold uppercase tracking-widest text-accent-foreground/80 mb-1">
                    Știai că?
                  </p>
                  <p className="font-sans text-foreground leading-relaxed">{stage.funFact}</p>
                </div>
                <p className="font-hand text-xl text-rose leading-snug border-l-2 border-rose/50 pl-4">
                  {stage.note}
                </p>
              </div>
            ) : (
              <div className="min-h-[220px]">
                <p className="text-muted-foreground text-sm font-sans uppercase tracking-wide mb-1">
                  Predare de amplasament
                </p>
                <h3 className="font-serif text-3xl font-semibold text-foreground mb-4">Terenul e liber</h3>
                <p className="font-sans text-foreground leading-relaxed">
                  Deocamdată avem doar un teren și o cotă ±0.00. Restul depinde de tine, doamna inginer.
                </p>
              </div>
            )}

          </div>
        </div>
      </div>
    </section>
  )
}
