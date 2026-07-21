import { ArrowUpRight, FileText, GitFork, Star } from 'lucide-react'
import { site } from '@/app/config'
import type { TermRepo } from '@/app/lib/github'
import { Reveal } from '@/app/components/ui/reveal'
import { Socials } from '@/app/components/socials'

/** Section shell: a glass panel so text stays readable over the moving 3D. */
function Panel({
  id,
  title,
  children,
  action,
}: {
  id: string
  title: string
  children: React.ReactNode
  action?: React.ReactNode
}) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className="scroll-mt-24">
      <Reveal className="panel rounded-card p-6 shadow-e2 backdrop-blur-xl sm:p-8">
        <div className="mb-6 flex items-baseline justify-between gap-4 border-b border-border pb-3">
          <h2
            id={`${id}-h`}
            className="font-mono text-xs font-medium uppercase tracking-widest text-fg-subtle"
          >
            {title}
          </h2>
          {action}
        </div>
        {children}
      </Reveal>
    </section>
  )
}

export function Hero({ resumeHref }: { resumeHref?: string | null }) {
  return (
    <section className="flex min-h-[88svh] flex-col justify-center">
      <Reveal className="space-y-6">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/50 px-3 py-1 text-xs text-fg-muted backdrop-blur">
          <span className="relative flex size-1.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-60" />
            <span className="relative inline-flex size-1.5 rounded-full bg-accent" />
          </span>
          {site.status}
        </span>

        <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
          {site.name}{' '}
          <span className="font-normal text-fg-subtle">({site.nickname})</span>
        </h1>
        <p className="max-w-lg text-lg leading-relaxed text-pretty text-fg-muted">
          {site.role} · {site.headline}
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <a
            href="#projects"
            className="inline-flex items-center gap-2 rounded-control bg-accent px-5 py-2.5 text-sm font-medium text-accent-fg shadow-e2 transition duration-200 ease-out-soft hover:-translate-y-0.5 active:translate-y-0"
          >
            View work
            <ArrowUpRight size={16} />
          </a>

          {/* Only rendered when public/resume.pdf actually exists — see lib/resume.ts */}
          {resumeHref && (
            <a
              href={resumeHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-control border border-border bg-surface/60 px-5 py-2.5 text-sm font-medium text-fg backdrop-blur transition duration-200 ease-out-soft hover:-translate-y-0.5 hover:border-accent/60 active:translate-y-0"
            >
              <FileText size={16} aria-hidden />
              Resume
            </a>
          )}

          <Socials />
        </div>
      </Reveal>

      <div className="animate-hint mt-16 flex items-center gap-2 text-xs text-fg-subtle">
        <span className="font-mono">scroll</span>
        <span aria-hidden>↓</span>
      </div>
    </section>
  )
}

export function About() {
  return (
    <Panel id="about" title="About">
      <div className="max-w-2xl space-y-4 leading-relaxed text-pretty text-fg-muted">
        {site.about.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
    </Panel>
  )
}

export function Skills() {
  return (
    <Panel id="skills" title="Skills">
      <div className="space-y-5">
        {site.skills.map((group) => (
          <div key={group.group} className="sm:flex sm:gap-6">
            <h3 className="mb-2 w-28 shrink-0 pt-1 text-sm capitalize text-fg-subtle sm:mb-0">
              {group.group}
            </h3>
            <div className="flex flex-wrap gap-2">
              {group.items.map((item) => (
                <span
                  key={item}
                  className="rounded-control border border-border bg-surface/60 px-2.5 py-1.5 text-xs font-medium text-fg-muted transition-colors hover:text-fg"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Panel>
  )
}

const languageColor: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Go: '#00add8',
  Dart: '#00b4ab',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Python: '#3572a5',
}

export function Projects({ repos, failed }: { repos: TermRepo[]; failed: boolean }) {
  return (
    <Panel
      id="projects"
      title="Projects"
      action={
        <a
          href={`https://github.com/${site.github}?tab=repositories`}
          target="_blank"
          rel="noopener noreferrer"
          className="group -my-1 inline-flex items-center gap-1 rounded-control py-1 text-sm text-fg-muted transition-colors hover:text-fg"
        >
          All repos
          <ArrowUpRight
            size={14}
            className="transition-transform duration-200 ease-out-soft group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </a>
      }
    >
      {repos.length === 0 ? (
        <p className="text-sm text-fg-muted">
          {failed ? 'Couldn’t reach GitHub right now — ' : 'No public repositories yet — '}
          <a
            href={`https://github.com/${site.github}`}
            className="text-accent underline underline-offset-4"
          >
            browse on GitHub
          </a>
          .
        </p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {repos.map((repo) => (
            <li key={repo.url} className="flex">
              <a
                href={repo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex w-full flex-col justify-between rounded-card border border-border bg-surface/50 p-5 transition duration-200 ease-out-soft hover:-translate-y-0.5 hover:border-accent/50"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-medium text-fg">{repo.name}</h3>
                    <ArrowUpRight
                      size={16}
                      aria-hidden
                      className="shrink-0 text-fg-subtle transition-transform duration-200 ease-out-soft group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
                    />
                  </div>
                  {repo.blurb && (
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-fg-muted">
                      {repo.blurb}
                    </p>
                  )}
                </div>
                <dl className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-fg-muted">
                  {repo.language && (
                    <div className="flex items-center gap-1.5">
                      <dt className="sr-only">Language</dt>
                      <span
                        aria-hidden
                        className="size-2 rounded-full"
                        style={{ backgroundColor: languageColor[repo.language] ?? repo.languageColor }}
                      />
                      <dd>{repo.language}</dd>
                    </div>
                  )}
                  {repo.stars > 0 && (
                    <div className="flex items-center gap-1">
                      <dt className="sr-only">Stars</dt>
                      <Star size={12} aria-hidden />
                      <dd>{repo.stars}</dd>
                    </div>
                  )}
                  {repo.forks > 0 && (
                    <div className="flex items-center gap-1">
                      <dt className="sr-only">Forks</dt>
                      <GitFork size={12} aria-hidden />
                      <dd>{repo.forks}</dd>
                    </div>
                  )}
                  <div className="ml-auto text-fg-subtle">Updated {repo.updatedLabel}</div>
                </dl>
              </a>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  )
}
