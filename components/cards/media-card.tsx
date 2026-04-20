import Image from 'next/image'
import { Play } from 'lucide-react'
import { cn } from '@/lib/tienIch'
import { formatDuration, type Song } from '@/lib/duLieuGiaLap'

interface MediaCardProps {
  song: Song
  variant?: 'default' | 'wide'
}

export function MediaCard({ song, variant = 'default' }: MediaCardProps) {
  return (
    <article
      className={cn(
        'group rounded-[28px] border border-white/8 bg-white/[0.045] p-3 shadow-[0_24px_80px_rgba(0,0,0,0.24)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-white/15 hover:bg-white/[0.07]',
        variant === 'wide' && 'flex items-center gap-4 p-4'
      )}
    >
      <div className={cn('relative overflow-hidden rounded-[22px]', variant === 'wide' ? 'h-24 w-24' : 'aspect-square w-full')}>
        <Image src={song.coverUrl} alt={song.title} fill className="object-cover transition duration-500 group-hover:scale-105" sizes="(max-width: 768px) 50vw, 20vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <button className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-black opacity-0 transition group-hover:opacity-100">
          <Play className="h-4 w-4 fill-current" />
        </button>
      </div>

      <div className={cn('min-w-0', variant === 'wide' ? 'flex-1' : 'mt-4')}>
        <p className="truncate text-base font-medium text-white">{song.title}</p>
        <p className="truncate text-sm text-white/55">{song.artist}</p>
        <div className="mt-3 flex items-center justify-between text-xs text-white/40">
          <span>{song.album}</span>
          <span>{formatDuration(song.duration)}</span>
        </div>
      </div>
    </article>
  )
}
