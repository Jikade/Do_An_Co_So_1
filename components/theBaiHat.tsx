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
          'group flex items-center gap-3 p-3 rounded-xl transition-all duration-300',
          'hover:bg-secondary/50 cursor-pointer',
          isCurrentSong && 'bg-secondary/70',
          className,
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handlePlay}
      >
        <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-secondary/30">
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
          <p className={cn('font-medium truncate transition-colors', isCurrentSong ? 'text-[var(--song-primary)]' : 'text-foreground')}>
            {song.title}
          </p>
          <p className="text-sm text-muted-foreground truncate">{song.artist}</p>
        </div>
        {showDuration && <span className="text-sm text-muted-foreground tabular-nums">{formatDuration(song.duration)}</span>}
        <button
          onClick={(event) => {
            event.stopPropagation()
            setIsFavorite(!isFavorite)
          }}
          className={cn(
            'p-2 rounded-full transition-all opacity-0 group-hover:opacity-100',
            isFavorite ? 'text-pink-500' : 'text-muted-foreground hover:text-foreground',
          )}
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
          'group relative w-full rounded-2xl overflow-hidden cursor-pointer',
          'transition-all duration-300 hover:scale-[1.02]',
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
            <div className="w-12 h-12 rounded-full bg-foreground/90 flex items-center justify-center shadow-lg">
              {isCurrentSong && isPlaying ? (
                <Pause className="w-6 h-6 text-background" />
              ) : (
                <Play className="w-6 h-6 text-background fill-current ml-0.5" />
              )}
            </div>
          </div>
        </div>
        <div className="p-3">
          <p className={cn('font-medium truncate text-sm', isCurrentSong ? 'text-[var(--song-primary)]' : 'text-foreground')}>
            {song.title}
          </p>
          <p className="text-xs text-muted-foreground truncate">{song.artist}</p>
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'group relative w-full rounded-3xl overflow-hidden cursor-pointer glass',
        'transition-all duration-500 hover:scale-[1.02] hover:shadow-xl',
        isCurrentSong && 'ring-2 ring-[var(--song-primary)] glow-soft',
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
          <div className="w-16 h-16 rounded-full bg-foreground/90 flex items-center justify-center shadow-2xl backdrop-blur-sm">
            {isCurrentSong && isPlaying ? (
              <Pause className="w-8 h-8 text-background" />
            ) : (
              <Play className="w-8 h-8 text-background fill-current ml-1" />
            )}
          </div>
        </div>
      </div>
      <div className="p-4">
        <p className={cn('font-semibold truncate transition-colors', isCurrentSong ? 'text-[var(--song-primary)]' : 'text-foreground')}>
          {song.title}
        </p>
        <p className="text-sm text-muted-foreground truncate mt-0.5">{song.artist}</p>
        <p className="text-xs text-muted-foreground/70 truncate mt-1">{song.album}</p>
        {showDuration && (
          <div className="flex items-center justify-between mt-3">
            <span className="text-xs text-muted-foreground tabular-nums">{formatDuration(song.duration)}</span>
            <button
              onClick={(event) => {
                event.stopPropagation()
                setIsFavorite(!isFavorite)
              }}
              className={cn('p-1.5 rounded-full transition-all', isFavorite ? 'text-pink-500' : 'text-muted-foreground hover:text-foreground')}
            >
              <Heart className={cn('w-4 h-4', isFavorite && 'fill-current')} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
