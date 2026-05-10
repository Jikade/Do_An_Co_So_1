import { API_BASE_URL } from "@/lib/api/songs";

export type LyricsMoodResult = {
  mood: string;
  confidence: number;
  matched_keywords: string[];
  sentiment: number;
};

export type LyricsMoodResponse = {
  moods: LyricsMoodResult[];
  language: "auto" | "en" | "vi";
  algorithm: string;
};

export async function analyzeLyricsMood(
  lyrics: string,
): Promise<LyricsMoodResponse> {
  const response = await fetch(`${API_BASE_URL}/lyrics-mood/analyze`, {
    method: "POST",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      lyrics,
      language: "en",
      top_k: 3,
    }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Không phân tích được mood từ lyrics");
  }

  return response.json();
}
