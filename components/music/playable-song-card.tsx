"use client";

import { Pause, Play } from "lucide-react";

import { uiTrackToSong } from "@/lib/player-song-adapter";
import type { UiTrack } from "@/lib/tracks-api";
import { useTheme } from "@/lib/nguCanhGiaoDien";

type PlayableSongCardProps = {
  track: UiTrack;
};

export function PlayableSongCard({ track }: PlayableSongCardProps) {
  const { nowPlaying, isPlaying, setNowPlaying, setIsPlaying } = useTheme();

  const isCurrentSong = nowPlaying?.id === track.id;
  const isCurrentSongPlaying = isCurrentSong && isPlaying;

  function handlePlay() {
    if (!track.audioUrl) return;

    if (isCurrentSongPlaying) {
      setIsPlaying(false);
      return;
    }

    if (!isCurrentSong) {
      setNowPlaying(uiTrackToSong(track));
    }

    setIsPlaying(true);
  }

  return (
    <article
      className={[
        "group overflow-hidden rounded-3xl border p-4 transition duration-300",
        "bg-[#070b12]/90 shadow-[0_18px_50px_rgba(0,0,0,0.35)]",
        "hover:-translate-y-1 hover:border-emerald-400/40 hover:shadow-[0_22px_60px_rgba(16,185,129,0.12)]",
        isCurrentSong ? "border-emerald-400/50" : "border-white/10",
      ].join(" ")}
    >
      <div className="relative overflow-hidden rounded-2xl bg-white/5">
        <img
          src={track.coverUrl || "/placeholder.svg"}
          alt={track.title}
          className="aspect-square w-full object-cover transition duration-500 group-hover:scale-105"
          onError={(event) => {
            event.currentTarget.src = "/placeholder.svg";
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-80" />

        <button
          type="button"
          onClick={handlePlay}
          className={[
            "absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center",
            "rounded-full bg-white text-black shadow-[0_18px_40px_rgba(0,0,0,0.4)]",
            "transition duration-300 hover:scale-105 active:scale-95",
            isCurrentSongPlaying
              ? "opacity-100"
              : "opacity-0 group-hover:opacity-100",
          ].join(" ")}
          aria-label={isCurrentSongPlaying ? "Tạm dừng" : "Phát bài hát"}
        >
          {isCurrentSongPlaying ? (
            <Pause className="h-5 w-5 fill-current" />
          ) : (
            <Play className="ml-0.5 h-5 w-5 fill-current" />
          )}
        </button>
      </div>

      <div className="mt-4">
        <h3 className="line-clamp-1 text-base font-semibold text-white">
          {track.title}
        </h3>

        <p className="mt-1 line-clamp-1 text-sm text-white/55">
          {track.artist || "Unknown Artist"}
        </p>

        <div className="mt-3 flex items-center justify-between gap-2">
          <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs text-white/55">
            {track.emotionLabelVi || track.emotion || "Không rõ mood"}
          </span>

          <button
            type="button"
            onClick={handlePlay}
            className={[
              "flex h-9 w-9 items-center justify-center rounded-full transition",
              isCurrentSongPlaying
                ? "bg-emerald-400 text-black"
                : "bg-white/8 text-white hover:bg-white hover:text-black",
            ].join(" ")}
            aria-label={isCurrentSongPlaying ? "Tạm dừng" : "Phát bài hát"}
          >
            {isCurrentSongPlaying ? (
              <Pause className="h-4 w-4 fill-current" />
            ) : (
              <Play className="ml-0.5 h-4 w-4 fill-current" />
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
