"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronDown,
  ChevronUp,
  Download,
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
import { useAuth } from "@/lib/nguCanhXacThuc";

const VIP_DOWNLOAD_MESSAGE =
  "Hãy mua gói VIP PRO để tải nhạc độc quyền từ chúng tôi";

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
    isTrackLiked,
    toggleLike,
  } = useTheme();

  const { user, isAuthenticated, refreshUser } = useAuth();

  const canDownloadVipPro = Boolean(isAuthenticated && user?.is_vip);

  const [vipDownloadMessage, setVipDownloadMessage] = useState<string | null>(
    null,
  );

  /**
   * song-card.tsx đang gọi setNowPlaying(playerSong).
   * Vì vậy bottom player ưu tiên nowPlaying.
   */
  const songDangPhat = nowPlaying ?? currentSong;

  const isLiked = isTrackLiked(songDangPhat?.id);

  const [isLikeSaving, setIsLikeSaving] = useState(false);
  const [isPlayerHidden, setIsPlayerHidden] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState<"off" | "all" | "one">("off");
  const [queueOpen, setQueueOpen] = useState(false);

  const parsedLyrics = useMemo(() => {
    return parseLyrics(songDangPhat?.lyrics ?? null);
  }, [songDangPhat?.lyrics]);

  const currentLyric = useMemo(() => {
    return getCurrentLyricLine(parsedLyrics, currentTime);
  }, [parsedLyrics, currentTime]);

  useEffect(() => {
    if (!vipDownloadMessage) return;

    const timeout = window.setTimeout(() => {
      setVipDownloadMessage(null);
    }, 3500);

    return () => window.clearTimeout(timeout);
  }, [vipDownloadMessage]);

  async function handleToggleLike() {
    if (!songDangPhat || isLikeSaving) return;

    const trackId = Number(songDangPhat.id);

    if (!Number.isInteger(trackId)) {
      console.warn("Không thể like bài hát mock hoặc bài hát không có id số.");
      return;
    }

    try {
      setIsLikeSaving(true);
      await toggleLike(trackId);
    } catch (error) {
      console.warn("Không lưu được trạng thái like:", error);
    } finally {
      setIsLikeSaving(false);
    }
  }

  function buildDownloadFileName() {
    const rawName = `${songDangPhat?.title || "bai-hat"}-${
      songDangPhat?.artist || "unknown"
    }`;

    const safeName = rawName
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D")
      .replace(/[^a-zA-Z0-9-_ ]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .toLowerCase();

    return `${safeName || "bai-hat"}.mp3`;
  }

  async function handleDownloadSong() {
    if (!songDangPhat?.audioUrl) return;

    try {
      await refreshUser();
    } catch (error) {
      console.warn("Không refresh được thông tin user:", error);
    }

    if (!isAuthenticated || !user?.is_vip) {
      setVipDownloadMessage(VIP_DOWNLOAD_MESSAGE);
      return;
    }

    setVipDownloadMessage(null);

    const fileName = buildDownloadFileName();

    try {
      const response = await fetch(songDangPhat.audioUrl);

      if (!response.ok) {
        throw new Error("Không tải được file audio.");
      }

      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();

      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.warn("Không tải được bằng blob, mở link audio trực tiếp:", error);

      const link = document.createElement("a");
      link.href = songDangPhat.audioUrl;
      link.download = fileName;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      document.body.appendChild(link);
      link.click();
      link.remove();
    }
  }

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
      <div
        className={cn(
          "fixed bottom-0 left-0 right-0 z-40 transition-transform duration-300 ease-out",
          isPlayerHidden ? "translate-y-[calc(100%-0.25rem)]" : "translate-y-0",
        )}
      >
        {/* Nút ẩn / hiện player */}
        <button
          type="button"
          onClick={() => setIsPlayerHidden((current) => !current)}
          aria-label={isPlayerHidden ? "Hiện trình phát" : "Ẩn trình phát"}
          title={isPlayerHidden ? "Hiện trình phát" : "Ẩn trình phát"}
          className={cn(
            "absolute left-1/2 top-0 z-50 flex h-8 w-14 -translate-x-1/2 -translate-y-full items-center justify-center",
            "rounded-t-2xl border border-b-0 border-white/10 bg-background/95 text-white/70 shadow-xl backdrop-blur-xl",
            "transition hover:text-white",
          )}
        >
          {isPlayerHidden ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </button>

        <div className="border-t border-white/10 bg-background/95 shadow-2xl backdrop-blur-xl">
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
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleToggleLike}
                disabled={isLikeSaving}
                title={isLiked ? "Bỏ thích bài hát" : "Thích bài hát"}
                className={cn(
                  isLiked && "text-red-500",
                  isLikeSaving && "opacity-60",
                )}
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
              <div className="relative">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={handleDownloadSong}
                  title={
                    canDownloadVipPro
                      ? "Tải bài hát về máy"
                      : "Cần VIP PRO để tải nhạc"
                  }
                  className={cn(
                    !canDownloadVipPro && "text-amber-300 hover:text-amber-200",
                  )}
                >
                  <Download className="h-4 w-4" />
                </Button>

                {vipDownloadMessage ? (
                  <div className="absolute bottom-[calc(100%+0.75rem)] right-0 z-50 w-72 rounded-2xl border border-amber-300/30 bg-slate-950/95 p-4 text-sm font-medium leading-6 text-amber-100 shadow-2xl shadow-black/40">
                    {vipDownloadMessage}
                  </div>
                ) : null}
              </div>

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
      </div>

      <QueueDrawer open={queueOpen} onOpenChange={setQueueOpen} />
    </>
  );
}
