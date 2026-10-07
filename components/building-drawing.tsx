import { BowShape } from "./site-decorations"

const LINE = "#ffffff"
const shape = { stroke: LINE, strokeWidth: 2, strokeLinejoin: "round" as const, pathLength: 1 }

// Schita 2D, folosita cand telefonul sau browserul nu poate afisa macheta 3D
export function BuildingDrawing({ built }: { built: number }) {
  return (
    <svg viewBox="0 0 400 400" className="w-full h-auto" role="img" aria-label="Schița unei case care se construiește etapă cu etapă">
      {/* Teren */}
      <line x1="20" y1="320" x2="380" y2="320" stroke={LINE} strokeWidth="2" />
      <path
        d="M30 320l-10 12M60 320l-10 12M330 320l-10 12M360 320l-10 12M380 320l-10 12"
        stroke={LINE}
        strokeWidth="1.200"
        opacity="0.6"
      />
      <text x="346" y="314" fill={LINE} fontSize="13" className="font-hand" opacity="0.8">±0.00</text>

      {built >= 1 && (
        <g className="draw">
          <rect x="84" y="320" width="232" height="22" fill="rgba(255,255,255,0.14)" className="fill-late" {...shape} />
          <rect x="74" y="342" width="56" height="16" fill="rgba(255,255,255,0.14)" className="fill-late" {...shape} />
          <rect x="172" y="342" width="56" height="16" fill="rgba(255,255,255,0.14)" className="fill-late" {...shape} />
          <rect x="270" y="342" width="56" height="16" fill="rgba(255,255,255,0.14)" className="fill-late" {...shape} />
          <text x="20" y="356" fill={LINE} fontSize="13" className="font-hand fade-late" opacity="0.8">-1.20</text>
        </g>
      )}

      {built >= 2 && (
        <g className="draw">
          <rect x="95" y="140" width="14" height="180" fill="rgba(255,255,255,0.2)" className="fill-late" {...shape} />
          <rect x="193" y="140" width="14" height="180" fill="rgba(255,255,255,0.2)" className="fill-late" {...shape} />
          <rect x="291" y="140" width="14" height="180" fill="rgba(255,255,255,0.2)" className="fill-late" {...shape} />
        </g>
      )}

      {built >= 3 && (
        <g className="draw">
          <rect x="88" y="226" width="224" height="10" fill="var(--blueprint)" className="fill-late" {...shape} />
          <rect x="88" y="136" width="224" height="10" fill="var(--blueprint)" className="fill-late" {...shape} />
          <text x="322" y="235" fill={LINE} fontSize="13" className="font-hand fade-late" opacity="0.8">+3.00</text>
          <text x="322" y="145" fill={LINE} fontSize="13" className="font-hand fade-late" opacity="0.8">+6.00</text>
        </g>
      )}

      {built >= 4 && (
        <g className="draw">
          {/* Usa */}
          <rect x="132" y="262" width="38" height="58" fill="rgba(245,183,47,0.25)" className="fill-late" {...shape} />
          <circle cx="163" cy="293" r="2" fill={LINE} className="fade-late" />
          {/* Ferestre */}
          <rect x="226" y="258" width="46" height="36" fill="rgba(255,255,255,0.12)" className="fill-late" {...shape} />
          <path d="M249 258v36M226 276h46" {...shape} fill="none" strokeWidth="1.500" />
          <rect x="128" y="166" width="46" height="36" fill="rgba(255,255,255,0.12)" className="fill-late" {...shape} />
          <path d="M151 166v36M128 184h46" {...shape} fill="none" strokeWidth="1.500" />
          <rect x="226" y="166" width="46" height="36" fill="rgba(255,255,255,0.12)" className="fill-late" {...shape} />
          <path d="M249 166v36M226 184h46" {...shape} fill="none" strokeWidth="1.500" />
        </g>
      )}

      {built >= 5 && (
        <g className="draw">
          <polygon points="72,136 200,66 328,136" fill="rgba(255,255,255,0.1)" className="fill-late" {...shape} />
          <path d="M200 66v70M136 101v35M264 101v35M136 136l64-35 64 35" {...shape} fill="none" strokeWidth="1.200" />
          <rect x="258" y="72" width="16" height="28" fill="var(--blueprint)" className="fill-late" {...shape} />
        </g>
      )}

      {built >= 6 && (
        <g className="draw">
          <line x1="200" y1="66" x2="200" y2="22" {...shape} />
          <BowShape x={200} y={26} scale={1.5} className="fade-late" />
        </g>
      )}
    </svg>
  )
}
