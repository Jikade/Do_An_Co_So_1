'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Heart, Pause, Play, SkipBack, SkipForward, Volume2 } from 'lucide-react'
import { useTheme } from '@/lib/nguCanhGiaoDien'
import { formatDuration } from '@/lib/duLieuGiaLap'

export function MiniPlayer() {
  const { nowPlaying, isPlaying, togglePlayPause, playNext, playPrevious, currentTime, totalDuration } = useTheme()

  if (!nowPlaying) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/8 bg-[#0a0d13]/92 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-[1800px] items-center justify-between gap-3 px-4 py-3 md:px-6">
        <Link href="/playlist/pl2" className="flex min-w-0 items-center gap-3">
          <div className="relative h-14 w-14 overflow-hidden rounded-2xl">
            <Image src={nowPlaying.coverUrl} alt={nowPlaying.title} fill className="object-cover" sizes="56px" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-white">{nowPlaying.title}</p>
            <p className="truncate text-xs text-white/45">{nowPlaying.artist}</p>
          </div>
        </Link>

        <div className="flex items-center gap-2 md:gap-3">
          <button onClick={playPrevious} className="hidden h-10 w-10 items-center justify-center rounded-full border border-white/8 bg-white/[0.04] text-white/65 transition hover:bg-white/[0.08] md:flex">
            <SkipBack className="h-4 w-4" />
          </button>
          <button onClick={togglePlayPause} className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-black transition hover:scale-[1.03]">
            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 fill-current" />}
          </button>
          <button onClick={playNext} className="hidden h-10 w-10 items-center justify-center rounded-full border border-white/8 bg-white/[0.04] text-white/65 transition hover:bg-white/[0.08] md:flex">
            <SkipForward className="h-4 w-4" />
          </button>
        </div>

        <div className="hidden items-center gap-4 md:flex">
          <div className="text-xs text-white/45">
            {formatDuration(Math.floor(currentTime))} / {formatDuration(Math.floor(totalDuration || nowPlaying.duration))}
          </div>
          <button className="flex h-10 w-10 items-center justify-center rounded-full border border-white/8 bg-white/[0.04] text-white/65 transition hover:bg-white/[0.08]">
            <Heart className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-2 text-white/45">
            <Volume2 className="h-4 w-4" />
            <div className="h-1 w-24 overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-cyan-300 to-violet-300" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
