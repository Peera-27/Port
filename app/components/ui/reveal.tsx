'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Fades + lifts children in the first time they enter the viewport, then stops
 * observing. Fails open (see .reveal in globals.css) for no-JS / reduced motion.
 */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Reveal when it scrolls into view, OR when it's already been scrolled
        // past (top above the viewport) — so anchor-jumps and End never leave a
        // skipped section stuck invisible.
        if (!entry.isIntersecting && entry.boundingClientRect.top >= 0) return
        setVisible(true)
        observer.disconnect()
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      data-visible={visible}
      style={delay ? ({ '--reveal-delay': `${delay}ms` } as React.CSSProperties) : undefined}
      className={`reveal ${className ?? ''}`}
    >
      {children}
    </div>
  )
}
