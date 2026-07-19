'use client'

import { useSyncExternalStore } from 'react'

/** Live media-query subscription. `serverValue` is what SSR/hydration assumes. */
export function useMediaQuery(query: string, serverValue: boolean) {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia(query)
      mq.addEventListener('change', cb)
      return () => mq.removeEventListener('change', cb)
    },
    () => window.matchMedia(query).matches,
    () => serverValue,
  )
}

/**
 * Reactively tracks the .dark class the theme toggle writes to <html> — that
 * class is the theme's source of truth, so we observe it rather than duplicate it.
 */
export function useIsDark() {
  return useSyncExternalStore(
    (cb) => {
      const observer = new MutationObserver(cb)
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class'],
      })
      return () => observer.disconnect()
    },
    () => document.documentElement.classList.contains('dark'),
    () => true, // server assumes dark: it is the default theme
  )
}
