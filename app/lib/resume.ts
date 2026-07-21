import fs from 'node:fs'
import path from 'node:path'

/**
 * Server-only. Returns the resume URL when the PDF actually exists in public/,
 * otherwise null so the button is hidden rather than linking to a 404.
 *
 * TODO(you): drop your file at `public/resume.pdf` — the button then appears
 * on its own (a rebuild picks it up; `npm run dev` picks it up immediately).
 */
export function getResumeHref(): string | null {
  try {
    const file = path.join(process.cwd(), 'public', 'resume.pdf')
    return fs.existsSync(file) ? '/resume.pdf' : null
  } catch {
    return null
  }
}
