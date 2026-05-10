import { apiPost, toImageUrl, toMediaUrl } from "@/lib/api-client"
import { type Emotion, type Song, type SongTheme, themePalette } from "@/lib/duLieuGiaLap"

export type NlpEmotion = "happy" | "sad" | "angry" | "relaxed"

export type EmotionProbabilities = Record<NlpEmotion, number>

export interface RecommendedTrack {
  id: number
  title: string
  artist: string
  audio_url?: string | null
  duration?: number | null
  emotion?: string | null
  emotion_label_vi?: string | null
  mood?: string | null
  cover_image?: string | null
  lyrics?: string | null
  emotion_scores?: Record<string, number> | null
  recommendation_score: number
  matched_mood?: string | null
}

export interface EmotionDetectResponse {
  emotion: NlpEmotion
  confidence: number
  confidencePercent: number
  probabilities: EmotionProbabilities
  recommendedSongs: RecommendedTrack[]
  autoPlaySong?: RecommendedTrack | null
  rationale?: string | null
}

const THEME_BY_EMOTION: Record<Emotion, SongTheme> = {
  happy: "green",
  sad: "blue",
  calm: "cyan",
  angry: "red",
  romantic: "pink",
  nostalgic: "sepia",
  energetic: "violet",
  stressed: "red",
}

export const NLP_EMOTION_LABELS: Record<NlpEmotion, { vi: string; en: string }> = {
  happy: { vi: "Vui vẻ", en: "Happy" },
  sad: { vi: "Buồn / cô đơn", en: "Sad" },
  angry: { vi: "Tức giận", en: "Angry" },
  relaxed: { vi: "Thư giãn", en: "Relaxed" },
}

export function emotionNameLabel(emotion: NlpEmotion, language: "vi" | "en" = "vi") {
  return NLP_EMOTION_LABELS[emotion]?.[language] ?? emotion
}

export function toUiEmotion(value?: string | null): Emotion {
  const raw = (value || "calm").toLowerCase().trim()

  if (["happy", "joy", "enjoyment", "positive", "vui"].includes(raw)) return "happy"
  if (["sad", "sadness", "negative", "lonely", "buon", "buồn"].includes(raw)) return "sad"
  if (["angry", "anger", "disgust", "fear", "stressed", "stress", "căng thẳng"].includes(raw)) return "angry"
  if (["energetic", "energy", "focus", "workout", "năng động"].includes(raw)) return "energetic"
  if (["romantic", "love", "lãng mạn"].includes(raw)) return "romantic"
  if (["nostalgic", "hoài niệm"].includes(raw)) return "nostalgic"
  if (["relaxed", "relax", "calm", "healing", "sleep", "chill", "thư giãn", "bình yên"].includes(raw)) return "calm"

  return "calm"
}

export function recommendedTrackToSong(track: RecommendedTrack): Song {
  const uiEmotion = toUiEmotion(track.mood ?? track.emotion)
  const theme = THEME_BY_EMOTION[uiEmotion] ?? "cyan"
  const confidence = Math.round(track.recommendation_score || 0)

  return {
    id: String(track.id),
    title: track.title || "Không rõ tên bài hát",
    artist: track.artist || "Unknown Artist",
    album: `AI score ${confidence}%`,
    duration: Number(track.duration || 0),
    theme,
    coverUrl: toImageUrl(track.cover_image || undefined),
    audioUrl: toMediaUrl(track.audio_url || undefined),
    emotion: uiEmotion,
    mood: uiEmotion,
    palette: themePalette[theme],
    lyricsVi: track.lyrics ? track.lyrics.split("\n").filter(Boolean) : [],
    lyricsEn: [],
    relatedSongIds: [],
  }
}

export async function detectTextEmotion(text: string, limit = 10) {
  return apiPost<EmotionDetectResponse>("/api/emotion/detect", { text, limit }, { auth: false })
}
