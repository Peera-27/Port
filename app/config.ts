export const site = {
  name: 'Peeraphat Chompoosi',
  nickname: 'Pee',
  role: 'Full-stack Developer',
  headline: 'Computer Science student, Faculty of Information Technology.',
  status: 'Open to internships',
  location: 'Bangkok, TH',
  uni: 'CS · Year 3 — Faculty of IT',

  /** Shown by the `contact` command. Leave empty to omit the email line. */
  email: '',

  about: [
    "I'm a full-stack developer in the making. I like building things end to end — from the database schema up to the last pixel — and I care about the parts users never see as much as the ones they do.",
    "Right now I work mostly with TypeScript, React and Next.js on the front, Go and Node on the back. I'm always looking for the next thing to break and rebuild properly.",
  ],

  github: 'Peera-27',

  socials: [
    { label: 'github', href: 'https://github.com/Peera-27' },
    { label: 'instagram', href: 'https://www.instagram.com/_peezx/' },
    { label: 'facebook', href: 'https://www.facebook.com/peerphat.chompoosi.5/' },
    { label: 'discord', href: 'https://discord.com/users/857976414183227492' },
  ],

  skills: [
    { group: 'languages', items: ['TypeScript', 'JavaScript', 'Go'] },
    { group: 'frontend', items: ['Next.js', 'React', 'Tailwind CSS'] },
    { group: 'backend', items: ['Node.js', 'Bun'] },
    { group: 'data', items: ['MySQL', 'MongoDB', 'Supabase'] },
    { group: 'tools', items: ['Git', 'Postman', 'Figma', 'Gemini'] },
  ],
}

/**
 * Hand-written one-liner per repo, keyed by repo name. Used as the description
 * in `ls projects` when GitHub itself has none. Blank = no description printed.
 *
 * TODO(you): fill these in — it's the only place a visitor learns what each does.
 */
export const projectBlurbs: Record<string, string> = {
  TinnerApp: '',
  'Meow-Chat': '',
  chef_kub: '',
  'gunpla-station': '',
  GE: '',
  Port: '',
}
