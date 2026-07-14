'use client'

import Link from 'next/link'
import { useEffect, useState, useSyncExternalStore } from 'react'
import { nav, site } from '@/app/config'
import { ThemeToggle } from '@/app/components/theme-toggle'
import { cn } from '@/app/components/ui/cn'

/** True once the page has scrolled off the top — drives the header's elevation. */
function subscribeScroll(onChange: () => void) {
  window.addEventListener('scroll', onChange, { passive: true })
  return () => window.removeEventListener('scroll', onChange)
}

function useScrolled() {
  return useSyncExternalStore(
    subscribeScroll,
    () => window.scrollY > 8,
    () => false,
  )
}

/**
 * Tracks which section the reader is on.
 *
 * Deliberately measured from scroll position rather than an IntersectionObserver
 * band: a percentage band picks the wrong section on very tall viewports (it can
 * mark a section active while the page is still scrolled to the top). "The last
 * heading that has passed under the header" is true at every viewport size.
 */
function useActiveSection() {
  const [active, setActive] = useState('')

  useEffect(() => {
    const sections = nav
      .map((item) => document.querySelector<HTMLElement>(item.href))
      .filter((el): el is HTMLElement => el !== null)

    if (sections.length === 0) return

    let frame = 0
    const measure = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        // Sits below the sticky header + scroll-padding landing spot, with slack so
        // sub-pixel scroll rounding can't leave a section one pixel short of active.
        const headerLine = 128
        let current = ''

        for (const section of sections) {
          if (section.getBoundingClientRect().top <= headerLine) {
            current = `#${section.id}`
          }
        }

        // At the very bottom the last section may never cross the line; it still wins.
        const atBottom =
          window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2
        if (atBottom) current = `#${sections[sections.length - 1].id}`

        setActive(current)
      })
    }

    measure()
    window.addEventListener('scroll', measure, { passive: true })
    window.addEventListener('resize', measure, { passive: true })

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', measure)
      window.removeEventListener('resize', measure)
    }
  }, [])

  return active
}

export function Header() {
  const scrolled = useScrolled()
  const active = useActiveSection()

  return (
    <header
      className={cn(
        'no-print sticky top-0 z-50 border-b bg-bg/80 backdrop-blur-md transition-colors duration-200 ease-out-soft',
        scrolled ? 'border-border' : 'border-transparent',
      )}
    >
      <div className="mx-auto flex h-16 max-w-3xl items-center justify-between gap-2 px-6">
        <Link
          href="/"
          // py-2 is load-bearing: it lifts the tap target to 36px (WCAG 2.5.8 wants >=24).
          className="group shrink-0 rounded-control py-2 pr-1 font-mono text-sm font-medium tracking-tight text-fg transition-opacity duration-200 hover:opacity-70"
        >
          {site.nickname.toLowerCase()}
          <span className="inline-block text-accent transition-transform duration-200 ease-out-soft group-hover:translate-x-0.5">
            .
          </span>
        </Link>

        {/* Three short links fit on a phone, so they stay visible instead of
            hiding behind a hamburger — one less tap to reach any section. */}
        <nav aria-label="Sections" className="flex items-center gap-0.5 sm:gap-1">
          {nav.map((item) => {
            const isActive = active === item.href
            return (
              <a
                key={item.href}
                href={item.href}
                aria-current={isActive ? 'true' : undefined}
                className={cn(
                  'group relative rounded-control px-2 py-2 text-xs transition duration-200 ease-out-soft active:scale-[0.97] sm:px-3 sm:text-sm',
                  isActive ? 'text-fg' : 'text-fg-muted hover:text-fg',
                )}
              >
                {item.label}
                <span
                  className={cn(
                    'absolute inset-x-2 bottom-1 h-px origin-left bg-fg transition-transform duration-200 ease-out-soft sm:inset-x-3',
                    isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100',
                  )}
                />
              </a>
            )
          })}
          <div className="ml-1 sm:ml-2">
            <ThemeToggle />
          </div>
        </nav>
      </div>
    </header>
  )
}
