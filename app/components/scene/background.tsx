'use client'

import dynamic from 'next/dynamic'
import { useEffect, useMemo, useState, useSyncExternalStore } from 'react'
import { useIsDark, useMediaQuery } from '@/app/components/ui/hooks'
import type { SceneColors } from '@/app/components/scene/scroll-scene'

// three.js loads in its own client chunk, never on the server, never blocking paint.
const ScrollScene = dynamic(() => import('@/app/components/scene/scroll-scene'), {
  ssr: false,
})

/** Reads the scene colours from CSS tokens so theme stays single-sourced. */
function sceneColors(dark: boolean): SceneColors {
  const s = getComputedStyle(document.documentElement)
  return {
    accent: s.getPropertyValue('--scene-accent').trim() || '#6f9bff',
    fog: s.getPropertyValue('--scene-fog').trim() || (dark ? '#05060f' : '#e6ecfa'),
    base: dark ? '#c9d2e8' : '#8794b5',
    star: dark ? '#dbe4ff' : '#6f7fa6',
  }
}

/** Deterministic PRNG so the static starfield matches between server and client. */
function mulberry32(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Static SVG stars — present always (base layer) and the whole show for
 *  reduced-motion visitors, who never load the WebGL scene. */
function StaticStars() {
  // Large viewBox → circles render sub-pixel-small (distant stars, not bokeh).
  const stars = useMemo(() => {
    const r = mulberry32(1337)
    return Array.from({ length: 170 }, () => ({
      cx: +(r() * 1000).toFixed(1),
      cy: +(r() * 1000).toFixed(1),
      rad: +(r() * 1 + 0.3).toFixed(2),
      o: +(r() * 0.5 + 0.12).toFixed(2),
    }))
  }, [])
  return (
    <svg
      className="absolute inset-0 size-full text-fg-subtle opacity-40 dark:opacity-70"
      preserveAspectRatio="xMidYMid slice"
      viewBox="0 0 1000 1000"
    >
      {stars.map((st, i) => (
        <circle key={i} cx={st.cx} cy={st.cy} r={st.rad} fill="currentColor" opacity={st.o} />
      ))}
    </svg>
  )
}

export function Background() {
  const dark = useIsDark()
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)', true)
  const desktop = useMediaQuery('(min-width: 640px)', false)

  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  )
  const colors = useMemo(() => (mounted ? sceneColors(dark) : null), [mounted, dark])

  const [pageVisible, setPageVisible] = useState(
    () => typeof document === 'undefined' || !document.hidden,
  )
  useEffect(() => {
    const onVisibility = () => setPageVisible(!document.hidden)
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [])

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Nebula glow — atmosphere before the canvas mounts and for reduced motion. */}
      <div
        className="absolute left-1/2 top-1/3 size-[85vmax] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40 blur-[130px]"
        style={{ background: 'radial-gradient(circle, var(--accent) 0%, transparent 62%)' }}
      />
      <StaticStars />

      {!reducedMotion && colors && (
        <div className="absolute inset-0">
          {/* `desktop` scales star / craft / asteroid counts to keep phones smooth. */}
          <ScrollScene active={pageVisible} colors={colors} dark={dark} desktop={desktop} />
        </div>
      )}
    </div>
  )
}
