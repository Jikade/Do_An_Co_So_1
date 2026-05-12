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

type LocalEmotionResult = {
  emotion: NlpEmotion | null;
  confidence: number;
  scores: EmotionProbabilities;
  probabilities: EmotionProbabilities;
  matchedKeywords: Record<NlpEmotion, string[]>;
};

type KeywordRule = {
  keyword: string;
  weight: number;
};

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL || "/api-backend"
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
    "buồn chán",
    "chán",
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

// Bản mới dùng trọng số theo cụm từ, không ép cảm xúc đứng đầu tối thiểu 65%.
// Những câu pha trộn như "vui ... nhưng cũng cô đơn và buồn" sẽ cho phân phối happy/sad gần nhau.
const LOCAL_KEYWORDS: Record<NlpEmotion, KeywordRule[]> = {
  happy: [
    { keyword: "vui vẻ", weight: 2.2 },
    { keyword: "hạnh phúc", weight: 2.4 },
    { keyword: "tuyệt vời", weight: 2 },
    { keyword: "yêu đời", weight: 1.8 },
    { keyword: "phấn khích", weight: 1.8 },
    { keyword: "hào hứng", weight: 1.8 },
    { keyword: "tích cực", weight: 1.5 },
    { keyword: "vui", weight: 1.2 },
    { keyword: "tuyệt", weight: 1.2 },
    { keyword: "cười", weight: 1.1 },
    { keyword: "happy", weight: 1.5 },
    { keyword: "joy", weight: 1.5 },
    { keyword: "joyful", weight: 1.6 },
    { keyword: "excited", weight: 1.5 },
    { keyword: "positive", weight: 1.2 },
  ],
  sad: [
    { keyword: "buồn chán", weight: 2.4 },
    { keyword: "cô đơn", weight: 2.3 },
    { keyword: "đau lòng", weight: 2 },
    { keyword: "thất vọng", weight: 1.8 },
    { keyword: "mệt mỏi", weight: 1.4 },
    { keyword: "chán nản", weight: 1.8 },
    { keyword: "tủi thân", weight: 1.8 },
    { keyword: "trống rỗng", weight: 1.7 },
    { keyword: "buồn", weight: 1.4 },
    { keyword: "chán", weight: 1.2 },
    { keyword: "khóc", weight: 1.4 },
    { keyword: "lụy", weight: 1.2 },
    { keyword: "nhớ", weight: 0.9 },
    { keyword: "sad", weight: 1.5 },
    { keyword: "lonely", weight: 1.8 },
    { keyword: "cry", weight: 1.2 },
    { keyword: "tired", weight: 1.1 },
    { keyword: "depressed", weight: 1.8 },
  ],
  angry: [
    { keyword: "tức giận", weight: 2.4 },
    { keyword: "bực mình", weight: 2 },
    { keyword: "khó chịu", weight: 1.8 },
    { keyword: "điên tiết", weight: 2.2 },
    { keyword: "phẫn nộ", weight: 2.2 },
    { keyword: "căng thẳng", weight: 1.7 },
    { keyword: "tức", weight: 1.2 },
    { keyword: "giận", weight: 1.4 },
    { keyword: "bực", weight: 1.2 },
    { keyword: "cáu", weight: 1.1 },
    { keyword: "angry", weight: 1.5 },
    { keyword: "mad", weight: 1.3 },
    { keyword: "rage", weight: 1.8 },
    { keyword: "annoyed", weight: 1.4 },
    { keyword: "stress", weight: 1.2 },
    { keyword: "stressed", weight: 1.3 },
  ],
  relaxed: [
    { keyword: "thư giãn", weight: 2.2 },
    { keyword: "bình yên", weight: 2 },
    { keyword: "nhẹ nhàng", weight: 1.8 },
    { keyword: "êm dịu", weight: 1.7 },
    { keyword: "nghỉ ngơi", weight: 1.5 },
    { keyword: "an yên", weight: 1.8 },
    { keyword: "tĩnh lặng", weight: 1.5 },
    { keyword: "chill", weight: 1.4 },
    { keyword: "calm", weight: 1.5 },
    { keyword: "relax", weight: 1.4 },
    { keyword: "relaxed", weight: 1.5 },
    { keyword: "peaceful", weight: 1.5 },
    { keyword: "sleep", weight: 1.2 },
    { keyword: "healing", weight: 1.2 },
  ],
};

const CONTRAST_MARKERS = [
  "nhưng",
  "nhung",
  "tuy nhiên",
  "tuy nhien",
  "dù vậy",
  "du vay",
  "song",
  "but",
  "however",
];
const EMOTION_ORDER: NlpEmotion[] = ["happy", "sad", "angry", "relaxed"];

function getToken() {
  if (typeof window === "undefined") return null;
  return (
    localStorage.getItem(TOKEN_STORAGE_KEY) ||
    localStorage.getItem("access_token")
  );
}

async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getToken();
  const headers = new Headers(init?.headers);

  if (!headers.has("Content-Type") && init?.body) {
    headers.set("Content-Type", "application/json");
  }

  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    cache: "no-store",
    ...init,
    headers,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `API lỗi: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

function normalizeVietnameseText(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeNlpEmotion(value?: string | null): NlpEmotion {
  const raw = normalizeVietnameseText(value || "relaxed");

  for (const [emotion, aliases] of Object.entries(MOOD_ALIASES) as Array<
    [NlpEmotion, string[]]
  >) {
    if (aliases.some((alias) => normalizeVietnameseText(alias) === raw))
      return emotion;
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
    raw.includes("buon") ||
    raw.includes("sad") ||
    raw.includes("lonely") ||
    raw.includes("co don")
  ) {
    return "sad";
  }

  if (
    raw.includes("angry") ||
    raw.includes("stress") ||
    raw.includes("cang") ||
    raw.includes("gian") ||
    raw.includes("buc") ||
    raw.includes("kho chiu")
  ) {
    return "angry";
  }

  return "relaxed";
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function isRangeOverlapped(
  start: number,
  end: number,
  ranges: Array<[number, number]>,
) {
  return ranges.some(
    ([usedStart, usedEnd]) => start < usedEnd && end > usedStart,
  );
}

function scoreKeywordRules(text: string, rules: KeywordRule[]) {
  const normalizedText = normalizeVietnameseText(text);
  const usedRanges: Array<[number, number]> = [];
  const matchedKeywords: string[] = [];
  let score = 0;

  const sortedRules = [...rules].sort(
    (a, b) =>
      normalizeVietnameseText(b.keyword).length -
      normalizeVietnameseText(a.keyword).length,
  );

  for (const rule of sortedRules) {
    const normalizedKeyword = normalizeVietnameseText(rule.keyword);
    if (!normalizedKeyword) continue;

    const regex = new RegExp(
      `(?:^|\\s)(${escapeRegExp(normalizedKeyword)})(?=\\s|$)`,
      "g",
    );
    let match: RegExpExecArray | null;

    while ((match = regex.exec(normalizedText)) !== null) {
      const start = match.index + match[0].length - match[1].length;
      const end = start + match[1].length;

      if (!isRangeOverlapped(start, end, usedRanges)) {
        usedRanges.push([start, end]);
        matchedKeywords.push(rule.keyword);
        score += rule.weight;
      }
    }
  }

  return { score, matchedKeywords };
}

function getContrastTail(text: string) {
  const normalized = normalizeVietnameseText(text);

  for (const marker of CONTRAST_MARKERS) {
    const normalizedMarker = normalizeVietnameseText(marker);
    const index = normalized.indexOf(` ${normalizedMarker} `);

    if (index >= 0) {
      return normalized.slice(index + normalizedMarker.length + 2).trim();
    }
  }

  return "";
}

function emptyProbabilities(): EmotionProbabilities {
  return { happy: 0, sad: 0, angry: 0, relaxed: 0 };
}

function normalizeScoresToProbabilities(
  scores: EmotionProbabilities,
): EmotionProbabilities {
  const rawTotal = EMOTION_ORDER.reduce(
    (sum, emotion) => sum + scores[emotion],
    0,
  );

  if (rawTotal <= 0) {
    return { happy: 0.25, sad: 0.25, angry: 0.25, relaxed: 0.25 };
  }

  const smoothing = 0.08;
  const dampedScores = EMOTION_ORDER.reduce((acc, emotion) => {
    acc[emotion] = Math.sqrt(Math.max(0, scores[emotion]));
    return acc;
  }, emptyProbabilities());

  const total = EMOTION_ORDER.reduce(
    (sum, emotion) => sum + dampedScores[emotion] + smoothing,
    0,
  );

  return EMOTION_ORDER.reduce((acc, emotion) => {
    acc[emotion] = (dampedScores[emotion] + smoothing) / total;
    return acc;
  }, emptyProbabilities());
}

function buildProbabilitiesFromConfidence(
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

function detectLocalEmotion(text: string): LocalEmotionResult {
  const scores = emptyProbabilities();
  const matchedKeywords: Record<NlpEmotion, string[]> = {
    happy: [],
    sad: [],
    angry: [],
    relaxed: [],
  };

  for (const [emotion, rules] of Object.entries(LOCAL_KEYWORDS) as Array<
    [NlpEmotion, KeywordRule[]]
  >) {
    const result = scoreKeywordRules(text, rules);
    scores[emotion] += result.score;
    matchedKeywords[emotion].push(...result.matchedKeywords);
  }

  const contrastTail = getContrastTail(text);

  if (contrastTail) {
    for (const [emotion, rules] of Object.entries(LOCAL_KEYWORDS) as Array<
      [NlpEmotion, KeywordRule[]]
    >) {
      const result = scoreKeywordRules(contrastTail, rules);
      scores[emotion] += result.score * 0.25;
    }
  }

  const probabilities = normalizeScoresToProbabilities(scores);
  const sorted = (
    Object.entries(probabilities) as Array<[NlpEmotion, number]>
  ).sort((a, b) => b[1] - a[1]);
  const [topEmotion, topProbability] = sorted[0];
  const totalScore = EMOTION_ORDER.reduce(
    (sum, emotion) => sum + scores[emotion],
    0,
  );

  if (totalScore <= 0) {
    return {
      emotion: null,
      confidence: 0,
      scores,
      probabilities,
      matchedKeywords,
    };
  }

  return {
    emotion: topEmotion,
    confidence: topProbability,
    scores,
    probabilities,
    matchedKeywords,
  };
}

function confidenceToUnit(value?: number | null) {
  const numeric = Number(value ?? 0);
  if (!Number.isFinite(numeric)) return 0;
  if (numeric > 1) return Math.max(0, Math.min(1, numeric / 100));
  return Math.max(0, Math.min(1, numeric));
}

function isMoodMatch(
  trackMood: string | null | undefined,
  emotion: NlpEmotion,
) {
  const raw = normalizeVietnameseText(trackMood || "");
  if (!raw) return false;

  return MOOD_ALIASES[emotion].some((alias) => {
    const normalizedAlias = normalizeVietnameseText(alias);
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
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ text }),
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
): Promise<{ tracks: RecommendedTrack[]; rationale: string | null }> {
  try {
    const response = await fetchJson<RecommendationResponse>("/recommend/", {
      method: "POST",
      headers: {
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
    return { tracks: [], rationale: null };
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

function buildMixedEmotionRationale(
  localEmotion: LocalEmotionResult,
  fallback: string,
) {
  const rows = (
    Object.entries(localEmotion.probabilities) as Array<[NlpEmotion, number]>
  )
    .filter(([, probability]) => probability >= 0.12)
    .sort((a, b) => b[1] - a[1])
    .map(
      ([emotion, probability]) =>
        `${NLP_EMOTION_LABELS[emotion].vi}: ${Math.round(probability * 100)}%`,
    );

  if (rows.length >= 2) {
    return `Câu có nhiều sắc thái cảm xúc: ${rows.join(", ")}.`;
  }

  return fallback;
}

export function emotionNameLabel(
  emotion: NlpEmotion,
  language: "vi" | "en" = "vi",
) {
  return NLP_EMOTION_LABELS[emotion]?.[language] ?? emotion;
}

export function toUiEmotion(value?: string | null): Emotion {
  const raw = normalizeVietnameseText(value || "calm");

  if (["happy", "joy", "enjoyment", "positive", "vui"].includes(raw)) {
    return "happy";
  }

  if (
    ["sad", "sadness", "negative", "lonely", "buon", "co don"].includes(raw)
  ) {
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
      "cang thang",
    ].includes(raw)
  ) {
    return "angry";
  }

  if (["energetic", "energy", "focus", "workout", "nang dong"].includes(raw)) {
    return "energetic";
  }

  if (["romantic", "love", "lang man"].includes(raw)) {
    return "romantic";
  }

  if (["nostalgic", "hoai niem"].includes(raw)) {
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
      "thu gian",
      "binh yen",
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
    lyrics: lyricsText,
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
  let finalProbabilities: EmotionProbabilities;
  let source: "local" | "backend" | "lyrics";

  if (localEmotion.emotion) {
    finalEmotion = localEmotion.emotion;
    finalConfidence = localEmotion.confidence;
    finalProbabilities = localEmotion.probabilities;
    source = "local";
  } else if (backendEmotionResponse?.label) {
    finalEmotion = backendEmotion;
    finalConfidence = backendConfidence || 0.75;
    finalProbabilities = buildProbabilitiesFromConfidence(
      finalEmotion,
      finalConfidence,
    );
    source = "backend";
  } else if (lyricsEmotion && !isDefaultLyricsRelax) {
    finalEmotion = lyricsEmotion;
    finalConfidence = lyricsConfidence || 0.65;
    finalProbabilities = buildProbabilitiesFromConfidence(
      finalEmotion,
      finalConfidence,
    );
    source = "lyrics";
  } else {
    finalEmotion = "relaxed";
    finalConfidence = 0.65;
    finalProbabilities = buildProbabilitiesFromConfidence(
      finalEmotion,
      finalConfidence,
    );
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
      finalProbabilities,
      recommendedSongs: recommendedSongs.map((song) => ({
        title: song.title,
        mood: song.mood,
        emotion: song.emotion,
        score: song.recommendation_score,
      })),
    });
  }

  const fallbackRationale =
    backendRecommendation.rationale ??
    (lyricsMood && !isDefaultLyricsRelax
      ? `Mood lyrics: ${lyricsMood.mood}.`
      : `Đề xuất theo cảm xúc ${finalEmotion}.`);

  return {
    emotion: finalEmotion,
    confidence: finalConfidence,
    confidencePercent: Math.round(finalConfidence * 100),
    probabilities: finalProbabilities,
    recommendedSongs,
    autoPlaySong: recommendedSongs[0] ?? null,
    rationale:
      source === "local"
        ? buildMixedEmotionRationale(localEmotion, fallbackRationale)
        : fallbackRationale,
  };
}
