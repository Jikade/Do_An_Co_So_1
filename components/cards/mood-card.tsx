import { cn } from '@/lib/tienIch'
import type { MoodCardItem } from '@/lib/khoaLisa-data'

export function MoodCard({ item }: { item: MoodCardItem }) {
  const Icon = item.icon

  return (
    <article className="relative overflow-hidden rounded-[28px] border border-white/8 bg-[#10141d] p-5 transition duration-300 hover:-translate-y-1 hover:border-white/15">
      <div className={cn('absolute inset-0 bg-gradient-to-br opacity-90', item.accent)} />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.14),transparent_32%)]" />
      <div className="relative">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/12 bg-black/20 text-white/85 backdrop-blur">
          <Icon className="h-5 w-5" />
        </div>
        <h3 className="mt-12 text-lg font-medium text-white">{item.title}</h3>
        <p className="mt-2 max-w-[18rem] text-sm leading-6 text-white/60">{item.subtitle}</p>
      </div>
    </article>
  )
}
