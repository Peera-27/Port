import Image from 'next/image'
import { Mail, Github } from 'lucide-react'
import { site } from '@/app/config'
import { Badge, StatusDot } from '@/app/components/ui/badge'
import { ButtonLink } from '@/app/components/ui/button'

export function Hero() {
  // Without an email the primary CTA *is* the GitHub button, so drop the GitHub
  // icon from the social row rather than pointing twice at the same place.
  const socials = site.email
    ? site.socials
    : site.socials.filter((social) => social.label !== 'GitHub')

  return (
    <section className="flex flex-col-reverse items-start gap-8 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex-1 space-y-6">
        <div className="space-y-4">
          <Badge shape="pill">
            <StatusDot />
            {site.status}
          </Badge>

          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
              {site.name}{' '}
              <span className="font-normal text-fg-subtle">({site.nickname})</span>
            </h1>
            <p className="max-w-md leading-relaxed text-pretty text-fg-muted">
              {site.headline}
            </p>
          </div>
        </div>

        {/* Primary action first, then the lower-commitment ways to reach out. */}
        <div className="flex flex-wrap items-center gap-2">
          {site.email ? (
            <ButtonLink href={`mailto:${site.email}`} variant="primary" size="md">
              <Mail size={16} />
              Get in touch
            </ButtonLink>
          ) : (
            <ButtonLink
              href={`https://github.com/${site.github}`}
              variant="primary"
              size="md"
              external
            >
              <Github size={16} />
              View GitHub
            </ButtonLink>
          )}

          <div className="flex items-center gap-2">
            {socials.map(({ label, href, icon: Icon }) => (
              <ButtonLink
                key={label}
                href={href}
                size="icon"
                variant="secondary"
                aria-label={label}
                external
                className="text-fg-muted hover:text-fg"
              >
                <Icon size={16} />
              </ButtonLink>
            ))}
          </div>
        </div>
      </div>

      <div className="shrink-0 overflow-hidden rounded-media border border-border shadow-e1">
        <Image
          src="/assets/profile.jpg"
          alt={site.name}
          width={112}
          height={112}
          priority
          className="size-24 object-cover transition-transform duration-200 ease-out-soft hover:scale-105 sm:size-28"
        />
      </div>
    </section>
  )
}
