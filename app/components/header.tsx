import Link from 'next/link'
import { site } from '@/app/config'
import { ThemeToggle } from '@/app/components/theme-toggle'

const nav = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
]

export function Header() {
  return (
    <header className="no-print fixed inset-x-0 top-0 z-50">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-5 sm:px-8">
        <Link
          href="/"
          className="rounded-control bg-surface/50 px-2 py-1 font-mono text-sm font-medium tracking-tight text-fg backdrop-blur transition-opacity hover:opacity-70"
        >
          {site.nickname.toLowerCase()}
          <span className="text-accent">.</span>
        </Link>

        <nav className="flex items-center gap-1">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="hidden rounded-control px-3 py-2 text-sm text-fg-muted transition-colors hover:text-fg sm:block"
            >
              {item.label}
            </a>
          ))}
          <div className="ml-1">
            <ThemeToggle />
          </div>
        </nav>
      </div>
    </header>
  )
}
