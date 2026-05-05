"use client";

import {
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from "lucide-react";

import { formatDuration } from "@/lib/duLieuGiaLap";
import { useTheme } from "@/lib/nguCanhGiaoDien";

export default function DangPhatPage() {
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
    currentEmotion,
  } = useTheme();

  if (!nowPlaying) {
    return (
      <div className="flex min-h-[calc(100vh-12rem)] items-center justify-center">
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] px-8 py-7 text-center shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
          <p className="text-lg font-semibold text-white">
            Hiện tạo không có bài nào đang phát
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-12rem)] items-center justify-center pb-8">
      <section className="relative w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/10 bg-[#070b12]/90 p-6 shadow-[0_30px_120px_rgba(0,0,0,0.45)] md:p-8">
        <div
          className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full blur-3xl"
          style={{
            background: `${nowPlaying.palette.primary}33`,
          }}
        />

        <div
          className="pointer-events-none absolute -bottom-28 -right-24 h-80 w-80 rounded-full blur-3xl"
          style={{
            background: `${nowPlaying.palette.secondary}25`,
          }}
        />

        <div className="relative grid gap-8 md:grid-cols-[360px_1fr] md:items-center">
          <div className="relative">
            <div className="absolute -inset-4 rounded-[2rem] bg-white/[0.03] blur-xl" />

            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] shadow-[0_25px_80px_rgba(0,0,0,0.45)]">
              <img
                src={nowPlaying.coverUrl || "/placeholder.svg"}
                alt={nowPlaying.title}
                className="aspect-square w-full object-cover"
                onError={(event) => {
                  event.currentTarget.src = "/placeholder.svg";
                }}
              />

              {isPlaying && (
                <div className="absolute bottom-5 left-5 flex items-end gap-1 rounded-full border border-white/10 bg-black/40 px-3 py-2 backdrop-blur-xl">
                  {[1, 2, 3, 4].map((item) => (
                    <span
                      key={item}
                      className="h-4 w-1 animate-pulse rounded-full bg-white"
                      style={{
                        animationDelay: `${item * 0.12}s`,
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-7">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.35em] text-white/35">
                Đang phát
              </p>

              <h1 className="mt-4 text-4xl font-black tracking-tight text-white md:text-6xl">
                {nowPlaying.title}
              </h1>

              <p className="mt-3 text-lg text-white/55">
                {nowPlaying.artist || "Unknown Artist"}
              </p>

              <div className="mt-5 inline-flex rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-medium capitalize text-white/70">
                Mood: {currentEmotion}
              </div>
            </div>

            <div className="space-y-3">
              <div className="relative h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{
                    width: `${progress}%`,
                    background: `linear-gradient(90deg, ${nowPlaying.palette.primary}, ${nowPlaying.palette.secondary})`,
                  }}
                />

                <input
                  type="range"
                  min={0}
                  max={100}
                  step={0.1}
                  value={progress}
                  onChange={(event) => setProgress(Number(event.target.value))}
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                />
              </div>

              <div className="flex justify-between text-xs font-medium text-white/40">
                <span>{formatDuration(Math.floor(currentTime))}</span>
                <span>
                  {formatDuration(
                    Math.floor(totalDuration || nowPlaying.duration || 0),
                  )}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-5 md:justify-start">
              <button
                type="button"
                onClick={playPrevious}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/60 transition hover:bg-white/10 hover:text-white"
              >
                <SkipBack className="h-5 w-5" />
              </button>

              <button
                type="button"
                onClick={togglePlayPause}
                className="flex h-20 w-20 items-center justify-center rounded-full text-black shadow-[0_20px_60px_rgba(0,0,0,0.35)] transition hover:scale-105 active:scale-95"
                style={{
                  background: `linear-gradient(135deg, ${nowPlaying.palette.primary}, ${nowPlaying.palette.secondary})`,
                }}
              >
                {isPlaying ? (
                  <Pause className="h-8 w-8 fill-current" />
                ) : (
                  <Play className="ml-1 h-8 w-8 fill-current" />
                )}
              </button>

              <button
                type="button"
                onClick={playNext}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/60 transition hover:bg-white/10 hover:text-white"
              >
                <SkipForward className="h-5 w-5" />
              </button>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
              <button
                type="button"
                onClick={() => setIsMuted(!isMuted)}
                className="text-white/50 transition hover:text-white"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="h-5 w-5" />
                ) : (
                  <Volume2 className="h-5 w-5" />
                )}
              </button>

              <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-white/10">
                <div
                  className="absolute inset-y-0 left-0 rounded-full bg-white/70"
                  style={{
                    width: isMuted ? "0%" : `${volume}%`,
                  }}
                />

                <input
                  type="range"
                  min={0}
                  max={100}
                  value={isMuted ? 0 : volume}
                  onChange={(event) => setVolume(Number(event.target.value))}
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                />
              </div>

              <span className="w-10 text-right text-xs font-medium text-white/40">
                {isMuted ? 0 : volume}%
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
