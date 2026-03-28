"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Volume2, VolumeX, Heart, ListMusic, Maximize2, Mic2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { useTheme } from "@/lib/nguCanhGiaoDien"
import { translations, mockSongs, formatDuration } from "@/lib/duLieuGiaLap"
import { MoodBadge } from "@/components/huyHieuCamXuc"
import { QueueDrawer } from "@/components/nganXepPhat"
import { cn } from "@/lib/tienIch"

export function BottomPlayer() {
  const { language, currentSong, setCurrentSong, isPlaying, setIsPlaying } = useTheme()
  const t = translations[language]
  
  const [progress, setProgress] = useState(35)
  const [volume, setVolume] = useState(75)
  const [isMuted, setIsMuted] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [shuffle, setShuffle] = useState(false)
  const [repeat, setRepeat] = useState<"off" | "all" | "one">("off")
  const [queueOpen, setQueueOpen] = useState(false)

  // Simulated progress
  useEffect(() => {
    if (!isPlaying) return
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleNext()
          return 0
        }
        return prev + 0.1
      })
    }, 100)
    return () => clearInterval(interval)
  }, [isPlaying])

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const handlePrevious = () => {
    const currentIndex = mockSongs.findIndex((s) => s.id === currentSong?.id)
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : mockSongs.length - 1
    setCurrentSong(mockSongs[prevIndex])
    setProgress(0)
  }

  const handleNext = () => {
    const currentIndex = mockSongs.findIndex((s) => s.id === currentSong?.id)
    const nextIndex = currentIndex < mockSongs.length - 1 ? currentIndex + 1 : 0
    setCurrentSong(mockSongs[nextIndex])
    setProgress(0)
  }

  const toggleRepeat = () => {
    setRepeat(repeat === "off" ? "all" : repeat === "all" ? "one" : "off")
  }

  const formatTime = (percentage: number, duration: number) => {
    const totalSeconds = duration
    const currentSeconds = Math.floor((percentage / 100) * totalSeconds)
    const currentMin = Math.floor(currentSeconds / 60)
    const currentSec = currentSeconds % 60
    return `${currentMin}:${currentSec.toString().padStart(2, "0")}`
  }

  if (!currentSong) return null

  return (
    <>
      <div 
        className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-2xl border-t border-white/10"
        style={{
          boxShadow: `0 -10px 50px ${currentSong.palette.primary}30`,
        }}
      >
        {/* Progress bar at top */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-white/10">
          <div 
            className="h-full transition-all duration-100"
            style={{ 
              width: `${progress}%`,
              background: `linear-gradient(to right, ${currentSong.palette.primary}, ${currentSong.palette.secondary})`
            }}
          />
        </div>

        <div className="flex items-center justify-between gap-4 px-4 py-3 md:px-6">
          {/* Left: Song Info */}
          <div className="flex items-center gap-3 flex-1 min-w-0 max-w-xs">
            <Link href="/dangPhat" className="relative flex-shrink-0 group">
              <div className="relative w-14 h-14 rounded-xl overflow-hidden">
                <Image
                  src={currentSong.coverUrl}
                  alt={currentSong.title}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
                {isPlaying && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex items-end gap-0.5 h-4">
                      {[...Array(4)].map((_, i) => (
                        <div
                          key={i}
                          className="w-1 bg-white rounded-full animate-pulse"
                          style={{
                            height: `${Math.random() * 100}%`,
                            animationDelay: `${i * 0.15}s`,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div 
                className="absolute -inset-1 rounded-xl opacity-50 blur-xl -z-10"
                style={{ backgroundColor: currentSong.palette.primary }}
              />
            </Link>
            
            <div className="min-w-0">
              <Link href="/dangPhat" className="block">
                <h4 className="font-semibold text-foreground truncate hover:underline">
                  {currentSong.title}
                </h4>
              </Link>
              <p className="text-sm text-muted-foreground truncate">{currentSong.artist}</p>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "hidden sm:flex flex-shrink-0",
                isLiked && "text-rose-500"
              )}
              onClick={() => setIsLiked(!isLiked)}
            >
              <Heart className={cn("w-5 h-5", isLiked && "fill-current")} />
            </Button>
          </div>

          {/* Center: Controls */}
          <div className="flex flex-col items-center gap-1 flex-1 max-w-lg">
            <div className="flex items-center gap-2 md:gap-4">
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "hidden md:flex w-8 h-8",
                  shuffle && "text-primary"
                )}
                onClick={() => setShuffle(!shuffle)}
              >
                <Shuffle className="w-4 h-4" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={handlePrevious}
              >
                <SkipBack className="w-5 h-5" />
              </Button>

              <Button
                size="icon"
                className="w-12 h-12 rounded-full"
                style={{
                  background: `linear-gradient(135deg, ${currentSong.palette.primary}, ${currentSong.palette.secondary})`,
                }}
                onClick={handlePlayPause}
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 fill-white text-white" />
                ) : (
                  <Play className="w-5 h-5 fill-white text-white ml-0.5" />
                )}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={handleNext}
              >
                <SkipForward className="w-5 h-5" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "hidden md:flex w-8 h-8",
                  repeat !== "off" && "text-primary"
                )}
                onClick={toggleRepeat}
              >
                <Repeat className="w-4 h-4" />
                {repeat === "one" && (
                  <span className="absolute text-[8px] font-bold">1</span>
                )}
              </Button>
            </div>

            {/* Progress */}
            <div className="hidden md:flex items-center gap-2 w-full">
              <span className="text-xs text-muted-foreground w-10 text-right">
                {formatTime(progress, currentSong.duration)}
              </span>
              <Slider
                value={[progress]}
                onValueChange={([value]) => setProgress(value)}
                max={100}
                step={0.1}
                className="flex-1"
              />
              <span className="text-xs text-muted-foreground w-10">
                {formatDuration(currentSong.duration)}
              </span>
            </div>
          </div>

          {/* Right: Extra Controls */}
          <div className="hidden md:flex items-center gap-2 flex-1 justify-end max-w-xs">
            <MoodBadge mood={currentSong.mood} size="sm" />

            <Button variant="ghost" size="icon" className="w-8 h-8">
              <Mic2 className="w-4 h-4" />
            </Button>

            <Button 
              variant="ghost" 
              size="icon" 
              className="w-8 h-8"
              onClick={() => setQueueOpen(true)}
            >
              <ListMusic className="w-4 h-4" />
            </Button>

            <div className="flex items-center gap-2 w-32">
              <Button
                variant="ghost"
                size="icon"
                className="w-8 h-8"
                onClick={() => setIsMuted(!isMuted)}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </Button>
              <Slider
                value={[isMuted ? 0 : volume]}
                onValueChange={([value]) => {
                  setVolume(value)
                  if (value > 0) setIsMuted(false)
                }}
                max={100}
                step={1}
                className="flex-1"
              />
            </div>

            <Link href="/dangPhat">
              <Button variant="ghost" size="icon" className="w-8 h-8">
                <Maximize2 className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <QueueDrawer open={queueOpen} onOpenChange={setQueueOpen} />
    </>
  )
}
