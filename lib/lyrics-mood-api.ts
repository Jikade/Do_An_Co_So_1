import { apiPost } from "@/lib/api-client";

export type LyricsMoodSignal = {
  sentiment: number;
  keyword_hits: number;
  matched_keywords: string[];
};

export type LyricsMoodResult = {
  mood: string;
  confidence: number;
  signals?: LyricsMoodSignal;
};

export type LyricsMoodResponse = {
  moods: LyricsMoodResult[];
  language: "auto" | "en" | "vi";
  algorithm: string;
};

export async function suggestLyricsMoods(
  lyrics: string,
  topK = 3,
): Promise<LyricsMoodResponse> {
  return apiPost<LyricsMoodResponse>(
    "/lyrics-mood/analyze",
    {
      lyrics,
      language: "en",
      top_k: topK,
    },
    {
      auth: false,
    },
  );
}
