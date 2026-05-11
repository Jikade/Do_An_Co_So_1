import { apiDelete, apiGet, apiPost } from "@/lib/api-client";

export type HistoryAction = "listen" | "played" | "like" | "skip";

export type HistoryTrack = {
  id: number;
  title: string;
  artist: string;
  audio_url: string;
  duration: number;
  emotion?: string | null;
  mood?: string | null;
  cover_image?: string | null;
  lyrics?: string | null;
  emotion_scores?: Record<string, number> | null;
};

export type ListeningHistoryItem = {
  id: number;
  user_id: number;
  track_id: number;
  action: HistoryAction;
  listen_ms: number;
  emotion_state_at_time?: Record<string, unknown> | null;
  created_at: string;
  track: HistoryTrack;
};

export type CreateHistoryPayload = {
  track_id: number;
  listen_ms?: number;
  emotion_state_at_time?: Record<string, unknown> | null;
};

export function getListeningHistory(limit = 100) {
  return apiGet<ListeningHistoryItem[]>(`/history?limit=${limit}`);
}

export function recordListeningHistory(payload: CreateHistoryPayload) {
  return apiPost<ListeningHistoryItem>("/history", payload);
}

export function clearListeningHistory() {
  return apiDelete<{ message: string; deleted: number }>("/history");
}

export function deleteListeningHistoryItem(historyId: number) {
  return apiDelete<{ message: string; id: number }>(`/history/${historyId}`);
}
