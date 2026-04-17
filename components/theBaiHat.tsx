'use client'

import { cn } from '@/lib/tienIch'
import type { Song } from '@/lib/duLieuGiaLap'
import { formatDuration } from '@/lib/duLieuGiaLap'
import { useTheme } from '@/lib/nguCanhGiaoDien'
import { Play, Pause, Heart } from 'lucide-react'
import { useState } from 'react'

interface SongCardProps {
  song: Song
  variant?: 'default' | 'compact' | 'list'
  showDuration?: boolean
  className?: string
}

export function SongCard({ song, variant = 'default', showDuration = true, className }: SongCardProps) {
  const { nowPlaying, setNowPlaying, isPlaying, setIsPlaying } = useTheme()
  const [isHovered, setIsHovered] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)

  const isCurrentSong = nowPlaying?.id === song.id

  const handlePlay = () => {
    if (isCurrentSong) {
      setIsPlaying(!isPlaying)
      return
    }

    setNowPlaying(song)
    setIsPlaying(true)
  }

  const lopAnh = 'absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105'

  if (variant === 'list') {
    return (
      <div
        className={cn(
          'group flex items-center gap-3 rounded-2xl p-3 transition-all duration-300',
          'cursor-pointer hover:bg-white/[0.045] hover:shadow-[0_8px_24px_rgba(0,0,0,0.24)]',
          isCurrentSong && 'bg-white/[0.06]',
          className,
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handlePlay}
      >
        <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-secondary/30 shadow-[0_10px_20px_rgba(0,0,0,0.24)]">
          <img src={song.coverUrl} alt={song.title} className={lopAnh} />
          <div className="absolute inset-0 bg-black/35 flex items-center justify-center">
            {isHovered || isCurrentSong ? (
              isCurrentSong && isPlaying ? (
                <Pause className="w-5 h-5 text-white" />
              ) : (
                <Play className="w-5 h-5 text-white fill-current ml-0.5" />
              )
            ) : null}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className={cn('truncate font-medium transition-colors', isCurrentSong ? 'text-[var(--brand-accent)]' : 'text-white')}>
            {song.title}
          </p>
          <p className="truncate text-sm text-white/46">{song.artist}</p>
        </div>
        {showDuration && <span className="text-sm tabular-nums text-white/32">{formatDuration(song.duration)}</span>}
        <button
          onClick={(event) => {
            event.stopPropagation()
            setIsFavorite(!isFavorite)
          }}
          className={cn('search-pill rounded-full p-2 transition-all opacity-0 group-hover:opacity-100', isFavorite ? 'text-pink-500' : 'text-muted-foreground hover:text-foreground')}
        >
          <Heart className={cn('w-4 h-4', isFavorite && 'fill-current')} />
        </button>
      </div>
    )
  }

  if (variant === 'compact') {
    return (
      <div
      className={cn(
        'group relative w-full cursor-pointer overflow-hidden rounded-[1.35rem] bg-[linear-gradient(180deg,rgba(33,33,33,0.94),rgba(22,22,22,0.92))] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_32px_rgba(0,0,0,0.3)]',
        className,
      )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handlePlay}
      >
        <div className="aspect-square relative bg-secondary/30">
          <img src={song.coverUrl} alt={song.title} className={lopAnh} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/15" />
        <div className={cn('absolute inset-0 flex items-center justify-center transition-opacity duration-300', isHovered ? 'opacity-100' : 'opacity-0')}>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--brand-accent)] text-[#06120a] shadow-lg">
              {isCurrentSong && isPlaying ? (
                <Pause className="w-6 h-6 text-background" />
              ) : (
                <Play className="w-6 h-6 text-background fill-current ml-0.5" />
              )}
            </div>
          </div>
        </div>
        <div className="p-3">
          <p className={cn('truncate text-sm font-medium', isCurrentSong ? 'text-[var(--brand-accent)]' : 'text-white')}>
            {song.title}
          </p>
          <p className="truncate text-xs text-white/44">{song.artist}</p>
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'group relative w-full cursor-pointer overflow-hidden rounded-[1.5rem] bg-[linear-gradient(180deg,rgba(33,33,33,0.96),rgba(22,22,22,0.94))]',
        'transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_24px_40px_rgba(0,0,0,0.34)]',
        isCurrentSong && 'ring-1 ring-[var(--brand-accent)] glow-soft',
        className,
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handlePlay}
    >
      <div className="aspect-square relative bg-secondary/30">
        <img src={song.coverUrl} alt={song.title} className={lopAnh} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
        <div className={cn('absolute inset-0 flex items-center justify-center transition-all duration-300', isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-90')}>
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--brand-accent)] text-[#06120a] shadow-2xl backdrop-blur-sm">
            {isCurrentSong && isPlaying ? (
              <Pause className="w-8 h-8 text-background" />
            ) : (
              <Play className="w-8 h-8 text-background fill-current ml-1" />
            )}
          </div>
        </div>
      </div>
      <div className="p-4">
        <p className={cn('truncate font-semibold transition-colors', isCurrentSong ? 'text-[var(--brand-accent)]' : 'text-white')}>
          {song.title}
        </p>
        <p className="mt-0.5 truncate text-sm text-white/48">{song.artist}</p>
        <p className="mt-1 truncate text-xs uppercase tracking-[0.18em] text-white/28">{song.album}</p>
        {showDuration && (
          <div className="flex items-center justify-between mt-3">
            <span className="text-xs text-muted-foreground tabular-nums">{formatDuration(song.duration)}</span>
            <button
              onClick={(event) => {
                event.stopPropagation()
                setIsFavorite(!isFavorite)
              }}
              className={cn('search-pill rounded-full p-1.5 transition-all', isFavorite ? 'text-pink-500' : 'text-muted-foreground hover:text-foreground')}
            >
              <Heart className={cn('w-4 h-4', isFavorite && 'fill-current')} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
