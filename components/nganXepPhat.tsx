"use client"

import { useState } from "react"
import Image from "next/image"
import { GripVertical, Play, Trash2, Clock, Music } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { mockSongs, translations, formatDuration } from "@/lib/duLieuGiaLap"
import { useTheme } from "@/lib/nguCanhGiaoDien"
import { MoodBadge } from "@/components/huyHieuCamXuc"

interface QueueDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function QueueDrawer({ open, onOpenChange }: QueueDrawerProps) {
  const { language, currentSong, setCurrentSong } = useTheme()
  const t = translations[language]
  const [queue, setQueue] = useState(mockSongs.slice(0, 8))

  const removeFromQueue = (songId: string) => {
    setQueue(queue.filter((song) => song.id !== songId))
  }

  const totalDuration = queue.reduce((acc, song) => acc + song.duration, 0)

  const formatTotalDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes} ${language === "vi" ? "phút" : "min"}`
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent 
        side="right" 
        className="w-full sm:w-[400px] bg-background/95 backdrop-blur-xl border-l border-white/10 p-0"
      >
        <SheetHeader className="p-6 pb-4 border-b border-white/10">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-xl font-bold text-foreground">
              {language === "vi" ? "Hàng đợi" : "Queue"}
            </SheetTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>{formatTotalDuration(totalDuration)}</span>
            </div>
          </div>
        </SheetHeader>

        {/* Now Playing */}
        {currentSong && (
          <div className="p-4 border-b border-white/10">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">
              {language === "vi" ? "Đang phát" : "Now Playing"}
            </p>
            <div 
              className="flex items-center gap-3 p-3 rounded-2xl"
              style={{ 
                backgroundColor: `${currentSong.palette.primary}15`,
                boxShadow: `0 0 30px ${currentSong.palette.primary}20`
              }}
            >
              <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
                <Image
                  src={currentSong.coverUrl}
                  alt={currentSong.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <div className="w-3 h-3 rounded-full bg-white animate-pulse" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-foreground truncate">{currentSong.title}</h4>
                <p className="text-sm text-muted-foreground truncate">{currentSong.artist}</p>
              </div>
              <MoodBadge emotion={currentSong.emotion} size="sm" />
            </div>
          </div>
        )}

        {/* Queue List */}
        <ScrollArea className="flex-1 h-[calc(100vh-280px)]">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">
                {language === "vi" ? "Tiếp theo" : "Up Next"} ({queue.length})
              </p>
              {queue.length > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs text-muted-foreground hover:text-foreground"
                  onClick={() => setQueue([])}
                >
                  {language === "vi" ? "Xóa tất cả" : "Clear All"}
                </Button>
              )}
            </div>

            {queue.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                  <Music className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">
                  {language === "vi" 
                    ? "Hàng đợi trống"
                    : "Queue is empty"}
                </p>
                <p className="text-sm text-muted-foreground/60 mt-1">
                  {language === "vi" 
                    ? "Thêm bài hát để nghe tiếp"
                    : "Add songs to play next"}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {queue.map((song, index) => (
                  <div
                    key={song.id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group"
                  >
                    <div className="flex items-center justify-center w-6 text-muted-foreground">
                      <GripVertical className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab" />
                      <span className="group-hover:hidden text-sm">{index + 1}</span>
                    </div>
                    
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={song.coverUrl}
                        alt={song.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-foreground truncate">{song.title}</h4>
                      <p className="text-xs text-muted-foreground truncate">{song.artist}</p>
                    </div>
                    
                    <span className="text-xs text-muted-foreground">{formatDuration(song.duration)}</span>
                    
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="w-8 h-8"
                        onClick={() => setCurrentSong(song)}
                      >
                        <Play className="w-3.5 h-3.5" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="w-8 h-8 text-rose-500 hover:text-rose-400"
                        onClick={() => removeFromQueue(song.id)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="p-4 border-t border-white/10">
          <Button className="w-full" variant="outline">
            {language === "vi" ? "Lưu thành playlist" : "Save as Playlist"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
