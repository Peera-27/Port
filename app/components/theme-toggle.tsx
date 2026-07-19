'use client'

import { useSyncExternalStore } from 'react'
import { Moon, Sun } from 'lucide-react'
import { cn } from '@/app/components/ui/cn'

/** The <html> class is the theme's source of truth (set pre-paint by layout). */
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
  return () => observer.disconnect()
}

export function ThemeToggle() {
  const dark = useSyncExternalStore(
    subscribe,
    () => document.documentElement.classList.contains('dark'),
    () => true,
  )

  const toggle = () => {
    const next = !dark
    document.documentElement.classList.toggle('dark', next)
    try {
      localStorage.setItem('theme', next ? 'dark' : 'light')
    } catch {}
  }

  const icon = 'col-start-1 row-start-1 transition duration-200 ease-out-soft'
  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={dark}
      aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
      className="grid size-9 place-items-center rounded-control border border-border bg-surface/60 text-fg-muted backdrop-blur transition duration-200 ease-out-soft hover:text-fg active:scale-90"
    >
      <span className="grid size-4 place-items-center">
        <Sun size={16} aria-hidden className={cn(icon, dark ? 'scale-100 opacity-100' : '-rotate-90 scale-50 opacity-0')} />
        <Moon size={16} aria-hidden className={cn(icon, dark ? 'rotate-90 scale-50 opacity-0' : 'scale-100 opacity-100')} />
      </span>
    </button>
  )
}
