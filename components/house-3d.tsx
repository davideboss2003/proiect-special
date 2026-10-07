"use client"

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { OrbitControls, RoundedBox, Stars } from "@react-three/drei"
import { Bloom, EffectComposer } from "@react-three/postprocessing"
import * as THREE from "three"

type Vec3 = [number, number, number]
type Mode = "rise" | "drop" | "pop"

const CONCRETE = "#c9ced6"
const WALL = "#fbf7ef"
const WOOD = "#b98558"
const WOOD_DARK = "#8f6240"
const FRAME = "#39414f"
const ROOF = "#d9607c"
const ROSE = "#e0607e"
const YELLOW = "#f5b72f"
const WARM_LIGHT = "#ffc66e"

const SKY_DAY = new THREE.Color("#1c4a86")
const SKY_NIGHT = new THREE.Color("#050c1d")
const SAND = new THREE.Color("#d8c49c")
const GRASS = new THREE.Color("#7fc487")

// Unde ajunge fundita, in varful acoperisului
const BOW_AT: Vec3 = [-0.8, 5.15, 0.35]

const easeOutBack = (p: number) => 1 + 2.7 * Math.pow(p - 1, 3) + 1.7 * Math.pow(p - 1, 2)
const easeInOut = (p: number) => p * p * (3 - 2 * p)
const clamp01 = (v: number) => THREE.MathUtils.clamp(v, 0, 1)

function easeOutBounce(p: number) {
  const n = 7.5625
  const d = 2.75
  if (p < 1 / d) return n * p * p
  if (p < 2 / d) return n * (p -= 1.5 / d) * p + 0.75
  if (p < 2.5 / d) return n * (p -= 2.25 / d) * p + 0.9375
  return n * (p -= 2.625 / d) * p + 0.984375
}

// Animatia de aparitie a unei piese. `position` este baza piesei (punctul de pe care se ridica).
function Piece({
  position,
  delay = 0,
  mode = "rise",
  children,
}: {
  position: Vec3
  delay?: number
  mode?: Mode
  children: ReactNode
}) {
  const ref = useRef<THREE.Group>(null)
  const time = useRef(0)

  useFrame((_, dt) => {
    const g = ref.current
    if (!g || time.current > delay + 1) return
    time.current += Math.min(dt, 0.05)
    const p = clamp01((time.current - delay) / 0.7)
    g.visible = p > 0
    if (mode === "rise") g.scale.y = Math.max(easeOutBack(p), 0.001)
    if (mode === "pop") g.scale.setScalar(Math.max(easeOutBack(p), 0.001))
    if (mode === "drop") g.position.y = position[1] + (1 - easeOutBounce(p)) * 4
  })

  return (
    <group ref={ref} position={position} visible={false}>
      {children}
    </group>
  )
}

// Cutie simpla, pozitionata dupa centru
function Box({ at, size, color, roughness = 0.8 }: { at: Vec3; size: Vec3; color: string; roughness?: number }) {
  return (
    <mesh position={at} castShadow receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} roughness={roughness} />
    </mesh>
  )
}

// Cutie animata, pozitionata dupa centrul bazei
function Block({
  base,
  size,
  color,
  delay,
  mode,
}: {
  base: Vec3
  size: Vec3
  color: string
  delay?: number
  mode?: Mode
}) {
  return (
    <Piece position={base} delay={delay} mode={mode}>
      <Box at={[0, size[1] / 2, 0]} size={size} color={color} />
    </Piece>
  )
}

// Material care se aprinde seara (ferestre, becuri, piscina)
function GlowMaterial({
  lit,
  color,
  glow = WARM_LIGHT,
  intensity = 1.5,
  opacity = 1,
}: {
  lit: boolean
  color: string
  glow?: string
  intensity?: number
  opacity?: number
}) {
  const ref = useRef<THREE.MeshStandardMaterial>(null)

  // Se aprinde lin; proprietatile care ar forta recompilarea shaderului raman fixe
  useFrame((_, dt) => {
    const m = ref.current
    if (!m) return
    m.emissiveIntensity = THREE.MathUtils.damp(m.emissiveIntensity, lit ? intensity : 0, 4, dt)
    if (opacity < 1) m.opacity = THREE.MathUtils.damp(m.opacity, lit ? Math.min(opacity + 0.4, 1) : opacity, 4, dt)
  })

  return (
    <meshStandardMaterial
      ref={ref}
      color={color}
      roughness={0.15}
      metalness={0.1}
      transparent={opacity < 1}
      opacity={opacity}
      emissive={glow}
      emissiveIntensity={0}
      toneMapped={false}
    />
  )
}

function Glass({ base, size, lit, delay }: { base: Vec3; size: Vec3; lit: boolean; delay?: number }) {
  return (
    <Piece position={base} delay={delay} mode="pop">
      <mesh position={[0, size[1] / 2, 0]}>
        <boxGeometry args={size} />
        <GlowMaterial lit={lit} color="#bfe3ff" opacity={0.55} />
      </mesh>
    </Piece>
  )
}

// Fereastra cu rama inchisa; `axis` = directia in care priveste
function Window({
  at,
  w,
  h,
  axis,
  lit,
  delay,
}: {
  at: Vec3
  w: number
  h: number
  axis: "x" | "z"
  lit: boolean
  delay: number
}) {
  const frame: Vec3 = axis === "z" ? [w + 0.14, h + 0.14, 0.08] : [0.08, h + 0.14, w + 0.14]
  const glass: Vec3 = axis === "z" ? [w, h, 0.12] : [0.12, h, w]
  return (
    <>
      <Block base={at} size={frame} color={FRAME} delay={delay} mode="pop" />
      <Glass base={[at[0], at[1] + 0.07, at[2]]} size={glass} lit={lit} delay={delay} />
    </>
  )
}

function Bulb({ at, lit, color = WARM_LIGHT, radius = 0.07 }: { at: Vec3; lit: boolean; color?: string; radius?: number }) {
  return (
    <mesh position={at}>
      <sphereGeometry args={[radius, 12, 12]} />
      <GlowMaterial lit={lit} color="#fff3d6" glow={color} intensity={3.5} />
    </mesh>
  )
}

function BowMesh() {
  return (
    <group scale={1.5}>
      {[-1, 1].map((s) => (
        <group key={s}>
          <mesh position={[s * 0.26, 0, 0]} rotation={[0, 0, (s * Math.PI) / 2]} scale={[1, 1, 0.55]} castShadow>
            <coneGeometry args={[0.32, 0.5, 24]} />
            <meshStandardMaterial color={ROSE} roughness={0.4} emissive={ROSE} emissiveIntensity={0.35} />
          </mesh>
          <mesh position={[s * 0.12, -0.3, 0]} rotation={[0, 0, s * 0.35]} castShadow>
            <boxGeometry args={[0.1, 0.45, 0.06]} />
            <meshStandardMaterial color={ROSE} roughness={0.4} emissive={ROSE} emissiveIntensity={0.35} />
          </mesh>
        </group>
      ))}
      <mesh castShadow>
        <sphereGeometry args={[0.13, 20, 20]} />
        <meshStandardMaterial color="#c94a6a" roughness={0.4} />
      </mesh>
    </group>
  )
}

const CRANE_AT: Vec3 = [4.6, 0, -3.4]
const JIB_Y = 8.2
const CRANE_REACH = Math.hypot(BOW_AT[0] - CRANE_AT[0], BOW_AT[2] - CRANE_AT[2])
const CRANE_AIM = Math.atan2(-(BOW_AT[2] - CRANE_AT[2]), BOW_AT[0] - CRANE_AT[0])
const CABLE_IDLE = 0.9
const CABLE_DOWN = JIB_Y - BOW_AT[1] - 0.43

// Macaraua: se plimba cat dureaza santierul, iar la final asaza fundita pe acoperis
function Crane({ built, lit }: { built: number; lit: boolean }) {
  const jib = useRef<THREE.Group>(null)
  const cable = useRef<THREE.Mesh>(null)
  const hook = useRef<THREE.Mesh>(null)
  const bow = useRef<THREE.Group>(null)
  const beacon = useRef<THREE.MeshStandardMaterial>(null)
  const finale = useRef(0)
  const carrying = built >= 6

  useFrame(({ clock }, dt) => {
    if (!jib.current || !cable.current || !hook.current || !bow.current) return
    const t = clock.elapsedTime

    let length = CABLE_IDLE
    if (carrying) {
      finale.current += Math.min(dt, 0.05)
      jib.current.rotation.y = THREE.MathUtils.damp(jib.current.rotation.y, CRANE_AIM, 3, dt)
      const lower = easeInOut(clamp01((finale.current - 1.4) / 2.2))
      const retract = easeInOut(clamp01((finale.current - 3.8) / 1.2))
      length = THREE.MathUtils.lerp(CABLE_IDLE, CABLE_DOWN, lower - retract)
      bow.current.position.y = -(0.43 + (retract > 0 ? CABLE_DOWN : length))
    } else {
      jib.current.rotation.y = CRANE_AIM + 0.9 + 0.45 * Math.sin(t * 0.5)
    }

    cable.current.scale.y = length
    hook.current.position.y = -0.15 - length
    bow.current.rotation.y = -jib.current.rotation.y
    if (beacon.current) beacon.current.emissiveIntensity = lit ? 2 + 2 * Math.sin(t * 4) : 0
  })

  return (
    <Piece position={CRANE_AT} mode="pop" delay={0.5}>
      <Box at={[0, 0.1, 0]} size={[1.1, 0.2, 1.1]} color={CONCRETE} />
      <Box at={[0, JIB_Y / 2, 0]} size={[0.3, JIB_Y, 0.3]} color={YELLOW} />
      {Array.from({ length: 9 }, (_, i) => (
        <Box key={i} at={[0, 0.7 + i * 0.85, 0]} size={[0.36, 0.06, 0.36]} color="#c98f12" />
      ))}
      <Box at={[0.1, JIB_Y - 0.35, 0.32]} size={[0.5, 0.45, 0.4]} color="#f4f6fa" />

      <group ref={jib} position={[0, JIB_Y, 0]}>
        <Box at={[3.5, 0, 0]} size={[7.6, 0.14, 0.22]} color={YELLOW} />
        <Box at={[-1.3, 0, 0]} size={[2.4, 0.14, 0.22]} color={YELLOW} />
        <Box at={[-2.1, -0.3, 0]} size={[0.7, 0.5, 0.45]} color="#8b939f" />
        <Box at={[0, 0.5, 0]} size={[0.14, 0.9, 0.14]} color={YELLOW} />
        <mesh position={[2.5, 0.475, 0]} rotation={[0, 0, -0.188]}>
          <boxGeometry args={[5.09, 0.04, 0.04]} />
          <meshStandardMaterial color="#c98f12" />
        </mesh>
        <mesh position={[-1, 0.475, 0]} rotation={[0, 0, 0.443]}>
          <boxGeometry args={[2.21, 0.04, 0.04]} />
          <meshStandardMaterial color="#c98f12" />
        </mesh>
        <mesh position={[0, 1.02, 0]}>
          <sphereGeometry args={[0.08, 12, 12]} />
          <meshStandardMaterial ref={beacon} color="#ff5a5a" emissive="#ff3030" emissiveIntensity={0} toneMapped={false} />
        </mesh>

        <group position={[CRANE_REACH, 0, 0]}>
          <Box at={[0, -0.12, 0]} size={[0.3, 0.1, 0.28]} color={FRAME} />
          <mesh ref={cable} position={[0, -0.15, 0]}>
            <cylinderGeometry args={[0.015, 0.015, 1, 6]} onUpdate={(g) => g.translate(0, -0.5, 0)} />
            <meshStandardMaterial color="#2a2f38" />
          </mesh>
          <mesh ref={hook}>
            <boxGeometry args={[0.14, 0.14, 0.14]} />
            <meshStandardMaterial color={FRAME} />
          </mesh>
          <group ref={bow} visible={carrying}>
            <BowMesh />
          </group>
        </group>
      </group>
    </Piece>
  )
}

function Roof({ lit }: { lit: boolean }) {
  const geometry = useMemo(() => {
    const tri = new THREE.Shape()
    tri.moveTo(-2.25, 0)
    tri.lineTo(2.25, 0)
    tri.lineTo(0, 1.3)
    tri.closePath()
    const g = new THREE.ExtrudeGeometry(tri, { depth: 4.6, bevelEnabled: false })
    g.translate(0, 0, -2.3)
    return g
  }, [])

  return (
    <>
      <Piece position={[-0.8, 3.45, 0.35]} mode="drop">
        <mesh geometry={geometry} castShadow receiveShadow>
          <meshStandardMaterial color={ROOF} roughness={0.55} />
        </mesh>
        {/* Fereastra rotunda de la mansarda */}
        <mesh position={[0, 0.5, 2.31]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.3, 0.3, 0.06, 28]} />
          <GlowMaterial lit={lit} color="#bfe3ff" />
        </mesh>
        <mesh position={[0, 0.5, 2.32]}>
          <torusGeometry args={[0.31, 0.045, 10, 32]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
      </Piece>
      <Block base={[0.45, 3.6, -0.9]} size={[0.4, 1.05, 0.4]} color={WALL} delay={0.7} />
      <Block base={[0.45, 4.65, -0.9]} size={[0.5, 0.08, 0.5]} color={FRAME} delay={0.9} mode="pop" />
    </>
  )
}

// Pergola de pe terasa, cu ghirlanda de becuri
function Pergola({ lit }: { lit: boolean }) {
  const posts: [number, number][] = [
    [1.2, -1.5],
    [2.6, -1.5],
    [1.2, 1.5],
    [2.6, 1.5],
  ]
  return (
    <Piece position={[0, 1.91, 0]} delay={1} mode="rise">
      {posts.map(([x, z]) => (
        <Box key={`${x}${z}`} at={[x, 0.625, z]} size={[0.1, 1.25, 0.1]} color={WOOD} />
      ))}
      <Box at={[1.2, 1.3, 0]} size={[0.1, 0.1, 3.3]} color={WOOD} />
      <Box at={[2.6, 1.3, 0]} size={[0.1, 0.1, 3.3]} color={WOOD} />
      {[-1.5, -0.9, -0.3, 0.3, 0.9, 1.5].map((z) => (
        <Box key={z} at={[1.9, 1.38, z]} size={[1.7, 0.06, 0.08]} color={WOOD_DARK} />
      ))}
      {[-1.4, -0.93, -0.47, 0, 0.47, 0.93, 1.4].map((z, i) => (
        <Bulb key={z} at={[2.68, 1.18 - 0.06 * Math.sin((i / 6) * Math.PI), z]} lit={lit} color={i % 2 ? "#ff9ab3" : WARM_LIGHT} />
      ))}
      {[1.45, 1.9, 2.35].map((x, i) => (
        <Bulb key={x} at={[x, 1.16, 1.58]} lit={lit} color={i % 2 ? WARM_LIGHT : "#ff9ab3"} />
      ))}
    </Piece>
  )
}

function RoundTree({ at, delay, scale = 1 }: { at: Vec3; delay: number; scale?: number }) {
  return (
    <Piece position={at} delay={delay} mode="pop">
      <group scale={scale}>
        <mesh position={[0, 0.5, 0]} castShadow>
          <cylinderGeometry args={[0.09, 0.13, 1, 8]} />
          <meshStandardMaterial color="#8a6a4f" />
        </mesh>
        {(
          [
            [0, 1.35, 0, 0.62, "#5fb37c"],
            [0.38, 1.1, 0.15, 0.45, "#6fc48b"],
            [-0.35, 1.15, -0.1, 0.48, "#55a872"],
            [0.05, 1.75, -0.05, 0.4, "#7ccf97"],
          ] as const
        ).map(([x, y, z, r, c], i) => (
          <mesh key={i} position={[x, y, z]} castShadow>
            <icosahedronGeometry args={[r, 1]} />
            <meshStandardMaterial color={c} roughness={0.9} flatShading />
          </mesh>
        ))}
      </group>
    </Piece>
  )
}

function ConeTree({ at, delay, scale = 1 }: { at: Vec3; delay: number; scale?: number }) {
  return (
    <Piece position={at} delay={delay} mode="pop">
      <group scale={scale}>
        <mesh position={[0, 0.2, 0]} castShadow>
          <cylinderGeometry args={[0.07, 0.09, 0.4, 8]} />
          <meshStandardMaterial color="#8a6a4f" />
        </mesh>
        {[0.75, 1.2, 1.6].map((y, i) => (
          <mesh key={y} position={[0, y, 0]} castShadow>
            <coneGeometry args={[0.5 - i * 0.12, 0.8, 8]} />
            <meshStandardMaterial color={i % 2 ? "#5fb37c" : "#4f9f6c"} roughness={0.9} flatShading />
          </mesh>
        ))}
      </group>
    </Piece>
  )
}

function Lamp({ at, delay, lit }: { at: Vec3; delay: number; lit: boolean }) {
  return (
    <Piece position={at} delay={delay} mode="rise">
      <Box at={[0, 0.45, 0]} size={[0.05, 0.9, 0.05]} color={FRAME} />
      <Bulb at={[0, 0.98, 0]} lit={lit} radius={0.12} />
    </Piece>
  )
}

// Gradina care apare la final
function Garden({ lit }: { lit: boolean }) {
  return (
    <>
      {/* Alee */}
      {[2.55, 3.05, 3.55, 4.05].map((z, i) => (
        <Block key={z} base={[-1.9 + (i % 2) * 0.12, 0, z]} size={[0.65, 0.05, 0.36]} color="#e9e4d8" delay={0.2 + i * 0.12} mode="pop" />
      ))}
      <Lamp at={[-2.6, 0, 3.3]} delay={0.9} lit={lit} />
      <Lamp at={[-1.2, 0, 3.9]} delay={1.05} lit={lit} />

      {/* Piscina */}
      <Block base={[3, 0, 3.2]} size={[3.4, 0.1, 1.9]} color="#f4f6fa" delay={0.5} mode="pop" />
      <Piece position={[3, 0.1, 3.2]} delay={0.9} mode="pop">
        <mesh>
          <boxGeometry args={[3, 0.03, 1.5]} />
          <GlowMaterial lit={lit} color="#58c8ee" glow="#2aa5ff" intensity={1.8} />
        </mesh>
      </Piece>

      {/* Jardiniera cu flori din fata geamului */}
      <Piece position={[1, 0, 2.05]} delay={0.7} mode="pop">
        <Box at={[0, 0.1, 0]} size={[2.6, 0.2, 0.3]} color={WOOD} />
        {[-1.1, -0.65, -0.2, 0.25, 0.7, 1.1].map((x, i) => (
          <mesh key={x} position={[x, 0.3, 0]} castShadow>
            <icosahedronGeometry args={[0.15, 1]} />
            <meshStandardMaterial color={i % 2 ? "#ff9ab3" : ROSE} flatShading />
          </mesh>
        ))}
      </Piece>

      <RoundTree at={[-4.5, 0, -3.2]} delay={0.4} scale={1.25} />
      <RoundTree at={[-4.6, 0, 3]} delay={0.7} />
      <RoundTree at={[2.4, 0, -3.7]} delay={1} scale={0.9} />
      <ConeTree at={[-3.3, 0, -3.7]} delay={0.6} scale={1.2} />
      <ConeTree at={[-4.7, 0, -1.1]} delay={0.85} />
      <ConeTree at={[-3.6, 0, 2.5]} delay={1.1} scale={0.8} />
    </>
  )
}

const GROUND_COLUMNS: [number, number][] = [-2.5, -0.85, 0.85, 2.5].flatMap((x) => [
  [x, 1.5],
  [x, -1.5],
]) as [number, number][]

const UPPER_COLUMNS: [number, number][] = [-2.5, 0.9].flatMap((x) => [
  [x, -1.5],
  [x, 0.35],
  [x, 2.2],
]) as [number, number][]

function House({ built, lit }: { built: number; lit: boolean }) {
  return (
    <>
      {/* Trasarea: conturul casei desenat pe teren */}
      {[
        [0, 1.6, 5.2, 0.05],
        [0, -1.6, 5.2, 0.05],
        [2.6, 0, 0.05, 3.2],
        [-2.6, 0, 0.05, 3.2],
      ].map(([x, z, w, d], i) => (
        <mesh key={i} position={[x, 0.01, z]}>
          <boxGeometry args={[w, 0.01, d]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      ))}

      {built >= 1 && (
        <>
          <Block base={[0, 0, 0]} size={[6, 0.1, 4]} color="#aeb5bf" mode="rise" />
          <Block base={[0, 0.1, 0]} size={[5.6, 0.15, 3.6]} color={CONCRETE} delay={0.25} mode="rise" />
        </>
      )}

      {built >= 2 &&
        GROUND_COLUMNS.map(([x, z], i) => (
          <group key={i}>
            <Block base={[x, 0.25, z]} size={[0.24, 1.5, 0.24]} color={CONCRETE} delay={i * 0.1} />
            {/* Mustatile de armatura, pana se toarna planseul */}
            {built === 2 &&
              [-1, 1].map((s) => (
                <Block key={s} base={[x + s * 0.06, 1.75, z + s * 0.06]} size={[0.025, 0.35, 0.025]} color="#5a4a42" delay={0.5 + i * 0.1} />
              ))}
          </group>
        ))}

      {built >= 3 && (
        <>
          <Block base={[0, 1.75, 0]} size={[5.6, 0.16, 3.6]} color={CONCRETE} mode="drop" />
          <Block base={[-0.8, 1.75, 2.1]} size={[3.8, 0.16, 0.7]} color={CONCRETE} mode="drop" />
          {UPPER_COLUMNS.map(([x, z], i) => (
            <Block key={i} base={[x, 1.91, z]} size={[0.24, 1.4, 0.24]} color={CONCRETE} delay={0.7 + i * 0.1} />
          ))}
          <Block base={[-0.8, 3.31, 0.35]} size={[3.9, 0.14, 4.2]} color={CONCRETE} delay={1.5} mode="drop" />
        </>
      )}

      {built >= 4 && (
        <>
          {/* Parter */}
          <Block base={[0, 0.25, -1.5]} size={[5, 1.5, 0.14]} color={WALL} />
          <Block base={[-2.5, 0.25, 0]} size={[0.14, 1.5, 3]} color={WALL} delay={0.1} />
          <Block base={[2.5, 0.25, 0]} size={[0.14, 1.5, 3]} color={WALL} delay={0.2} />
          <Block base={[-1.68, 0.25, 1.5]} size={[1.5, 1.5, 0.14]} color={WOOD} delay={0.3} />
          {[-1.45, -1.28, -1.11, -0.96].map((x) => (
            <Block key={x} base={[x, 0.25, 1.59]} size={[0.05, 1.5, 0.04]} color={WOOD_DARK} delay={0.5} />
          ))}
          <Block base={[-1.9, 0.25, 1.58]} size={[0.62, 1.2, 0.06]} color={FRAME} delay={0.9} mode="pop" />
          <Block base={[-1.7, 0.8, 1.62]} size={[0.05, 0.14, 0.04]} color={YELLOW} delay={1.1} mode="pop" />
          <Block base={[-1.9, 0, 2.05]} size={[1.1, 0.12, 0.5]} color={CONCRETE} delay={0.9} mode="pop" />

          {/* Peretele de sticla al livingului */}
          <Glass base={[0.82, 0.3, 1.5]} size={[3.2, 1.38, 0.08]} lit={lit} delay={0.6} />
          {[-0.76, 0.03, 0.83, 1.63, 2.42].map((x, i) => (
            <Block key={x} base={[x, 0.25, 1.5]} size={[0.07, 1.5, 0.13]} color={FRAME} delay={0.7 + i * 0.06} />
          ))}
          <Window at={[2.57, 0.6, 0]} w={1.4} h={0.8} axis="x" lit={lit} delay={1} />
          <Window at={[-2.57, 0.7, -0.3]} w={1} h={0.7} axis="x" lit={lit} delay={1.05} />
          <Window at={[-1.3, 0.7, -1.57]} w={1.2} h={0.7} axis="z" lit={lit} delay={1.1} />
          <Window at={[1.3, 0.7, -1.57]} w={1.2} h={0.7} axis="z" lit={lit} delay={1.15} />

          {/* Etaj, iesit in consola peste intrare */}
          <Block base={[-0.8, 1.91, -1.5]} size={[3.4, 1.4, 0.14]} color={WALL} delay={0.5} />
          <Block base={[-0.8, 1.91, 2.2]} size={[3.4, 1.4, 0.14]} color={WALL} delay={0.6} />
          <Block base={[-2.5, 1.91, 0.35]} size={[0.14, 1.4, 3.7]} color={WALL} delay={0.7} />
          <Block base={[0.9, 1.91, 0.35]} size={[0.14, 1.4, 3.7]} color={WALL} delay={0.8} />
          <Window at={[-0.8, 2.1, 2.27]} w={2.6} h={0.95} axis="z" lit={lit} delay={1.3} />
          <Window at={[-2.57, 2.5, 0.35]} w={2.2} h={0.5} axis="x" lit={lit} delay={1.35} />
          <Window at={[-0.8, 2.3, -1.57]} w={1.6} h={0.7} axis="z" lit={lit} delay={1.4} />
          <Window at={[0.97, 1.95, 0.2]} w={1.5} h={1.15} axis="x" lit={lit} delay={1.45} />

          {/* Balustrada de sticla a terasei */}
          <Piece position={[0, 1.91, 0]} delay={1.5} mode="rise">
            {(
              [
                [2.72, 0, 0.04, 3.5],
                [1.9, 1.72, 1.68, 0.04],
                [1.9, -1.72, 1.68, 0.04],
              ] as const
            ).map(([x, z, w, d], i) => (
              <group key={i}>
                <mesh position={[x, 0.25, z]}>
                  <boxGeometry args={[w, 0.5, d]} />
                  <meshStandardMaterial color="#cfeaff" transparent opacity={0.35} roughness={0.1} />
                </mesh>
                <Box at={[x, 0.52, z]} size={[w + 0.02, 0.04, d + 0.02]} color={FRAME} />
              </group>
            ))}
          </Piece>
        </>
      )}

      {built >= 5 && (
        <>
          <Roof lit={lit} />
          <Pergola lit={lit} />
        </>
      )}

      {built >= 6 && <Garden lit={lit} />}
    </>
  )
}

// Insula pe care sta santierul: nisip cat se construieste, iarba la final
function Island({ green }: { green: boolean }) {
  const top = useRef<THREE.MeshStandardMaterial>(null)

  useFrame((_, dt) => {
    top.current?.color.lerp(green ? GRASS : SAND, 1 - Math.exp(-1.5 * dt))
  })

  return (
    <group>
      <RoundedBox args={[11.4, 0.8, 9.4]} radius={0.3} smoothness={4} position={[0, -0.4, 0]} receiveShadow>
        <meshStandardMaterial ref={top} color={SAND} roughness={1} />
      </RoundedBox>
      <RoundedBox args={[11, 1, 9]} radius={0.4} smoothness={4} position={[0, -1.1, 0]}>
        <meshStandardMaterial color="#9a6d4a" roughness={1} />
      </RoundedBox>
      {/* Ascuns in pamant: pregateste din timp shaderul folosit de copaci */}
      <mesh position={[0, -1.2, 0]}>
        <icosahedronGeometry args={[0.1, 0]} />
        <meshStandardMaterial color="#5fb37c" flatShading />
      </mesh>
      <RoundedBox args={[9.6, 1, 7.6]} radius={0.5} smoothness={4} position={[0, -1.8, 0]}>
        <meshStandardMaterial color="#7a5338" roughness={1} />
      </RoundedBox>
    </group>
  )
}

const FIREFLY_COUNT = 45
const FIREFLY_COLOR = new THREE.Color(3, 2.3, 0.9)

// Licuricii care plutesc in jurul casei dupa ce se aprind luminile
function Fireflies({ lit }: { lit: boolean }) {
  const mesh = useRef<THREE.InstancedMesh>(null)
  const size = useRef(0)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const seeds = useMemo(
    () =>
      Array.from({ length: FIREFLY_COUNT }, () => ({
        x: (Math.random() - 0.5) * 11,
        y: 0.6 + Math.random() * 5.5,
        z: (Math.random() - 0.5) * 9,
        phase: Math.random() * Math.PI * 2,
        speed: 0.3 + Math.random() * 0.5,
      })),
    [],
  )

  useFrame(({ clock }, dt) => {
    if (!mesh.current) return
    size.current = THREE.MathUtils.damp(size.current, lit ? 1 : 0, 2, dt)
    const t = clock.elapsedTime
    seeds.forEach((f, i) => {
      const a = t * f.speed + f.phase
      dummy.position.set(f.x + Math.sin(a) * 0.5, f.y + Math.sin(a * 1.7) * 0.35, f.z + Math.cos(a * 1.3) * 0.5)
      dummy.scale.setScalar(size.current * (0.6 + 0.4 * Math.sin(a * 3)))
      dummy.updateMatrix()
      mesh.current!.setMatrixAt(i, dummy.matrix)
    })
    mesh.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, FIREFLY_COUNT]} frustumCulled={false}>
      <sphereGeometry args={[0.045, 8, 8]} />
      <meshBasicMaterial color={FIREFLY_COLOR} toneMapped={false} />
    </instancedMesh>
  )
}

// Ziua trece in seara dupa ce fundita ajunge pe acoperis
function Atmosphere({ dusk, lit }: { dusk: boolean; lit: boolean }) {
  const scene = useThree((s) => s.scene)
  const ambient = useRef<THREE.AmbientLight>(null)
  const sun = useRef<THREE.DirectionalLight>(null)
  const nightLights = useRef<THREE.Group>(null)
  const sky = useMemo(() => SKY_DAY.clone(), [])
  const moonTint = useMemo(() => new THREE.Color("#9db4ff"), [])
  const white = useMemo(() => new THREE.Color("#ffffff"), [])

  useEffect(() => {
    scene.background = sky
  }, [scene, sky])

  useFrame((_, dt) => {
    const k = 1 - Math.exp(-1.2 * dt)
    sky.lerp(dusk ? SKY_NIGHT : SKY_DAY, k)
    if (ambient.current) {
      ambient.current.intensity = THREE.MathUtils.lerp(ambient.current.intensity, dusk ? 0.8 : 1.3, k)
      ambient.current.color.lerp(dusk ? moonTint : white, k)
    }
    if (sun.current) sun.current.intensity = THREE.MathUtils.lerp(sun.current.intensity, dusk ? 0.7 : 2.3, k)
    nightLights.current?.children.forEach((l) => {
      const light = l as THREE.PointLight
      light.intensity = THREE.MathUtils.damp(light.intensity, lit ? light.userData.power : 0, 3, dt)
    })
  })

  return (
    <>
      <ambientLight ref={ambient} intensity={1.3} />
      <directionalLight
        ref={sun}
        position={[7, 13, 8]}
        intensity={2.3}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={12}
        shadow-camera-bottom={-10}
        shadow-bias={-0.0005}
      />
      <directionalLight position={[-7, 5, -6]} intensity={0.45} color="#bcd7ff" />

      {/* Montate de la inceput: adaugarea de lumini in timpul animatiei ar bloca scena o clipa */}
      <group ref={nightLights}>
        <pointLight position={[0.8, 1.2, 2.6]} color={WARM_LIGHT} intensity={0} distance={7} userData={{ power: 9 }} />
        <pointLight position={[1.9, 2.9, 0]} color={WARM_LIGHT} intensity={0} distance={5} userData={{ power: 8 }} />
        <pointLight position={[3, 0.8, 3.2]} color="#49b8ff" intensity={0} distance={5} userData={{ power: 10 }} />
        <pointLight position={[-1.9, 1.2, 3.6]} color={WARM_LIGHT} intensity={0} distance={5} userData={{ power: 8 }} />
      </group>
      {/* Pana seara stau micsorate in pamant, ca shaderul lor sa fie deja compilat */}
      <group scale={dusk ? 1 : 0.001} position={[0, dusk ? 0 : -1.2, 0]}>
        <Stars radius={70} depth={30} count={1500} factor={5} fade speed={0.6} />
      </group>
      <Fireflies lit={lit} />
    </>
  )
}

// Pe telefon: glisarea pe verticala deruleaza pagina, cea pe orizontala roteste casa
function AllowPageScroll() {
  const gl = useThree((s) => s.gl)
  useEffect(() => {
    const id = setTimeout(() => {
      gl.domElement.style.touchAction = "pan-y"
    }, 0)
    return () => clearTimeout(id)
  }, [gl])
  return null
}

// Pe ecrane inalte (telefon) largim unghiul, ca insula si macaraua sa incapa pe latime
function FitCamera() {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera
  const aspect = useThree((s) => s.size.width / s.size.height)
  useEffect(() => {
    camera.fov = aspect < 1 ? 32 / aspect : 32
    camera.updateProjectionMatrix()
  }, [camera, aspect])
  return null
}

const VIEW_ANGLE = 1.15

export default function House3D({ built, onContextLost }: { built: number; onContextLost?: () => void }) {
  // Finalul: fundita coboara, se lasa seara, apoi se aprind luminile
  const [dusk, setDusk] = useState(false)
  const [lit, setLit] = useState(false)
  const finished = built >= 6

  useEffect(() => {
    if (!finished) return
    const toDusk = setTimeout(() => setDusk(true), 3800)
    const toLit = setTimeout(() => setLit(true), 5600)
    return () => {
      clearTimeout(toDusk)
      clearTimeout(toLit)
    }
  }, [finished])

  return (
    <Canvas
      shadows
      dpr={[1, 1.75]}
      camera={{ position: [16.5, 14.8, 20.2], fov: 32 }}
      // Daca placa video renunta, pagina trece pe schita 2D
      onCreated={({ gl }) => gl.domElement.addEventListener("webglcontextlost", () => onContextLost?.())}
      aria-label="Machetă 3D a unei case care se construiește etapă cu etapă"
    >
      <Atmosphere dusk={dusk} lit={lit} />
      <Island green={finished} />
      <House built={built} lit={lit} />
      {built >= 1 && <Crane built={built} lit={lit} />}

      <EffectComposer>
        <Bloom mipmapBlur luminanceThreshold={1} intensity={0.7} radius={0.7} />
      </EffectComposer>

      <OrbitControls
        target={[0, 3.1, 0]}
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={1.2}
        minPolarAngle={VIEW_ANGLE}
        maxPolarAngle={VIEW_ANGLE}
      />
      <AllowPageScroll />
      <FitCamera />
    </Canvas>
  )
}
