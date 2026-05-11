import { apiPost } from "@/lib/api-client";
import type { Song } from "@/lib/api/songs";

export type RecommendationResponse = {
  tracks: Song[];
  rationale?: string | null;
};

export function getPersonalRecommendations(
  limit = 24,
  emotionState: Record<string, unknown> = {},
) {
  return apiPost<RecommendationResponse>("/recommend/", {
    limit,
    emotion_state: emotionState,
  });
}
