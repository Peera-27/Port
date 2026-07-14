import { Github, Instagram, Facebook, type LucideIcon } from 'lucide-react'
import { BsDiscord } from 'react-icons/bs'
import type { IconType } from 'react-icons'

export const site = {
  name: 'Peeraphat Chompoosi',
  nickname: 'Pee',
  role: 'Full-stack Developer',
  headline: 'Computer Science student, Faculty of Information Technology.',
  status: 'Open to internships',

  /**
   * Shown as the primary call to action in the hero. Leave empty to hide the
   * button entirely — a dead mailto: is worse than no button.
   */
  email: '',

  about: [
    "I'm a full-stack developer in the making. I like building things end to end — from the database schema up to the last pixel — and I care about the parts users never see as much as the ones they do.",
    "Right now I work mostly with TypeScript, React and Next.js on the front, Go and Node on the back. I'm always looking for the next thing to break and rebuild properly.",
  ],

  github: 'Peera-27',

  socials: [
    { label: 'GitHub', href: 'https://github.com/Peera-27', icon: Github },
    { label: 'Instagram', href: 'https://www.instagram.com/_peezx/', icon: Instagram },
    {
      label: 'Facebook',
      href: 'https://www.facebook.com/peerphat.chompoosi.5/',
      icon: Facebook,
    },
    {
      label: 'Discord',
      href: 'https://discord.com/users/857976414183227492',
      icon: BsDiscord,
    },
  ] satisfies { label: string; href: string; icon: LucideIcon | IconType }[],
}

/**
 * Hand-written copy for your repos, keyed by repo name. GitHub has no
 * description on any of them, so this is the only place a visitor learns what a
 * project actually does — stars, language and dates are pulled live from the API.
 *
 * TODO(you): fill in a one-liner for each. Anything left blank simply renders
 * without a description rather than showing filler text.
 */
export const projectBlurbs: Record<string, string> = {
  TinnerApp: '',
  'Meow-Chat': '',
  chef_kub: '',
  'gunpla-station': '',
  GE: '',
  Port: '',
}

export const nav = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
]
