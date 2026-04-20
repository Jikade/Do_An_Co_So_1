import Link from 'next/link'
import { ArrowRight, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { landingSpotlights } from '@/lib/khoaLisa-data'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden px-5 pb-14 pt-20 md:px-8 md:pb-24 md:pt-28">
      <div className="absolute inset-x-0 top-[-10rem] h-[24rem] bg-[radial-gradient(circle_at_top,rgba(126,87,255,0.22),transparent_42%)]" />
      <div className="absolute right-0 top-24 h-72 w-72 rounded-full bg-cyan-400/10 blur-[120px]" />
      <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div>
          <p className="mb-5 text-[0.72rem] uppercase tracking-[0.34em] text-cyan-200/75">Premium mood streaming</p>
          <h1 className="max-w-4xl text-5xl font-semibold leading-[1.02] tracking-tight text-white md:text-7xl">
            KhoaLisa
            <span className="block bg-gradient-to-r from-white via-cyan-100 to-violet-200 bg-clip-text text-transparent">
              nghe nhac nhu mot canh phim.
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-white/62 md:text-lg">
            Landing page chi noi dieu can noi: mot khong gian am nhac toi, sang, ca nhan hoa, va du cuon de bam play ngay.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link href="/app">
              <Button size="lg" className="h-12 rounded-full bg-white px-7 text-black hover:bg-white/90">
                <Play className="mr-2 h-4 w-4 fill-current" />
                Nghe ngay
              </Button>
            </Link>
            <a href="#preview">
              <Button size="lg" variant="outline" className="h-12 rounded-full border-white/14 bg-white/[0.03] px-7 text-white hover:bg-white/[0.08]">
                Kham pha
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </a>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
          {landingSpotlights.map((item) => (
            <article key={item.title} className="rounded-[30px] border border-white/8 bg-white/[0.045] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl">
              <p className="text-xs uppercase tracking-[0.24em] text-white/35">{item.title}</p>
              <div className="mt-4 flex items-end justify-between gap-4">
                <div>
                  <p className="text-3xl font-semibold text-white">{item.value}</p>
                  <p className="mt-1 text-sm text-white/50">{item.subtitle}</p>
                </div>
                <div className="h-16 w-16 rounded-full bg-[radial-gradient(circle,rgba(111,240,255,0.45),rgba(111,240,255,0))]" />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
