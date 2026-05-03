'use client'

import { cn } from '@/lib/tienIch'
import type { Playlist } from '@/lib/duLieuGiaLap'
import { themeGradients } from '@/lib/duLieuGiaLap'
import { useTheme } from '@/lib/nguCanhGiaoDien'
import { Play } from 'lucide-react'
import { MoodBadge } from './huyHieuCamXuc'

interface PlaylistCardProps {
  playlist: Playlist
  variant?: 'default' | 'compact' | 'hero'
  className?: string
}

export function PlaylistCard({ playlist, variant = 'default', className }: PlaylistCardProps) {
  const { language, setNowPlaying, setIsPlaying } = useTheme()

  const handlePlay = () => {
    if (!playlist.songs.length) return
    setNowPlaying(playlist.songs[0])
    setIsPlaying(true)
  }

  if (variant === 'hero') {
    return (
      <div className={cn('group relative w-full overflow-hidden rounded-[2rem] cursor-pointer transition-all duration-500 hover:scale-[1.01]', className)} onClick={handlePlay}>
        <div className="aspect-[2/1] md:aspect-[3/1] relative bg-secondary/20">
          <img src={playlist.coverUrl} alt={playlist.name[language]} className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
          <div className={cn('absolute inset-0 bg-gradient-to-br', themeGradients[playlist.theme])} />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,10,0.16),rgba(10,10,10,0.82))]" />
          <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end">
            <MoodBadge emotion={playlist.emotion} size="sm" className="mb-3 w-fit" />
            <h3 className="mb-2 text-2xl font-bold text-white md:text-3xl">{playlist.name[language]}</h3>
            <p className="mb-5 max-w-2xl text-sm leading-7 text-white/68 md:text-base">{playlist.description[language]}</p>
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 rounded-full bg-[var(--brand-accent)] px-6 py-3 font-medium text-[#06120a] transition-transform hover:scale-105">
                <Play className="h-5 w-5 fill-current" />
                <span>{language === 'vi' ? 'Phát ngay' : 'Play Now'}</span>
              </button>
              <span className="text-sm text-muted-foreground">{playlist.songCount} {language === 'vi' ? 'bài' : 'songs'} • {playlist.duration}</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (variant === 'compact') {
    return (
      <div className={cn('group flex cursor-pointer items-center gap-3 rounded-2xl border border-white/6 bg-white/[0.03] p-3 transition-all duration-300 hover:bg-white/[0.05]', className)} onClick={handlePlay}>
        <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-2xl bg-secondary/20">
          <img src={playlist.coverUrl} alt={playlist.name[language]} className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
            <Play className="w-5 h-5 text-white fill-current" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="truncate font-medium text-white">{playlist.name[language]}</p>
          <p className="text-sm text-muted-foreground truncate">{playlist.songCount} {language === 'vi' ? 'bài' : 'songs'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('group relative w-full overflow-hidden rounded-[1.75rem] border border-white/6 bg-[linear-gradient(180deg,rgba(33,33,33,0.96),rgba(22,22,22,0.94))] cursor-pointer transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_24px_40px_rgba(0,0,0,0.34)]', className)} onClick={handlePlay}>
      <div className="aspect-square relative bg-secondary/20">
        <img src={playlist.coverUrl} alt={playlist.name[language]} className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <div className={cn('absolute inset-0 bg-gradient-to-br', themeGradients[playlist.theme])} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/22 to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/25">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--brand-accent)] text-[#06120a] shadow-2xl">
            <Play className="ml-0.5 h-7 w-7 fill-current" />
          </div>
        </div>
        <div className="absolute top-3 right-3">
          <MoodBadge emotion={playlist.emotion} size="sm" showLabel={false} />
        </div>
      </div>
      <div className="p-4">
        <h4 className="truncate font-semibold text-white">{playlist.name[language]}</h4>
        <p className="mt-1 line-clamp-2 text-sm text-white/56">{playlist.description[language]}</p>
        <p className="text-xs text-muted-foreground/70 mt-2">{playlist.songCount} {language === 'vi' ? 'bài' : 'songs'} • {playlist.duration}</p>
      </div>
    </div>
  )
}
