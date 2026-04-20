import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/common/logo'

export function LandingHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/8 bg-[#07090d]/70 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
        <Logo />
        <nav className="hidden items-center gap-8 text-sm text-white/55 md:flex">
          <a href="#preview" className="transition hover:text-white">Preview</a>
          <a href="#features" className="transition hover:text-white">Features</a>
          <a href="#moods" className="transition hover:text-white">Mood picks</a>
        </nav>
        <Link href="/app">
          <Button className="rounded-full bg-white text-black hover:bg-white/90">Nghe ngay</Button>
        </Link>
      </div>
    </header>
  )
}
