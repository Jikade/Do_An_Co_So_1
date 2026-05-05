"use client";

import { Pause, Play } from "lucide-react";

import { getAssetUrl, type Song as ApiSong } from "@/lib/api/songs";
import { useTheme } from "@/lib/nguCanhGiaoDien";
import { themePalette, type Song as PlayerSong } from "@/lib/duLieuGiaLap";

type SongCardProps = {
  song: ApiSong;
};

function normalizeEmotion(value?: string | null) {
  const mood = value?.toLowerCase().trim();

  if (!mood) return "calm";

  if (
    mood === "happy" ||
    mood === "sad" ||
    mood === "calm" ||
    mood === "angry" ||
    mood === "romantic" ||
    mood === "nostalgic" ||
    mood === "energetic" ||
    mood === "stressed"
  ) {
    return mood;
  }

  if (mood === "relax") return "calm";
  if (mood === "focus") return "calm";

  return "calm";
}

function emotionToTheme(emotion: string) {
  if (emotion === "happy") return "green";
  if (emotion === "sad") return "blue";
  if (emotion === "angry") return "red";
  if (emotion === "romantic") return "pink";
  if (emotion === "nostalgic") return "sepia";
  if (emotion === "energetic") return "violet";
  if (emotion === "stressed") return "blue";

  return "cyan";
}

function apiSongToPlayerSong(song: ApiSong): PlayerSong {
  const emotion = normalizeEmotion(song.mood || song.emotion);
  const theme = emotionToTheme(emotion);

  return {
    id: song.id,
    title: song.title || "Không rõ tên bài hát",
    artist: song.artist || "Unknown Artist",
    album: "Backend Library",
    duration: Number(song.duration || 0),

    theme,
    emotion,
    mood: emotion,

    coverUrl: song.cover_image
      ? getAssetUrl(song.cover_image)
      : "/placeholder.svg",

    audioUrl: getAssetUrl(song.audio_url),

    palette: themePalette[theme],

    lyricsVi: [],
    lyricsEn: [],
    relatedSongIds: [],
  } as PlayerSong;
}

export default function SongCard({ song }: SongCardProps) {
  const { nowPlaying, isPlaying, setNowPlaying, setIsPlaying } = useTheme();

  const isCurrentSong = nowPlaying?.id === song.id;
  const isCurrentSongPlaying = isCurrentSong && isPlaying;

  function handlePlay() {
    const playerSong = apiSongToPlayerSong(song);

    if (!playerSong.audioUrl) return;

    if (isCurrentSong) {
      setIsPlaying(!isPlaying);
      return;
    }

    setNowPlaying(playerSong);

    /**
     * Delay rất nhỏ để ThemeProvider kịp đổi audio.src
     * rồi mới gọi play.
     */
    setTimeout(() => {
      setIsPlaying(true);
    }, 0);
  }

  return (
    <article
      className={[
        "group overflow-hidden rounded-3xl border p-4 transition duration-300",
        "bg-[#070b12]/90 shadow-[0_18px_50px_rgba(0,0,0,0.35)]",
        "hover:-translate-y-1 hover:border-emerald-400/40 hover:shadow-[0_22px_60px_rgba(16,185,129,0.12)]",
        isCurrentSong ? "border-emerald-400/60" : "border-white/10",
      ].join(" ")}
    >
      <div className="relative overflow-hidden rounded-2xl bg-white/5">
        <img
          src={
            song.cover_image
              ? getAssetUrl(song.cover_image)
              : "/placeholder.svg"
          }
          alt={song.title}
          className="aspect-square w-full object-cover transition duration-500 group-hover:scale-105"
          onError={(event) => {
            event.currentTarget.src = "/placeholder.svg";
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

        <button
          type="button"
          onClick={handlePlay}
          className={[
            "absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center",
            "rounded-full bg-white text-black shadow-[0_18px_40px_rgba(0,0,0,0.45)]",
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
          {song.title}
        </h3>

        <p className="mt-1 line-clamp-1 text-sm text-white/55">
          {song.artist || "Unknown Artist"}
        </p>

        <div className="mt-3 flex items-center justify-between gap-2">
          <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs capitalize text-white/55">
            {song.mood || song.emotion || "unknown"}
          </span>

          <button
            type="button"
            onClick={handlePlay}
            className={[
              "flex h-9 w-9 items-center justify-center rounded-full transition",
              isCurrentSongPlaying
                ? "bg-emerald-400 text-black"
                : "bg-white/10 text-white hover:bg-white hover:text-black",
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
