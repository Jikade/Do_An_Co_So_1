import type { Metadata, Viewport } from 'next'
<<<<<<< HEAD
=======
import { Inter, Geist_Mono } from 'next/font/google'
>>>>>>> 8587083219adb682e5b3c9d1293f3780e0522532
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/lib/nguCanhGiaoDien'
import './globals.css'

<<<<<<< HEAD
export const metadata: Metadata = {
  title: 'KhoaLisa - Premium mood music',
  description: 'KhoaLisa la web nhac toi gian, cao cap, tach ro landing page va app nghe nhac de trai nghiem gon, sang va hien dai hon.',
  generator: 'v0.app',
  keywords: ['KhoaLisa', 'premium music app', 'mood music', 'dark music ui', 'personalized playlists'],
  authors: [{ name: 'KhoaLisa' }],
  icons: {
    icon: '/img/logo/logo.jpg?v=2',
    apple: '/img/logo/logo.jpg?v=2',
    shortcut: '/img/logo/logo.jpg?v=2',
=======
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
>>>>>>> 8587083219adb682e5b3c9d1293f3780e0522532
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
<<<<<<< HEAD
      <body className="font-sans antialiased">
        <ThemeProvider>{children}</ThemeProvider>
=======
      <body className={`${inter.variable} ${geistMono.variable} font-sans antialiased`}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
>>>>>>> 8587083219adb682e5b3c9d1293f3780e0522532
        <Analytics />
      </body>
    </html>
  )
}
