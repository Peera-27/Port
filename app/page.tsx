import { getRepos } from '@/app/lib/github'
import { Background } from '@/app/components/scene/background'
import { Hero, About, Skills, Projects } from '@/app/components/sections'
import { site } from '@/app/config'

export default async function Page() {
  const { repos, failed } = await getRepos()

  return (
    <>
      {/* Fixed WebGL corridor behind everything; content scrolls over it. */}
      <Background />

      <main id="main" className="relative mx-auto max-w-3xl space-y-24 px-5 pb-24 sm:px-8">
        <Hero />
        <About />
        <Skills />
        <Projects repos={repos} failed={failed} />
      </main>

      <footer className="no-print relative mx-auto max-w-3xl px-5 pb-12 sm:px-8">
        <div className="flex flex-col gap-1 border-t border-border pt-6 text-xs text-fg-subtle sm:flex-row sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}
          </p>
          <p className="font-mono">Built with Next.js · Three.js · Tailwind</p>
        </div>
      </footer>
    </>
  )
}
