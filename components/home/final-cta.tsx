import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function FinalCTA() {
  return (
    <section className="px-5 py-14 md:px-8 md:py-20">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-[36px] border border-white/8 bg-[radial-gradient(circle_at_top,rgba(110,101,255,0.26),transparent_38%),linear-gradient(180deg,rgba(19,24,34,0.96),rgba(9,11,15,0.96))] px-6 py-10 text-center shadow-[0_30px_100px_rgba(0,0,0,0.34)] md:px-10">
        <p className="text-[0.72rem] uppercase tracking-[0.3em] text-cyan-200/75">Start the session</p>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white md:text-5xl">Vao app va nghe ngay khi mood vua den.</h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/58 md:text-base">
          KhoaLisa giu homepage ngan gon, de toan bo su chu y duoc danh cho trai nghiem nghe nhac that su ben trong.
        </p>
        <div className="mt-8 flex justify-center">
          <Link href="/app">
            <Button size="lg" className="h-12 rounded-full bg-white px-7 text-black hover:bg-white/90">
              Mo KhoaLisa
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
