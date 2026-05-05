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
    id: String(song.id),
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
    lyrics: song.lyrics ?? null,
    lyricsVi: [],
    lyricsEn: [],
    relatedSongIds: [],
  } as PlayerSong;
}

export default function SongCard({ song }: SongCardProps) {
  const { nowPlaying, isPlaying, setNowPlaying, setIsPlaying } = useTheme();

  const isCurrentSong = nowPlaying?.id === String(song.id);
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
    <article className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-4 shadow-sm transition hover:bg-white/[0.08]">
      <button
        type="button"
        onClick={handlePlay}
        className="absolute inset-0 z-10"
        aria-label={isCurrentSongPlaying ? "Tạm dừng" : "Phát nhạc"}
      />

      <div className="relative z-0">
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted">
          <img
            src={
              song.cover_image
                ? getAssetUrl(song.cover_image)
                : "/placeholder.svg"
            }
            alt={song.title}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            onError={(event) => {
              event.currentTarget.src = "/placeholder.svg";
            }}
          />

          <div className="absolute inset-0 flex items-center justify-center bg-black/25 opacity-0 transition group-hover:opacity-100">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-black shadow-lg">
              {isCurrentSongPlaying ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5 fill-current" />
              )}
            </div>
          </div>
        </div>

        <div className="mt-3">
          <h3 className="line-clamp-1 font-semibold">{song.title}</h3>
          <p className="line-clamp-1 text-sm text-muted-foreground">
            {song.artist || "Unknown Artist"}
          </p>

          <div className="mt-2 flex items-center justify-between gap-2">
            <span className="rounded-full bg-white/10 px-2 py-1 text-xs">
              {song.mood || song.emotion || "unknown"}
            </span>

            {isCurrentSongPlaying ? (
              <span className="text-xs text-green-500">Đang phát</span>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}
