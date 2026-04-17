import Link from 'next/link'
import { Logo } from '@/components/common/logo'

export function LandingFooter() {
  return (
    <footer className="border-t border-white/8 px-5 py-8 md:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <Logo compact />
        <div className="flex items-center gap-5 text-sm text-white/45">
          <Link href="/app" className="transition hover:text-white">App</Link>
          <Link href="/library" className="transition hover:text-white">Library</Link>
          <Link href="/settings" className="transition hover:text-white">Settings</Link>
        </div>
        <p className="text-sm text-white/35">© 2026 KhoaLisa. Dark, clean, personal.</p>
      </div>
    </footer>
  )
}
