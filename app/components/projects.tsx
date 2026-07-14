import { ArrowUpRight, GitFork, Star } from 'lucide-react'
import { Section } from '@/app/components/section'
import { Card, cardStyles } from '@/app/components/ui/card'
import { ButtonLink } from '@/app/components/ui/button'
import { StaggerItem } from '@/app/components/ui/stagger'
import { site, projectBlurbs } from '@/app/config'

type Repo = {
  id: number
  name: string
  html_url: string
  description: string | null
  language: string | null
  stargazers_count: number
  forks_count: number
  fork: boolean
  updated_at: string
}

type Result = { repos: Repo[]; failed: boolean }

const languageColor: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Go: '#00add8',
  Python: '#3572a5',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Java: '#b07219',
  C: '#555555',
  'C++': '#f34b7d',
  'C#': '#178600',
  PHP: '#4f5d95',
  Shell: '#89e051',
  Dart: '#00b4ab',
  Vue: '#41b883',
}

const DIVISIONS = [
  { amount: 60, unit: 'second' },
  { amount: 60, unit: 'minute' },
  { amount: 24, unit: 'hour' },
  { amount: 7, unit: 'day' },
  { amount: 4.34524, unit: 'week' },
  { amount: 12, unit: 'month' },
  { amount: Number.POSITIVE_INFINITY, unit: 'year' },
] as const

/** "2 months ago" — a real recency signal, unlike a repeated 0-star count. */
function relativeTime(iso: string) {
  const formatter = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })
  let duration = (Date.parse(iso) - Date.now()) / 1000

  for (const division of DIVISIONS) {
    if (Math.abs(duration) < division.amount) {
      return formatter.format(Math.round(duration), division.unit)
    }
    duration /= division.amount
  }
  return ''
}

async function getRepos(): Promise<Result> {
  const res = await fetch(
    `https://api.github.com/users/${site.github}/repos?sort=updated&per_page=100`,
    {
      next: { revalidate: 3600 },
      headers: { Accept: 'application/vnd.github+json' },
    },
  )

  // Unauthenticated GitHub allows 60 req/h per IP; on shared hosting that runs
  // out. Distinguish "we couldn't ask" from "there's nothing there".
  if (!res.ok) return { repos: [], failed: true }

  const repos: Repo[] = await res.json()
  return {
    repos: repos
      .filter((repo) => !repo.fork)
      .sort(
        (a, b) =>
          b.stargazers_count - a.stargazers_count ||
          Date.parse(b.updated_at) - Date.parse(a.updated_at),
      )
      .slice(0, 6),
    failed: false,
  }
}

/** Mirrors the real card grid so the swap-in causes no layout shift. */
export function ProjectsSkeleton() {
  return (
    <Section id="projects" title="Projects">
      <div className="grid gap-3 sm:grid-cols-2">
        {Array.from({ length: 6 }, (_, i) => (
          <Card key={i} className="animate-pulse p-5" style={{ animationDelay: `${i * 75}ms` }}>
            <div className="h-5 w-1/3 rounded bg-border" />
            <div className="mt-3 h-4 w-full rounded bg-border" />
            <div className="mt-2 h-4 w-2/3 rounded bg-border" />
            <div className="mt-6 h-3 w-1/2 rounded bg-border" />
          </Card>
        ))}
      </div>
    </Section>
  )
}

function EmptyState({ failed }: { failed: boolean }) {
  return (
    <div className="rounded-card border border-dashed border-border px-6 py-12 text-center">
      <p className="text-sm text-fg">
        {failed ? 'Couldn’t reach GitHub right now.' : 'No public repositories yet.'}
      </p>
      <p className="mx-auto mt-1 max-w-sm text-sm text-fg-muted">
        {failed
          ? 'The repository list will come back on its own — in the meantime you can browse it directly.'
          : 'Anything published will show up here automatically.'}
      </p>
      <ButtonLink
        href={`https://github.com/${site.github}`}
        variant="secondary"
        size="sm"
        external
        className="mt-4"
      >
        Open GitHub
        <ArrowUpRight size={14} />
      </ButtonLink>
    </div>
  )
}

function RepoCard({ repo }: { repo: Repo }) {
  // Curated copy wins; the GitHub description is the fallback. If neither exists
  // we render no paragraph at all rather than "No description provided." filler.
  const blurb = projectBlurbs[repo.name]?.trim() || repo.description?.trim() || null

  return (
    <a
      href={repo.html_url}
      target="_blank"
      rel="noopener noreferrer"
      className={cardStyles(true, 'flex h-full w-full flex-col justify-between p-5')}
    >
      <div>
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-medium text-fg">{repo.name}</h3>
          <ArrowUpRight
            size={16}
            aria-hidden
            className="shrink-0 text-fg-subtle transition duration-200 ease-out-soft group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-fg"
          />
        </div>
        {blurb && (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-fg-muted">{blurb}</p>
        )}
      </div>

      {/* Zero stars and zero forks are noise, not information — only show real numbers. */}
      <dl className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-fg-muted">
        {repo.language && (
          <div className="flex items-center gap-1.5">
            <dt className="sr-only">Language</dt>
            <span
              aria-hidden
              className="size-2 shrink-0 rounded-full"
              style={{ backgroundColor: languageColor[repo.language] ?? 'currentColor' }}
            />
            <dd>{repo.language}</dd>
          </div>
        )}
        {repo.stargazers_count > 0 && (
          <div className="flex items-center gap-1">
            <dt className="sr-only">Stars</dt>
            <Star size={12} aria-hidden />
            <dd>{repo.stargazers_count}</dd>
          </div>
        )}
        {repo.forks_count > 0 && (
          <div className="flex items-center gap-1">
            <dt className="sr-only">Forks</dt>
            <GitFork size={12} aria-hidden />
            <dd>{repo.forks_count}</dd>
          </div>
        )}
        <div className="ml-auto">
          <dt className="sr-only">Last updated</dt>
          <dd className="text-fg-subtle">Updated {relativeTime(repo.updated_at)}</dd>
        </div>
      </dl>
    </a>
  )
}

export async function Projects() {
  const { repos, failed } = await getRepos()

  return (
    <Section
      id="projects"
      title="Projects"
      action={
        <a
          href={`https://github.com/${site.github}?tab=repositories`}
          target="_blank"
          rel="noopener noreferrer"
          // -my-1 py-1 keeps the tap target >=24px tall without adding visual space.
          className="group -my-1 inline-flex items-center gap-1 rounded-control py-1 text-sm text-fg-muted transition-colors duration-200 hover:text-fg"
        >
          All repositories
          <ArrowUpRight
            size={14}
            aria-hidden
            className="transition-transform duration-200 ease-out-soft group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </a>
      }
    >
      {repos.length === 0 ? (
        <EmptyState failed={failed} />
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {repos.map((repo, i) => (
            <li key={repo.id} className="flex">
              <StaggerItem index={i} className="flex w-full">
                <RepoCard repo={repo} />
              </StaggerItem>
            </li>
          ))}
        </ul>
      )}
    </Section>
  )
}
