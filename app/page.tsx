import { Suspense } from 'react'
import { Hero } from '@/app/components/hero'
import { Reveal } from '@/app/components/reveal'
import { Section } from '@/app/components/section'
import { Skills } from '@/app/components/skills'
import { Projects, ProjectsSkeleton } from '@/app/components/projects'
import { StaggerItem } from '@/app/components/ui/stagger'
import { site } from '@/app/config'

export default function Page() {
  return (
    // One vertical rhythm for the whole page: 4rem between sections on mobile,
    // 6rem from `sm` up. No per-section margin overrides anywhere.
    <div className="mx-auto max-w-3xl space-y-16 px-6 py-16 sm:space-y-24 sm:py-24">
      {/* Above the fold: animate on load rather than on scroll, so it never waits for JS. */}
      <div className="animate-rise">
        <Hero />
      </div>

      <Reveal>
        <Section id="about" title="About">
          <div className="max-w-2xl space-y-4 leading-relaxed text-pretty text-fg-muted">
            {site.about.map((paragraph, i) => (
              <StaggerItem key={paragraph} index={i}>
                <p>{paragraph}</p>
              </StaggerItem>
            ))}
          </div>
        </Section>
      </Reveal>

      <Reveal>
        <Skills />
      </Reveal>

      <Reveal>
        <Suspense fallback={<ProjectsSkeleton />}>
          <Projects />
        </Suspense>
      </Reveal>
    </div>
  )
}
