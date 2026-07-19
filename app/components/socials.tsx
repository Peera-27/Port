import { Github, Instagram, Facebook, type LucideIcon } from 'lucide-react'
import { site } from '@/app/config'

function Discord({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.3 4.4A19 19 0 0 0 15.6 3l-.3.5a14 14 0 0 1 4 2 15 15 0 0 0-13 0 14 14 0 0 1 4-2L10 3a19 19 0 0 0-4.7 1.4A19.7 19.7 0 0 0 2 17.6 19 19 0 0 0 7.6 20l.7-1a12 12 0 0 1-1.9-.9l.5-.4a10.7 10.7 0 0 0 10.2 0l.5.4c-.6.4-1.2.7-1.9.9l.7 1A19 19 0 0 0 22 17.6a19.7 19.7 0 0 0-1.7-13.2ZM9.3 15.1c-.9 0-1.7-.8-1.7-1.9s.8-1.9 1.7-1.9 1.7.9 1.7 1.9-.7 1.9-1.7 1.9Zm5.4 0c-.9 0-1.7-.8-1.7-1.9s.8-1.9 1.7-1.9 1.7.9 1.7 1.9-.7 1.9-1.7 1.9Z" />
    </svg>
  )
}

const icons: Record<string, LucideIcon | typeof Discord> = {
  github: Github,
  instagram: Instagram,
  facebook: Facebook,
  discord: Discord,
}

export function Socials() {
  return (
    <div className="flex items-center gap-2">
      {site.socials.map(({ label, href }) => {
        const Icon = icons[label] ?? Github
        return (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="grid size-9 place-items-center rounded-control border border-border bg-surface/50 text-fg-muted backdrop-blur transition duration-200 ease-out-soft hover:-translate-y-0.5 hover:text-fg active:translate-y-0"
          >
            <Icon size={16} />
          </a>
        )
      })}
    </div>
  )
}
