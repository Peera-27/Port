import '@/app/globals.css'
import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Header } from '@/app/components/header'
import { Footer } from '@/app/components/footer'
import { site } from '@/app/config'

const title = `${site.name} — ${site.role}`

export const metadata: Metadata = {
  // TODO(you): point this at the real domain once deployed so OG/canonical URLs resolve.
  metadataBase: new URL('https://example.com'),
  title,
  description: site.headline,
  openGraph: {
    title,
    description: site.headline,
    type: 'profile',
    images: ['/assets/profile.jpg'],
  },
  twitter: { card: 'summary', title, description: site.headline },
}

// Applies the stored/system theme before first paint so the page never flashes.
const themeScript = `
try {
  var stored = localStorage.getItem('theme');
  var dark = stored ? stored === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
  if (dark) document.documentElement.classList.add('dark');
} catch (e) {}
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
      <body className="flex min-h-screen flex-col font-sans">
        {/* First tab stop: lets keyboard users jump the nav straight to content. */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-100 focus:rounded-control focus:border focus:border-border focus:bg-surface focus:px-4 focus:py-2 focus:text-sm focus:text-fg focus:shadow-e2"
        >
          Skip to content
        </a>
        <Header />
        <main id="main" tabIndex={-1} className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
