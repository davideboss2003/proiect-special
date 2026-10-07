interface DecorationProps {
  size?: number
  className?: string
}

// Fundita, de pus in interiorul unui <svg>
export function BowShape({ x, y, scale = 1, className = "" }: { x: number; y: number; scale?: number; className?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} className={className}>
      <path d="M-2 1l-4 8M2 1l4 8" stroke="#c94a6a" strokeWidth="2.500" strokeLinecap="round" fill="none" />
      <path
        d="M0 0C-6-9-14-8-13 0c-1 8 7 9 13 0zM0 0c6-9 14-8 13 0 1 8-7 9-13 0z"
        fill="var(--rose)"
        stroke="#c94a6a"
        strokeWidth="1.200"
        strokeLinejoin="round"
      />
      <circle r="3" fill="#c94a6a" />
    </g>
  )
}

export function HardHat({ size = 60, className = "" }: DecorationProps) {
  return (
    <svg width={size} height={size * 0.75} viewBox="0 0 80 60" fill="none" className={className} aria-hidden="true">
      <path d="M12 44a28 28 0 0 1 56 0z" fill="var(--accent)" />
      <path d="M34 14h12a3 3 0 0 1 3 3v27H31V17a3 3 0 0 1 3-3z" fill="#ffd978" />
      <path d="M22 44V30M58 44V30" stroke="#d99a14" strokeWidth="2.5" strokeLinecap="round" />
      <rect x="4" y="43" width="72" height="9" rx="4.5" fill="#e0a31c" />
      <BowShape x={40} y={32} />
    </svg>
  )
}

// Echer
export function SetSquare({ size = 80, className = "" }: DecorationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" className={className} aria-hidden="true">
      <path d="M8 72V8l64 64z" fill="var(--primary)" fillOpacity="0.12" stroke="var(--primary)" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M22 58V36l22 22z" stroke="var(--primary)" strokeWidth="2" strokeLinejoin="round" />
      <path d="M8 20h5M8 30h3M8 40h5M8 50h3M8 60h5M20 72v-5M30 72v-3M40 72v-5M50 72v-3M60 72v-5" stroke="var(--primary)" strokeWidth="1.5" />
    </svg>
  )
}

export function Ruler({ size = 120, className = "" }: DecorationProps) {
  return (
    <svg width={size} height={size * 0.22} viewBox="0 0 120 26" fill="none" className={className} aria-hidden="true">
      <rect x="1.500" y="1.500" width="117" height="23" rx="3" fill="var(--accent)" fillOpacity="0.35" stroke="#c98f12" strokeWidth="2" />
      <path
        d="M10 2v10M20 2v6M30 2v10M40 2v6M50 2v10M60 2v6M70 2v10M80 2v6M90 2v10M100 2v6M110 2v10"
        stroke="#c98f12"
        strokeWidth="1.5"
      />
    </svg>
  )
}

export function DrawingCompass({ size = 80, className = "" }: DecorationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" className={className} aria-hidden="true">
      <circle cx="40" cy="12" r="6" stroke="var(--primary)" strokeWidth="2.5" />
      <path d="M36 17 18 70M44 17l18 53" stroke="var(--primary)" strokeWidth="3" strokeLinecap="round" />
      <path d="M27 44h26" stroke="var(--primary)" strokeWidth="2" />
      <path d="M12 72a40 40 0 0 0 56 0" stroke="var(--rose)" strokeWidth="1.500" strokeDasharray="3 4" />
    </svg>
  )
}

// Linie de cota, ca pe planse
export function DimensionLine({ label, className = "" }: { label: string; className?: string }) {
  return (
    <div className={`flex items-center gap-3 font-hand ${className}`} aria-hidden="true">
      <span className="h-3 w-px bg-current" />
      <span className="h-px flex-1 bg-current" />
      <span className="text-lg md:text-xl whitespace-nowrap">{label}</span>
      <span className="h-px flex-1 bg-current" />
      <span className="h-3 w-px bg-current" />
    </div>
  )
}
