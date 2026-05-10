import { toImageUrl, toMediaUrl } from "@/lib/api-client";
import {
  type Emotion,
  type Song,
  type SongTheme,
  themePalette,
} from "@/lib/duLieuGiaLap";

export type NlpEmotion = "happy" | "sad" | "angry" | "relaxed";

export type EmotionProbabilities = Record<NlpEmotion, number>;

export interface RecommendedTrack {
  id: number;
  title: string;
  artist: string;
  audio_url?: string | null;
  duration?: number | null;
  emotion?: string | null;
  emotion_label_vi?: string | null;
  mood?: string | null;
  cover_image?: string | null;
  lyrics?: string | null;
  emotion_scores?: Record<string, number> | null;
  recommendation_score: number;
  matched_mood?: string | null;
}

export interface EmotionDetectResponse {
  emotion: NlpEmotion;
  confidence: number;
  confidencePercent: number;
  probabilities: EmotionProbabilities;
  recommendedSongs: RecommendedTrack[];
  autoPlaySong: RecommendedTrack | null;
  rationale: string | null;
}

type BackendEmotionResponse = {
  label?: string | null;
  valence?: number | null;
  arousal?: number | null;
  confidence?: number | null;
  per_modality?: Record<string, unknown> | null;
};

type LyricsMoodResult = {
  mood: string;
  confidence: number;
  matched_keywords?: string[];
  sentiment?: number;
};

type LyricsMoodResponse = {
  moods?: LyricsMoodResult[];
  language?: "auto" | "en" | "vi";
  algorithm?: string;
};

type RecommendationResponse = {
  tracks?: Array<Partial<RecommendedTrack>>;
  rationale?: string | null;
};

type TrackResponse = {
  id: number;
  title: string;
  artist: string;
  audio_url?: string | null;
  duration?: number | null;
  emotion?: string | null;
  emotion_label_vi?: string | null;
  mood?: string | null;
  cover_image?: string | null;
  lyrics?: string | null;
  emotion_scores?: Record<string, number> | null;
};

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000"
).replace(/\/$/, "");

const TOKEN_STORAGE_KEY = "moodsync_access_token";

const THEME_BY_EMOTION: Record<Emotion, SongTheme> = {
  happy: "green",
  sad: "blue",
  calm: "cyan",
  angry: "red",
  romantic: "pink",
  nostalgic: "sepia",
  energetic: "violet",
  stressed: "red",
};

export const NLP_EMOTION_LABELS: Record<
  NlpEmotion,
  { vi: string; en: string }
> = {
  happy: { vi: "Vui vẻ", en: "Happy" },
  sad: { vi: "Buồn / cô đơn", en: "Sad" },
  angry: { vi: "Tức giận", en: "Angry" },
  relaxed: { vi: "Thư giãn", en: "Relaxed" },
};

const MOOD_ALIASES: Record<NlpEmotion, string[]> = {
  happy: [
    "happy",
    "joy",
    "enjoyment",
    "positive",
    "vui",
    "vui vẻ",
    "hạnh phúc",
    "yêu đời",
    "phấn khích",
    "tích cực",
    "green",
    "energetic",
  ],
  sad: [
    "sad",
    "sadness",
    "negative",
    "lonely",
    "buon",
    "buồn",
    "cô đơn",
    "đau lòng",
    "thất vọng",
    "khóc",
    "blue",
    "nostalgic",
  ],
  angry: [
    "angry",
    "anger",
    "disgust",
    "fear",
    "stressed",
    "stress",
    "tức",
    "giận",
    "bực",
    "khó chịu",
    "cáu",
    "căng thẳng",
    "tức giận",
    "red",
  ],
  relaxed: [
    "relaxed",
    "relax",
    "calm",
    "chill",
    "healing",
    "sleep",
    "thư giãn",
    "bình yên",
    "nhẹ nhàng",
    "êm dịu",
    "an yên",
    "cyan",
  ],
};

const LOCAL_KEYWORDS: Record<NlpEmotion, string[]> = {
  happy: [
    "vui",
    "vui vẻ",
    "hạnh phúc",
    "tuyệt",
    "tuyệt vời",
    "yêu đời",
    "phấn khích",
    "hào hứng",
    "tích cực",
    "cười",
    "happy",
    "joy",
    "joyful",
    "excited",
    "positive",
  ],
  sad: [
    "buồn",
    "cô đơn",
    "đau lòng",
    "thất vọng",
    "mệt mỏi",
    "chán nản",
    "khóc",
    "lụy",
    "nhớ",
    "sad",
    "lonely",
    "cry",
    "tired",
    "depressed",
  ],
  angry: [
    "tức",
    "giận",
    "tức giận",
    "bực",
    "bực mình",
    "khó chịu",
    "cáu",
    "điên tiết",
    "phẫn nộ",
    "căng thẳng",
    "angry",
    "mad",
    "rage",
    "annoyed",
    "stress",
    "stressed",
  ],
  relaxed: [
    "thư giãn",
    "bình yên",
    "nhẹ nhàng",
    "êm dịu",
    "chill",
    "nghỉ ngơi",
    "an yên",
    "tĩnh lặng",
    "calm",
    "relax",
    "relaxed",
    "peaceful",
    "sleep",
    "healing",
  ],
};

function getToken() {
  if (typeof window === "undefined") return null;

  return (
    localStorage.getItem(TOKEN_STORAGE_KEY) ||
    localStorage.getItem("access_token")
  );
}

async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    cache: "no-store",
    ...init,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `API lỗi: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

function normalizeNlpEmotion(value?: string | null): NlpEmotion {
  const raw = (value || "relaxed").toLowerCase().trim();

  for (const [emotion, aliases] of Object.entries(MOOD_ALIASES) as Array<
    [NlpEmotion, string[]]
  >) {
    if (aliases.includes(raw)) return emotion;
  }

  if (
    raw.includes("vui") ||
    raw.includes("happy") ||
    raw.includes("joy") ||
    raw.includes("positive")
  ) {
    return "happy";
  }

  if (
    raw.includes("buồn") ||
    raw.includes("sad") ||
    raw.includes("lonely") ||
    raw.includes("cô đơn")
  ) {
    return "sad";
  }

  if (
    raw.includes("angry") ||
    raw.includes("stress") ||
    raw.includes("căng") ||
    raw.includes("giận") ||
    raw.includes("bực") ||
    raw.includes("khó chịu")
  ) {
    return "angry";
  }

  return "relaxed";
}

function detectLocalEmotion(text: string): {
  emotion: NlpEmotion | null;
  confidence: number;
  scores: Record<NlpEmotion, number>;
} {
  const raw = text.toLowerCase();

  const scores: Record<NlpEmotion, number> = {
    happy: 0,
    sad: 0,
    angry: 0,
    relaxed: 0,
  };

  for (const [emotion, keywords] of Object.entries(LOCAL_KEYWORDS) as Array<
    [NlpEmotion, string[]]
  >) {
    for (const keyword of keywords) {
      if (raw.includes(keyword.toLowerCase())) {
        scores[emotion] += 1;
      }
    }
  }

  const sorted = (Object.entries(scores) as Array<[NlpEmotion, number]>).sort(
    (a, b) => b[1] - a[1],
  );

  const [topEmotion, topScore] = sorted[0];

  if (topScore <= 0) {
    return {
      emotion: null,
      confidence: 0,
      scores,
    };
  }

  const total = Object.values(scores).reduce((sum, value) => sum + value, 0);
  const confidence = Math.max(0.65, Math.min(0.95, topScore / total));

  return {
    emotion: topEmotion,
    confidence,
    scores,
  };
}

function confidenceToUnit(value?: number | null) {
  const numeric = Number(value ?? 0);

  if (!Number.isFinite(numeric)) return 0;
  if (numeric > 1) return Math.max(0, Math.min(1, numeric / 100));

  return Math.max(0, Math.min(1, numeric));
}

function buildProbabilities(
  emotion: NlpEmotion,
  confidence: number,
): EmotionProbabilities {
  const safeConfidence = Math.max(0.25, Math.min(0.98, confidence || 0.75));
  const rest = Math.max(0, 1 - safeConfidence) / 3;

  return {
    happy: emotion === "happy" ? safeConfidence : rest,
    sad: emotion === "sad" ? safeConfidence : rest,
    angry: emotion === "angry" ? safeConfidence : rest,
    relaxed: emotion === "relaxed" ? safeConfidence : rest,
  };
}

function isMoodMatch(
  trackMood: string | null | undefined,
  emotion: NlpEmotion,
) {
  const raw = (trackMood || "").toLowerCase().trim();
  if (!raw) return false;

  return MOOD_ALIASES[emotion].some((alias) => {
    const normalizedAlias = alias.toLowerCase();
    return raw === normalizedAlias || raw.includes(normalizedAlias);
  });
}

function normalizeTrack(
  track: Partial<RecommendedTrack> | TrackResponse,
  index: number,
  emotion: NlpEmotion,
  baseScore = 95,
): RecommendedTrack {
  const mood = track.mood ?? track.emotion ?? emotion;
  const matched = isMoodMatch(mood, emotion);

  return {
    id: Number(track.id ?? index + 1),
    title: track.title || "Không rõ tên bài hát",
    artist: track.artist || "Unknown Artist",
    audio_url: track.audio_url ?? null,
    duration: track.duration ?? null,
    emotion: track.emotion ?? mood,
    emotion_label_vi: track.emotion_label_vi ?? null,
    mood,
    cover_image: track.cover_image ?? null,
    lyrics: track.lyrics ?? null,
    emotion_scores: track.emotion_scores ?? null,
    recommendation_score: Number(
      track.recommendation_score ??
        Math.max(35, (matched ? baseScore : 55) - index * 5),
    ),
    matched_mood: track.matched_mood ?? mood,
  };
}

function rankTracksByMood(tracks: RecommendedTrack[], emotion: NlpEmotion) {
  return [...tracks].sort((a, b) => {
    const aMatched = isMoodMatch(a.mood ?? a.emotion, emotion) ? 1 : 0;
    const bMatched = isMoodMatch(b.mood ?? b.emotion, emotion) ? 1 : 0;

    if (aMatched !== bMatched) {
      return bMatched - aMatched;
    }

    return (b.recommendation_score || 0) - (a.recommendation_score || 0);
  });
}

function mergeUniqueTracks(
  first: RecommendedTrack[],
  second: RecommendedTrack[],
) {
  const map = new Map<number, RecommendedTrack>();

  for (const track of [...first, ...second]) {
    if (!map.has(track.id)) {
      map.set(track.id, track);
    }
  }

  return Array.from(map.values());
}

async function detectBackendEmotion(
  text: string,
  token: string,
): Promise<BackendEmotionResponse | null> {
  try {
    return await fetchJson<BackendEmotionResponse>("/api/emotion/detect", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        text,
      }),
    });
  } catch {
    return null;
  }
}

async function analyzeLyricsMood(
  text: string,
): Promise<LyricsMoodResult | null> {
  try {
    const response = await fetchJson<LyricsMoodResponse>(
      "/lyrics-mood/analyze",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lyrics: text,
          language: "auto",
          top_k: 3,
        }),
      },
    );

    const moods = Array.isArray(response.moods) ? response.moods : [];
    return moods[0] ?? null;
  } catch {
    return null;
  }
}

async function getBackendRecommendations(
  emotion: NlpEmotion,
  confidence: number,
  limit: number,
  token: string,
  rawEmotion: BackendEmotionResponse | null,
): Promise<{
  tracks: RecommendedTrack[];
  rationale: string | null;
}> {
  try {
    const response = await fetchJson<RecommendationResponse>("/recommend/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        user_id: 0,
        emotion_state: {
          label: emotion,
          emotion,
          mood: emotion,
          confidence,
          valence: rawEmotion?.valence ?? 0,
          arousal: rawEmotion?.arousal ?? 0,
        },
        limit,
      }),
    });

    const tracks = Array.isArray(response.tracks)
      ? response.tracks.map((track, index) =>
          normalizeTrack(track, index, emotion),
        )
      : [];

    return {
      tracks: rankTracksByMood(tracks, emotion),
      rationale: response.rationale ?? null,
    };
  } catch {
    return {
      tracks: [],
      rationale: null,
    };
  }
}

async function getTracksByMood(
  emotion: NlpEmotion,
  limit: number,
): Promise<RecommendedTrack[]> {
  try {
    const tracks = await fetchJson<TrackResponse[]>("/tracks/");

    const normalized = tracks.map((track, index) =>
      normalizeTrack(track, index, emotion),
    );

    return rankTracksByMood(normalized, emotion).slice(0, limit);
  } catch {
    return [];
  }
}

function hasAnyMoodMatch(tracks: RecommendedTrack[], emotion: NlpEmotion) {
  return tracks.some((track) =>
    isMoodMatch(track.mood ?? track.emotion, emotion),
  );
}

export function emotionNameLabel(
  emotion: NlpEmotion,
  language: "vi" | "en" = "vi",
) {
  return NLP_EMOTION_LABELS[emotion]?.[language] ?? emotion;
}

export function toUiEmotion(value?: string | null): Emotion {
  const raw = (value || "calm").toLowerCase().trim();

  if (["happy", "joy", "enjoyment", "positive", "vui"].includes(raw)) {
    return "happy";
  }

  if (["sad", "sadness", "negative", "lonely", "buon", "buồn"].includes(raw)) {
    return "sad";
  }

  if (
    [
      "angry",
      "anger",
      "disgust",
      "fear",
      "stressed",
      "stress",
      "căng thẳng",
    ].includes(raw)
  ) {
    return "angry";
  }

  if (["energetic", "energy", "focus", "workout", "năng động"].includes(raw)) {
    return "energetic";
  }

  if (["romantic", "love", "lãng mạn"].includes(raw)) {
    return "romantic";
  }

  if (["nostalgic", "hoài niệm"].includes(raw)) {
    return "nostalgic";
  }

  if (
    [
      "relaxed",
      "relax",
      "calm",
      "healing",
      "sleep",
      "chill",
      "thư giãn",
      "bình yên",
    ].includes(raw)
  ) {
    return "calm";
  }

  return "calm";
}

export function recommendedTrackToSong(track: RecommendedTrack): Song {
  const uiEmotion = toUiEmotion(track.mood ?? track.emotion);
  const theme = THEME_BY_EMOTION[uiEmotion] ?? "cyan";
  const confidence = Math.round(track.recommendation_score || 0);

  const lyricsText = track.lyrics ?? null;

  const lyricsLines = lyricsText
    ? lyricsText
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean)
    : [];

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

    // Quan trọng: player/dashboard đang cần field lyrics dạng string.
    lyrics: lyricsText,

    // Giữ thêm lyricsVi để các component khác vẫn dùng được nếu cần.
    lyricsVi: lyricsLines,
    lyricsEn: [],
    relatedSongIds: [],
  };
}

export async function detectTextEmotion(
  text: string,
  limit = 10,
): Promise<EmotionDetectResponse> {
  const cleanText = text.trim();

  if (!cleanText) {
    throw new Error("Vui lòng nhập nội dung trước khi phân tích.");
  }

  const token = getToken();

  if (!token) {
    throw new Error("Bạn cần đăng nhập trước khi nhận diện cảm xúc.");
  }

  const localEmotion = detectLocalEmotion(cleanText);

  const [backendEmotionResponse, lyricsMood] = await Promise.all([
    detectBackendEmotion(cleanText, token),
    analyzeLyricsMood(cleanText),
  ]);

  const backendEmotion = normalizeNlpEmotion(backendEmotionResponse?.label);
  const backendConfidence = confidenceToUnit(
    backendEmotionResponse?.confidence,
  );

  const lyricsEmotion = lyricsMood?.mood
    ? normalizeNlpEmotion(lyricsMood.mood)
    : null;

  const lyricsConfidence = confidenceToUnit(lyricsMood?.confidence);
  const lyricsMatchedKeywords = lyricsMood?.matched_keywords ?? [];

  const isDefaultLyricsRelax =
    lyricsEmotion === "relaxed" &&
    lyricsConfidence <= 0.45 &&
    lyricsMatchedKeywords.length === 0;

  let finalEmotion: NlpEmotion;
  let finalConfidence: number;
  let source: "local" | "backend" | "lyrics";

  if (localEmotion.emotion) {
    finalEmotion = localEmotion.emotion;
    finalConfidence = localEmotion.confidence;
    source = "local";
  } else if (backendEmotionResponse?.label) {
    finalEmotion = backendEmotion;
    finalConfidence = backendConfidence || 0.75;
    source = "backend";
  } else if (lyricsEmotion && !isDefaultLyricsRelax) {
    finalEmotion = lyricsEmotion;
    finalConfidence = lyricsConfidence || 0.65;
    source = "lyrics";
  } else {
    finalEmotion = "relaxed";
    finalConfidence = 0.65;
    source = "local";
  }

  const [backendRecommendation, localTracks] = await Promise.all([
    getBackendRecommendations(
      finalEmotion,
      finalConfidence,
      limit,
      token,
      backendEmotionResponse,
    ),
    getTracksByMood(finalEmotion, limit),
  ]);

  const preferLocalTracks =
    localTracks.length > 0 && hasAnyMoodMatch(localTracks, finalEmotion);

  const mergedTracks = preferLocalTracks
    ? mergeUniqueTracks(localTracks, backendRecommendation.tracks)
    : mergeUniqueTracks(backendRecommendation.tracks, localTracks);

  const recommendedSongs = rankTracksByMood(mergedTracks, finalEmotion).slice(
    0,
    limit,
  );

  if (process.env.NODE_ENV !== "production") {
    console.log("[detectTextEmotion]", {
      source,
      localEmotion,
      backendEmotion,
      backendConfidence,
      lyricsEmotion,
      lyricsConfidence,
      lyricsMatchedKeywords,
      finalEmotion,
      finalConfidence,
      recommendedSongs: recommendedSongs.map((song) => ({
        title: song.title,
        mood: song.mood,
        emotion: song.emotion,
        score: song.recommendation_score,
      })),
    });
  }

  return {
    emotion: finalEmotion,
    confidence: finalConfidence,
    confidencePercent: Math.round(finalConfidence * 100),
    probabilities: buildProbabilities(finalEmotion, finalConfidence),
    recommendedSongs,
    autoPlaySong: recommendedSongs[0] ?? null,
    rationale:
      backendRecommendation.rationale ??
      (lyricsMood && !isDefaultLyricsRelax
        ? `Mood lyrics: ${lyricsMood.mood}.`
        : `Đề xuất theo cảm xúc ${finalEmotion}.`),
  };
}
