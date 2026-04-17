'use client'

import { cn } from '@/lib/tienIch'
import { useTheme } from '@/lib/nguCanhGiaoDien'
import { formatDuration } from '@/lib/duLieuGiaLap'
import { Play, Pause, SkipBack, SkipForward, Heart, Volume2, VolumeX } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'

interface MiniPlayerProps {
  className?: string
}

export function MiniPlayer({ className }: MiniPlayerProps) {
  const {
    nowPlaying,
    isPlaying,
    togglePlayPause,
    playPrevious,
    playNext,
    currentTime,
    totalDuration,
    progress,
    setProgress,
    volume,
    setVolume,
    isMuted,
    setIsMuted,
  } = useTheme()
  const [isFavorite, setIsFavorite] = useState(false)

  if (!nowPlaying) return null

  return (
    <div
      className={cn(
        'theme-transition fixed bottom-0 left-0 right-0 z-50 border-t border-white/8 bg-[linear-gradient(180deg,rgba(13,15,17,0.97),rgba(10,12,14,0.96))] backdrop-blur-xl',
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/14 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-white/6">
        <div className="h-full bg-[linear-gradient(90deg,var(--brand-accent),rgba(30,215,96,0.55))] transition-all duration-300" style={{ width: `${progress}%` }} />
      </div>

      <div className="relative mx-auto max-w-[1540px] px-4 py-3 md:px-5 xl:px-7">
        <div className="grid min-h-[5.75rem] items-center gap-4 md:grid-cols-[minmax(0,1.05fr)_minmax(0,1.2fr)_minmax(0,0.95fr)]">
          <Link href="/dangPhat" className="flex min-w-0 items-center gap-3">
            <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-[1.1rem] border border-white/8 bg-white/[0.04] shadow-[0_12px_24px_rgba(0,0,0,0.24)]">
              <img src={nowPlaying.coverUrl} alt={nowPlaying.title} className="absolute inset-0 h-full w-full object-cover" />
              {isPlaying && <div className="absolute inset-0 bg-black/20" />}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">{nowPlaying.title}</p>
              <p className="truncate text-xs text-white/46">{nowPlaying.artist}</p>
              <p className="pill-label mt-1 hidden text-[0.66rem] text-white/24 md:block">Đang phát</p>
            </div>
          </Link>

          <div className="flex flex-col items-center gap-2.5">
            <div className="flex items-center gap-2.5 md:gap-3">
              <button onClick={playPrevious} className="search-pill hidden rounded-full p-2.5 text-white/58 transition-colors hover:text-white sm:flex">
                <SkipBack className="h-4 w-4" />
              </button>
              <button onClick={togglePlayPause} className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--brand-accent)] text-[#06120a] shadow-[0_12px_26px_rgba(30,215,96,0.22)] transition-transform hover:scale-[1.03]">
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 fill-current ml-0.5" />}
              </button>
              <button onClick={playNext} className="search-pill hidden rounded-full p-2.5 text-white/58 transition-colors hover:text-white sm:flex">
                <SkipForward className="h-4 w-4" />
              </button>
            </div>
            <div className="hidden w-full max-w-[27rem] items-center gap-3 md:flex">
              <span className="text-[0.68rem] tabular-nums text-white/34">{formatDuration(Math.floor(currentTime))}</span>
              <input
                type="range"
                min={0}
                max={100}
                value={progress}
                onChange={(event) => setProgress(Number(event.target.value))}
                className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-white/10 accent-[var(--brand-accent)]"
              />
              <span className="text-[0.68rem] tabular-nums text-white/34">{formatDuration(Math.floor(totalDuration || nowPlaying.duration))}</span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 md:gap-3">
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className={cn('search-pill hidden rounded-full p-2.5 transition-colors sm:flex', isFavorite ? 'text-pink-400' : 'text-white/52 hover:text-white')}
            >
              <Heart className={cn('h-4 w-4', isFavorite && 'fill-current')} />
            </button>
            <div className="search-pill hidden items-center gap-2 rounded-full px-3 py-2 md:flex">
              <button onClick={() => setIsMuted(!isMuted)} className="text-white/52 transition-colors hover:text-white">
                {isMuted || volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </button>
              <input
                type="range"
                min={0}
                max={100}
                value={isMuted ? 0 : volume}
                onChange={(event) => setVolume(Number(event.target.value))}
                className="w-24 accent-[var(--brand-accent)]"
              />
            </div>
            <span className="search-pill pill-label hidden rounded-full px-3 py-2 text-[0.68rem] text-white/38 md:block">
              Phiên nghe mood
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
