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
      <div className={cn('group relative w-full rounded-3xl overflow-hidden cursor-pointer transition-all duration-500 hover:scale-[1.01]', className)} onClick={handlePlay}>
        <div className="aspect-[2/1] md:aspect-[3/1] relative bg-secondary/20">
          <img src={playlist.coverUrl} alt={playlist.name[language]} className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
          <div className={cn('absolute inset-0 bg-gradient-to-br', themeGradients[playlist.theme])} />
          <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/40 to-transparent" />
          <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end">
            <MoodBadge emotion={playlist.emotion} size="sm" className="mb-3 w-fit" />
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-2">{playlist.name[language]}</h3>
            <p className="text-muted-foreground mb-4 line-clamp-2">{playlist.description[language]}</p>
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-foreground text-background font-medium transition-transform hover:scale-105">
                <Play className="w-5 h-5 fill-current" />
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
      <div className={cn('group flex items-center gap-3 p-2 rounded-xl cursor-pointer transition-all duration-300 hover:bg-secondary/50', className)} onClick={handlePlay}>
        <div className="w-14 h-14 rounded-xl flex-shrink-0 relative overflow-hidden bg-secondary/20">
          <img src={playlist.coverUrl} alt={playlist.name[language]} className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
            <Play className="w-5 h-5 text-white fill-current" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium truncate text-foreground">{playlist.name[language]}</p>
          <p className="text-sm text-muted-foreground truncate">{playlist.songCount} {language === 'vi' ? 'bài' : 'songs'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('group relative w-full rounded-2xl overflow-hidden cursor-pointer glass transition-all duration-500 hover:scale-[1.02] hover:shadow-xl', className)} onClick={handlePlay}>
      <div className="aspect-square relative bg-secondary/20">
        <img src={playlist.coverUrl} alt={playlist.name[language]} className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <div className={cn('absolute inset-0 bg-gradient-to-br', themeGradients[playlist.theme])} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/25">
          <div className="w-14 h-14 rounded-full bg-foreground flex items-center justify-center shadow-2xl">
            <Play className="w-7 h-7 text-background fill-current ml-0.5" />
          </div>
        </div>
        <div className="absolute top-3 right-3">
          <MoodBadge emotion={playlist.emotion} size="sm" showLabel={false} />
        </div>
      </div>
      <div className="p-4">
        <h4 className="font-semibold text-foreground truncate">{playlist.name[language]}</h4>
        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{playlist.description[language]}</p>
        <p className="text-xs text-muted-foreground/70 mt-2">{playlist.songCount} {language === 'vi' ? 'bài' : 'songs'} • {playlist.duration}</p>
      </div>
    </div>
  )
}
