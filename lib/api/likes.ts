import { apiDelete, apiGet, apiPost } from "@/lib/api-client";
import type { Song } from "@/lib/api/songs";

export type LikeStateResponse = {
  track_id: number;
  liked: boolean;
};

export type LikeToggleResponse = {
  track_id: number;
  liked: boolean;
  interaction_id?: number | null;
};

export type LikeListResponse = {
  track_ids: number[];
  tracks: Song[];
};

export function getLikedTracks() {
  return apiGet<LikeListResponse>("/likes");
}

export function getLikeState(trackId: number) {
  return apiGet<LikeStateResponse>(`/likes/${trackId}`);
}

export function likeTrack(trackId: number) {
  return apiPost<LikeToggleResponse>(`/likes/${trackId}`);
}

export function unlikeTrack(trackId: number) {
  return apiDelete<LikeToggleResponse>(`/likes/${trackId}`);
}
