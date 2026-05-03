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

export async function getLegacyTracks(): Promise<LegacyTrack[]> {
  const tracks = await getTracks();

  return tracks.map((track) => ({
    maBaiHat: track.id,
    tenBaiHat: track.title,
    ngheSi: track.artist,
    anhBia: track.coverUrl,
    tepAmThanh: track.audioUrl,
    thoiLuong: track.duration,
    camXuc: track.emotion,
  }));
}

export type ApiTrack = {
  id: number;
  title: string;
  artist: string;
  audio_url: string;
  duration: number;
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

export async function getTracks(): Promise<UiTrack[]> {
  const tracks = await apiGet<ApiTrack[]>("/tracks/");

  return tracks.map((track) => ({
    id: String(track.id),
    title: track.title,
    artist: track.artist,
    audioUrl: toMediaUrl(track.audio_url),
    coverUrl: toImageUrl(track.cover_image),
    duration: track.duration,
    emotion: track.emotion,
    emotionLabelVi: track.emotion_label_vi,
    emotionScores: track.emotion_scores,
  }));
}

export async function getTrackById(id: string | number): Promise<UiTrack> {
  const track = await apiGet<ApiTrack>(`/tracks/${id}`);

  return {
    id: String(track.id),
    title: track.title,
    artist: track.artist,
    audioUrl: toMediaUrl(track.audio_url),
    coverUrl: toImageUrl(track.cover_image),
    duration: track.duration,
    emotion: track.emotion,
    emotionLabelVi: track.emotion_label_vi,
    emotionScores: track.emotion_scores,
  };
}
