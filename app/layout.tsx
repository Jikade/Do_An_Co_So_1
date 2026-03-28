import type { Metadata, Viewport } from 'next'
import { Inter, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/lib/nguCanhGiaoDien'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin', 'vietnamese'],
  variable: '--font-inter',
})

const geistMono = Geist_Mono({ 
  subsets: ['latin'],
  variable: '--font-geist-mono',
})

export const metadata: Metadata = {
  title: 'MoodSync AI - Âm nhạc theo cảm xúc của bạn',
  description: 'AI phát hiện cảm xúc từ khuôn mặt, giọng nói và văn bản để đề xuất âm nhạc hoàn hảo cho bạn. Music that feels you.',
  generator: 'v0.app',
  keywords: ['AI music', 'emotion detection', 'mood music', 'personalized playlists', 'MoodSync'],
  authors: [{ name: 'MoodSync AI' }],
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
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
    <html lang="vi" className="dark">
      <body className={`${inter.variable} ${geistMono.variable} font-sans antialiased`}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
