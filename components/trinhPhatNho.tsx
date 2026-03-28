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
    <div className={cn('fixed bottom-0 left-0 right-0 z-50 glass-strong border-t border-border/50 theme-transition', className)}>
      <div className="absolute top-0 left-0 right-0 h-1 bg-secondary/50">
        <div className="h-full bg-[var(--song-primary)] transition-all duration-300" style={{ width: `${progress}%` }} />
      </div>

      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20 gap-4">
          <Link href="/dangPhat" className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 relative bg-secondary/20">
              <img src={nowPlaying.coverUrl} alt={nowPlaying.title} className="absolute inset-0 h-full w-full object-cover" />
              {isPlaying && <div className="absolute inset-0 bg-black/20" />}
            </div>
            <div className="min-w-0">
              <p className="font-medium text-foreground truncate text-sm">{nowPlaying.title}</p>
              <p className="text-xs text-muted-foreground truncate">{nowPlaying.artist}</p>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <button onClick={playPrevious} className="p-2 rounded-full text-muted-foreground hover:text-foreground transition-colors hidden sm:flex">
              <SkipBack className="w-5 h-5" />
            </button>
            <button onClick={togglePlayPause} className="w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center hover:scale-105 transition-transform">
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
            </button>
            <button onClick={playNext} className="p-2 rounded-full text-muted-foreground hover:text-foreground transition-colors hidden sm:flex">
              <SkipForward className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-2 flex-1 justify-end">
            <span className="text-xs text-muted-foreground tabular-nums hidden md:block">
              {formatDuration(Math.floor(currentTime))} / {formatDuration(Math.floor(totalDuration || nowPlaying.duration))}
            </span>
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className={cn('p-2 rounded-full transition-colors hidden sm:flex', isFavorite ? 'text-pink-500' : 'text-muted-foreground hover:text-foreground')}
            >
              <Heart className={cn('w-5 h-5', isFavorite && 'fill-current')} />
            </button>
            <div className="hidden md:flex items-center gap-2">
              <button onClick={() => setIsMuted(!isMuted)} className="text-muted-foreground hover:text-foreground">
                {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <input
                type="range"
                min={0}
                max={100}
                value={isMuted ? 0 : volume}
                onChange={(event) => setVolume(Number(event.target.value))}
                className="w-20 accent-[var(--song-primary)]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
