import '@/app/globals.css'
import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Header } from '@/app/components/header'
import { site } from '@/app/config'

const title = `${site.name} — ${site.role}`

export const metadata: Metadata = {
  // TODO(you): point this at the real domain once deployed.
  metadataBase: new URL('https://example.com'),
  title,
  description: site.headline,
  openGraph: { title, description: site.headline, type: 'profile' },
  twitter: { card: 'summary', title, description: site.headline },
}

// Applies the stored theme before first paint so the page never flashes.
// Dark is the default; an explicit light choice from the toggle persists.
const themeScript = `
try {
  var dark = localStorage.getItem('theme') !== 'light';
  if (dark) document.documentElement.classList.add('dark');
} catch (e) { document.documentElement.classList.add('dark'); }
`

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${GeistSans.variable} ${GeistMono.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-100 focus:rounded-control focus:border focus:border-border focus:bg-surface focus:px-4 focus:py-2 focus:text-sm focus:text-fg"
        >
          Skip to content
        </a>
        <Header />
        {children}
      </body>
    </html>
  )
}
