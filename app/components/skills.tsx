import Image from 'next/image'
import { SiTypescript, SiGo, SiPostman, SiGit } from 'react-icons/si'
import { Section } from '@/app/components/section'
import { Badge } from '@/app/components/ui/badge'
import { StaggerItem } from '@/app/components/ui/stagger'

type Skill = { name: string; icon: React.ReactNode }

/**
 * Logos are vendored under /public rather than hot-linked from svgl.app: no
 * third-party request on every page view, and next/image reserves the box so
 * nothing shifts as they decode.
 */
function Logo({ file, alt, invert }: { file: string; alt: string; invert?: boolean }) {
  return (
    <Image
      src={`/assets/logos/${file}.svg`}
      alt=""
      aria-hidden
      title={alt}
      width={14}
      height={14}
      className={invert ? 'size-3.5 dark:invert' : 'size-3.5'}
    />
  )
}

const groups: { label: string; items: Skill[] }[] = [
  {
    label: 'Languages',
    items: [
      { name: 'TypeScript', icon: <SiTypescript className="size-3.5 text-[#3178c6]" /> },
      { name: 'JavaScript', icon: <Logo file="javascript" alt="JavaScript" /> },
      { name: 'Go', icon: <SiGo className="size-3.5 text-[#00add8]" /> },
    ],
  },
  {
    label: 'Frontend',
    items: [
      { name: 'Next.js', icon: <Logo file="nextjs_icon_dark" alt="Next.js" invert /> },
      { name: 'Tailwind CSS', icon: <Logo file="tailwindcss" alt="Tailwind CSS" /> },
    ],
  },
  {
    label: 'Backend & Data',
    items: [
      { name: 'Bun', icon: <Logo file="bun" alt="Bun" /> },
      { name: 'MySQL', icon: <Logo file="mysql-icon-light" alt="MySQL" /> },
      { name: 'MongoDB', icon: <Logo file="mongodb-icon-dark" alt="MongoDB" /> },
      { name: 'Supabase', icon: <Logo file="supabase" alt="Supabase" /> },
    ],
  },
  {
    label: 'Tools',
    items: [
      { name: 'Git', icon: <SiGit className="size-3.5 text-[#f05033]" /> },
      { name: 'Postman', icon: <SiPostman className="size-3.5 text-[#ff6c37]" /> },
      { name: 'Figma', icon: <Logo file="figma" alt="Figma" /> },
      { name: 'Gemini', icon: <Logo file="gemini" alt="Gemini" /> },
    ],
  },
]

export function Skills() {
  // Continuous index across groups so the stagger reads as one wave, not four.
  let cursor = 0

  return (
    <Section id="skills" title="Skills">
      <dl className="space-y-6">
        {groups.map((group) => (
          <div key={group.label} className="sm:flex sm:gap-6">
            <dt className="mb-3 shrink-0 pt-1.5 text-sm text-fg-subtle sm:mb-0 sm:w-36">
              {group.label}
            </dt>
            <dd className="flex flex-wrap gap-2">
              {group.items.map((skill) => (
                <StaggerItem key={skill.name} index={cursor++}>
                  <Badge>
                    <span className="transition-transform duration-200 ease-out-soft group-hover/chip:scale-110">
                      {skill.icon}
                    </span>
                    {skill.name}
                  </Badge>
                </StaggerItem>
              ))}
            </dd>
          </div>
        ))}
      </dl>
    </Section>
  )
}
