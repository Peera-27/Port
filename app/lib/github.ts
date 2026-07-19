import { site, projectBlurbs } from '@/app/config'

export type TermRepo = {
  name: string
  blurb: string | null
  language: string | null
  languageColor: string
  url: string
  stars: number
  forks: number
  updatedLabel: string
}

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

/** "2 months ago" — computed server-side so client hydration can't drift. */
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

export async function getRepos(): Promise<{ repos: TermRepo[]; failed: boolean }> {
  const res = await fetch(
    `https://api.github.com/users/${site.github}/repos?sort=updated&per_page=100`,
    { next: { revalidate: 3600 }, headers: { Accept: 'application/vnd.github+json' } },
  )

  // Unauthenticated GitHub allows 60 req/h per IP; distinguish "couldn't ask"
  // from "nothing there" so the terminal can print an honest message.
  if (!res.ok) return { repos: [], failed: true }

  const repos: Repo[] = await res.json()
  const mapped = repos
    .filter((repo) => !repo.fork)
    .sort(
      (a, b) =>
        b.stargazers_count - a.stargazers_count ||
        Date.parse(b.updated_at) - Date.parse(a.updated_at),
    )
    .slice(0, 6)
    .map<TermRepo>((repo) => ({
      name: repo.name,
      // Curated copy wins; GitHub's own description is the fallback.
      blurb: projectBlurbs[repo.name]?.trim() || repo.description?.trim() || null,
      language: repo.language,
      languageColor: (repo.language && languageColor[repo.language]) || '#8b8b8b',
      url: repo.html_url,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      updatedLabel: relativeTime(repo.updated_at),
    }))

  return { repos: mapped, failed: false }
}
