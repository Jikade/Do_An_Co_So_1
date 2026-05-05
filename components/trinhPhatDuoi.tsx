"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Heart,
  ListMusic,
  Maximize2,
  Mic2,
  Pause,
  Play,
  Repeat,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { QueueDrawer } from "@/components/nganXepPhat";
import { MoodBadge } from "@/components/huyHieuCamXuc";
import { useTheme } from "@/lib/nguCanhGiaoDien";
import { formatDuration } from "@/lib/duLieuGiaLap";
import { getCurrentLyricLine, parseLyrics } from "@/lib/lyrics";
import { cn } from "@/lib/tienIch";

export function BottomPlayer() {
  const {
    currentSong,
    nowPlaying,
    isPlaying,
    setIsPlaying,
    playNext,
    playPrevious,
    progress,
    setProgress,
    volume,
    setVolume,
    isMuted,
    setIsMuted,
    currentTime,
  } = useTheme();

  /**
   * Quan trọng:
   * song-card.tsx đang gọi setNowPlaying(playerSong).
   * Vì vậy bottom player phải ưu tiên nowPlaying.
   */
  const songDangPhat = nowPlaying ?? currentSong;

  const [isLiked, setIsLiked] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState<"off" | "all" | "one">("off");
  const [queueOpen, setQueueOpen] = useState(false);

  const parsedLyrics = useMemo(() => {
    return parseLyrics(songDangPhat?.lyrics ?? null);
  }, [songDangPhat?.lyrics]);

  const currentLyric = useMemo(() => {
    return getCurrentLyricLine(parsedLyrics, currentTime);
  }, [parsedLyrics, currentTime]);

  console.log("=== DEBUG LYRIC BOTTOM PLAYER ===");
  console.log("songDangPhat title:", songDangPhat?.title);
  console.log("songDangPhat lyrics:", songDangPhat?.lyrics);
  console.log("parsedLyrics:", parsedLyrics);
  console.log("currentTime:", currentTime);
  console.log("progress:", progress);
  console.log("currentLyric:", currentLyric);
  console.log("=================================");

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleRepeat = () => {
    setRepeat(repeat === "off" ? "all" : repeat === "all" ? "one" : "off");
  };

  const formatTime = (percentage: number, duration: number) => {
    const totalSeconds = duration || 0;
    const currentSeconds = Math.floor((percentage / 100) * totalSeconds);
    const currentMin = Math.floor(currentSeconds / 60);
    const currentSec = currentSeconds % 60;

    return `${currentMin}:${currentSec.toString().padStart(2, "0")}`;
  };

  if (!songDangPhat) return null;

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-background/95 shadow-2xl backdrop-blur-xl">
        {/* Progress bar trên cùng */}
        <div className="h-1 w-full bg-white/10">
          <div
            className="h-full bg-primary transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="mx-auto flex max-w-screen-2xl items-center gap-4 px-4 py-3">
          {/* Left: Song Info */}
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl bg-muted">
              <Image
                src={songDangPhat.coverUrl || "/placeholder.svg"}
                alt={songDangPhat.title}
                fill
                className="object-cover"
              />

              {isPlaying && (
                <div className="absolute inset-0 flex items-end justify-center gap-0.5 bg-black/20 pb-2">
                  {[...Array(4)].map((_, i) => (
                    <span
                      key={i}
                      className="w-1 rounded-full bg-white"
                      style={{
                        height: `${12 + i * 4}px`,
                        animation: `musicBar 0.8s ease-in-out infinite ${
                          i * 0.1
                        }s`,
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="min-w-0">
              <h4 className="truncate font-semibold">{songDangPhat.title}</h4>

              <p className="truncate text-sm text-muted-foreground">
                {songDangPhat.artist}
              </p>

              <div className="mt-1">
                <MoodBadge emotion={songDangPhat.emotion} size="sm" />
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsLiked(!isLiked)}
              className={cn(isLiked && "text-red-500")}
            >
              <Heart className={cn("h-4 w-4", isLiked && "fill-current")} />
            </Button>
          </div>

          {/* Center: Controls + Progress + Lyrics */}
          <div className="flex flex-[2] flex-col items-center gap-2">
            {/* Controls */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShuffle(!shuffle)}
                className={cn(shuffle && "text-primary")}
              >
                <Shuffle className="h-4 w-4" />
              </Button>

              <Button variant="ghost" size="icon" onClick={playPrevious}>
                <SkipBack className="h-5 w-5" />
              </Button>

              <Button
                size="icon"
                onClick={handlePlayPause}
                className="h-11 w-11 rounded-full"
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5 fill-current" />
                )}
              </Button>

              <Button variant="ghost" size="icon" onClick={playNext}>
                <SkipForward className="h-5 w-5" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={toggleRepeat}
                className={cn(repeat !== "off" && "text-primary")}
              >
                <Repeat className="h-4 w-4" />

                {repeat === "one" && (
                  <span className="absolute text-[9px] font-bold">1</span>
                )}
              </Button>
            </div>

            {/* Thanh tua nhạc */}
            <div className="flex w-full max-w-xl items-center gap-2 text-xs text-muted-foreground">
              <span className="w-10 text-right">
                {formatTime(progress, songDangPhat.duration)}
              </span>

              <Slider
                value={[progress]}
                onValueChange={(value) => setProgress(value[0])}
                max={100}
                step={0.1}
                className="flex-1"
              />

              <span className="w-10">
                {formatDuration(songDangPhat.duration)}
              </span>
            </div>

            {/* Lyrics nằm dưới thanh tua nhạc */}
            {currentLyric ? (
              <div className="w-full max-w-xl rounded-2xl border border-primary/50 bg-primary/20 px-4 py-2 text-center text-sm font-semibold text-foreground shadow-lg">
                {currentLyric.text}
              </div>
            ) : null}
          </div>

          {/* Right: Extra Controls */}
          <div className="flex flex-1 items-center justify-end gap-2">
            <Button variant="ghost" size="icon">
              <Mic2 className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setQueueOpen(true)}
            >
              <ListMusic className="h-4 w-4" />
            </Button>

            <div className="flex w-28 items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMuted(!isMuted)}
                className="h-8 w-8"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </Button>

              <Slider
                value={[isMuted ? 0 : volume]}
                onValueChange={(value) => {
                  setVolume(value[0]);

                  if (value[0] > 0) {
                    setIsMuted(false);
                  }
                }}
                max={100}
                step={1}
                className="flex-1"
              />
            </div>

            <Link href="/now-playing">
              <Button variant="ghost" size="icon">
                <Maximize2 className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <QueueDrawer open={queueOpen} onOpenChange={setQueueOpen} />
    </>
  );
}
