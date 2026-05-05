import type { Emotion, Song, SongTheme } from "@/lib/duLieuGiaLap";
import { themePalette } from "@/lib/duLieuGiaLap";
import type { UiTrack } from "@/lib/tracks-api";

const VALID_EMOTIONS: Emotion[] = [
  "happy",
  "sad",
  "calm",
  "angry",
  "romantic",
  "nostalgic",
  "energetic",
  "stressed",
];

const EMOTION_THEME_MAP: Record<Emotion, SongTheme> = {
  happy: "green",
  sad: "blue",
  calm: "cyan",
  angry: "red",
  romantic: "pink",
  nostalgic: "sepia",
  energetic: "violet",
  stressed: "blue",
};

export function normalizeEmotion(value?: string | null): Emotion {
  const raw = value?.toLowerCase().trim();

  if (!raw) return "calm";

  if (VALID_EMOTIONS.includes(raw as Emotion)) {
    return raw as Emotion;
  }

  // mood cũ / mood CRUD tự thêm
  if (raw === "relax") return "calm";
  if (raw === "focus") return "calm";

  return "calm";
}

export function uiTrackToSong(track: UiTrack): Song {
  const emotion = normalizeEmotion(track.emotion);
  const theme = EMOTION_THEME_MAP[emotion];

  return {
    id: track.id,
    title: track.title || "Không rõ tên bài hát",
    artist: track.artist || "Unknown Artist",
    album: "Backend Library",
    duration: Number(track.duration || 0),
    theme,
    coverUrl: track.coverUrl || "/placeholder.svg",
    audioUrl: track.audioUrl,
    emotion,
    mood: emotion,
    palette: themePalette[theme],
    lyricsVi: [],
    lyricsEn: [],
    relatedSongIds: [],
  };
}
