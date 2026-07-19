'use client'

import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { EffectComposer, Bloom, Vignette, SMAA } from '@react-three/postprocessing'
import {
  AdditiveBlending,
  BackSide,
  CanvasTexture,
  Color,
  InstancedMesh,
  MathUtils,
  NormalBlending,
  Object3D,
  SRGBColorSpace,
  type Group,
  type Mesh,
  type Points as ThreePoints,
  type Texture,
} from 'three'

const TAU = Math.PI * 2
const rand = (a: number, b: number) => a + Math.random() * (b - a)

export type SceneColors = { fog: string; accent: string; base: string; star: string }

/* ------------------------------------------------------------------ textures */

function makeStarSprite(): CanvasTexture {
  const s = 64
  const c = document.createElement('canvas')
  c.width = c.height = s
  const ctx = c.getContext('2d')!
  const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2)
  g.addColorStop(0, 'rgba(255,255,255,1)')
  g.addColorStop(0.35, 'rgba(255,255,255,0.5)')
  g.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, s, s)
  return new CanvasTexture(c)
}

function makeBanded(stops: [number, string][]): CanvasTexture {
  const w = 256
  const c = document.createElement('canvas')
  c.width = c.height = w
  const ctx = c.getContext('2d')!
  const g = ctx.createLinearGradient(0, 0, 0, w)
  stops.forEach(([o, col]) => g.addColorStop(o, col))
  ctx.fillStyle = g
  ctx.fillRect(0, 0, w, w)
  for (let i = 0; i < 46; i++) {
    ctx.globalAlpha = 0.05
    ctx.fillStyle = Math.random() > 0.5 ? '#ffffff' : '#000000'
    ctx.fillRect(0, Math.random() * w, w, Math.random() * 5 + 1)
  }
  ctx.globalAlpha = 1
  const tex = new CanvasTexture(c)
  tex.colorSpace = SRGBColorSpace
  return tex
}

function makeEarth(): CanvasTexture {
  const w = 256
  const h = 128
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  const ctx = c.getContext('2d')!
  ctx.fillStyle = '#1f5fae'
  ctx.fillRect(0, 0, w, h)
  ctx.fillStyle = '#2f8f4e'
  for (let i = 0; i < 26; i++) {
    ctx.beginPath()
    ctx.ellipse(rand(0, w), rand(24, h - 24), rand(8, 26), rand(6, 16), rand(0, TAU), 0, TAU)
    ctx.fill()
  }
  ctx.fillStyle = '#eaf3ff'
  ctx.fillRect(0, 0, w, 8)
  ctx.fillRect(0, h - 8, w, 8)
  const tex = new CanvasTexture(c)
  tex.colorSpace = SRGBColorSpace
  return tex
}

/** Equirectangular nebula backdrop, tinted for the theme so light mode stays bright. */
function makeNebula(dark: boolean): CanvasTexture {
  const w = 1024
  const h = 512
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  const ctx = c.getContext('2d')!
  ctx.fillStyle = dark ? '#05060f' : '#e9edf7'
  ctx.fillRect(0, 0, w, h)

  const clouds = dark
    ? ['#3a2a6e', '#1f3f7a', '#2a5f6e', '#4a2a5e']
    : ['#c9d2ee', '#d7e0f2', '#cfe6ea', '#dcd2ec']
  ctx.globalCompositeOperation = dark ? 'lighter' : 'source-over'
  for (let i = 0; i < 22; i++) {
    const x = rand(0, w)
    const y = rand(0, h)
    const rr = rand(60, 200)
    const g = ctx.createRadialGradient(x, y, 0, x, y, rr)
    const col = clouds[Math.floor(rand(0, clouds.length))]
    g.addColorStop(0, col + (dark ? '55' : '77'))
    g.addColorStop(1, col + '00')
    ctx.fillStyle = g
    ctx.beginPath()
    ctx.arc(x, y, rr, 0, TAU)
    ctx.fill()
  }
  // baked distant stars
  ctx.globalCompositeOperation = 'source-over'
  ctx.fillStyle = dark ? '#ffffff' : '#7f8cad'
  for (let i = 0; i < 340; i++) {
    ctx.globalAlpha = rand(0.15, 0.8)
    ctx.fillRect(rand(0, w), rand(0, h), rand(0.6, 1.6), rand(0.6, 1.6))
  }
  ctx.globalAlpha = 1
  const tex = new CanvasTexture(c)
  tex.colorSpace = SRGBColorSpace
  return tex
}

/* ------------------------------------------------------------------- helpers */

function usePointer() {
  const pointer = useRef({ x: 0, y: 0 })
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])
  return pointer
}

/* -------------------------------------------------------------------- nebula */

function Nebula({ dark }: { dark: boolean }) {
  const ref = useRef<Mesh>(null)
  const tex = useMemo(() => makeNebula(dark), [dark])
  useFrame((_, d) => {
    if (ref.current) ref.current.rotation.y += d * 0.004
  })
  return (
    <mesh ref={ref} scale={[-1, 1, 1]}>
      <sphereGeometry args={[90, 40, 40]} />
      <meshBasicMaterial map={tex} side={BackSide} fog={false} depthWrite={false} />
    </mesh>
  )
}

/* -------------------------------------------------------------------- stars */

function Starfield({
  count,
  sprite,
  size,
  opacity,
  dark,
  spin,
  phase,
}: {
  count: number
  sprite: Texture
  size: number
  opacity: number
  dark: boolean
  spin: number
  phase: number
}) {
  const ref = useRef<ThreePoints>(null)
  const mat = useRef<{ opacity: number }>(null)
  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    // Star colours: mostly white, some blue, a few warm — a real sky isn't monochrome.
    const palette = dark
      ? [
          [1, 1, 1],
          [0.7, 0.82, 1],
          [1, 0.86, 0.7],
        ]
      : [
          [0.5, 0.56, 0.72],
          [0.42, 0.5, 0.7],
          [0.6, 0.55, 0.62],
        ]
    for (let i = 0; i < count; i++) {
      positions[i * 3] = rand(-32, 32)
      positions[i * 3 + 1] = rand(-22, 22)
      positions[i * 3 + 2] = rand(-70, -2)
      const p = palette[Math.floor(rand(0, 3))]
      colors[i * 3] = p[0]
      colors[i * 3 + 1] = p[1]
      colors[i * 3 + 2] = p[2]
    }
    return { positions, colors }
  }, [count, dark])

  useFrame(({ clock }, d) => {
    if (ref.current) ref.current.rotation.z += d * spin
    // Gentle collective twinkle, the two layers out of phase.
    if (mat.current) mat.current.opacity = opacity * (0.82 + 0.18 * Math.sin(clock.elapsedTime * 1.5 + phase))
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        ref={mat}
        map={sprite}
        vertexColors
        size={size}
        sizeAttenuation
        transparent
        opacity={opacity}
        depthWrite={false}
        fog={false}
        blending={dark ? AdditiveBlending : NormalBlending}
      />
    </points>
  )
}

/* ------------------------------------------------------------------ comets */

function Comet({ accent, speed, delay }: { accent: string; speed: number; delay: number }) {
  const ref = useRef<Group>(null)
  const state = useRef({ t: -delay, from: [0, 0, 0], to: [0, 0, 0], live: false })

  const reset = () => {
    const s = state.current
    const z = rand(-40, -6)
    s.from = [rand(-6, 6) - 22, rand(4, 14), z]
    s.to = [rand(-6, 6) + 22, rand(-14, -4), z]
    s.t = -rand(0.5, 4)
    s.live = true
  }

  // Seed the first flight after mount (never during render).
  useEffect(() => {
    reset()
  }, [])

  useFrame((_, d) => {
    const g = ref.current
    const s = state.current
    if (!g) return
    s.t += d * speed
    if (s.t < 0 || s.t > 1) {
      g.visible = false
      if (s.t > 1) reset()
      return
    }
    g.visible = true
    const p = s.t
    g.position.set(
      MathUtils.lerp(s.from[0], s.to[0], p),
      MathUtils.lerp(s.from[1], s.to[1], p),
      s.from[2],
    )
    g.lookAt(s.to[0], s.to[1], s.from[2])
  })

  return (
    <group ref={ref} visible={false}>
      <mesh>
        <sphereGeometry args={[0.09, 12, 12]} />
        <meshBasicMaterial color={new Color('#ffffff')} toneMapped={false} />
      </mesh>
      {/* tail streak (points -z in local space) */}
      <mesh position={[0, 0, -1.1]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.08, 2.2, 12, 1, true]} />
        <meshBasicMaterial
          color={new Color(accent).multiplyScalar(1.6)}
          transparent
          opacity={0.5}
          blending={AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
    </group>
  )
}

/* ---------------------------------------------------------------- atmosphere */

function Atmosphere({ radius, color, power = 3 }: { radius: number; color: string; power?: number }) {
  const uniforms = useMemo(
    () => ({ uColor: { value: new Color(color) }, uPower: { value: power } }),
    [color, power],
  )
  return (
    <mesh scale={1.16}>
      <sphereGeometry args={[radius, 36, 36]} />
      <shaderMaterial
        transparent
        depthWrite={false}
        blending={AdditiveBlending}
        side={BackSide}
        uniforms={uniforms}
        vertexShader={`
          varying vec3 vN; varying vec3 vP;
          void main(){ vN = normalize(normalMatrix * normal);
            vec4 mv = modelViewMatrix * vec4(position, 1.0); vP = mv.xyz;
            gl_Position = projectionMatrix * mv; }`}
        fragmentShader={`
          uniform vec3 uColor; uniform float uPower; varying vec3 vN; varying vec3 vP;
          void main(){ float f = pow(1.0 - abs(dot(vN, normalize(-vP))), uPower);
            gl_FragColor = vec4(uColor, f); }`}
      />
    </mesh>
  )
}

/* --------------------------------------------------------------------- sun */

function Sun({ dark }: { dark: boolean }) {
  const ref = useRef<Mesh>(null)
  useFrame((_, d) => {
    if (ref.current) ref.current.rotation.y += d * 0.05
  })
  return (
    <group position={[-9, 4.5, 3]}>
      <mesh ref={ref}>
        <sphereGeometry args={[3.2, 48, 48]} />
        {/* colour pushed >1 so Bloom blooms it strongly */}
        <meshBasicMaterial color={new Color('#ffcf5a').multiplyScalar(1.9)} toneMapped={false} fog={false} />
      </mesh>
      <mesh scale={1.5}>
        <sphereGeometry args={[3.2, 32, 32]} />
        <meshBasicMaterial color="#ff9d2e" transparent opacity={0.25} blending={AdditiveBlending} depthWrite={false} fog={false} />
      </mesh>
      <pointLight color="#fff1cf" intensity={dark ? 3 : 2} distance={0} decay={0} />
    </group>
  )
}

/* ------------------------------------------------------------------- planet */

type PlanetDef = {
  name: string
  pos: [number, number, number]
  radius: number
  color?: string
  texture?: 'earth' | 'jupiter' | 'saturn' | 'venus'
  tilt: number
  spin: number
  saturnRings?: boolean
  thinRing?: string
  moon?: boolean
  atmosphere?: string
}

function SaturnRings() {
  const bands: [number, number, string, number][] = [
    [1.55, 1.95, '#c9b483', 0.5],
    [2.02, 2.28, '#e2d3a2', 0.6], // Cassini gap before this band
    [2.34, 2.75, '#cdb87e', 0.4],
  ]
  return (
    <group rotation={[-Math.PI / 2.2, 0, 0]}>
      {bands.map(([inner, outer, col, op], i) => (
        <mesh key={i}>
          <ringGeometry args={[inner, outer, 96]} />
          <meshBasicMaterial color={col} transparent opacity={op} side={2} depthWrite={false} />
        </mesh>
      ))}
    </group>
  )
}

function Planet({ def, textures }: { def: PlanetDef; textures: Record<string, CanvasTexture> }) {
  const body = useRef<Mesh>(null)
  const moon = useRef<Group>(null)
  const map = def.texture ? textures[def.texture] : undefined

  useFrame((_, d) => {
    if (body.current) body.current.rotation.y += d * def.spin
    if (moon.current) moon.current.rotation.y += d * 0.5
  })

  return (
    <group position={def.pos} rotation={[0, 0, def.tilt]}>
      <mesh ref={body}>
        <sphereGeometry args={[def.radius, 40, 40]} />
        <meshStandardMaterial map={map} color={map ? '#ffffff' : def.color} roughness={0.85} metalness={0.05} />
      </mesh>

      {def.atmosphere && <Atmosphere radius={def.radius} color={def.atmosphere} />}
      {def.saturnRings && <SaturnRings />}
      {def.thinRing && (
        <mesh rotation={[-Math.PI / 2.1, 0, 0]}>
          <ringGeometry args={[def.radius * 1.3, def.radius * 1.7, 80]} />
          <meshBasicMaterial color={def.thinRing} transparent opacity={0.4} side={2} depthWrite={false} />
        </mesh>
      )}

      {def.moon && (
        <group ref={moon}>
          <mesh position={[def.radius + 0.7, 0, 0]}>
            <sphereGeometry args={[def.radius * 0.27, 24, 24]} />
            <meshStandardMaterial color="#b8bcc4" roughness={0.9} />
          </mesh>
        </group>
      )}
    </group>
  )
}

/* -------------------------------------------------------------- asteroid belt */

function Asteroids({ count }: { count: number }) {
  const group = useRef<Group>(null)
  const mesh = useRef<InstancedMesh>(null)
  const dummy = useMemo(() => new Object3D(), [])

  useEffect(() => {
    const m = mesh.current
    if (!m) return
    for (let i = 0; i < count; i++) {
      dummy.position.set(rand(-11, 11), rand(-5, 5), rand(-27, -23))
      dummy.rotation.set(rand(0, TAU), rand(0, TAU), rand(0, TAU))
      dummy.scale.setScalar(rand(0.06, 0.22))
      dummy.updateMatrix()
      m.setMatrixAt(i, dummy.matrix)
    }
    m.instanceMatrix.needsUpdate = true
  }, [count, dummy])

  useFrame((_, d) => {
    if (group.current) group.current.rotation.z += d * 0.03
  })

  return (
    <group ref={group}>
      <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
        <icosahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color="#8b8578" flatShading roughness={0.95} />
      </instancedMesh>
    </group>
  )
}

/* -------------------------------------------------------------------- ships */

function Ship({ base, accent }: { base: string; accent: string }) {
  const ref = useRef<Group>(null)
  useFrame((_, d) => {
    if (ref.current) ref.current.rotation.z += d * 0.12
  })
  const glow = useMemo(() => new Color(accent).multiplyScalar(2.4), [accent])
  return (
    <group ref={ref}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <capsuleGeometry args={[0.16, 0.72, 8, 16]} />
        <meshStandardMaterial color={base} metalness={0.85} roughness={0.25} />
      </mesh>
      <mesh position={[0, 0, 0.66]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.16, 0.42, 18]} />
        <meshStandardMaterial color={base} metalness={0.85} roughness={0.25} />
      </mesh>
      <mesh position={[0, 0.1, 0.28]}>
        <sphereGeometry args={[0.11, 20, 20]} />
        <meshStandardMaterial color="#0f1830" emissive={new Color(accent)} emissiveIntensity={0.6} metalness={0.4} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.17, 0]}>
        <boxGeometry args={[0.06, 0.02, 0.9]} />
        <meshStandardMaterial color={accent} emissive={new Color(accent)} emissiveIntensity={0.4} />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 0.34, 0, -0.12]} rotation={[0, 0, s * 0.55]}>
          <boxGeometry args={[0.52, 0.04, 0.36]} />
          <meshStandardMaterial color="#1a2c50" metalness={0.6} roughness={0.4} />
        </mesh>
      ))}
      <mesh position={[0, 0.18, -0.34]} rotation={[0.4, 0, 0]}>
        <boxGeometry args={[0.03, 0.28, 0.3]} />
        <meshStandardMaterial color="#1a2c50" metalness={0.6} roughness={0.4} />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 0.1, 0, -0.52]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshBasicMaterial color={glow} toneMapped={false} />
        </mesh>
      ))}
    </group>
  )
}

function Satellite({ base, accent }: { base: string; accent: string }) {
  const ref = useRef<Group>(null)
  useFrame((_, d) => {
    if (ref.current) {
      ref.current.rotation.y += d * 0.3
      ref.current.rotation.x += d * 0.07
    }
  })
  return (
    <group ref={ref}>
      <mesh>
        <boxGeometry args={[0.5, 0.55, 0.7]} />
        <meshStandardMaterial color={base} metalness={0.7} roughness={0.35} />
      </mesh>
      <mesh position={[0, 0, 0.36]}>
        <boxGeometry args={[0.52, 0.57, 0.05]} />
        <meshStandardMaterial color="#caa04a" metalness={0.9} roughness={0.4} />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 1.05, 0, 0]}>
          <boxGeometry args={[1.1, 0.02, 0.62]} />
          <meshStandardMaterial color="#16305c" emissive={new Color(accent)} emissiveIntensity={0.35} metalness={0.4} roughness={0.5} />
        </mesh>
      ))}
    </group>
  )
}

type CraftItem = { kind: 'ship' | 'sat'; pos: [number, number, number]; rot: [number, number, number]; scale: number }

function Craft({ count, base, accent }: { count: number; base: string; accent: string }) {
  const items = useMemo<CraftItem[]>(
    () =>
      Array.from({ length: count }, (_, i) => ({
        kind: i % 3 === 0 ? 'sat' : 'ship',
        pos: [rand(-9, 9), rand(-6, 6), rand(-50, 4)],
        rot: [rand(0, TAU), rand(0, TAU), rand(0, TAU)],
        scale: rand(0.7, 1.2),
      })),
    [count],
  )
  return (
    <>
      {items.map((it, i) => (
        <group key={i} position={it.pos} rotation={it.rot} scale={it.scale}>
          {it.kind === 'ship' ? <Ship base={base} accent={accent} /> : <Satellite base={base} accent={accent} />}
        </group>
      ))}
    </>
  )
}

/* ---------------------------------------------------------------------- rig */

function Rig({ pointer }: { pointer: React.RefObject<{ x: number; y: number }> }) {
  const maxScroll = useRef(1)
  useEffect(() => {
    const measure = () => {
      maxScroll.current = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
    }
    measure()
    window.addEventListener('resize', measure, { passive: true })
    return () => window.removeEventListener('resize', measure)
  }, [])

  useFrame((state) => {
    const progress = MathUtils.clamp(window.scrollY / maxScroll.current, 0, 1)
    const cam = state.camera
    cam.position.z += (8 - progress * 66 - cam.position.z) * 0.08
    cam.position.x += (pointer.current.x * 1.6 - cam.position.x) * 0.04
    cam.position.y += (-pointer.current.y * 1.1 - cam.position.y) * 0.04
  })
  return null
}

/* ------------------------------------------------------------------- planets */

const PLANETS: PlanetDef[] = [
  { name: 'Mercury', pos: [4, -1, -3], radius: 0.34, color: '#9a8b7c', tilt: 0.02, spin: 0.2 },
  { name: 'Venus', pos: [-5, 1.6, -9], radius: 0.58, texture: 'venus', tilt: 0.05, spin: 0.15 },
  { name: 'Earth', pos: [5.4, -1, -15], radius: 0.72, texture: 'earth', tilt: 0.4, spin: 0.4, moon: true, atmosphere: '#7fb3ff' },
  { name: 'Mars', pos: [-5, 1.2, -21], radius: 0.5, color: '#c1440e', tilt: 0.44, spin: 0.38 },
  { name: 'Jupiter', pos: [6.6, 1.6, -31], radius: 1.6, texture: 'jupiter', tilt: 0.05, spin: 0.6 },
  { name: 'Saturn', pos: [-6.6, -1.2, -39], radius: 1.3, texture: 'saturn', tilt: 0.47, spin: 0.55, saturnRings: true },
  { name: 'Uranus', pos: [5.2, 1.2, -47], radius: 0.92, color: '#a8e0e6', tilt: 1.4, spin: 0.4, thinRing: '#bfe6ea', atmosphere: '#9fe6ee' },
  { name: 'Neptune', pos: [-5, -1, -55], radius: 0.9, color: '#3b57c9', tilt: 0.5, spin: 0.42, atmosphere: '#5a78ff' },
]

export default function ScrollScene({
  active,
  colors,
  dark,
  desktop,
}: {
  active: boolean
  colors: SceneColors
  dark: boolean
  desktop: boolean
}) {
  const pointer = usePointer()
  const sprite = useMemo(() => makeStarSprite(), [])
  const textures = useMemo(
    () => ({
      earth: makeEarth(),
      jupiter: makeBanded([
        [0, '#c9a06a'],
        [0.3, '#e6c79a'],
        [0.5, '#b07d4e'],
        [0.7, '#e6c79a'],
        [1, '#c9a06a'],
      ]),
      saturn: makeBanded([
        [0, '#d8c489'],
        [0.5, '#e8d9a8'],
        [1, '#cbb277'],
      ]),
      venus: makeBanded([
        [0, '#d9b877'],
        [0.5, '#efd9a0'],
        [1, '#d0a95f'],
      ]),
    }),
    [],
  )

  const stars = desktop ? 1600 : 750
  const craft = desktop ? 9 : 5
  const asteroids = desktop ? 160 : 80

  return (
    <Canvas
      frameloop={active ? 'always' : 'never'}
      dpr={[1, 1.6]}
      camera={{ position: [0, 0, 8], fov: 60 }}
      // Opaque canvas (alpha:false) + an explicit background colour. A transparent
      // canvas under an EffectComposer composites against the CSS layer behind it
      // and flickers frame-to-frame; the full nebula fills the frame anyway.
      gl={{ antialias: false, alpha: false, stencil: false, powerPreference: 'high-performance' }}
    >
      <color attach="background" args={[colors.fog]} />
      <fog attach="fog" args={[colors.fog, 18, 70]} />
      <ambientLight intensity={dark ? 0.16 : 0.5} />

      <Rig pointer={pointer} />
      <Nebula dark={dark} />

      <Starfield count={stars} sprite={sprite} size={0.14} opacity={dark ? 0.9 : 0.4} dark={dark} spin={0.005} phase={0} />
      <Starfield count={Math.round(stars / 3)} sprite={sprite} size={0.28} opacity={dark ? 1 : 0.5} dark={dark} spin={0.012} phase={2.1} />

      <Sun dark={dark} />
      {PLANETS.map((def) => (
        <Planet key={def.name} def={def} textures={textures} />
      ))}
      <Asteroids count={asteroids} />
      <Craft count={craft} base={colors.base} accent={colors.accent} />

      <Comet accent={colors.accent} speed={0.5} delay={1} />
      {desktop && <Comet accent="#a9c2ff" speed={0.4} delay={5} />}

      {/* multisampling 0: MSAA render targets + bloom flicker on some GPUs.
          SMAA gives smooth edges as a post pass instead. */}
      <EffectComposer multisampling={0}>
        <Bloom
          intensity={desktop ? 1.1 : 0.6}
          luminanceThreshold={0.65}
          luminanceSmoothing={0.3}
          mipmapBlur
          radius={0.7}
        />
        <Vignette offset={0.3} darkness={dark ? 0.55 : 0.3} eskil={false} />
        <SMAA />
      </EffectComposer>
    </Canvas>
  )
}
