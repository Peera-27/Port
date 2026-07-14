'use client'

import { useSyncExternalStore } from 'react'
import { Moon, Sun } from 'lucide-react'
import { Button } from '@/app/components/ui/button'
import { cn } from '@/app/components/ui/cn'

/**
 * The <html> class is the source of truth — it's set by the inline script in the
 * layout before first paint, so we subscribe to it rather than mirroring it in state.
 */
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange)
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class'],
  })
  return () => observer.disconnect()
}

export function ThemeToggle() {
  const dark = useSyncExternalStore(
    subscribe,
    () => document.documentElement.classList.contains('dark'),
    () => false, // server render: assume light, corrected on hydration
  )

  function toggle() {
    const next = !dark
    document.documentElement.classList.toggle('dark', next)
    localStorage.setItem('theme', next ? 'dark' : 'light')
  }

  const icon = 'col-start-1 row-start-1 transition duration-200 ease-out-soft'

  return (
    <Button
      size="icon"
      variant="secondary"
      onClick={toggle}
      aria-pressed={dark}
      aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
      className="text-fg-muted hover:text-fg"
    >
      {/* Both icons stay mounted and cross-fade, so the swap reads as one motion. */}
      <span className="grid size-4 place-items-center">
        <Sun
          size={16}
          aria-hidden
          className={cn(icon, dark ? 'scale-100 opacity-100' : '-rotate-90 scale-50 opacity-0')}
        />
        <Moon
          size={16}
          aria-hidden
          className={cn(icon, dark ? 'rotate-90 scale-50 opacity-0' : 'scale-100 opacity-100')}
        />
      </span>
    </Button>
  )
}
