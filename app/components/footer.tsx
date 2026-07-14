import { site } from '@/app/config'

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border">
      <div className="mx-auto flex max-w-3xl flex-col gap-2 px-6 py-8 text-xs text-fg-subtle sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} {site.name}
        </p>
        <p className="font-mono">Built with Next.js &amp; Tailwind CSS</p>
      </div>
    </footer>
  )
}
