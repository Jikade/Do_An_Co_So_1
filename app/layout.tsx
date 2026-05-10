import type { Metadata, Viewport } from 'next'
import { Analytics } from '@vercel/analytics/next'

import { ThemeProvider } from '@/lib/nguCanhGiaoDien'
import { AuthProvider } from '@/lib/nguCanhXacThuc'
import './globals.css'

export const metadata: Metadata = {
  title: 'KhoaLisa - Premium mood music',
  description:
    'KhoaLisa la web nhac toi gian, cao cap, tach ro landing page va app nghe nhac de trai nghiem gon, sang va hien dai hon.',
  generator: 'v0.app',
  keywords: [
    'KhoaLisa',
    'premium music app',
    'mood music',
    'dark music ui',
    'personalized playlists',
  ],
  authors: [{ name: 'KhoaLisa' }],
  icons: {
    icon: '/img/logo/logo.jpg?v=2',
    apple: '/img/logo/logo.jpg?v=2',
    shortcut: '/img/logo/logo.jpg?v=2',
  },
}

export const viewport: Viewport = {
  themeColor: '#0a0a0f',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
