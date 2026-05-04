import { apiGet, toImageUrl, toMediaUrl } from "@/lib/api-client";

export type LegacyTrack = {
  maBaiHat: string;
  tenBaiHat: string;
  ngheSi: string;
  anhBia: string;
  tepAmThanh: string;
  thoiLuong: number;
  camXuc?: string | null;
};

export type ApiTrack = {
  id: number;
  title: string;
  artist: string;
  audio_url?: string | null;
  duration?: number | null;
  emotion?: string | null;
  emotion_label_vi?: string | null;
  cover_image?: string | null;
  emotion_scores?: Record<string, number> | null;
};

export type UiTrack = {
  id: string;
  title: string;
  artist: string;
  audioUrl: string;
  coverUrl: string;
  duration: number;
  emotion?: string | null;
  emotionLabelVi?: string | null;
  emotionScores?: Record<string, number> | null;
};

function mapApiTrackToUiTrack(track: ApiTrack): UiTrack {
  return {
    id: String(track.id),
    title: track.title || "Không rõ tên bài hát",
    artist: track.artist || "Unknown Artist",
    audioUrl: track.audio_url ? toMediaUrl(track.audio_url) : "",
    coverUrl: track.cover_image
      ? toImageUrl(track.cover_image)
      : "/placeholder.svg",
    duration: Number(track.duration || 0),
    emotion: track.emotion ?? null,
    emotionLabelVi: track.emotion_label_vi ?? null,
    emotionScores: track.emotion_scores ?? null,
  };
}

function mapUiTrackToLegacyTrack(track: UiTrack): LegacyTrack {
  return {
    maBaiHat: track.id,
    tenBaiHat: track.title,
    ngheSi: track.artist,
    anhBia: track.coverUrl,
    tepAmThanh: track.audioUrl,
    thoiLuong: track.duration,
    camXuc: track.emotion,
  };
}

export async function getTracks(): Promise<UiTrack[]> {
  const tracks = await apiGet<ApiTrack[]>("/tracks/");

  if (!Array.isArray(tracks)) {
    return [];
  }

  return tracks.map(mapApiTrackToUiTrack);
}

export async function getTrackById(id: string | number): Promise<UiTrack> {
  const track = await apiGet<ApiTrack>(`/tracks/${id}`);

  return mapApiTrackToUiTrack(track);
}

export async function getLegacyTracks(): Promise<LegacyTrack[]> {
  const tracks = await getTracks();

  return tracks.map(mapUiTrackToLegacyTrack);
}
